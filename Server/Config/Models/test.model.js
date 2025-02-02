import { Schema, model } from "mongoose";

const testSchema = new Schema({
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: "Usera", // Ensure this matches the correct User model reference name
  },
  Students: [
    {
      student: {
        type: Schema.Types.ObjectId,
        ref: "User", // Ensure this matches the correct User model reference name
      },
      marks_obtained: {
        type: String,
      },
      dateofgiving: {
        type: String,
      },
    },
  ],
  testName: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // Assuming "duration" is in minutes, adjust if needed
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          type: String,
          required: true,
        },
      ],
      correctAnswer: {
        type: String,
        required: true,
      },
      marks: {
        type: String,
      },
    },
  ],
  subject: {
    type: String,
  },
  passingMarks: {
    type: String,
  },
  total: {
    type: String,
  },
  
});

const Test = model("Test", testSchema);
export default Test;
