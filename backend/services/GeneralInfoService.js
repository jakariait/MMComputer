const fs = require('fs');
const GeneralInfoModel = require('../models/GeneralInfoModel');
const mongoose = require('mongoose');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads');

const deleteOldFile = (filename) => {
  if (filename) {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

// Get General Info (Only One Entry)
const getGeneralInfo = async (req, res) => {
  return GeneralInfoModel.findOne({});
};

// Create or Update General Info

const updateGeneralInfo = async (data, files) => {
  try {
    let generalInfo = await GeneralInfoModel.findOne({});

    const PrimaryLogo = files?.PrimaryLogo?.[0]?.filename || generalInfo?.PrimaryLogo;
    const SecondaryLogo = files?.SecondaryLogo?.[0]?.filename || generalInfo?.SecondaryLogo;
    const Favicon = files?.Favicon?.[0]?.filename || generalInfo?.Favicon;

    if (generalInfo) {
      if (files?.PrimaryLogo?.[0]?.filename && generalInfo?.PrimaryLogo) {
        deleteOldFile(generalInfo.PrimaryLogo);
      }
      if (files?.SecondaryLogo?.[0]?.filename && generalInfo?.SecondaryLogo) {
        deleteOldFile(generalInfo.SecondaryLogo);
      }
      if (files?.Favicon?.[0]?.filename && generalInfo?.Favicon) {
        deleteOldFile(generalInfo.Favicon);
      }
    }

    if (!generalInfo) {
      generalInfo = new GeneralInfoModel({
        PrimaryLogo,
        SecondaryLogo,
        Favicon,
        ...data,
        SalesPhone: Array.isArray(data.SalesPhone)
          ? data.SalesPhone
          : data.SalesPhone?.split(',') || [],
        ServicePhone: Array.isArray(data.ServicePhone)
          ? data.ServicePhone
          : data.ServicePhone?.split(',') || [],
        HotlinePhone: Array.isArray(data.HotlinePhone)
          ? data.HotlinePhone
          : data.HotlinePhone?.split(',') || [],
        CompanyEmail: Array.isArray(data.CompanyEmail)
          ? data.CompanyEmail
          : data.CompanyEmail?.split(',') || [],
      });
    } else {
      generalInfo.PrimaryLogo = PrimaryLogo;
      generalInfo.SecondaryLogo = SecondaryLogo;
      generalInfo.Favicon = Favicon;
      generalInfo.CompanyName = data.CompanyName;
      generalInfo.SalesPhone = Array.isArray(data.SalesPhone)
        ? data.SalesPhone
        : data.SalesPhone?.split(',') || [];
      generalInfo.ServicePhone = Array.isArray(data.ServicePhone)
        ? data.ServicePhone
        : data.ServicePhone?.split(',') || [];
      generalInfo.HotlinePhone = Array.isArray(data.HotlinePhone)
        ? data.HotlinePhone
        : data.HotlinePhone?.split(',') || [];
      generalInfo.CompanyEmail = Array.isArray(data.CompanyEmail)
        ? data.CompanyEmail
        : data.CompanyEmail?.split(',') || [];
      generalInfo.CompanyAddress = data.CompanyAddress;
      generalInfo.GoogleMapLink = data.GoogleMapLink;
      generalInfo.FooterCopyright = data.FooterCopyright;
    }

    await generalInfo.save();
    return generalInfo;
  } catch (error) {
    console.error('Error updating General Info:', error);
    throw new Error('Failed to update General Info: ' + error.message);
  }
};

// Delete General Info
const deleteGeneralInfo = async (req, res) => {
  const generalInfo = await GeneralInfoModel.findOne({});
  if (generalInfo) {
    deleteOldFile(generalInfo.PrimaryLogo);
    deleteOldFile(generalInfo.SecondaryLogo);
    deleteOldFile(generalInfo.Favicon);
  }
  return GeneralInfoModel.deleteMany({});
};

// Export service functions
module.exports = {
  getGeneralInfo,
  updateGeneralInfo,
  deleteGeneralInfo,
};
