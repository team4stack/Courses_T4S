const mongoose = require('mongoose');

const progressTrackingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'Lesson ID is required']
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  testSubmitted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure a user can only have one progress record per lesson
progressTrackingSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('ProgressTracking', progressTrackingSchema);