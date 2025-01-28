import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Timer, ArrowRight, ArrowLeft, X } from "lucide-react";
import QuestionSidebar from "../custom/QuestionSidebar";
import FooterControls from "../custom/FooterControls";
import SubHeading from "../custom/Subheading";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTestByid } from "../store/Slices/TestSlice";

const TestPage = () => {
  const { id } = useParams();
  const { loading, error, testById } = useSelector((state) => state.test);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionStatus, setQuestionStatus] = useState(
    testById?.questions ? Array(testById.questions.length).fill("Not Attempted") : []
  );
  
  const [answers, setAnswers] = useState(
    testById?.questions ? Array(testById.questions.length).fill(null) : []
  );
  const [timeLeft, setTimeLeft] = useState(testById?.duration * 60 || 0); // Convert minutes to seconds
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTestByid(id));
  }, [dispatch, id]);

  // Update state when testById changes
  useEffect(() => {
    if (testById?.questions) {
      setQuestionStatus(Array(testById.questions.length).fill("Not Attempted"));
      setAnswers(Array(testById.questions.length).fill(null));
      setTimeLeft(testById.duration * 60);
    }
  }, [testById]);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isTestSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, isTestSubmitted]);

  const handleNext = () => {
    if (currentQuestion < testById?.questions?.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleClearOption = () => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[currentQuestion] = null;
      return updatedAnswers;
    });
    updateQuestionStatus(currentQuestion, "Not Attempted");
  };

  const handleSubmit = () => {
    // Calculate score
    const score = answers.reduce((total, answer, index) => {
      if (testById?.questions[index] && 
          answer === testById.questions[index].options.indexOf(testById.questions[index].correctAnswer)) {
        return total + 1;
      }
      return total;
    }, 0);

    setIsTestSubmitted(true);
    alert(
      `Test submitted successfully!\nYour score: ${score}/${testById?.questions?.length}`
    );
  };

  const updateQuestionStatus = (index, status) => {
    setQuestionStatus((prev) => {
      const updatedStatus = [...prev];
      updatedStatus[index] = status;
      return updatedStatus;
    });
  };

  const handleOptionChange = (optionIndex) => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[currentQuestion] = optionIndex;
      return updatedAnswers;
    });
    updateQuestionStatus(currentQuestion, "Answered");
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestion(index);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!testById) return <div>No test data available</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow p-4 gap-4">
        {/* Main Question Panel */}
        <div className="flex-1">
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 flex flex-row justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{testById.testName}</h2>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-8">
                <p className="text-lg mb-4">
                  Question {currentQuestion + 1} of {testById.questions.length}
                </p>
                <p className="text-xl font-medium mb-6">
                  {testById.questions[currentQuestion].question}
                </p>

                <div className="space-y-3">
                  {testById.questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors
                        ${
                          answers[currentQuestion] === index
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-gray-50"
                        }`}
                      onClick={() => handleOptionChange(index)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="">
            <CardContent>
              <div className="flex justify-between">
                <Button
                  className="flex"
                  variant="outline"
                  disabled={currentQuestion === 0}
                  onClick={handlePrevious}
                >
                  <ArrowLeft className="ml-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearOption}
                  className="flex text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Response
                </Button>
                <Button
                  className="flex"
                  variant="outline"
                  onClick={
                    currentQuestion === testById.questions.length - 1
                      ? handleSubmit
                      : handleNext
                  }
                >
                  {currentQuestion === testById.questions.length - 1 ? "Submit" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Navigation Sidebar */}
        <QuestionSidebar
          totalQuestions={testById.questions.length}
          currentQuestion={currentQuestion}
          setCurrentQuestion={handleQuestionNavigation}
          questionStatus={questionStatus}
        />
      </div>
    </div>
  );
};

export default TestPage;