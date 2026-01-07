import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let memory = {};

app.post("/chat", async (req, res) => {
  const { message, user } = req.body;

  if (!message) return res.json({ reply: "Empty message." });

  memory[user] = memory[user] || [];
  memory[user].push({ role: "user", content: message });

  const ai = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_OPENAI_API_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Spacechat, a smart friendly AI for a social network." },
        ...memory[user]
      ]
    })
  });

  const data = await ai.json();
  const reply = data.choices[0].message.content;

  memory[user].push({ role: "assistant", content: reply });
  res.json({ reply });
});

app.listen(3000, () => console.log("AI running"));
