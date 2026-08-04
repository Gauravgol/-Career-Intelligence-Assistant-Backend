import Anthropic from "@anthropic-ai/sdk";

export const analyze = async ({
    apiKey,
    model,
    resume,
    jobDescription
}) => {

    const anthropic = new Anthropic({
        apiKey
    });

    const response = await anthropic.messages.create({

        model,

        max_tokens: 2048,

        messages: [
            {
                role: "user",
                content: `
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
            }
        ]
    });

    return JSON.parse(response.content[0].text);
};