import Test from "../Config/Models/test.model.js";
import User from "../Config/Models/user.model.js";
import AppError from "../utils/AppError.js";

const createTest = async (req, res, next) => {
  try {
    const { id } = req.user; // Extract teacher ID from token
    const { testName, duration, instructions, questions } = req.body;

    // Validate the user exists
    const teacher = await User.findById(id);
    if (!teacher) {
      return next(new AppError("Invalid user ID.", 401));
    }

    // Validate all required fields
    if (!testName || !duration || !instructions || !questions || questions.length === 0) {
      return next(new AppError("All fields are required.", 501));
    }

    // Validate and map each question
    const formattedQuestions = questions.map((question) => {
      if (!question.question || !question.options || question.options.length < 2) {
        throw new AppError("Each question must have text and at least two options.", 502);
      }

      if (!question.correctAnswer || !["A", "B", "C", "D"].includes(question.correctAnswer)) {
        throw new AppError(
          `Correct answer for question "${question.question}" must be one of A, B, C, or D.`,
          503
        );
      }

      // Map the correctAnswer (A -> 0, B -> 1, C -> 2, D -> 3)
      const correctAnswerIndex = "ABCD".indexOf(question.correctAnswer);

      if (correctAnswerIndex < 0 || correctAnswerIndex >= question.options.length) {
        throw new AppError(
          `Correct answer for question "${question.question}" does not match any provided option.`,
          503
        );
      }

      return {
        question: question.question,
        options: question.options,
        correctAnswer: question.options[correctAnswerIndex], // Map to the actual option
        marks: question.marks || "0", // Default marks to "0" if not provided
      };
    });

    // Save test to the database
    const newTest = await Test.create({
      testName,
      duration,
      instructions,
      questions: formattedQuestions, // Save correctly formatted questions
      teacherId: id,
    });

    // Respond to client
    res.status(201).json({
      success: true,
      message: "Test created successfully.",
      data: newTest,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError("Internal Server Error", 505));
  }
};


const getTestsbyTeacheid = async (req, res, next) => {
  try {
    const { id } = req.user; // Extract the teacher's ID from the token
    const tests = await Test.find({ teacherId: id }); // Query tests associated with the teacher

    if (!tests || tests.length === 0) {
      return next(new AppError('No tests found for this teacher.', 404));
    }

    res.status(200).json({
      success: true,
      message: `All tests created by teacher with ID: ${id}`,
      data: tests, // This now contains properly serialized data
    });
  } catch (error) {
    console.error(error);
    next(new AppError('Internal Server Error', 500));
  }
};


const getTests = async(req,res,next) =>{
  const test = await Test.find()

  res.status(200).json({
    success:true,
    message:'All Tests',
    test
  })
}
const getTestByid = async(req,res,next) =>{
  const {id} = req.params
  const test = await Test.findById(id)
  if(!test){
    return next(new AppError('Test not found with this id',501));
  }
  res.status(200).json({
    success:true,
    message:`Test with ${id}`,
    test
  })
}
const submitTest = async(req,res,next)=>{
  
}

export {
    createTest,
    getTestsbyTeacheid,
    getTests,
    getTestByid
}