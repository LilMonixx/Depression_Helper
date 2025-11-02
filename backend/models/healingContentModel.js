const mongoose = require('mongoose');

const healingContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // 'Article', 'Podcast', 'Video'
  type: {
    type: String,
    required: true,
    enum: ['Article', 'Podcast', 'Video'],
  },
  // Đường link tới nội dung
  url: {
    type: String,
    required: true,
  },
  // (Tùy chọn) Đường link tới ảnh bìa
  thumbnailUrl: {
    type: String,
  },
}, {
  timestamps: true
});

const HealingContent = mongoose.model('HealingContent', healingContentSchema);

module.exports = HealingContent;