"use client";

import React, { useState } from "react";

export default function TextToVideoMVP() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateP5Code = async (prompt: string) => {
    try {
      setLoading(true);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer `,
          "HTTP-Referer": "http://localhost:3000", // Or your deployed site
          "X-Title": "TextToVideoMVP",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            {
              role: "user",
              content: `Generate p5.js code that matches this description: "${prompt}". Only return valid JavaScript code inside a single <script>.`,
            },
          ],
        }),
      });

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;

      if (reply) {
        // Optionally remove code block markdown (```) if present
        const cleanedCode = reply.replace(/```(javascript)?/g, "").replace(/```/g, "").trim();
        setGeneratedCode(cleanedCode);
      } else {
        alert("Failed to generate code.");
      }
    } catch (err) {
      console.error("Error generating code:", err);
      alert("An error occurred while generating the code.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    generateP5Code(prompt);
  };

  const getIframeSrcDoc = (code: string) => `
    <html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>
      </head>
      <body style="margin:0">
        <script>${code}</script>
      </body>
    </html>
  `;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Text to 2D Video MVP</h1>

      <textarea
        placeholder='Enter a prompt like "Show bouncing ball"'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mb-4 w-full border p-2 rounded"
        rows={4}
      />

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Animation"}
      </button>

      {generatedCode && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <iframe
            width="8000"
            height="800"
            srcDoc={getIframeSrcDoc(generatedCode)}
            sandbox="allow-scripts"
            className="border rounded"
          ></iframe>
        </div>
      )}
    </div>
  );
}