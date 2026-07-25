const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const ProductModel = require('../models/ProductModel');
const BrandModel = require('../models/BrandModel');
const CategoryModel = require('../models/CategoryModel');
const SubCategoryModel = require('../models/SubCategoryModel');
const ChildCategoryModel = require('../models/ChildCategoryModel');
const CounterModel = require('../models/CounterModel');
const slugify = require('slugify');

const SQL_FILE = path.join(__dirname, '../mmcobrgt_ocar119.sql');
const IMAGE_SOURCE_DIR = path.join(__dirname, '../image');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

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

function copyImage(srcRelativePath) {
  if (!srcRelativePath) return null;
  const filename = path.basename(srcRelativePath);
  const srcPath = path.join(IMAGE_SOURCE_DIR, srcRelativePath);
  const destPath = path.join(UPLOADS_DIR, filename);

  if (fs.existsSync(destPath)) return filename;
  if (fs.existsSync(srcPath)) {
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    return filename;
  }
  return null;
}

function parseLiItems(html) {
  if (!html) return [];
  const decoded = html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
  const items = [];
  const liRegex = /<li[^>]*>(.*?)<\/li>/gi;
  let match;
  while ((match = liRegex.exec(decoded)) !== null) {
    const text = stripHtml(match[1]);
    if (text) items.push(text);
  }
  return items;
}

function stripHtml(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/\\r\\n|[\r\n]+/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected.\n');

  console.log('Reading SQL file...');
  const content = fs.readFileSync(SQL_FILE, 'utf-8');
  console.log(`  Read ${(content.length / 1024 / 1024).toFixed(2)} MB\n`);

  console.log('Parsing SQL tables...');
  const products = parseInsertRows(content, 'oc_product');
  const descriptions = parseInsertRows(content, 'oc_product_description');
  const productImages = parseInsertRows(content, 'oc_product_image');
  const productToCategory = parseInsertRows(content, 'oc_product_to_category');
  const productAttributes = parseInsertRows(content, 'oc_product_attribute');
  const productRewards = parseInsertRows(content, 'oc_product_reward');
  const productSpecials = parseInsertRows(content, 'oc_product_special');
  const customTabDescs = parseInsertRows(content, 'oc_product_customtab_description');
  const manufacturers = parseInsertRows(content, 'oc_manufacturer');
  const attributes = parseInsertRows(content, 'oc_attribute');
  const attributeDescs = parseInsertRows(content, 'oc_attribute_description');
  const attributeGroupDescs = parseInsertRows(content, 'oc_attribute_group_description');
  const categories = parseInsertRows(content, 'oc_category');
  const categoryDescs = parseInsertRows(content, 'oc_category_description');
  const categoryPaths = parseInsertRows(content, 'oc_category_path');

  console.log(`  Products: ${products.length}`);
  console.log(`  Descriptions: ${descriptions.length}`);
  console.log(`  Product Images: ${productImages.length}`);
  console.log(`  Product-Category: ${productToCategory.length}`);
  console.log(`  Product Attributes: ${productAttributes.length}`);
  console.log(`  Product Rewards: ${productRewards.length}`);
  console.log(`  Product Specials: ${productSpecials.length}`);
  console.log(`  Custom Tab Descs: ${customTabDescs.length}`);
  console.log(`  Manufacturers: ${manufacturers.length}`);
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Category Descs: ${categoryDescs.length}\n`);

  // --- Build lookup maps ---

  const descMap = {};
  for (const d of descriptions) {
    if (String(d.language_id) === '1') descMap[String(d.product_id)] = d;
  }

  const imageMap = {};
  for (const img of productImages) {
    const pid = String(img.product_id);
    if (!imageMap[pid]) imageMap[pid] = [];
    if (img.image) imageMap[pid].push(img.image);
  }

  const productCategoryIds = {};
  for (const pc of productToCategory) {
    const pid = String(pc.product_id);
    if (!productCategoryIds[pid]) productCategoryIds[pid] = [];
    productCategoryIds[pid].push(String(pc.category_id));
  }

  const attributeGroupNameMap = {};
  for (const ag of attributeGroupDescs) {
    if (String(ag.language_id) === '1') {
      attributeGroupNameMap[String(ag.attribute_group_id)] = ag.name;
    }
  }

  const attributeNameMap = {};
  for (const ad of attributeDescs) {
    if (String(ad.language_id) === '1') attributeNameMap[String(ad.attribute_id)] = ad.name;
  }

  const attributeGroupMap = {};
  for (const a of attributes) {
    attributeGroupMap[String(a.attribute_id)] = String(a.attribute_group_id);
  }

  const rewardMap = {};
  for (const r of productRewards) {
    rewardMap[String(r.product_id)] = r.points;
  }

  const specialPriceMap = {};
  for (const s of productSpecials) {
    const pid = String(s.product_id);
    const sp = parseFloat(s.price) || 0;
    if (sp > 0 && (!specialPriceMap[pid] || sp < specialPriceMap[pid])) {
      specialPriceMap[pid] = sp;
    }
  }

  const keyFeaturesTabMap = {};
  for (const t of customTabDescs) {
    if (String(t.language_id) === '1' && t.title && t.title.replace(/&amp;/g, '&').trim() === 'Key Features' && t.description) {
      keyFeaturesTabMap[String(t.product_id)] = t.description;
    }
  }
  console.log(`  Key Features tab rows: ${Object.keys(keyFeaturesTabMap).length}`);

  const manufacturerMap = {};
  for (const m of manufacturers) {
    manufacturerMap[String(m.manufacturer_id)] = m.name.trim();
  }

  const productAttrMap = {};
  for (const pa of productAttributes) {
    const pid = String(pa.product_id);
    if (!productAttrMap[pid]) productAttrMap[pid] = [];
    productAttrMap[pid].push(pa);
  }

  // Build SQL category_id → category name map
  const sqlCategoryNameMap = {};
  for (const cd of categoryDescs) {
    if (String(cd.language_id) === '1') {
      sqlCategoryNameMap[String(cd.category_id)] = cd.name.trim();
    }
  }

  // Build active category set
  const activeCategoryIds = new Set();
  for (const c of categories) {
    if (String(c.status) === '1') activeCategoryIds.add(String(c.category_id));
  }

  // Build path lookup from oc_category_path (same as migrateCategories.js)
  const pathMap = {};
  for (const p of categoryPaths) {
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

  // Build full hierarchy path for each SQL category (e.g., "Laptop > All Laptop > HP")
  const sqlCategoryPath = {};
  for (const [cid, name] of Object.entries(sqlCategoryNameMap)) {
    const level = getCategoryLevel(cid);
    if (level === 0) {
      sqlCategoryPath[cid] = [name];
    } else if (level === 1) {
      const p0 = getPathAtLevel(cid, 0);
      const p0Name = p0 ? sqlCategoryNameMap[p0] || '' : '';
      sqlCategoryPath[cid] = [p0Name, name];
    } else if (level >= 2) {
      const p0 = getPathAtLevel(cid, 0);
      const p1 = getPathAtLevel(cid, 1);
      const p0Name = p0 ? sqlCategoryNameMap[p0] || '' : '';
      const p1Name = p1 ? sqlCategoryNameMap[p1] || '' : '';
      sqlCategoryPath[cid] = [p0Name, p1Name, name];
    }
  }

  // --- Fetch existing MongoDB data ---

  console.log('Clearing existing products...');
  await ProductModel.deleteMany({});
  console.log('  Done.\n');

  console.log('Fetching existing brands from MongoDB...');
  const existingBrands = await BrandModel.find({}).lean();
  const brandNameToId = {};
  for (const b of existingBrands) brandNameToId[b.name.toLowerCase()] = b._id;
  console.log(`  Found ${existingBrands.length} brands.\n`);

  console.log('Fetching existing categories from MongoDB...');
  const existingCategories = await CategoryModel.find({}).lean();
  const existingSubCategories = await SubCategoryModel.find({}).lean();
  const existingChildCategories = await ChildCategoryModel.find({}).lean();

  // Build MongoDB path-based lookups
  const mongoCatPath = {};
  for (const c of existingCategories) mongoCatPath[c.name.trim().toLowerCase()] = c._id;

  const mongoSubCatPath = {};
  for (const sc of existingSubCategories) {
    const fullMatch = existingCategories.find(c => String(c._id) === String(sc.category));
    if (fullMatch) {
      const key = `${fullMatch.name.trim().toLowerCase()} > ${sc.name.trim().toLowerCase()}`;
      mongoSubCatPath[key] = { _id: sc._id, category: sc.category };
    }
  }

  const mongoChildCatPath = {};
  for (const cc of existingChildCategories) {
    const catMatch = existingCategories.find(c => String(c._id) === String(cc.category));
    const subMatch = existingSubCategories.find(s => String(s._id) === String(cc.subCategory));
    if (catMatch && subMatch) {
      const key = `${catMatch.name.trim().toLowerCase()} > ${subMatch.name.trim().toLowerCase()} > ${cc.name.trim().toLowerCase()}`;
      mongoChildCatPath[key] = { _id: cc._id, category: cc.category, subCategory: cc.subCategory };
    }
  }

  // Build SQL category ID → MongoDB _id mapping via full path
  const sqlCatIdToMongoId = {};
  for (const [cid, pathParts] of Object.entries(sqlCategoryPath)) {
    const level = pathParts.length - 1;
    const pathKey = pathParts.map(p => p.trim().toLowerCase()).join(' > ');
    if (level === 0 && mongoCatPath[pathKey]) {
      sqlCatIdToMongoId[cid] = { type: 'category', id: mongoCatPath[pathKey] };
    } else if (level === 1 && mongoSubCatPath[pathKey]) {
      const m = mongoSubCatPath[pathKey];
      sqlCatIdToMongoId[cid] = { type: 'subCategory', id: m._id, parentId: m.category };
    } else if (level >= 2 && mongoChildCatPath[pathKey]) {
      const m = mongoChildCatPath[pathKey];
      sqlCatIdToMongoId[cid] = { type: 'childCategory', id: m._id, parentId: m.category, subId: m.subCategory };
    }
  }
  console.log(`  Mapped ${Object.keys(sqlCatIdToMongoId).length} SQL categories to MongoDB.\n`);

  // --- Create brands from manufacturers ---

  console.log('Creating missing brands from manufacturers...');
  let newBrandCount = 0;
  const manufacturerToBrandId = {};
  for (const m of manufacturers) {
    const name = m.name.trim();
    const key = name.toLowerCase();
    if (brandNameToId[key]) {
      manufacturerToBrandId[String(m.manufacturer_id)] = brandNameToId[key];
    } else {
      const brand = await BrandModel.create({ name, isActive: true });
      brandNameToId[key] = brand._id;
      manufacturerToBrandId[String(m.manufacturer_id)] = brand._id;
      newBrandCount++;
    }
  }
  console.log(`  Created ${newBrandCount} new brands.\n`);

  // --- Initialize productId counter ---

  console.log('Initializing productId counter...');
  let nextProductId = 1000;
  const counter = await CounterModel.findOne({ name: 'productId' });
  if (counter) {
    nextProductId = counter.value + 1;
  }
  // We'll update the counter at the end

  // --- Process products ---

  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  console.log('Processing products...');
  let created = 0;
  let skipped = 0;
  let errors = 0;
  let imagesCopied = 0;

  const BATCH_SIZE = 50;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const docs = [];

    for (const product of batch) {
      try {
        const pidStr = String(product.product_id);
        const desc = descMap[pidStr];
        if (!desc) { skipped++; continue; }

        const name = desc.name || 'Unknown Product';
        const model = product.model || '';
        const status = String(product.status) === '1';

        // Copy thumbnail
        let thumbnailFilename = '';
        if (product.image) {
          const fn = copyImage(product.image);
          if (fn) { thumbnailFilename = fn; imagesCopied++; }
        }

        // Copy additional images
        const additionalImages = imageMap[pidStr] || [];
        const imageFilenames = [];
        for (const imgPath of additionalImages) {
          const fn = copyImage(imgPath);
          if (fn) { imageFilenames.push(fn); imagesCopied++; }
        }

        // Deduplicate images and prepend thumbnail as first image
        const uniqueImages = [...new Set(imageFilenames)];
        if (thumbnailFilename) uniqueImages.unshift(thumbnailFilename);

        // Build specifications
        const specsMap = {};
        const specsList = [];
        const attrs = productAttrMap[pidStr] || [];
        for (const attr of attrs) {
          const attrId = String(attr.attribute_id);
          const groupId = attributeGroupMap[attrId];
          const groupName = groupId ? (attributeGroupNameMap[groupId] || 'General') : 'General';
          const attrName = attributeNameMap[attrId] || `Attribute ${attrId}`;
          const attrValue = (attr.text || '').replace(/\\r\\n|[\r\n]+/g, ' ').trim();
          if (!specsMap[groupName]) specsMap[groupName] = [];
          specsMap[groupName].push({ label: attrName, value: attrValue });
          specsList.push({ key: attrName, value: attrValue });
        }
        const specifications = Object.entries(specsMap).map(([title, labels]) => ({ title, labels }));
        const kfHtml = keyFeaturesTabMap[pidStr];
        const keyFeatures = kfHtml ? parseLiItems(kfHtml).map(t => {
          const idx = t.indexOf(': ');
          return idx > 0 ? { key: t.slice(0, idx).trim(), value: t.slice(idx + 2).trim() } : { key: t, value: t };
        }) : specsList.slice(0, 6);

        const longDesc = stripHtml(desc.description);
        const metaKeywords = desc.meta_keyword ? desc.meta_keyword.split(',').map(k => k.trim()).filter(Boolean) : [];
        const searchTags = desc.tag ? desc.tag.split(',').map(t => t.trim()).filter(Boolean) : [];

        // Category mapping
        const sqlCatIds = productCategoryIds[pidStr] || [];
        let assignedCategory = null;
        let assignedSubCategory = null;
        let assignedChildCategory = null;

        for (const sqlCatId of sqlCatIds) {
          const mapped = sqlCatIdToMongoId[sqlCatId];
          if (mapped) {
            if (mapped.type === 'category' && !assignedCategory) {
              assignedCategory = mapped.id;
            } else if (mapped.type === 'subCategory' && !assignedSubCategory) {
              assignedSubCategory = mapped.id;
              if (!assignedCategory) assignedCategory = mapped.parentId;
            } else if (mapped.type === 'childCategory' && !assignedChildCategory) {
              assignedChildCategory = mapped.id;
              if (!assignedCategory) assignedCategory = mapped.parentId;
              if (!assignedSubCategory) assignedSubCategory = mapped.subId;
            }
          }
        }

        // Brand
        const brandId = manufacturerToBrandId[String(product.manufacturer_id)] || null;

        // Dates
        let createdAt = new Date();
        let updatedAt = new Date();
        if (product.date_added && product.date_added !== '0000-00-00 00:00:00') createdAt = new Date(product.date_added);
        if (product.date_modified && product.date_modified !== '0000-00-00 00:00:00') updatedAt = new Date(product.date_modified);

        const price = parseFloat(product.price) || 0;
        const quantity = parseInt(product.quantity) || 0;

        const productId = nextProductId++;
        const slug = `${slugify(name, { lower: true })}-${productId}`;

        const doc = {
          productId,
          name,
          slug,
          productCode: model,
          thumbnailImage: thumbnailFilename,
          images: uniqueImages,
          longDesc,
          metaTitle: desc.meta_title || name,
          metaDescription: desc.meta_description || '',
          metaKeywords,
          searchTags,
          keyFeatures,
          specifications,
          finalPrice: price,
          finalDiscount: specialPriceMap[pidStr] && specialPriceMap[pidStr] < price ? specialPriceMap[pidStr] : 0,
          finalStock: quantity,
          isActive: status,
          category: assignedCategory,
          subCategory: assignedSubCategory,
          childCategory: assignedChildCategory,
          brand: brandId,
          freeShipping: String(product.shipping) === '0',
          createdAt,
          updatedAt,
        };

        if (rewardMap[pidStr]) doc.rewardPoints = parseInt(rewardMap[pidStr]) || 0;

        docs.push(doc);
      } catch (err) {
        console.error(`  Error preparing product ${product.product_id}: ${err.message}`);
        errors++;
      }
    }

    if (docs.length > 0) {
      try {
        const result = await ProductModel.insertMany(docs, { ordered: false });
        created += result.length;
      } catch (err) {
        if (err.writeErrors) {
          created += err.insertedCount || 0;
        } else {
          console.error(`  Batch error: ${err.message}`);
          errors++;
        }
      }
    }

    if ((i / BATCH_SIZE + 1) % 10 === 0 || i + BATCH_SIZE >= products.length) {
      console.log(`  Progress: ${Math.min(i + BATCH_SIZE, products.length)}/${products.length} products processed (${created} created, ${skipped} skipped)`);
    }
  }

  // Update counter
  await CounterModel.findOneAndUpdate(
    { name: 'productId' },
    { $set: { value: nextProductId - 1 } },
    { upsert: true }
  );

  console.log('\n========================================');
  console.log('  MIGRATION SUMMARY');
  console.log('========================================');
  console.log(`  Products in SQL:   ${products.length}`);
  console.log(`  Created:           ${created}`);
  console.log(`  Skipped (no desc): ${skipped}`);
  console.log(`  Errors:            ${errors}`);
  console.log(`  Images copied:     ${imagesCopied}`);
  console.log(`  Next productId:    ${nextProductId}`);
  console.log('========================================\n');

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
