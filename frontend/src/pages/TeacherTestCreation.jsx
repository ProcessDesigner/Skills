import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  LayoutDashboard,
  Clock,
  Plus,
  Bookmark,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  GraduationCap,
  Book,
  Timer,
  ArrowRight,
  Save,
  Trash2,
  BarChart3,
  UserCircle,
  Boxes,
  Package,
  Receipt,
  Settings,
  LifeBuoy,
} from "lucide-react";
import Sidebar from "../custom/Sidebar";
import { SidebarItem } from "../custom/Sidebar";
import SubHeading from "../custom/Subheading";
import { createTest } from "../store/Slices/TestSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const TestDetailsSection = ({ testDetails, setTestDetails, questions }) => {
  const [focused, setFocused] = useState(false);
  const dispatch = useDispatch()

  const handleCreateTest = async () => {
  // Validate test details and questions
  if (!testDetails.testName || !testDetails.duration || !testDetails.instructions) {
    toast.error("Please fill in all test details");
    return;
  }

  if (questions.length === 0) {
    toast.error("Please add at least one question");
    return;
  }

  // Prepare data in the format expected by backend
  const testData = {
    testName: testDetails.testName,
    duration: testDetails.duration,
    instructions: testDetails.instructions,
    questions: questions.map((q) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    })),
  };

  try {
    console.log("This is test data", testData);
    const response = await dispatch(createTest(testData));

    if (response.payload.success) {
      toast.success("Test created successfully");
      // Reset form and questions
      setTestDetails({ testName: "", duration: "", instructions: "" });
      setQuestions([]); // Reset questions array
      setNewQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "", questionNumber: 1 });
    }
  } catch (error) {
    toast.error("Failed to create test");
  }
};


  
  
  return (
    <Card className="mb-8 overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-500 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6" />
              Test Details
            </h2>
            <p className="text-blue-100 text-sm">Fill in the basic information about your test</p>
          </div>
          <Badge className="flex bg-blue-400/20 text-white border-blue-400/30 px-3 py-1.5">
            <Book className="w-4 h-4 mr-1" />
            New Test
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 p-6 bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-blue-500" />
              Test Name
            </label>
            <div className={`relative transition-all duration-300 ${focused ? 'scale-[1.02]' : ''}`}>
              <Input
                value={testDetails.testName}
                onChange={(e) => setTestDetails({ ...testDetails, testName: e.target.value })}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Enter test name"
                className="w-full border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
              />
              <Bookmark className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">Give your test a clear and descriptive name</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Timer className="h-4 w-4 text-blue-500" />
              Duration (minutes)
            </label>
            <div className="relative">
              <Input
                type="number"
                value={testDetails.duration}
                onChange={(e) => setTestDetails({ ...testDetails, duration: e.target.value })}
                placeholder="Enter test duration"
                className="w-full border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">Specify the total time allowed for the test</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            Test Instructions
          </label>
          <Textarea
            value={testDetails.instructions}
            onChange={(e) => setTestDetails({ ...testDetails, instructions: e.target.value })}
            placeholder="Enter detailed instructions for test takers..."
            className="w-full min-h-[120px] border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <p className="text-xs text-gray-500">Provide clear instructions for students taking the test</p>
        </div>

        {questions.length > 0 && (
          <div className="mt-6">
            <Button 
              onClick={handleCreateTest}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-blue-700 text-white h-12 font-medium transition-all duration-300 transform hover:scale-[1.02]"
            >
              Create Test
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const QuestionForm = ({ newQuestion, setNewQuestion, handleAddQuestion }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);

  return (
    <Card className="mb-6 overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-500 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <Plus className="h-6 w-6" />
              Add New Question
            </h2>
            <p className="text-blue-100 text-sm">Create multiple choice questions</p>
          </div>
          <Badge className="flex bg-blue-400/20 text-white border-blue-400/30 px-3 py-1.5">
            Question {newQuestion.questionNumber || 1}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8 p-6 bg-white">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            Question Text
          </label>
          <Textarea
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            placeholder="Type your question here..."
            className="w-full min-h-[100px] border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            Answer Options
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            {newQuestion.options.map((option, index) => (
              <div 
                key={index}
                className={`relative transform transition-all duration-300 ${
                  hoveredOption === index ? 'scale-[1.02]' : ''
                }`}
                onMouseEnter={() => setHoveredOption(index)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={`w-8 h-8 flex items-center justify-center transition-all duration-300 ${
                      newQuestion.correctAnswer === String.fromCharCode(65 + index)
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </Badge>
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[index] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                    className="w-full border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            Select Correct Answer
          </label>
          <div className="grid grid-cols-4 gap-3">
            {["A", "B", "C", "D"].map((letter) => (
              <Button
                key={letter}
                onClick={() => {
                  setSelectedOption(letter);
                  setNewQuestion({ ...newQuestion, correctAnswer: letter });
                }}
                className={`h-12 transition-all duration-300 ${
                  newQuestion.correctAnswer === letter
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
        <Button
        onClick={handleAddQuestion}
        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-blue-700 text-white h-12 font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
      >
        <Plus className="mr-2 h-5 w-5" /> Add Question
      </Button>
          <Button
            className="bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 h-12 px-6 transition-all duration-300"
          >
            <Save className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


const TeacherTestCreation = () => {
  const [testDetails, setTestDetails] = useState({
    testName: "",
    duration: "",
    instructions: "",
  });

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    questionNumber: 1,
  });

  
  const handleAddQuestion = useCallback(() => {
    if (
      newQuestion.question &&
      newQuestion.options.every((opt) => opt) &&
      newQuestion.correctAnswer
    ) {
      setQuestions((prev) => [
        ...prev,
        { ...newQuestion, id: prev.length + 1 },
      ]);
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
    }
  }, [newQuestion]);

  const handleDeleteQuestion = useCallback((id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" alert />
        <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" />
        <SidebarItem icon={<UserCircle size={20} />} text="Users" />
        <SidebarItem icon={<Boxes size={20} />} text="Inventory" />
        <SidebarItem icon={<Package size={20} />} text="Orders" alert />
        <SidebarItem icon={<Receipt size={20} />} text="Billings" />
        <hr className="my-3" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
      </Sidebar>
      <div className="flex-1 min-h-screen pb-8 overflow-y-auto">
        <SubHeading />
        <div className="max-w-5xl mx-auto p-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 mb-8">
            Create Aptitude Test
          </h1>
          <TestDetailsSection 
            testDetails={testDetails} 
            setTestDetails={setTestDetails} 
            questions={questions}  // Add this line
          />
          <QuestionForm
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
            handleAddQuestion={handleAddQuestion}
          />
          {/* <QuestionBank
            questions={questions}
            handleDeleteQuestion={handleDeleteQuestion}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default TeacherTestCreation;