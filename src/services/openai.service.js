import OpenAI from "openai";

export const analyze = async ({
    apiKey,
    model,
    resume,
    jobDescription
}) => {

    const client = new OpenAI({
        apiKey
    });

    const response = await client.responses.create({
        model,
        input: `
You are an expert technical recruiter.

Analyze the resume against the job description.

Return ONLY valid JSON.

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

    return JSON.parse(response.output_text);
};