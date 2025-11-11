const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true
  },
  introVideoUrl: {
    type: String,
    required: [true, 'Intro video URL is required'],
    trim: true,
    match: [/^https?:\/\/.+\..+/, 'Please enter a valid URL']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);