const express = require("express");
const { urlencoded, json } = require("body-parser");
const makeRepositories = require("./middleware/repositories");

const STORAGE_FILE_PATH = "questions.json";
const PORT = 3000;

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(makeRepositories(STORAGE_FILE_PATH));

app.get("/", (_, res) => {
  res.json({ message: "Welcome to responder!" });
});

app.get("/questions", async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions();
  res.json(questions);
});

app.get("/questions/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const question = await req.repositories.questionRepo.getQuestionById(
    questionId
  );

  if (!question) {
    res.status(404).json({ message: "Question not found" });
  } else {
    res.status(200).json(question);
  }
});

app.post("/questions", async (req, res) => {
  const { body } = req;

  if (Object.keys(body).length === 0) {
    res.status(400).json({ message: "Question is required" });
  } else {
    const question = await req.repositories.questionRepo.addQuestion(body);
    res.status(201).json(question);
  }
});

app.get("/questions/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  const answers = await req.repositories.questionRepo.getAnswers(questionId);

  if (answers.length === 0) {
    res.status(404).json({ message: "Question not found" });
  } else {
    res.json(answers);
  }
});

app.post("/questions/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  const { body } = req;

  const answer = await req.repositories.questionRepo.addAnswer(
    questionId,
    body
  );

  if (!answer) {
    res.status(400).json({ message: "Question not found" });
  } else {
    res.status(201).json(answer);
  }
});

app.get("/questions/:questionId/answers/:answerId", async (req, res) => {
  const { questionId, answerId } = req.params;
  const answer = await req.repositories.questionRepo.getAnswer(
    questionId,
    answerId
  );

  if (!answer) {
    res.status(404).json({ message: "Answer not found" });
  } else {
    res.status(200).json(answer);
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Responder app listening on port ${PORT}`);
  });
}

module.exports = app;
