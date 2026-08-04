import express from "express";
import upload from  "../middleware/upload.middleware.js";
import { analyzeResume } from  "../controllers/analyzeResume.controller.js";

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "API is healthy"
    });
});

router.post(
    "/analyze",
    upload.fields([
        { name: "resume", maxCount: 1 },
        { name: "jobDescription", maxCount: 1 }
    ]),
    analyzeResume
);



export default router;
