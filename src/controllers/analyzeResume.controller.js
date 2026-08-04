import  {extractText}  from "../utils/extractText.js";

import * as openai from "../services/openai.service.js";
import * as gemini from "../services/gemini.service.js";
import * as claude from "../services/claude.service.js";

const getUserFriendlyAnalyzeError = (error) => {
    const status = error?.status || error?.statusCode || error?.response?.status;
    const message = String(error?.message || "").toLowerCase();

    if (error instanceof SyntaxError || message.includes("json")) {
        return {
            statusCode: 502,
            message: "The AI returned a response we could not read. Please try again."
        };
    }

    if (status === 401 || status === 403 || message.includes("api key") || message.includes("unauthorized")) {
        return {
            statusCode: 401,
            message: "Your API key could not be verified. Please check the key and try again."
        };
    }

    if (status === 400 || message.includes("model")) {
        return {
            statusCode: 400,
            message: "The selected model or request is not supported by this provider. Please choose another model and try again."
        };
    }

    if (status === 429 || message.includes("quota") || message.includes("rate limit")) {
        return {
            statusCode: 429,
            message: "The AI provider is busy or your quota was reached. Please wait a moment and try again."
        };
    }

    if (message.includes("unsupported file")) {
        return {
            statusCode: 400,
            message: "Please upload a PDF, DOCX, or TXT file."
        };
    }

    if (message.includes("network") || message.includes("fetch") || message.includes("timeout")) {
        return {
            statusCode: 503,
            message: "We could not connect to the AI provider. Please check your connection and try again."
        };
    }

    return {
        statusCode: 500,
        message: "We could not analyze the resume right now. Please try again."
    };
};

export const analyzeResume = async (req, res) => {
    try {
        const resume = req.files?.resume?.[0];
        const jobDescription = req.files?.jobDescription?.[0];

        const { provider, model, apiKey } = req.body;

        if (!resume || !jobDescription) {
            return res.status(400).json({
                success: false,
                message: "Resume and Job Description are required."
            });
        }

        if (!provider || !model || !apiKey) {
            return res.status(400).json({
                success: false,
                message: "provider, model and apiKey are required."
            });
        }

        const resumeText = await extractText(resume);
        const jobDescriptionText = await extractText(jobDescription);

        let llmProvider;

        switch (provider.toLowerCase()) {
            case "openai":
                llmProvider = openai;
                break;

            case "gemini":
                llmProvider = gemini;
                break;

            case "claude":
            case "anthropic":
                llmProvider = claude;
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: "Unsupported LLM provider."
                });
        }

        const result = await llmProvider.analyze({
            apiKey,
            model,
            resume: resumeText,
            jobDescription: jobDescriptionText
        });

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Analyze resume error:", error);

        const errorResponse = getUserFriendlyAnalyzeError(error);

        return res.status(errorResponse.statusCode).json({
            success: false,
            message: errorResponse.message
        });
    }
};
