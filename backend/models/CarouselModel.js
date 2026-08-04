const mongoose = require('mongoose');

const DataSchema = mongoose.Schema(
  {
    imgSrc: { type: String, required: true },
    link: { type: String, default: '' },
    position: {
      type: String,
      enum: ['left-large', 'right-top', 'right-bottom'],
      default: 'left-large',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CarouselModel = mongoose.model('Carousel', DataSchema);

module.exports = CarouselModel;
