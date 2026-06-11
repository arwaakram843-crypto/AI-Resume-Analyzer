import express from "express";
import cors from "cors";
import OpenAI from "openai";
import multer from "multer";
import mammoth from "mammoth";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import * as pdfParse from "pdf-parse";  

dotenv.config();

// ---------------- SETUP ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });
let storedResumeText = "";

// ---------------- OPENROUTER CLIENT ----------------
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// ---------------- FRONTEND PATH ----------------
const frontendPath = path.join(__dirname, "..", "AI RESUME FRONTEND");
app.use(express.static(frontendPath));

// ---------------- ROUTES ----------------
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "Index.html"));
});
   //-----------------file text extraction-----------------   
//import pdfParse from "pdf-parse"; // keep this same

async function extractTextFromFile(buffer, mimetype, filename) {
  try {

    if (mimetype === "application/pdf") {
      const data = await pdfParse(buffer);
      return data.text || "";
    }

    if (mimetype.includes("word")) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }

    return buffer.toString("utf8");

  } catch (err) {
    console.error("PDF ERROR:", err);
    return "";
  }
}

// ---------------- UPLOAD ROUTE ----------------
app.post("/upload", upload.single("resumeFile"), async (req, res) => {
  try {
    let resumeText = req.body.resumeText?.trim() || "";

    if (req.file?.buffer) {
      const extractedText = await extractTextFromFile(
        req.file.buffer,
        req.file.mimetype,   
        req.file.originalname
      );

      if (extractedText) {
        resumeText = extractedText;
      }
    }

    if (!resumeText) {
      return res.status(400).json({
        error: "No resume text found.",
      });
    }

    storedResumeText = resumeText;
    console.log("FINAL RESUME TEXT:", resumeText);

    console.log("===== STORED RESUME =====");
console.log(storedResumeText);
console.log("=========================");

res.json({
  success: true,
  message: "Resume uploaded successfully"
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});
// ---------------- AI ANALYSIS ROUTE ----------------
// ---------------- AI ANALYSIS ROUTE ----------------

app.post("/analyze", async (req, res) => {
   console.log("ANALYZE ROUTE HIT");
  try {

    const jobDesc = req.body.jobDesc;   

    if (!storedResumeText) {
      return res.status(400).json({
        error: "Please upload resume first"
      });
    }

    console.log("Resume:", storedResumeText);
    console.log("Job Description:", jobDesc);

    // TEMP RESPONSE
    const completion = await client.chat.completions.create({
  model: "openai/gpt-4o-mini",

  messages: [
    {
      role: "user",
      content: `
Resume:
${storedResumeText}

Job Description:
${jobDesc}

Compare the resume with the job description.

Return ONLY valid JSON in this exact format:

{
  "overallMatch": 85,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "recommendations": ["recommendation1", "recommendation2"]
}
`
   }
  ]
});

const aiText = completion.choices[0].message.content;

console.log("AI Response:", aiText);

//const result = JSON.parse(aiText);
const cleanText = aiText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const result = JSON.parse(cleanText);

res.json(result);

 } catch (error) {

  console.error("FULL ERROR:");
  console.error(error);

  res.status(500).json({
    error: error.message
  });
  }


})
// ---------------- START SERVER ----------------
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:5000`);
});
