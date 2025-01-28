// custom/SignupPage.jsx
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
// For redirection
import Button from "../ui/Button"; // Assuming you have a Button component
import Input from "../ui/Input"; // Assuming you have an Input component
import Label from "../ui/Label"; // Assuming you have a Label component
import Card from "../ui/Card"; // Assuming you have a Card component


import Select from '../ui/Select';
import TermsModal from "../ui/TermsModal";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/Slices/AuthSlice";

export default function SignupPage() {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    prn: "",
    rollNo: "",
    password: "",
    classroom: "",
    role: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  // const { signup, error, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleInputValue = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(`Field updated: ${name}, Value: ${value}`);
    setSignupData({
      ...signupData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isTermsChecked) {
      toast.error("Please agree to the Terms and Conditions to proceed.");
      return;
    }
    const response = await dispatch(registerUser(signupData))
    if(response.payload.success){
      navigate("/verify-email");
    }
  };

  const handleAgreeToTerms = () => {
    setIsTermsChecked(true);  // Check the checkbox
    setIsModalOpen(false);  // Close the modal
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[550px] p-6"
        footerText="Already have an account?"
        linkText="Login"
        linkHref="/login"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                name="role"
                value={signupData.role}
                onChange={handleInputValue}
                options={[
                  { value: "Specify Your role", label: null },
                  { value: "student", label: "Student" },
                  { value: "teacher", label: "Teacher" },
                ]}
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={signupData.name}
                onChange={handleInputValue}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={signupData.email}
              onChange={handleInputValue}
              required
            />
          </div>

          {signupData.role === "student" && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="rollNo">Roll No.</Label>
                  <Input
                    id="rollNo"
                    type="text"
                    name="rollNo"
                    placeholder="Enter your RollNo."
                    value={signupData.rollNo}
                    onChange={handleInputValue}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="prn">PRN</Label>
                  <Input
                    id="prn"
                    type="text"
                    name="prn"
                    placeholder="Enter your PRN"
                    value={signupData.prn}
                    onChange={handleInputValue}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="classroom">Class</Label>
                  <Select
                    id="classroom"
                    name="classroom"
                    value={signupData.classroom}
                    onChange={handleInputValue}
                    options={[
                      { value: "", label: "Select" },
                      { value: "FYCM1", label: "FYCM1" },
                      { value: "FYCM2", label: "FYCM2" },
                      { value: "FYCM3", label: "FYCM3" },
                      { value: "FYETC", label: "FYETC" },
                      { value: "FYAIDS", label: "FYAIDS" },
                      { value: "FYACT", label: "FYACT" },
                    ]}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="mb-4 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={signupData.password}
                onChange={handleInputValue}
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute top-10 right-2 flex items-center"
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>

            <div className="mb-4 relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={toggleShowConfirmPassword}
                className="absolute top-10 right-2 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={isTermsChecked}
              onChange={(e) => setIsTermsChecked(e.target.checked)}
              className="mr-2"
            />
            <Label htmlFor="terms">
              I agree to the{" "}
              <span
                onClick={() => setIsModalOpen(true)} // Open modal
                className="text-primary hover:underline cursor-pointer"
              >
                Terms and Conditions
              </span>
            </Label>
          </div>

          <Button type="submit" className="w-full mb-4" >
            Sign Up
          </Button>
        </form>

        {/* Terms and Conditions Modal */}
        <TermsModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAgree={handleAgreeToTerms}  // Pass the handleAgreeToTerms function
        />
      </Card>
    </div>
  );
}
