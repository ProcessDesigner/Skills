import { configureStore } from "@reduxjs/toolkit"
import authSliceReducer from './Slices/AuthSlice'
import testSliceReducer from './Slices/TestSlice'
const store = configureStore({
	reducer:{
		auth:authSliceReducer,
		test:testSliceReducer
	},
	devTools:true
})

export default store;