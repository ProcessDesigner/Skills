import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import Header from "../custom/Header";
import Sidebar, { SidebarItem } from "../custom/Sidebar";
import SubHeading from "../custom/StudentSubheading";
import { Link } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

import {
  Calendar,
  Clock,
  Search,
  BookOpen,
  Timer,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  BarChart2,
  GraduationCap,
  Target,
  Trophy,
  Users,
  LayoutDashboard,
  BarChart3,
  UserCircle,
  Boxes,
  Package,
  Receipt,
  Settings,
  ChevronRight,
  LifeBuoy,
  BookOpenCheck,
  Bell,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getTests } from "../store/Slices/TestSlice";

const TestCard = ({ test, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-green-50 text-green-600 border-green-200";
      case "upcoming":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "completed":
        return "bg-gray-50 text-gray-600 border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ongoing":
        return <Timer className="w-4 h-4 mr-1" />;
      case "upcoming":
        return <Clock className="w-4 h-4 mr-1" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className={`transform transition-all duration-500 ease-out bg-white border-gray-100 hover:shadow-lg hover:scale-[1.02] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <Badge
                className={`px-3 py-1 ${getStatusColor(test.status)} flex items-center`}
              >
                {getStatusIcon(test.status)}
                {test.status?.charAt(0).toUpperCase() + test.status?.slice(1)}
              </Badge>
              {test.importance && (
                <Badge className="bg-red-50 text-red-600 border-red-200 flex items-center px-3 py-1">
                  <Bell className="w-3 h-3 mr-1" />
                  High Priority
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {test.testName}
              </h3>
              {test.participants && (
                <div className="flex items-center text-gray-500 text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  {test.participants.length} participants
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{test.subject}</span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{test.date}</span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{test.duration} minutes</span>
                </div>
              </div>

              {test.additionalInfo && (
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                    <Target className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Total Marks: {test.totalMarks}</span>
                  </div>
                  <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                    <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{test.examiner}</span>
                  </div>
                  {test.status === "completed" && (
                    <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                      <Trophy className="w-4 h-4 mr-2 text-green-500" />
                      <span className="font-medium text-green-600">
                        {test.score}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="ml-6 flex flex-col items-end space-y-2 text-white">
            {test.status === "ongoing" && (
              <Link to="/test">
                <Button className="bg-blue-600 hover:bg-blue-700 transition-all flex">
                  Start Test <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            )}
            {test.status === "upcoming" && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Starts in</p>
                <p className="text-lg font-semibold text-blue-600">
                  {test.startsIn}
                </p>
              </div>
            )}
            {test.status === "completed" && (
              <Button
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 text-gray-700 transition-all flex "
              >
                View Results <BarChart2 className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StudentTestDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const { tests, loading, error } = useSelector((state) => state.test);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTests());
  }, [dispatch]);

  const filteredTests = tests.filter(
    (test) =>
      (test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.subject.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedTab === "all" || test.status === selectedTab)
  );

  const getStatusCount = (status) => {
    return tests.filter((test) => test.status === status).length;
  };

  return (
    <div className="flex">
      <div className="h-screen fixed">
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

      <div className="w-full">
        <SubHeading />
        <div className="flex bg-gray-50">
          <div className="w-full">
            <div className="min-h-screen">
              <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h1 className="text-3xl font-bold text-gray-900">
                        My Tests
                      </h1>
                      <Badge className="bg-blue-50 text-blue-600 border-blue-200 p-2">
                        {tests.length} Tests
                      </Badge>
                    </div>
                    <p className="text-gray-600">
                      View and manage your academic assessments
                    </p>
                  </div>

                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search tests..."
                      className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 transition-colors w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                      <div className="text-blue-600 font-medium" size={"1rem"}>
                        All Tests
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {tests.length}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                      <div className="text-green-600 font-medium">Ongoing</div>
                      <div className="text-2xl font-bold text-green-700">
                        {getStatusCount("ongoing")}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                      <div className="text-blue-600 font-medium">Upcoming</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {getStatusCount("upcoming")}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="text-gray-600 font-medium">Completed</div>
                      <div className="text-2xl font-bold text-gray-700">
                        {getStatusCount("completed")}
                      </div>
                    </div>
                  </div>
                </div>

                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="flex border-b">
                    <TabsTrigger value="all" className="py-2 px-4 text-sm text-gray-700 hover:text-gray-900">
                      All Tests
                    </TabsTrigger>
                    <TabsTrigger value="ongoing" className="py-2 px-4 text-sm text-green-600 hover:text-green-700">
                      Ongoing
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="py-2 px-4 text-sm text-blue-600 hover:text-blue-700">
                      Upcoming
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="py-2 px-4 text-sm text-gray-600 hover:text-gray-700">
                      Completed
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      filteredTests.map((test, index) => (
                        <TestCard key={test._id} test={test} index={index} />
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTestDashboard;
