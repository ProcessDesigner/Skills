import React, { useState, useMemo, useEffect } from "react";
import { useParams, Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  ClipboardCheck,
  Search,
  Download,
  ArrowUpDown,
  LayoutDashboard,
  BarChart3,
  UserCircle,
  Boxes,
  Package,
  Receipt,
  Settings,
  LifeBuoy,
  // LineChart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Sidebar, { SidebarItem } from "../custom/Sidebar";
import SubHeading from "../custom/Subheading";
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { getTestsbyTeacheid } from "../store/Slices/TestSlice";
// Test Details Component
const testResults = [
  {
    id: 1,
    testName: "Data Structures Quiz",
    date: "2024-01-15",
    totalStudents: 45,
    averageScore: 78.5,
    passingRate: 85,
    results: [
      {
        studentName: "Alice Johnson",
        score: 92,
        timeTaken: "45:30",
        status: "Passed",
      },
      {
        studentName: "Bob Smith",
        score: 68,
        timeTaken: "52:15",
        status: "Failed",
      },
      {
        studentName: "Carol White",
        score: 85,
        timeTaken: "48:20",
        status: "Passed",
      },
    ],
  },
  {
    id: 2,
    testName: "Algorithms Midterm",
    date: "2024-01-20",
    totalStudents: 38,
    averageScore: 72.3,
    passingRate: 76,
    results: [
      {
        studentName: "David Brown",
        score: 88,
        timeTaken: "55:00",
        status: "Passed",
      },
      {
        studentName: "Eva Davis",
        score: 95,
        timeTaken: "49:45",
        status: "Passed",
      },
      {
        studentName: "Frank Miller",
        score: 62,
        timeTaken: "58:30",
        status: "Failed",
      },
    ],
  },
];
const performanceData = testResults.map((test) => ({
  name: test.testName,
  averageScore: test.averageScore,
  passingRate: test.passingRate,
}));
const TestDetails = () => {
  const { id } = useParams();
  const test = testResults.find((t) => t.id === parseInt(id));
  const navigate = useNavigate();

  if (!test) {
    return <div>Test not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{test.testName} Results</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Back to Tests
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Test Overview</CardTitle>
              <p className="text-gray-600">Date: {test.date}</p>
            </div>
            <div className="text-right">
              <p>Total Students: {test.totalStudents}</p>
              <p>Average Score: {test.averageScore}%</p>
              <p>Passing Rate: {test.passingRate}%</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">Student Name</th>
                <th className="py-3 px-4 text-left">Score</th>
                <th className="py-3 px-4 text-left">Time Taken</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {test.results.map((result, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">{result.studentName}</td>
                  <td className="py-3 px-4">{result.score}%</td>
                  <td className="py-3 px-4">{result.timeTaken}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        result.status === "Passed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

// Main TestResultsPage Component
const TestResultsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const dispatch = useDispatch()
  const {loading,error,tests} = useSelector((state)=>state.test)
  console.log("This is tests ",tests)

  useEffect(async()=>{
    await dispatch(getTestsbyTeacheid())
  },[dispatch])
  const testResults = [
    {
      id: 1,
      testName: "Data Structures Quiz",
      date: "2024-01-15",
      totalStudents: 45,
      averageScore: 78.5,
      passingRate: 85,
    },
    {
      id: 2,
      testName: "Algorithms Midterm",
      date: "2024-01-20",
      totalStudents: 38,
      averageScore: 72.3,
      passingRate: 76,
    },
  ];

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const downloadResults = () => {
    const headers = [
      "Test Name",
      "Date",
      "Total Students",
      "Average Score",
      "Passing Rate",
    ];
    const csvContent = [
      headers.join(","),
      ...testResults.map((test) =>
        [
          test.testName,
          test.date,
          test.totalStudents,
          `${test.averageScore}%`,
          `${test.passingRate}%`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "test_results.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAndSortedResults = useMemo(() => {
    let results = testResults;

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      results = results.filter(
        (test) =>
          test.testName.toLowerCase().includes(lowercaseQuery) ||
          test.date.toLowerCase().includes(lowercaseQuery)
      );
    }

    if (sortConfig.key) {
      results.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return results;
  }, [testResults, searchQuery, sortConfig]);

  return (
    <div className="flex min-h-screen">
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
      <div className="flex-1 min-h-screen pb-8 overflow-y-auto">
        <SubHeading />
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Test Results Dashboard
            </h1>
            <p className="text-gray-600">
              View and analyze student performance across all tests
            </p>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mx-8 ">
          <Card className="transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tests Conducted
              </CardTitle>
              <TrendingUp className="text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testResults.length}</div>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Average Pass Rate
              </CardTitle>
              <ClipboardCheck className="text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  testResults.reduce((acc, test) => acc + test.passingRate, 0) /
                  testResults.length
                ).toFixed(1)}
                %
              </div>
              <p className="text-xs text-gray-500">Across all tests</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {testResults.reduce((acc, test) => acc + test.totalStudents, 0)}
              </div>
              <p className="text-xs text-gray-500">Participated in tests</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mx-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="averageScore"
                      stroke="#8884d8"
                      name="Average Score"
                    />
                    <Line
                      type="monotone"
                      dataKey="passingRate"
                      stroke="#82ca9d"
                      name="Passing Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="averageScore"
                      fill="#8884d8"
                      name="Average Score"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mx-8">
          <CardContent>
            <div className="overflow-x-auto ">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 px-6 text-left">Test Name</th>
                    <th className="py-4 px-6 text-left">Date</th>
                    <th className="py-4 px-6 text-left">Total Students</th>
                    <th className="py-4 px-6 text-left">Average Score</th>
                    <th className="py-4 px-6 text-left">Passing Rate</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedResults.map((test) => (
                    <tr key={test.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">{test.testName}</td>
                      <td className="py-4 px-6">{test.date}</td>
                      <td className="py-4 px-6">{test.totalStudents}</td>
                      <td className="py-4 px-6">{test.averageScore}%</td>
                      <td className="py-4 px-6">{test.passingRate}%</td>
                      <td className="py-4 px-6">
                        <Link
                          to={`/getmarks/${test.id}`}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Combined component for routing
const TestResultsRoutes = () => {
  return (
    <Routes>
      <Route index element={<TestResultsPage />} />
      <Route path=":id" element={<TestDetails />} />
    </Routes>
  );
};

export default TestResultsRoutes;
