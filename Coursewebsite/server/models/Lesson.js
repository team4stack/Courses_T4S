const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: [true, 'Module ID is required']
  },
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    trim: true,
    match: [/^https?:\/\/.+\..+/, 'Please enter a valid URL']
  },
  order: {
    type: Number,
    required: [true, 'Order is required'],
    min: [0, 'Order must be a positive number']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema);