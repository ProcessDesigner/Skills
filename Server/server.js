import express from 'express'
import dbConnection from './Config/dbConnection.js';
import app from './app.js';
import cloudinary from 'cloudinary'
const PORT = 5034;


cloudinary.v2.config({
    cloud_name:'deafm48ba',
    api_key:'916367985651227',
    api_secret:'kWEPTClb0C0UOAsICG1sGTrg7qE'
})


app.listen(PORT,()=>{
    dbConnection()
    console.log(`Server is listening at http://localhost:${PORT}/`);
})
