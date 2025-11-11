const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  order: {
    type: Number,
    required: [true, 'Order is required'],
    min: [0, 'Order must be a positive number']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Module', moduleSchema);