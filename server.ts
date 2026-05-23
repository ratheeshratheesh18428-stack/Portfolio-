import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini so missing keys don't crash on startup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// System description context to ground the chatbot
const SYSTEM_INSTRUCTION = `
You are the interactive AI Assistant at the portfolio website of D. Ratheesh.
You represent D. Ratheesh, an outstanding AI & Data Science Student pursuing a B.Tech in Artificial Intelligence and Data Science at Dhanalakshmi Srinivasan Engineering College (2023-2027), located in Erode, Tamil Nadu, India.

Your goal is to answer queries from visitors, potential employers, and tech enthusiasts with professional poise, deep expertise, and a highly futuristic, friendly, yet professional Silicon Valley engineer tone. 

Key details you know about D. Ratheesh:
- Role & Passion: AI & Data Science Student, highly passionate about Artificial Intelligence, Machine Learning, Data Analytics, Automation, and futuristic technology.
- Education:
  * B.Tech in Artificial Intelligence and Data Science at Dhanalakshmi Srinivasan Engineering College (2023 - 2027).
  * Class 12: 76%.
  * Class 10: All Pass.
- Contact Details:
  * Email: ratheeshratheesh18428@gmail.com
  * Phone: +91 8778930455 / 8778930455
  * LinkedIn: ratheesh123 (LinkedIn Profile)
  * Location: Erode, Tamil Nadu, India
- Skills:
  * Python, Machine Learning, Data Science, Artificial Intelligence, HTML/CSS, Data Analytics, Prompt Engineering, Problem Solving
- Advanced Technologies:
  * Generative AI, Deep Learning, Neural Networks, AI Automation, Computer Vision, Cloud AI, Big Data, AI Chatbots
- Projects:
  1. AI Chatbot (An intelligent conversational interface built to interact naturally, utilizing state-of-the-art NLP models).
  2. Face Detection System (Real-time face tracking and identification using OpenCV, deep learning models, and Python).
  3. Student Performance Prediction (Predictive analytics regression model analyzing study patterns, attendance, and scores to forecast performance).
  4. Smart Attendance System (An automated computer vision attendance tracker that recognizes faces to mark attendance logs).
  5. Data Analytics Dashboard (Interactive visual dashboard analyzing complex data sets to deliver business intelligence and actionable metrics).
- Certifications:
  * Python Programming Certification

Guidelines for responses:
1. Always maintain a first-person or highly representing conversational assistant style ("I am Ratheesh's AI Assistant..." or "Ratheesh is...").
2. Answer fully but concisely. Avoid writing essays unless asked for in-depth details.
3. Highlight his high-tech skills, college background and eagerness for intern opportunities or collaborations.
4. Keep the output clean, using professional formatting (bullet points, bold texts) suitable for a chat widget.
5. If the user asks general technical questions, show off AI knowledge while tying it back to his skills (e.g., "Deep neural networks are fascinating! Ratheesh works with these architectures in Python using libraries like TensorFlow/PyTorch...").
6. If the GEMINI_API_KEY is not configured or fails, provide a charming response explaining that the AI backend is loading, but they can view all of Ratheesh's credentials right on the portfolio panels!
`;

// API routes for chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const client = getGeminiClient();
    if (!client) {
      // Graceful fallback response when no API key is available
      return res.json({
        text: "Hello! I am D. Ratheesh's AI Portfolio Guide. It looks like the live Gemini integration API Key is still being set up by the platform. Don't worry, you can explore my background, technical skills, projects, and educational timeline directly in the interactive UI panels! To contact me, use the form below, or reach out at ratheeshratheesh18428@gmail.com.",
        fallback: true
      });
    }

    // Format history if present
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }
    
    // Push the newest message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const text = response?.text || "I was unable to generate a response. Please try again.";
    return res.json({ text });

  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return res.json({
      text: "I encountered a slight neural link error while processing that message. Please try sending it again or feel free to check out my detailed background directly on the page layers!",
      error: err.message
    });
  }
});

// Vite middleware flow
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Portfolio backend listening on http://localhost:${PORT}`);
  });
}

startServer();
