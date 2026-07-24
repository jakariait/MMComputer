const ChildCategory = require('../models/ChildCategoryModel');
const fs = require('fs');
const path = require('path');

const deleteOldFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '../uploads', filename);
  try { fs.unlinkSync(filePath); } catch {}
};

// Create a new child category
const createChildCategory = async (childCategoryData) => {
  try {
    if (!childCategoryData.name || !childCategoryData.category || !childCategoryData.subCategory) {
      throw new Error('Name, category, and subcategory are required fields.');
    }

    const childCategory = new ChildCategory(childCategoryData);
    await childCategory.save();
    return childCategory;
  } catch (error) {
    throw new Error('Error creating child category: ' + error.message);
  }
};

// Get all child categories
const getAllChildCategories = async (filter = {}) => {
  try {
    const childCategories = await ChildCategory.find(filter)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .select('-createdAt -updatedAt')
      .exec();
    return childCategories;
  } catch (error) {
    throw new Error('Error fetching child categories: ' + error.message);
  }
};

// Get a single child category by ID
const getChildCategoryById = async (id) => {
  try {
    const childCategory = await ChildCategory.findById(id)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .select('-createdAt -updatedAt')
      .exec();

    if (!childCategory) {
      throw new Error('Child category not found');
    }

    return childCategory;
  } catch (error) {
    throw new Error('Error fetching child category: ' + error.message);
  }
};

// Update a Child Category
const updateChildCategory = async (id, updatedData) => {
  try {
    const existing = await ChildCategory.findById(id);
    if (!existing) throw new Error('Child Category not found');

    if (updatedData.image && updatedData.image !== existing.image) {
      deleteOldFile(existing.image);
    } else if (updatedData.removeImage === 'true') {
      deleteOldFile(existing.image);
      updatedData.image = '';
    } else {
      updatedData.image = existing.image;
    }
    delete updatedData.removeImage;

    const childCategory = await ChildCategory.findByIdAndUpdate(id, updatedData, {
      new: true,
    })
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .select('-createdAt -updatedAt')
      .exec();

    if (!childCategory) throw new Error('Child Category not found');
    return childCategory;
  } catch (error) {
    throw new Error('Error updating child category: ' + error.message);
  }
};

// Delete a Child Category
const deleteChildCategory = async (id) => {
  try {
    const childCategory = await ChildCategory.findByIdAndDelete(id);
    if (!childCategory) throw new Error('Child Category not found');
    deleteOldFile(childCategory.image);
    return { message: 'Child Category deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting child category: ' + error.message);
  }
};

module.exports = {
  createChildCategory,
  getAllChildCategories,
  getChildCategoryById,
  updateChildCategory,
  deleteChildCategory,
};
