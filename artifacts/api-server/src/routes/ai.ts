import { Router, type IRouter } from "express";

const router: IRouter = Router();

const sampleAnswers: Record<string, string> = {
  default_Hindi: "यह एक बहुत अच्छा प्रश्न है! इस विषय को समझने के लिए, हमें पहले बुनियादी अवधारणाओं को जानना होगा। विद्याशाला पर आपको इस विषय से संबंधित कई उत्कृष्ट वीडियो और क्विज़ मिलेंगे जो आपकी समझ को गहरा करेंगे।",
  default_English: "That's a great question! To understand this topic well, we need to first grasp the fundamental concepts. On VidyaShala, you'll find excellent videos and quizzes on this subject that will deepen your understanding significantly.",
  explain_Hindi: "सरल शब्दों में: यह विषय बहुत महत्वपूर्ण है और इसे समझने के लिए हम इसे छोटे-छोटे हिस्सों में बाँट सकते हैं। पहला कदम है बुनियादी बातें सीखना, फिर धीरे-धीरे आगे बढ़ना।",
  explain_English: "Simply put: this topic is very important and we can break it down into smaller parts. The first step is learning the basics, then gradually progressing forward.",
};

router.post("/ai/ask", async (req, res): Promise<void> => {
  const { question, language, context, mode } = req.body;

  const key = mode === "explain" ? `explain_${language}` : `default_${language}`;
  const answer = sampleAnswers[key] || sampleAnswers["default_English"];

  const suggestions = [
    "Can you give me an example?",
    "What are the key concepts?",
    "How can I practice this?",
    "Generate a quiz on this topic",
  ];

  const relatedTopics = [
    "Fundamentals",
    "Advanced applications",
    "Industry use cases",
    "Practice exercises",
  ];

  await new Promise((r) => setTimeout(r, 800));

  res.json({
    answer,
    language: language || "English",
    suggestions,
    relatedTopics,
    mode: mode || "explain",
  });
});

router.post("/ai/generate-quiz", async (req, res): Promise<void> => {
  const { topic, sector, difficulty, questionCount, language } = req.body;

  const questions = Array.from({ length: Math.min(questionCount || 5, 10) }, (_, i) => ({
    id: i + 1,
    question: `Question ${i + 1}: What is the key concept related to ${topic}?`,
    options: [
      `Option A: The primary principle of ${topic}`,
      `Option B: A secondary aspect of ${topic}`,
      `Option C: An unrelated concept`,
      `Option D: A common misconception about ${topic}`,
    ],
    correctIndex: 0,
    explanation: `The correct answer demonstrates understanding of ${topic}'s core principle.`,
    topic,
  }));

  res.json({ topic, questions });
});

router.post("/ai/flashcards", async (req, res): Promise<void> => {
  const { topic, language, count } = req.body;

  const flashcards = Array.from({ length: Math.min(count || 5, 10) }, (_, i) => ({
    front: `What is concept ${i + 1} in ${topic}?`,
    back: `Concept ${i + 1} in ${topic} refers to the fundamental principle that helps in understanding the subject more deeply.`,
    topic,
  }));

  res.json(flashcards);
});

router.post("/ai/study-plan", async (req, res): Promise<void> => {
  const { goal, sector, hoursPerDay, durationWeeks, language } = req.body;

  const weeks = Array.from({ length: durationWeeks || 4 }, (_, i) => ({
    week: i + 1,
    theme: i === 0 ? "Foundations" : i === 1 ? "Core Concepts" : i === 2 ? "Practical Skills" : "Mastery",
    topics: [
      `${sector} basics - Week ${i + 1}`,
      `Practice exercises`,
      `Quiz review`,
    ],
    hoursRequired: hoursPerDay * 7,
  }));

  const milestones = [
    "Complete foundation modules",
    "Score 80%+ on beginner quiz",
    "Finish first project",
    "Earn sector certificate",
  ];

  res.json({
    goal,
    weeks,
    totalHours: (hoursPerDay || 1) * 7 * (durationWeeks || 4),
    milestones,
  });
});

export default router;
