import React, { useEffect, useState } from "react";
import {
  Github,
  Linkedin,
  Globe,
  Mail,
  MapPin,
  Building2,
  GraduationCap,
  Calendar,
  Hash,
  LifeBuoy,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  BarChart3,
  LayoutDashboard,
  Settings,
  User2,
} from "lucide-react";
import { topicsData } from "../data/learningPathData";
import Sidebar, { SidebarItem } from "../custom/Sidebar";
import LeetCodeStats from "../custom/LeetcodeStats";
import SubHeading from "../custom/Subheading";
import { useDispatch, useSelector } from "react-redux";
import { leetCode } from "../store/Slices/AuthSlice";

const TopicProgressBar = ({ solved, total }) => {
  const progressPercentage = total > 0 ? (solved / total) * 100 : 0;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ease-in-out ${
          progressPercentage > 0
            ? "bg-gradient-to-r from-sky-400 to-blue-500"
            : "bg-gray-300"
        }`}
        style={{
          width: `${progressPercentage}%`,
          boxShadow:
            progressPercentage > 0 ? "0 2px 5px rgba(0,119,255,0.3)" : "none",
        }}
      />
    </div>
  );
};
const UserProfile = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch()
  const {data} = useSelector((state)=>state.auth)
  const user = data;
  console.log("This is user data",user)


  const defaultProfilePic =
    "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";

  const progressData = [
    { label: "A2Z", value: 0, target: 100 },
    { label: "SDE", value: 0, target: 100 },
    { label: "79", value: 0, target: 100 },
  ];
  const solvedQuestionsCounts = {
    Arrays: 1,
    "Linked Lists": 1,
    Strings: 2,
    Recursion: 0,
    Backtracking: 0,
    "Binary Search": 0,
    Heaps: 0,
    Stacks: 0,
    Queues: 0,
    "Binary Trees": 0,
    "Binary Search Trees": 0,
    "Dynamic Programming": 0,
    "Greedy Algorithms": 0,
    Graphs: 0,
  };
  const topics = [
    { name: "Arrays", count: 3 },
    { name: "Binary Search", count: 0 },
    { name: "Binary Search Tree", count: 0 },
    { name: "Binary Tree", count: 0 },
    { name: "Bit Manipulation", count: 0 },
    { name: "Dynamic Programming", count: 0 },
    { name: "Graph", count: 0 },
    { name: "Greedy", count: 0 },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(sectionId);
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (username.trim()) {
      await dispatch(leetCode(username))
    }
  };

  const handleRemove = () => {
    setLeetcodeStats(null);
    setUsername("");
    setError(null);
  };

  // const TopicProgressBar = ({ solved, total }) => {
  //   const progressPercentage = total > 0 ? (solved / total) * 100 : 0;

  //   return (
  //     <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
  //       <div
  //         className="bg-sky-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
  //         style={{ width: `${progressPercentage}%` }}
  //       ></div>
  //     </div>
  //   );
  // };

  return (
    <div className="flex bg-slate-50">
      <div className="flex h-screen fixed">
        {/* Sidebar */}
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
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className=" fixed">
          {/* Header Navbar */}
          <SubHeading />
        </div>
        {/* Content Section */}
        <div className=" mx-auto bg-white rounded-xl shadow-lg p-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            <img
              src={user.profilePic || defaultProfilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultProfilePic;
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <div className="flex gap-2">
                  <a
                    href={user.github}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={user.linkedin}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <p className="text-gray-600">{user.name}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>{user.course}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{user.classroom}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span className="font-mono">{user.prn}</span>
                </div>
              </div>
            </div>
          </div>
          {/* LeetCode Section */}
          <div className="mb-8">
            <LeetCodeStats />
          </div>

          {/* Topics Grid */}
          <div className="mt-24 pb-8">
            {" "}
            {/* Increased top margin and added bottom padding */}
            <h2 className="text-2xl font-semibold text-center mb-6">
              Topic Progress
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
              {" "}
              {/* Added horizontal padding */}
              {Object.values(topicsData).map((topic, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                >
                  <div className="mb-4 flex justify-center">{topic.icon}</div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    {topic.title}
                  </h3>
                  <div className="text-sm text-gray-600 mb-2 flex justify-center">
                    <span>
                      {solvedQuestionsCounts[topic.title]} /{" "}
                      {topic.questions.length} solved
                    </span>
                  </div>
                  <TopicProgressBar
                    solved={solvedQuestionsCounts[topic.title]}
                    total={topic.questions.length}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
