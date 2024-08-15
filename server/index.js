import express from 'express'
import dotenv from "dotenv"
import connectDB from './db/connectDB.js'
import authRoutes from './routes/auth.routes.js'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
// initializations
const app = express()
const PORT = process.env.PORT || 5000
dotenv.config()
const __dirname = path.resolve();




// middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
// Parse JSON bodies (default content-type is application/json)
app.use(bodyParser.json());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()) // to parse the cookies
app.use('/api/auth',authRoutes)
app.get('/hello', (req,res)=>{
    res.send("hello worlf")
})

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
	});
}




app.listen(PORT, async()=>{
    await connectDB()
    console.log("server is running on port", PORT)})
