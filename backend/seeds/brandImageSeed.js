require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const BrandModel = require('../models/BrandModel');

const SOURCE_DIR = '/Users/jakaria/Downloads/image';
const DEST_DIR = path.join(__dirname, '..', 'uploads');

const brandImageMap = {
  'AMD': 'catalog/Brand logo/Brand_logo-150x150 (4).jpg',
  'Lenovo': 'catalog/Brand logo/Brand_logo-150x150.jpg',
  'Acer': 'catalog/Brand logo/Brand_logo-150x150 (5).jpg',
  'Apple': 'catalog/Brand logo/Brand_logo-150x150 (1).jpg',
  'Canon': 'catalog/demo/canon_logo.jpg',
  'Sony': 'catalog/demo/sony_logo.jpg',
  'ASUS': 'catalog/Brand logo/Brand_logo-150x150 (2).jpg',
  'Dell': 'catalog/Brand logo/apple_logo-150x150.jpg',
  'Gigabyte': 'catalog/Brand logo/Brand_logo-150x150 (9).jpg',
  'HP': 'catalog/Brand logo/apple_logo-150x150 (1).jpg',
  'Intel': 'catalog/Brand logo/Brand_logo-150x150 (3).jpg',
  'NVIDIA': 'catalog/Brand logo/Brand_logo-150x150 (8).jpg',
  'Razer': 'catalog/Brand logo/Brand_logo-150x150 (7).jpg',
  'Zotac': 'catalog/Brand logo/Brand_logo-150x150 (10).jpg',
  'A4 tech': 'catalog/Brand logo/new voliume/a4tech.jpg',
  'Colorful': 'catalog/Brand logo/new voliume/Colorful.jpg',
  'Brothers': 'catalog/Brand logo/new voliume/Brothers.jpg',
  'Microsoft': 'catalog/Brand logo/new voliume/download.jpg',
  'Corsair': 'catalog/Brand logo/new voliume/Corsair.jpg',
  'PC Power': 'catalog/Brand logo/PC-Power-Logo.png',
  'Antec': 'catalog/Brand logo/logos-2.webp',
  'Vention': 'catalog/vention_logo.png',
  'HAVIT': 'catalog/Brand logo/20241115-182658_909x173.png',
  'Gamdias': 'catalog/Brand logo/GD_Logo_252X60.png',
  'XTRIKEME': 'catalog/Brand logo/logo.png',
  'Team': 'catalog/Brand logo/new voliume/team.jpg',
  'IMICE': 'catalog/Brand logo/Безымянный.png',
  'Hisense': 'catalog/Brand logo/Hisense_logo_PNG2.png',
  'TP-Link': 'catalog/Brand logo/new-logo.png',
  'Tenda': 'catalog/logo.png',
  'Midea': 'catalog/Brand logo/Midea_Logo_RGB_blue_on_white_NoRegister.webp',
  'Asrock': 'catalog/AC./images.png',
  'PELADN': 'catalog/Brand logo/format,webp (1).jpeg',
  'Adata': 'catalog/Brand logo/new voliume/adata.jpg',
  'Transcend': 'catalog/Brand logo/download.png',
  'G.Skill': 'catalog/Brand logo/opKm5TQk_400x400.jpg',
  'PNY': 'catalog/Brand logo/pny-logo-dark--r-.png',
  'Kingston': 'catalog/Brand logo/kingston-logo-blkText.png',
  'Western Digital': 'catalog/Brand logo/Western_Digital_logo_logotype_emblem.png',
  'Hikvision': 'catalog/Brand logo/new voliume/download.png',
  'Dahua': 'catalog/Brand logo/new voliume/Dahua.jpg',
  'Avita': 'catalog/Brand logo/avita.png',
  'Amazfit': 'catalog/Brand logo/new voliume/Amazfit.jpg',
  'Sunlux': 'catalog/Brand logo/sunlux.png',
  'Kaspersky': 'catalog/Brand logo/new voliume/download (1).png',
  'ELITE': 'catalog/Brand logo/elite logo.jpg',
  'APTECH': 'catalog/Brand logo/new voliume/imgi_1_default.jpeg',
  'MONARCH': 'catalog/Brand logo/new voliume/ezgif-6fb79c7380b6d6.jpg',
  'Sharp': 'catalog/Brand logo/new voliume/images.png',
  'RICOH': 'catalog/Brand logo/new voliume/ricoh.jpg',
  'AULA': 'catalog/Brand logo/new voliume/aula.jpg',
  'Boya': 'catalog/Brand logo/new voliume/BOYA.jpg',
  'PANTUM': 'catalog/Brand logo/new voliume/pantum.jpg',
  'RONGTA': 'catalog/Brand logo/new voliume/rongta.jpg',
  'X-PRINTER': 'catalog/Brand logo/new voliume/x-printer.jpg',
  'X-TREME': 'catalog/Brand logo/new voliume/xtreme.jpg',
  'Micropack': 'catalog/Brand logo/new voliume/micropack.jpg',
  'Danaaz': 'catalog/Brand logo/new voliume/Danaaz.jpg',
  'EZVIZ': 'catalog/Brand logo/new voliume/ezviz.jpg',
  'Mercusys': 'catalog/Brand logo/new voliume/mercucys.jpg',
  'Cudy': 'catalog/Brand logo/new voliume/Cudy.jpg',
  'GoPro': 'catalog/Brand logo/new voliume/gopro.jpg',
  'DJI': 'catalog/Brand logo/new voliume/dji.jpg',
  'Insta360': 'catalog/Brand logo/new voliume/imgi_21_Insta360-Logo.jpg',
  'Walton': 'catalog/Brand logo/new voliume/walton.jpg',
  'MaxGreen': 'catalog/Brand logo/new voliume/maxgreen.jpg',
  'Hoco': 'catalog/Brand logo/new voliume/hoco.jpg',
  'Awei': 'catalog/Brand logo/new voliume/Awei.jpg',
  'Optoma': 'catalog/Brand logo/optoma.jpg',
  'BenQ': 'catalog/Brand logo/nav-icon-benq-logo.png',
  'Black Shark': 'catalog/Brand logo/new voliume/Black Shark.jpeg',
  'InFocus': 'catalog/Brand logo/new voliume/infocus.jpg',
  'METZ': 'catalog/Brand logo/new voliume/metz.jpg',
  'AOC': 'catalog/Brand logo/new voliume/aoc.jpg',
  'BOXLIGHT': 'catalog/Brand logo/new voliume/BOXLIGHT.png',
  'ARMOR': 'catalog/Brand logo/new voliume/armor.jpg',
  'Panasonic': 'catalog/Brand logo/new voliume/panasonic.jpg',
  'LG': 'catalog/Brand logo/new voliume/lg.jpg',
  'Smart': 'catalog/Brand logo/new voliume/smart.jpg',
  'MAXHUB': 'catalog/Brand logo/new voliume/maxhub.png',
  'Hitachi': 'catalog/Brand logo/new voliume/hitachi.jpg',
  'Deli': 'catalog/Brand logo/new voliume/deli copy.jpg',
  'SPRT': 'catalog/Brand logo/new voliume/sprt.jpg',
  'Baseus': 'catalog/Brand logo/new voliume/Baseus.jpg',
  'Apacer': 'catalog/Brand logo/new voliume/Apacer.jpg',
  'Dareu': 'catalog/Brand logo/new voliume/Dareu.jpg',
  'AKASO': 'catalog/Brand logo/new voliume/akaso.jpg',
  'AUSEK': 'catalog/Brand logo/new voliume/302094346_459511809561544_5133636389709228719_n.jpg',
  'Apollo': 'catalog/Brand logo/new voliume/Apollo.jpg',
  'Nikon': 'catalog/Brand logo/new voliume/imgi_1_nikon-logo-png_seeklogo-99545.jpeg',
  'Exide': 'catalog/ips/ezgif-11ebeeb61820f7.jpg',
  'NPTE': 'catalog/ips/ezgif-11269793932e9f.jpg',
  'Luminous': 'catalog/ips/imgi_170_luminous-logo.jpeg',
  'Hithium': 'catalog/ips/imgi_212_1000_F_552624485_svgsZBxJtyyS2aPuU9rNja9kKnlyVqrJ.jpeg',
  'Kenson': 'catalog/ups/imgi_140_3932-kenson_logo.jpeg',
  'EcoFlow': 'catalog/Brand logo/new voliume/ecoflow.jpg',
  'Lewitt': 'catalog/Brand logo/new voliume/Lewitt.jpeg',
  'Rode': 'catalog/Brand logo/new voliume/Rode.jpg',
  'Audio Technica': 'catalog/Brand logo/new voliume/audio.jpg',
  'Shure': 'catalog/Brand logo/new voliume/Shure.jpg',
  'Neumann': 'catalog/Brand logo/new voliume/Neumann.jpg',
  'M-Audio': 'catalog/Brand logo/new voliume/M-Audio.jpg',
  'KRK': 'catalog/Brand logo/new voliume/KRK.jpg',
  'Focal Alpha': 'catalog/Brand logo/new voliume/Focal Alpha.jpg',
  'Genelec': 'catalog/Brand logo/new voliume/Genelec.jpg',
  'Edifier': 'catalog/Brand logo/new voliume/Edifier.jpg',
  'Yamaha': 'catalog/Brand logo/new voliume/Yamaha.jpg',
  'Gimbal': 'catalog/Gimbal/imgi_43_default.jpeg',
  'Winson': 'catalog/AC./mmcomputerbd.com.jpeg',
  'Yumite': 'catalog/Casing/mmcomputerbd.com.jpeg',
};

const migrateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    if (!fs.existsSync(DEST_DIR)) {
      fs.mkdirSync(DEST_DIR, { recursive: true });
    }

    let copied = 0;
    let skipped = 0;
    let notFound = 0;

    for (const [brandName, srcRelative] of Object.entries(brandImageMap)) {
      const srcPath = path.join(SOURCE_DIR, srcRelative);
      const filename = path.basename(srcRelative);

      if (!fs.existsSync(srcPath)) {
        console.log(`Source not found: ${srcRelative}`);
        notFound++;
        continue;
      }

      const destPath = path.join(DEST_DIR, filename);
      if (fs.existsSync(destPath)) {
        skipped++;
      } else {
        fs.copyFileSync(srcPath, destPath);
        copied++;
      }

      const updated = await BrandModel.findOneAndUpdate(
        { name: brandName },
        { logo: filename },
        { new: true }
      );
      if (!updated) {
        console.log(`Brand not found in DB: ${brandName}`);
      }
    }

    console.log(`\nDone! Copied: ${copied}, Skipped (exists): ${skipped}, Not found: ${notFound}`);
  } catch (error) {
    console.error('Migration error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

migrateImages();
