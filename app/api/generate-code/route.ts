// app/api/generate-code/route.ts

export async function POST(req: Request) {
    const { prompt } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            // "HTTP-Referer": "https://yourdomain.com", // Optional
            "X-Title": "P5js Code Generator",        // Optional
        },
        body: JSON.stringify({
            model: "deepseek/deepseek-r1-0528:free",
            messages: [
                {
                    role: "user",
                    content: `Write a p5.js sketch for the following idea:\n${prompt}`,
                },
            ],
        }),
    });

    const data = await response.json();
    console.log("data", data);

    const code = data?.choices?.[0]?.message?.content || "/* No code returned */";

    return new Response(JSON.stringify({ code }), {
        headers: { "Content-Type": "application/json" },
    });
}