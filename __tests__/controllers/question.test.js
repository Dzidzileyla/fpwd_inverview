const request = require("supertest");
const app = require("../../index");
const { faker } = require("@faker-js/faker");

describe("question controller", () => {
  test("GET /questions - Should return questions", async () => {
    const response = await request(app).get("/questions");
    expect(response.statusCode).toBe(200);
  });

  test("/questions/:questionId - Should return question", async () => {
    const questionId = "50f9e662-fa0e-4ec7-b53b-7845e8f821c3";
    const response = await request(app).get(`/questions/${questionId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", questionId);
  });

  test("/questions/:questionId - Should not return question when providing non existing question id", async () => {
    const questionId = "50f9e662-fa0e-4ec7-b53b-7845e8f821c4";
    const response = await request(app).get(`/questions/${questionId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("message", "Question not found");
  });

  test("POST /questions - Should create new question", async () => {
    const sampleQuestion = {
      id: faker.datatype.uuid(),
      author: faker.name.fullName(),
      summary: faker.random.words(10),
      answers: [],
    };

    const response = await request(app).post("/questions").send(sampleQuestion);
    expect(response.statusCode).toBe(201);
  });

  test("GET /questions/:questionId/answers - Should return answers for specific question", async () => {
    const questionId = "50f9e662-fa0e-4ec7-b53b-7845e8f821c3";

    const response = await request(app).get(`/questions/${questionId}/answers`);
    expect(response.statusCode).toBe(200);
  });

  test("GET /questions/:questionId/answers - Should not return answers for not existing question", async () => {
    const questionId = faker.datatype.uuid();

    const response = await request(app).get(`/questions/${questionId}/answers`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("message", "Question not found");
  });

  test("POST /questions/:questionId/answers - Should create answer for specific question", async () => {
    const questionId = "50f9e662-fa0e-4ec7-b53b-7845e8f821c3";

    const answer = {
      id: faker.datatype.uuid(),
      author: faker.name.fullName(),
      summary: faker.random.words(10),
    };

    const response = await request(app)
      .post(`/questions/${questionId}/answers`)
      .send(answer);

    expect(response.statusCode).toBe(201);
  });

  test("POST /questions/:questionId/answers - Should not create answer for non existing question", async () => {
    const questionId = faker.datatype.uuid();

    const answer = {
      id: faker.datatype.uuid(),
      author: faker.name.fullName(),
      summary: faker.random.words(10),
    };

    const response = await request(app)
      .post(`/questions/${questionId}/answers`)
      .send(answer);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Question not found");
  });

  test("GET /questions/:questionId/answers/:answerId - Should returns answer for specific question id and answer id", async () => {
    const questionId = "50f9e662-fa0e-4ec7-b53b-7845e8f821c3";
    const answerId = "ce7bddfb-0544-4b14-92d8-188b03c41ee4";

    const response = await request(app).get(`/questions/${questionId}/answers/${answerId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", answerId);
  });
});
