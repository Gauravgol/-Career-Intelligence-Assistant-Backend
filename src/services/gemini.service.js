import { GoogleGenAI } from "@google/genai";

export const analyze = async ({
    apiKey,
    model,
    resume,
    jobDescription
}) => {

    const ai = new GoogleGenAI({
        apiKey
    });

    const response = await ai.models.generateContent({
        model,
        contents: `
You are an expert recruiter.

Return ONLY JSON.

{
    "matchScore":0,
    "summary":"",
    "matchingSkills":[],
    "missingSkills":[],
    "experienceAlignment":"",
    "interviewQuestions":[]
}

Resume:

${resume}

Job Description:

${jobDescription}
`
    });

    return JSON.parse(response.text);
};