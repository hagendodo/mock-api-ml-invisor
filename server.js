const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const randomDelay = (req, res, next) => {
  const delay = Math.floor(Math.random() * (60 - 10 + 1) + 10) * 1000; // Random delay between 10 and 60 seconds
  setTimeout(next, delay);
};

app.use(randomDelay);

const generateQuestions = (jobTitle, jobDescription) => {
  return [
    `Describe a complex data conversion project you have worked on. How did you ensure the integrity of the data throughout the process?`,
    `How do you approach the architectural design of a new system, and what tools or methodologies might you employ?`,
    `Can you provide an example of how you have improved a process in a previous role, and what key performance indicators (KPIs) you defined for success?`,
    `How do you stay up to date with information security practices and ensure your work adheres to these standards?`,
    `Tell me about a time when you had to liaise between end users and business units to resolve a critical issue. How did you handle the communication and what was the outcome?`,
  ];
};

const generateFeedback = (answer) => {
  return `Your response demonstrates a strong understanding of the subject. Further elaboration on specific methodologies or examples would provide a more comprehensive view of your expertise.`;
};

const generateScore = () => {
  return Math.floor(Math.random() * 40) + 60;
};

app.post("/api/generate-question", (req, res) => {
  const { job_title, job_description } = req.body;

  if (!job_title || !job_description) {
    return res.status(400).json({
      error: true,
      message: "Job title and job description are required.",
    });
  }

  const questions = generateQuestions(job_title, job_description);

  res.json({
    data: {
      job_title,
      job_description,
      questions: questions.map((q) => ({ question: q })),
    },
    error: false,
    message: "Success",
  });
});

app.post("/api/user-answer", (req, res) => {
  const { interviews } = req.body;

  if (!interviews || !Array.isArray(interviews)) {
    return res.status(400).json({
      error: true,
      message: "Interviews array is required.",
    });
  }

  const feedbacks = interviews.map((interview) => ({
    question: interview.question,
    answer: interview.answer,
    feedback: generateFeedback(interview.answer),
    score: generateScore().toString(),
  }));

  res.json({
    data: {
      job_title: req.body.job_title,
      job_description: req.body.job_description,
      feedbacks: feedbacks,
    },
    error: false,
    message: "Success",
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
