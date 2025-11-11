const mongoose = require('mongoose');

const testSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: [true, 'Test ID is required']
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: [true, 'Question index is required'],
      min: 0
    },
    selectedOption: {
      type: Number,
      required: [true, 'Selected option is required'],
      min: 0
    }
  }],
  score: {
    type: Number,
    default: 0,
    min: 0
  },
  graded: {
    type: Boolean,
    default: false
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  marks: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Ensure a user can only submit a test once
testSubmissionSchema.index({ userId: 1, testId: 1 }, { unique: true });

module.exports = mongoose.model('TestSubmission', testSubmissionSchema);