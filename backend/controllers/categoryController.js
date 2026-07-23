const categoryService = require('../services/categoryService');
const CategoryModel = require('../models/CategoryModel');
const fs = require('fs');
const path = require('path');

const deleteOldFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '../uploads', filename);
  try { fs.unlinkSync(filePath); } catch {}
};

const createCategory = async (req, res) => {
  try {
    const { name, featureCategory, showInHomepage } = req.body;
    const image = req.files?.image?.[0]?.filename || req.body.image || '';

    const categoryData = {
      name,
      featureCategory,
      showInHomepage,
      image,
    };

    const category = new CategoryModel(categoryData);
    await category.save();
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    if (categories.length === 0) {
      return res.status(200).json({ message: 'No categories found', categories });
    }
    res.status(200).json({ message: 'Categories retrieved successfully', categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, featureCategory, showInHomepage, removeImage } = req.body;

    const categoryData = {
      name,
      featureCategory,
      showInHomepage,
    };

    const existing = await CategoryModel.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (req.files?.image?.[0]?.filename) {
      deleteOldFile(existing.image);
      categoryData.image = req.files.image[0].filename;
    } else if (removeImage === 'true') {
      deleteOldFile(existing.image);
      categoryData.image = '';
    } else {
      categoryData.image = existing.image;
    }

    const category = await CategoryModel.findByIdAndUpdate(id, categoryData, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    deleteOldFile(category.image);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
};
