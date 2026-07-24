require('dotenv').config();
const mongoose = require('mongoose');
const BrandModel = require('../models/BrandModel');

const brands = [
  'AMD', 'Lenovo', 'Acer', 'Apple', 'Canon', 'Sony', 'ASUS', 'Dell',
  'Gigabyte', 'HP', 'Intel', 'NVIDIA', 'Razer', 'Zotac', 'A4 tech',
  'Colorful', 'MSI', 'Epson', 'Brothers', 'Microsoft', 'Corsair',
  'PC Power', 'Antec', 'DeepCool', 'Toshiba', 'Seagate', 'Vention',
  'ORICO', 'HAVIT', 'Gamdias', 'XTRIKEME', 'Team', 'IMICE', 'Hisense',
  'TP-Link', 'Tenda', 'Midea', 'Asrock', 'PELADN', 'Adata', 'Transcend',
  'G.Skill', 'PNY', 'Kingston', 'Samsung', 'Western Digital', 'TwinMOS',
  'Lexar', 'FSP', 'Thermaltake', 'Huntkey', 'Hikvision', 'Zkteco',
  'Dahua', 'Jovision', 'Tiandy', 'Uniview', 'Avita', 'Haylou',
  'Amazfit', 'Value-Top', 'STAREX', 'ViewSonic', 'Eset', 'Sunlux',
  'Eksa', 'Kaspersky', 'Dtech', 'China', 'Ugreen', 'FJGEAR', 'Delux',
  'GameMax', 'MONTECH AIR', 'Gree', 'Haier', 'General', 'ELITE',
  'APTECH', 'DARK GOST', 'Logitech', 'TrendSonic', 'MONARCH', 'Sharp',
  'RICOH', 'NON-BRAND', 'AULA', 'Boya', 'PANTUM', 'RONGTA',
  'X-PRINTER', 'X-TREME', 'Micropack', 'TEV', 'PANAROMIIC', 'Danaaz',
  'MITSUBISHI', 'EZVIZ', 'Mercusys', 'Cudy', 'GoPro', 'DJI',
  'Insta360', 'Walton', 'MaxGreen', 'Hoco', 'Awei', 'Optoma', 'BenQ',
  'Black Shark', 'InFocus', 'METZ', 'AOC', 'BOXLIGHT', 'ARMOR',
  'Panasonic', 'LG', 'Smart', 'MAXHUB', 'Hitachi', 'Deli', 'SPRT',
  'Power Print', 'Joyroom', 'Fantech', 'Yison', 'Vyvylabs', 'Plextone',
  'Baseus', 'Oraimo', 'XTRA', 'RIVERSONG', 'Remax', 'Xiaomi', 'Jedel',
  'Microlab', 'Thonet & Vander', 'Redragon', 'F&D', 'Wiwu', 'Yuanxin',
  'JBL', 'Apacer', 'SanDisk', 'T-Wolf', 'SJCAM', 'Onikuma', 'Dareu',
  'Monka', 'Xtrfy', 'Rapoo', 'Maono', 'Phyhome', 'AKASO', 'AUSEK',
  'Zebra', 'G-Printer', 'MARSRIVA', 'Power Pac', 'Apollo', 'Digital X',
  'Nikon', 'Exide', 'NPTE', 'Luminous', 'Hithium', 'CMX', 'Kenson',
  'Mitel', 'Grandstream', 'DINSTAR', 'Master', 'Kington', 'EcoFlow',
  'Zhiyun', 'Lewitt', 'Rode', 'Audio Technica', 'Shure', 'Neumann',
  'M-Audio', 'KRK', 'Focal Alpha', 'Genelec', 'Edifier', 'Yamaha',
  'Gimbal', 'TX', 'Focusrite', 'boss', 'universal', 'midas',
  'sound craft', 'behringer', 'apogee', 'solid state logic', 'ovo',
  'Winson', 'Yumite', 'Oscoo', 'netac', 'Singer', 'Pro Tech',
  'Nexakey', 'D-link', 'Safenet', 'COTE', 'Rosenberger', 'Micronet',
  'CommScope', 'Ficer', 'Panduit', 'HyperX', 'Gigasonic', 'GUNNIR',
  'HKC', 'Realview', 'Dato', 'Esonic', 'Dintek', 'Golden Field',
  'wintech', 'Hiksemi', 'TECLAST', 'Imou', 'afox', 'Cooler Master',
  'ICOOLAX', 'KingFast', 'Twinkle Star', 'OCPC', 'Ruijie',
  'sapphire plus', 'Xtreme', 'Patriot', 'ARKTEK', 'Netis', 'Tech power',
  'cheerlux', 'Blisbond', 'Rangs', 'XP-Pen',
];

const seedBrands = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    const existing = await BrandModel.find().select('name');
    const existingNames = new Set(existing.map((b) => b.name));

    const newBrands = brands
      .filter((name) => !existingNames.has(name))
      .map((name) => ({ name }));

    if (newBrands.length === 0) {
      console.log('All brands already exist. Nothing to seed.');
    } else {
      let inserted = 0;
      for (const brand of newBrands) {
        try {
          await BrandModel.create(brand);
          inserted++;
        } catch (err) {
          if (err.code === 11000) {
            console.log(`Skipped duplicate: ${brand.name}`);
          } else {
            console.error(`Error inserting ${brand.name}:`, err.message);
          }
        }
      }
      console.log(`Seeded ${inserted} new brands.`);
    }

    const total = await BrandModel.countDocuments();
    console.log(`Total brands in database: ${total}`);
  } catch (error) {
    console.error('Seed error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedBrands();
