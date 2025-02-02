// ... other imports
import { useState } from "react"
import StudentSelect from "./ui/student-select"

const TestDetailsSection = ({ testDetails, setTestDetails, questions }) => {
  const [selectedStudents, setSelectedStudents] = useState([])

  // Sample student data - replace with your actual data
  const students = [
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      prn: "PRN001",
      branch: "Computer Science",
      year: "3rd Year",
      division: "A",
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      prn: "PRN002",
      branch: "Electrical Engineering",
      year: "2nd Year",
      division: "B",
    },
    // Add more sample students...
  ]

  const handleStudentSelect = (student) => {
    setSelectedStudents((prev) => {
      if (prev.includes(student.prn)) {
        return prev.filter((prn) => prn !== student.prn)
      }
      return [...prev, student.prn]
    })
  }

  return (
    <Card className="mb-8 overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-500 p-6">
        {/* ... existing header content ... */}
      </CardHeader>
      <CardContent className="space-y-8 p-6 bg-white">
        {/* ... existing test name and duration inputs ... */}

        {/* Subject Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Book className="h-4 w-4 text-blue-500" />
            Subject
          </label>
          <Input
            value={testDetails.subject}
            onChange={(e) => setTestDetails({ ...testDetails, subject: e.target.value })}
            placeholder="Enter subject name"
            className="w-full border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Enhanced Student Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-blue-500" />
            Select Students
          </label>
          <StudentSelect students={students} onSelect={handleStudentSelect} selectedStudents={selectedStudents} />
          {selectedStudents.length > 0 && (
            <div className="text-sm text-gray-500">{selectedStudents.length} student(s) selected</div>
          )}
        </div>

        {/* ... existing instructions textarea ... */}

        {/* ... existing create test button ... */}
      </CardContent>
    </Card>
  )
}

