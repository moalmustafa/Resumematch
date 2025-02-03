export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { jobPost, resume } = req.body;
    const apiKey = process.env.OPENAI_API_KEY; // Fetch API key from environment variables

    if (!jobPost || !resume) {
        return res.status(400).json({ error: "Missing job post or resume" });
    }

    const prompt = `
        Given the following job description:
        "${jobPost}"

        And this resume:
        "${resume}"

        Please rewrite the resume to better match the job description while keeping the candidate's original experience and skills.
    `;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        return res.status(200).json({ matchingResume: data.choices[0].message.content });

    } catch (error) {
        return res.status(500).json({ error: "Error processing request", details: error.message });
    }
}