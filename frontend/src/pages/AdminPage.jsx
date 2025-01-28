import { useEffect, useState } from 'react';
import { CaretSortIcon } from '@radix-ui/react-icons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/Table";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuthStore } from '../store/authStore'; // Adjust the import path
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Modal from "../ui/Modal"; // Import your modal component

export default function AdminPage() {
  const { fetchAllStudents, users = [], user, logout } = useAuthStore(); // Adjust to include current user
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedStudent, setSelectedStudent] = useState(null); // Store selected student
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchAllStudents();

    // Set up an interval to fetch data every 5 seconds
    const intervalId = setInterval(() => {
      fetchAllStudents();
    }, 5000);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchAllStudents]);

  const sortData = (a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  };

  const filteredAndSortedStudents = users
    .filter(student =>
      Object.values(student).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort(sortData);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handleResultClick = (student) => {
    setSelectedStudent(student); // Set the selected student to display in the modal
    setIsModalOpen(true); // Open the modal
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <div className="flex items-center">
          {user && (
            <>
              <span className="mr-4">Welcome, {user.name}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm mr-2"
        />
        <Button variant="primary" onClick={() => navigate('/experiment')}>
          Experiment
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => handleSort('classroom')} className='flex'>
                  Class
                  <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('prn')} className='flex'>
                  PRN
                  <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('name')} className='flex'>
                  Name
                  <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('email')} className='flex'>
                  Email
                  <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead><Button variant="ghost" onClick={() => handleSort('rollNo')} className='flex'>
                  Roll No.
                  <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button></TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Verified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.classroom}</TableCell>
                <TableCell>{student.prn}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.rollNo}</TableCell>
                <TableCell>
                  <Button variant="link" onClick={() => handleResultClick(student)}>
                    View Results
                  </Button>
                </TableCell>
                <TableCell>{student.isVerified ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal for displaying usage time and thickness */}
      {isModalOpen && selectedStudent && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-lg font-bold mb-4">Results for {selectedStudent.name}</h2>
          <div className="flex justify-between">
            <div className="w-1/2">
              <h3 className="text-md font-semibold">Usage Time</h3>
              <ul>
                {selectedStudent.usageTime.map((timeInSeconds, index) => (
                  <li key={index} className="border-b py-2">
                    Trial {index + 1}: {formatTime(timeInSeconds)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-1/2">
              <h3 className="text-md font-semibold">Thickness</h3>
              <ul>
                {selectedStudent.expResult.map((result, index) => (
                  <li key={index} className="border-b py-2">
                    Trial {index + 1}: {result}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
