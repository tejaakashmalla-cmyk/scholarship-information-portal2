const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [5, 'Age must be at least 5'],
      max: [60, 'Age cannot exceed 60'],
    },
    annualIncome: {
      type: Number,
      required: [true, 'Annual income is required'],
      min: [0, 'Income cannot be negative'],
    },
    educationLevel: {
      type: String,
      required: [true, 'Education level is required'],
      enum: ['Below 10th', '10th Pass', '12th Pass', 'Graduation', 'Post Graduation', 'PhD'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['General', 'OBC', 'SC', 'ST', 'Minority'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say',
    },
    disabilityStatus: {
      type: Boolean,
      default: false,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-set isComplete based on required fields
profileSchema.pre('save', function (next) {
  this.isComplete = !!(
    this.fullName && this.age && this.annualIncome !== undefined &&
    this.educationLevel && this.category && this.state
  );
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
