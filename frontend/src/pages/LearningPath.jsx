import React, { useMemo, useState } from "react";
import Leetcode from "../assets/leetcode.png";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import {
  LayoutDashboard,
  BarChart3,
  UserCircle,
  Boxes,
  Package,
  Receipt,
  Settings,
  LifeBuoy,
  Plus,
  ArrowLeft,
  Delete,
  X,
} from "lucide-react";
import Header from "../custom/Header";
import Sidebar, { SidebarItem } from "../custom/Sidebar";
import SubHeading from "../custom/StudentSubheading";
import { topicsData, categories } from "../data/learningPathData";
import AddQuestionForm from "../custom/AddQuestionForm";
const LearningPath = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [questions, setQuestions] = useState(topicsData);
  const [newQuestion, setNewQuestion] = useState({
    problem: "",
    practice: "",
    difficulty: "Medium",
    // category: "Basic",
    // timeComplexity: "",
    // spaceComplexity: "",
    // notes: "",
    // companies: "",
    // similarProblems: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    e.preventDefault();
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value, // Dynamically update the field based on the input's name
    }));
  };

  const handleCheckboxChange = (topic, index) => {
    const updatedQuestions = { ...questions };
    updatedQuestions[topic].questions[index].status =
      !updatedQuestions[topic].questions[index].status;
    setQuestions(updatedQuestions);
  };
  const handleCancel = () => {
    setNewQuestion({
      problem: "",
      practice: "",
      difficulty: "Medium",
      // category: "Basic",
      // timeComplexity: "",
      // spaceComplexity: "",
      // notes: "",
      // companies: "",
      // similarProblems: "",
    });

    setShowForm(false);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!selectedTopic) return;

    const updatedQuestions = { ...questions };
    updatedQuestions[selectedTopic].questions.push({
      status: false,
      ...newQuestion,
    });

    setQuestions(updatedQuestions);
    setNewQuestion({
      problem: "",
      practice: "",
      difficulty: "Medium",
      // category: "Basic",
      // timeComplexity: "",
      // spaceComplexity: "",
      // notes: "",
      // companies: "",
      // similarProblems: "",
    });
    setShowForm(false);
  };

  const TopicCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(topicsData).map(([key, topic]) => (
        <Card
          key={key}
          className="hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
          onClick={() => setSelectedTopic(key)}
        >
          <CardContent className="p-6">
            <div
              className={`${topic.color} text-white p-4 rounded-lg mb-4 inline-block`}
            >
              {topic.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
            <p className="text-gray-600">{topic.description}</p>
            <div className="mt-4 text-sm text-gray-500">
              {questions[key].questions.filter((q) => q.status).length} /{" "}
              {questions[key].questions.length} completed
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const TopicQuestions = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSelectedTopic(null)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          <span>Back to Topics</span>
        </button>
        <h2 className="text-2xl font-bold">
          {topicsData[selectedTopic].title}
        </h2>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Problem</th>
              <th className="p-4 text-left">Practice</th>
              <th className="p-4 text-left">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {questions[selectedTopic].questions.map((question, index) => (
              <tr key={index} className="border-t">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={question.status}
                    onChange={() => handleCheckboxChange(selectedTopic, index)}
                    className="h-4 w-4"
                  />
                </td>
                <td className="p-4">{question.problem}</td>
                <td className="p-4">
                  <a
                    href={question.practice}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <img src={Leetcode} alt="LeetCode" className="h-8 w-14" />
                  </a>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      question.difficulty === "Easy"
                        ? "bg-green-100 text-green-800"
                        : question.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center space-x-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        {showForm ? (
          <div className="flex space-x-2">
            <Delete size={20} /> <span>Cancel</span>{" "}
          </div>
        ) : (
          <div className="flex space-x-2">
            <Plus size={20} /> <span>Add New Question</span>{" "}
          </div>
        )}
      </Button>

      {/* {showForm && (
        
      )} */}
    </div>
  );

  return (
    <div className="flex">
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          alert
        />
        <SidebarItem icon={<BarChart3 size={20} />} text="Statistics" />
        <SidebarItem icon={<UserCircle size={20} />} text="Users" />
        <SidebarItem icon={<Boxes size={20} />} text="Inventory" />
        <SidebarItem icon={<Package size={20} />} text="Orders" alert />
        <SidebarItem icon={<Receipt size={20} />} text="Billings" />
        <hr className="my-3" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
      </Sidebar>

      <div className="w-full">
        {/* <Header /> */}
        <SubHeading />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Learning Path
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose a topic to start your learning journey. Each section
              contains carefully curated problems to help you master the
              concepts.
            </p>
          </div>

          {selectedTopic ? <TopicQuestions /> : <TopicCards />}
          {showForm ? (
            <Card className="my-8">
              <AddQuestionForm
                newQuestion={newQuestion}
                onInputChange={handleInputChange}
                onSubmit={handleAddQuestion}
                onCancel={handleCancel}
              />
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
