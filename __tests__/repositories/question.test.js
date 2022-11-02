const { writeFile, rm } = require("fs/promises");
const { faker } = require("@faker-js/faker");
const { makeQuestionRepository } = require("../../repositories/question");

describe("question repository", () => {
  const TEST_QUESTIONS_FILE_PATH = "test-questions.json";
  let questionRepo;

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]));

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH);
  });

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH);
  });

  test("should return a list of 0 questions", async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0);
  });

  test("should return a list of 2 questions", async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: "What is my name?",
        author: "Jack London",
        answers: [],
      },
      {
        id: faker.datatype.uuid(),
        summary: "Who are you?",
        author: "Tim Doods",
        answers: [],
      },
    ];

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

    expect(await questionRepo.getQuestions()).toHaveLength(2);
  });

  test("Should return a question for specific id", async () => {
    const questionId = faker.datatype.uuid();

    const testQuestions = [
      {
        id: questionId,
        summary: "What is my name?",
        author: "Jack London",
        answers: [],
      },
      {
        id: faker.datatype.uuid(),
        summary: "Who are you?",
        author: "Tim Doods",
        answers: [],
      },
    ];

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

    const question = await questionRepo.getQuestionById(questionId);

    expect(question.id).toBe(questionId);
    expect(question.summary).toBe("What is my name?");
    expect(question.author).toBe("Jack London");
    expect(question.answers).toHaveLength(0);
  });

  test("Should return a nothing while searching question does not exist in database", async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: "What is my name?",
        author: "Jack London",
        answers: [],
      },
      {
        id: faker.datatype.uuid(),
        summary: "Who are you?",
        author: "Tim Doods",
        answers: [],
      },
    ];

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

    const questionId = faker.datatype.uuid();
    expect(await questionRepo.getQuestionById(questionId)).toBeUndefined();
  });

  test("Should add new question to database", async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: "What is my name?",
        author: "Jack London",
        answers: [],
      },
      {
        id: faker.datatype.uuid(),
        summary: "Who are you?",
        author: "Tim Doods",
        answers: [],
      },
    ];

    const newQuestion = {
      id: faker.datatype.uuid(),
      summary: "Am I speaking with?",
      author: "Mateusz Kopko",
      answers: [],
    };

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

    await questionRepo.addQuestion(newQuestion);

    const questions = await questionRepo.getQuestions();
    expect(questions).toHaveLength(3);
  });

  test("Should return answers for specific question", async () => {
    const questionId = faker.datatype.uuid();
    const answerId = faker.datatype.uuid();

    const testQuestions = [
      {
        id: questionId,
        summary: "What is my name?",
        author: "Jack London",
        answers: [
          {
            id: answerId,
            author: "Mateusz Kopko",
            summary: "Aluminum Foil hat rocks!",
          },
        ],
      },
      {
        id: faker.datatype.uuid(),
        summary: "Who are you?",
        author: "Tim Doods",
        answers: [],
      },
    ];

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

    const answers = await questionRepo.getAnswers(questionId);
    expect(answers).toHaveLength(1);

    const answer = answers[0];
    expect(answer.id).toBe(answerId);
    expect(answer.author).toBe("Mateusz Kopko");
    expect(answer.summary).toBe("Aluminum Foil hat rocks!");
  });

  test("Should return an empty array of answers for non existing question", async () => {
    const questionId = faker.datatype.uuid();

    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: "What is my name?",
        author: "Jack London",
        answers: [
          {
            id: faker.datatype.uuid(),
            author: "Mateusz Kopko",
            summary: "Aluminum Foil hat rocks!",
          },
        ],
      },
      {
        id: faker.datatype.uuid(),
        summary: "Who are you?",
        author: "Tim Doods",
        answers: [],
      },
    ];

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

    const answers = await questionRepo.getAnswers(questionId);
    expect(answers).toHaveLength(0);
  });

  test("Should return answer while searching by question id and answer id", async () => {
    const questionId = faker.datatype.uuid();
    const answerId = faker.datatype.uuid();

    const testQuestions = [
      {
        id: questionId,
        summary: "What is my name?",
        author: "Jack London",
        answers: [
          {
            id: answerId,
            author: "Mateusz Kopko",
            summary: "Aluminum Foil hat rocks!",
          },
        ],
      },
      {
        id: faker.datatype.uuid(),
        summary: "Who are you?",
        author: "Tim Doods",
        answers: [],
      },
    ];

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

    const answer = await questionRepo.getAnswer(questionId, answerId);
    expect(answer.id).toBe(answerId);
    expect(answer.author).toBe("Mateusz Kopko");
    expect(answer.summary).toBe("Aluminum Foil hat rocks!");
  });

  test("Should return nothing while searching by non exiting question and with existing answer", async () => {
    const questionId = faker.datatype.uuid();
    const answerId = faker.datatype.uuid();

    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: "What is my name?",
        author: "Jack London",
        answers: [
          {
            id: answerId,
            author: "Mateusz Kopko",
            summary: "Aluminum Foil hat rocks!",
          },
        ],
      },
      {
        id: faker.datatype.uuid(),
        summary: "Who are you?",
        author: "Tim Doods",
        answers: [],
      },
    ];

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

    const answer = await questionRepo.getAnswer(questionId, answerId);
    expect(answer).toBeUndefined();
  });

  test("Should return nothing while searching by exiting question and with non existing answer", async () => {
    const questionId = faker.datatype.uuid();
    const answerId = faker.datatype.uuid();

    const testQuestions = [
      {
        id: questionId,
        summary: "What is my name?",
        author: "Jack London",
        answers: [
          {
            id: faker.datatype.uuid(),
            author: "Mateusz Kopko",
            summary: "Aluminum Foil hat rocks!",
          },
        ],
      },
      {
        id: faker.datatype.uuid(),
        summary: "Who are you?",
        author: "Tim Doods",
        answers: [],
      },
    ];

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

    const answer = await questionRepo.getAnswer(questionId, answerId);
    expect(answer).toBeUndefined();
  });

  test("Should add answer to question", async () => {
    const questionId = faker.datatype.uuid();

    const testQuestions = [
      {
        id: questionId,
        summary: "What is my name?",
        author: "Jack London",
        answers: [
          {
            id: faker.datatype.uuid(),
            author: "Mateusz Kopko",
            summary: "Aluminum Foil hat rocks!",
          },
        ],
      },
      {
        id: faker.datatype.uuid(),
        summary: "Who are you?",
        author: "Tim Doods",
        answers: [],
      },
    ];

    const newAnswer = {
      id: faker.datatype.uuid(),
      author: "Alex Jones",
      summary: "Reptilians are real!",
    };

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions));

    await questionRepo.addAnswer(questionId, newAnswer);

    const answers = await questionRepo.getAnswers(questionId);
    expect(answers).toHaveLength(2);
  });
});
