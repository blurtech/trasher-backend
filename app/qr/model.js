const mongoose = require('mongoose');

const { Schema } = mongoose;

const definition = {
  version: {
    type: Number
  },
  count: Number,
  tag: String,
  expired: {
    type: Boolean,
    default: false
  }
};

const LitterSchema = new Schema(definition, {});

module.exports = mongoose.model('QR', LitterSchema, "QRCodes");
