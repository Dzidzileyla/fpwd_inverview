const express = require("express");
const router = express.Router();
const { isEmpty } = require("../util/util");

router.get("/questions", async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions();
  res.json(questions);
});

router.post("/questions", async (req, res) => {
  const { body } = req;

  if (isEmpty(body)) {
    res.status(400).json({ message: "Question is required" });
  } else {
    const question = await req.repositories.questionRepo.addQuestion(body);
    res.status(201).json(question);
  }
});

router.get("/questions/:questionId", async (req, res) => {
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

router.get("/questions/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  const answers = await req.repositories.questionRepo.getAnswers(questionId);

  if (answers.length === 0) {
    res.status(404).json({ message: "Question not found" });
  } else {
    res.json(answers);
  }
});

router.post("/questions/:questionId/answers", async (req, res) => {
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

router.get("/questions/:questionId/answers/:answerId", async (req, res) => {
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

module.exports = router;
