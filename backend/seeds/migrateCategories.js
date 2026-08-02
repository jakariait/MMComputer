const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

dotenv.config();

const CategoryModel = require('../models/CategoryModel');
const SubCategoryModel = require('../models/SubCategoryModel');
const ChildCategoryModel = require('../models/ChildCategoryModel');
const CategoryCounterModel = require('../models/CategoryCounterModel');
const ChildCategoryCounterModel = require('../models/ChildCategoryCounter');

const SQL_FILE = path.join(__dirname, '../mmcobrgt_ocar119.sql');

function parseValue(val) {
  val = val.trim();
  if (val === 'NULL') return null;
  if (val.startsWith("'") && val.endsWith("'")) {
    const inner = val.slice(1, -1);
    return inner.replace(/''/g, "'").replace(/\\'/g, "'");
  }
  return val;
}

function parseInsertRows(content, tableName) {
  const headerPattern = `INSERT INTO \\\`${tableName}\\\`\\s*\\(([^)]+)\\)\\s*VALUES\\s*`;
  const headerRegex = new RegExp(headerPattern, 'gi');
  const allRows = [];

  let match;
  while ((match = headerRegex.exec(content)) !== null) {
    const columns = match[1].split(',').map(c => c.trim().replace(/`/g, ''));
    let pos = headerRegex.lastIndex;

    // Find end of VALUES: scan with paren depth & quote tracking
    let depth = 0;
    let inQuote = false;
    let valueStart = pos;

    while (pos < content.length) {
      const ch = content[pos];
      if (inQuote) {
        if (ch === '\\' && pos + 1 < content.length && content[pos + 1] === "'") {
          pos += 2;
          continue;
        }
        if (ch === "'" && pos + 1 < content.length && content[pos + 1] === "'") {
          pos += 2;
          continue;
        }
        if (ch === "'") {
          inQuote = false;
        }
      } else {
        if (ch === "'") {
          inQuote = true;
        } else if (ch === '(') {
          depth++;
        } else if (ch === ')') {
          depth--;
        } else if (ch === ';' && depth === 0) {
          break;
        }
      }
      pos++;
    }

    let valuesStr = content.slice(valueStart, pos);

    // Parse value tuples
    let vpos = 0;
    while (vpos < valuesStr.length) {
      while (vpos < valuesStr.length && (valuesStr[vpos] === ' ' || valuesStr[vpos] === '\n' || valuesStr[vpos] === '\r' || valuesStr[vpos] === '\t' || valuesStr[vpos] === ',')) vpos++;
      if (vpos >= valuesStr.length || valuesStr[vpos] !== '(') break;
      vpos++;

      const vals = [];
      let current = '';
      let inQ = false;

      while (vpos < valuesStr.length) {
        const ch = valuesStr[vpos];
        if (inQ) {
          if (ch === '\\' && vpos + 1 < valuesStr.length && valuesStr[vpos + 1] === "'") {
            current += "\\'";
            vpos += 2;
          } else if (ch === "'" && vpos + 1 < valuesStr.length && valuesStr[vpos + 1] === "'") {
            current += "''";
            vpos += 2;
          } else if (ch === "'") {
            current += "'";
            vpos++;
            inQ = false;
          } else {
            current += ch;
            vpos++;
          }
        } else {
          if (ch === "'") {
            current += "'";
            vpos++;
            inQ = true;
          } else if (ch === ')') {
            vals.push(current.trim());
            vpos++;
            break;
          } else if (ch === ',') {
            vals.push(current.trim());
            current = '';
            vpos++;
          } else {
            current += ch;
            vpos++;
          }
        }
      }

      if (vals.length === columns.length) {
        const row = {};
        vals.forEach((v, idx) => {
          row[columns[idx]] = parseValue(v);
        });
        allRows.push(row);
      }
    }
  }

  return allRows;
}

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected.\n');

  // Clear existing category data
  console.log('Clearing existing category data...');
  await CategoryModel.deleteMany({});
  await SubCategoryModel.deleteMany({});
  await ChildCategoryModel.deleteMany({});
  await CategoryCounterModel.deleteMany({});
  await ChildCategoryCounterModel.deleteMany({});
  console.log('  Done.\n');

  // Read SQL file
  console.log('Reading SQL file...');
  const content = fs.readFileSync(SQL_FILE, 'utf-8');
  console.log(`  Read ${(content.length / 1024 / 1024).toFixed(2)} MB\n`);

  // Parse SQL data
  const categories = parseInsertRows(content, 'oc_category');
  const descriptions = parseInsertRows(content, 'oc_category_description');
  const paths = parseInsertRows(content, 'oc_category_path');
  const seoUrls = parseInsertRows(content, 'oc_seo_url');

  console.log(`Parsed: ${categories.length} categories, ${descriptions.length} descriptions, ${paths.length} paths, ${seoUrls.length} SEO URLs\n`);

  // Filter only active (status = 1)
  const activeCategories = categories.filter(c => String(c.status) === '1');
  console.log(`Active categories: ${activeCategories.length}\n`);

  // Build path lookup
  const pathMap = {};
  for (const p of paths) {
    const cid = String(p.category_id);
    if (!pathMap[cid]) pathMap[cid] = [];
    pathMap[cid].push({ pathId: String(p.path_id), level: parseInt(p.level) });
  }

  function getCategoryLevel(categoryId) {
    const entry = pathMap[categoryId];
    if (!entry) return -1;
    const self = entry.find(e => e.pathId === categoryId);
    return self ? self.level : -1;
  }

  function getPathAtLevel(categoryId, level) {
    const entry = pathMap[categoryId];
    if (!entry) return null;
    const found = entry.find(e => e.level === level);
    return found ? found.pathId : null;
  }

  // Build name map (English, language_id = 1)
  const nameMap = {};
  for (const d of descriptions) {
    if (String(d.language_id) === '1') {
      nameMap[String(d.category_id)] = d.name;
    }
  }

  // Build SEO URL map
  const seoMap = {};
  for (const u of seoUrls) {
    const q = u.query || '';
    if (q.startsWith('category_id=')) {
      seoMap[q] = u.keyword;
    }
  }

  // Group by hierarchy level
  const level0 = []; // Category
  const level1 = []; // SubCategory
  const level2plus = []; // ChildCategory (flatten 2+ into single level)

  for (const cat of activeCategories) {
    const cid = String(cat.category_id);
    const level = getCategoryLevel(cid);
    const name = nameMap[cid] || `Category ${cid}`;

    if (level === 0) {
      level0.push({ cid, name, ...cat });
    } else if (level === 1) {
      level1.push({ cid, name, ...cat });
    } else if (level >= 2) {
      level2plus.push({ cid, name, level, ...cat });
    } else {
      console.log(`  WARNING: Category ${cid} ('${name}') has no path entry, skipping.`);
    }
  }

  console.log(`Distribution: ${level0.length} Categories, ${level1.length} SubCategories, ${level2plus.length} ChildCategories (level 2+)\n`);

  // ---- Phase 1: Insert Categories (level 0) ----
  console.log('--- Phase 1: Inserting Categories ---');
  const categoryMap = {};
  for (const cat of level0) {
    const doc = await CategoryModel.create({
      name: cat.name,
      image: cat.image || '',
      showInHomepage: false,
    });
    categoryMap[cat.cid] = doc._id;
    console.log(`  [Category] ${cat.name} (sql_id: ${cat.cid}) -> _id: ${doc._id}`);
  }
  console.log(`  Inserted ${level0.length} Categories\n`);

  // ---- Phase 2: Insert SubCategories (level 1) ----
  console.log('--- Phase 2: Inserting SubCategories ---');
  const subCategoryMap = {};
  for (const cat of level1) {
    const parentPathId = getPathAtLevel(cat.cid, 0);
    const parentId = categoryMap[parentPathId];
    if (!parentId) {
      console.log(`  SKIP: '${cat.name}' (${cat.cid}) - parent Category (path_id: ${parentPathId}) not found`);
      continue;
    }

    const doc = await SubCategoryModel.create({
      name: cat.name,
      image: cat.image || '',
      showInHomepage: false,
      isActive: true,
      category: parentId,
      categoryId: 0,
    });
    subCategoryMap[cat.cid] = { _id: doc._id };
    console.log(`  [SubCategory] ${cat.name} (sql_id: ${cat.cid}) -> categoryId: ${doc.categoryId}, slug: ${doc.slug}`);
  }
  console.log(`  Inserted ${Object.keys(subCategoryMap).length} SubCategories\n`);

  // ---- Phase 3: Insert ChildCategories (level 2+) ----
  console.log('--- Phase 3: Inserting ChildCategories ---');
  let childInserted = 0;
  for (const cat of level2plus) {
    const parentSubPathId = getPathAtLevel(cat.cid, 1);
    const parentSub = subCategoryMap[parentSubPathId];
    if (!parentSub) {
      console.log(`  SKIP: '${cat.name}' (${cat.cid}) - parent SubCategory (level 1 path_id: ${parentSubPathId}) not found`);
      continue;
    }

    const parentCatPathId = getPathAtLevel(cat.cid, 0);
    const parentCatId = categoryMap[parentCatPathId];
    if (!parentCatId) {
      console.log(`  SKIP: '${cat.name}' (${cat.cid}) - parent Category (level 0 path_id: ${parentCatPathId}) not found`);
      continue;
    }

    const doc = await ChildCategoryModel.create({
      name: cat.name,
      image: cat.image || '',
      showInHomepage: false,
      isActive: true,
      category: parentCatId,
      subCategory: parentSub._id,
      categoryId: 0,
    });
    console.log(`  [ChildCategory] ${cat.name} (sql_id: ${cat.cid}) -> categoryId: ${doc.categoryId}, slug: ${doc.slug}`);
    childInserted++;
  }
  console.log(`  Inserted ${childInserted} ChildCategories\n`);

  // Summary
  console.log('========================================');
  console.log('  MIGRATION SUMMARY');
  console.log('========================================');
  console.log(`  Categories:      ${level0.length}`);
  console.log(`  SubCategories:   ${Object.keys(subCategoryMap).length}`);
  console.log(`  ChildCategories: ${childInserted}`);
  console.log('========================================');

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
