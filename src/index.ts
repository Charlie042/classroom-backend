import express from "express";
import subjectRoutes from "./routes/subject.js";
import cors from "cors";


const app = express();

const PORT = 3000;

if(!process.env.FRONTEND_URL){
    throw new Error('FRONTEND_URL is not defined');
}

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }
));
app.use("/api/v1/subjects", subjectRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});