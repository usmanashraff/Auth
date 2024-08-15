import mongoose from "mongoose";
const connectDB = async()=>{
    try {
      const conn = await mongoose.connect(process.env.MONGO_URL)
      console.log("mongodb connected")
    } catch (error) {
        console.log("error in connecting mongodb", error.message)
        process.exit(1) //1 to exit with failur and 0 to exit with success
    }
}

export default connectDB