import { useState, useMemo } from "react"
import { Search, Check } from "lucide-react"

const StudentSelect = ({ students, onSelect, selectedStudents = [] }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    branch: "",
    year: "",
    division: "",
  })

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    return {
      branch: [...new Set(students.map((s) => s.branch))],
      year: [...new Set(students.map((s) => s.year))],
      division: [...new Set(students.map((s) => s.division))],
    }
  }, [students])

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        searchTerm === "" ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.prn.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesBranch = filters.branch === "" || student.branch === filters.branch
      const matchesYear = filters.year === "" || student.year === filters.year
      const matchesDivision = filters.division === "" || student.division === filters.division

      return matchesSearch && matchesBranch && matchesYear && matchesDivision
    })
  }, [students, searchTerm, filters])

  return (
    <div className="w-full border rounded-lg shadow-sm bg-white">
      {/* Search and Filters Header */}
      <div className="p-4 border-b space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name, email, or PRN..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {/* Branch Filter */}
          <select
            value={filters.branch}
            onChange={(e) => setFilters((prev) => ({ ...prev, branch: e.target.value }))}
            className="px-3 py-1 border rounded-full text-sm bg-white hover:bg-gray-50"
          >
            <option value="">All Branches</option>
            {filterOptions.branch.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={filters.year}
            onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}
            className="px-3 py-1 border rounded-full text-sm bg-white hover:bg-gray-50"
          >
            <option value="">All Years</option>
            {filterOptions.year.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Division Filter */}
          <select
            value={filters.division}
            onChange={(e) => setFilters((prev) => ({ ...prev, division: e.target.value }))}
            className="px-3 py-1 border rounded-full text-sm bg-white hover:bg-gray-50"
          >
            <option value="">All Divisions</option>
            {filterOptions.division.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students List */}
      <div className="max-h-[300px] overflow-y-auto">
        {filteredStudents.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No students found matching the criteria</div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.prn}
              onClick={() => onSelect(student)}
              className={`p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedStudents.includes(student.prn) ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-gray-500">
                    {student.email} | PRN: {student.prn}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {student.branch} - {student.year} - Division {student.division}
                  </div>
                </div>
                {selectedStudents.includes(student.prn) && <Check className="h-5 w-5 text-blue-500" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default StudentSelect

