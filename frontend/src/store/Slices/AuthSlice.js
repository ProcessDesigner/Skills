import toast from "react-hot-toast";
import axiosInstance from "@/Helpers/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    loading:false,
    error:null,
    isLoggedIn :localStorage.getItem('isLoggedIn')||false,
    data:localStorage.getItem('data')|| {},
    role: localStorage.getItem('role')||""
}

export const registerUser = createAsyncThunk(
    "user/signup",
    async(data,{rejectWithvalue})=>{
        try {
            const response = await axiosInstance.post('user/signup',data)
            return (await response).data;
        } catch (error) {
            console.log(error)
            const errorMessage =
            error?.response?.data?.message || "Failed to signup.";
            toast.error(errorMessage);
            return rejectWithvalue(errorMessage);
      
        }
    }
)

export const validateOtp = createAsyncThunk(
    "user/validate",
    async(data,{rejectWithValue})=>{
        try {
            console.log("this is the otp being sent form slice",data)
            const response = await axiosInstance.post('user/validate',data)
            return await response.data
        } catch (error) {
            console.log(error)
            const errorMessage =
            error?.response?.data?.message || "Failed to validate.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);   
        }
    }
)

export const regenerateOtp = createAsyncThunk(
    "user/validate",
    async(data,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.post('user/regenerate')
            return await response.data
        } catch (error) {
            console.log(error)
            const errorMessage =
            error?.response?.data?.message || "Failed to regenerate.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);   
        }
    }
)

export const logout = createAsyncThunk(
    'user/logout',
    async(data,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.post('user/logout')
            return await response.data
        } catch (error) {
            console.log(error)
            const errorMessage =
            error?.response?.data?.message || "Failed to regenerate.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage); 
        }
    }
)

export const loginUser = createAsyncThunk(
    "user/login",
    async(data,{rejectWithvalue})=>{
        try {
            const response = await axiosInstance.post('user/login',data)
            return await response.data;
        } catch (error) {
            console.log(error)
            const errorMessage =
            error?.response?.data?.message || "Failed to signup.";
            toast.error(errorMessage);
            return rejectWithvalue(errorMessage);   
        }
    }
)

export const getUser = createAsyncThunk(
    'user/getuser',
    async(data,{rejectWithvalue}) =>{
        try {
            const response = await axiosInstance.get('user/me')
            return response.data;
        } catch (error) {
            console.log(error)
            const errorMessage =
            error?.response?.data?.message || "Failed to signup.";
            toast.error(errorMessage);
            return rejectWithvalue(errorMessage);    
        }
    }
)

export const forgotPassword = createAsyncThunk(
    "user/forgotpassword",
    async(data,{rejectWithvalue})=>{
        try {
            const response = await axiosInstance.post('user/forgot',data)
            return await response.data
        } catch (error) {
            console.log(error)
            const errorMessage =
            error?.response?.data?.message || "Failed to generate forgot password url.";
            toast.error(errorMessage);
            return rejectWithvalue(errorMessage);    
        }
    }
)
export const resetPassword = createAsyncThunk(
    "user/reset-password",
    async (data, { rejectWithValue }) => {
      try {
        const { password, resetToken } = data; // Extract password and resetToken
        console.log("Sending the response to backend");
        const response = await axiosInstance.post(`user/reset/${resetToken}`, { password });
        console.log("Response received from backend");
        return response.data;
      } catch (error) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || "Failed to reset the password.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  );

  export const leetCode = createAsyncThunk(
    "auth/leetcode",
    async(username,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.post(`user/leetcode/${username}`)
            return await response.data
        } catch (error) {
            console.log(error);
            const errorMessage =
            error?.response?.data?.message || "Failed to get leetcode";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage); 
        }
    }
  )
  
const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(registerUser.fulfilled, (state, action) => {
                console.log("Register Response Payload:", action.payload); // Add this line
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", JSON.stringify(action?.payload?.user?.role));
                
                state.data = action.payload.user;
                state.role = action.payload.user?.role;
                state.isLoggedIn = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log("Login Response Payload:", action.payload); // Add this line
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", JSON.stringify(action?.payload?.user?.role));
                
                state.data = action.payload.user;
                state.role = action.payload.user?.role;
                state.isLoggedIn = true;
            })
            .addCase(getUser.pending,(state,action)=>{
                state.error = null
                state.loading = true
            })
            .addCase(getUser.fulfilled,(state,action)=>{
                state.data = action.payload.user;
                state.role = action.payload.user?.role;
                state.loading = false
            })
            .addCase(getUser.rejected,(state,action)=>{
                state.error = action.payload
                state.loading = false
            })
        
        
    }
})

export default authSlice.reducer