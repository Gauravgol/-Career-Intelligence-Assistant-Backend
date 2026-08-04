import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/router.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", router);

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found"});
});

app.use((err, req, res, next) => {
    console.error("Request Error:", err);

    if (err.name === "MulterError") {
        const message = err.code === "LIMIT_FILE_SIZE"
            ? "Files must be 10 MB or smaller."
            : "There was a problem uploading your files. Please try again.";

        return res.status(400).json({ success: false, message });
    }

    if (err.message?.includes("Only PDF")) {
        return res.status(400).json({
            success: false,
            message: "Please upload only PDF, DOC, DOCX, or TXT files."
        });
    }

    res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again."
    });
});

export default app;
