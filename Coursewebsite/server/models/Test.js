const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'Lesson ID is required'],
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Test title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  questions: [{
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true
    },
    options: [{
      type: String,
      required: [true, 'Option text is required'],
      trim: true
    }],
    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer index is required'],
      min: 0
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Test', testSchema);