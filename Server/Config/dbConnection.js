import mongoose from "mongoose";

const URI = 'mongodb+srv://gurdev191004:LQnbdclCgndLkq2A@test0.9p8sb.mongodb.net/?retryWrites=true&w=majority&appName=test0';


const dbConnection = async()=>{
    const {connection} = await mongoose.connect(URI)
    try {
        console.log(`Connected to ${connection.host}`)
    } catch (error) {
        process.exit(1);
        console.log(error)
    }

}

export default dbConnection;