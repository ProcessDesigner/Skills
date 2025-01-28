import axiosInstance from "@/Helpers/axiosInstance"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

const initialState ={
    loading:false,
    error:null,
    testById:null,
    tests:[]
}

export const createTest = createAsyncThunk(
    "test/create",
    async(data,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.post('test/create',data)
            return await response.data;
        } catch (error) {
            console.log(error)
            const errorMessage =
            error?.response?.data?.message || "Failed to create test.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
)

export const getTestsbyTeacheid= createAsyncThunk(
    'test/gettestbyteacherid',
    async(data,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.get('test/getTestsByTeacherid')
            return await response.data
        } catch (error) {
            console.log(error)
            const errorMessage =
            error?.response?.data?.message || "Failed to create test.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
)

export const getTests = createAsyncThunk(
    'test/getall',
    async(data,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.get('test/getall')
            return await response.data
        } catch (error) {
            console.log(error)
            const errorMessage =
            error?.response?.data?.message || "Failed to create test.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
)

export const getTestByid = createAsyncThunk(
    'test/getTestbyid',
    async(id,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.get(`test/getTestbyId/${id}`)
            return await response.data;
        } catch (error) {
            console.log(error)
            const errorMessage =
            error?.response?.data?.message || "Failed to create test.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage); 
        }
    }
)

const testSlice = createSlice({
    name:"test",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(getTestsbyTeacheid.pending,(state,action)=>{
                state.loading = true,
                state.error = null
            })
            .addCase(getTestsbyTeacheid.fulfilled,(state,action)=>{
                console.log("This is action payload",action.payload)
                state.loading = false,
                state.tests = action.payload.data
            })
            .addCase(getTestsbyTeacheid.rejected,(state,action)=>{
                state.loading = false,
                state.error = action.payload
            })
            .addCase(getTests.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTests.fulfilled, (state, action) => {
                state.loading = false;
                state.tests = action.payload.test;
            })
            .addCase(getTests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getTestByid.pending,(state,action)=>{
                state.loading = true,
                state.error = null
            })
            .addCase(getTestByid.fulfilled,(state,action)=>{
                console.log("This is action",action.payload)
                state.loading = false,
                state.testById = action.payload.test
            })
            .addCase(getTestByid.rejected,(state,action)=>{
                state.loading = false,
                state.error = action.payload
            })
        }
})

export default testSlice.reducer