const express = require("express");
const { urlencoded, json } = require("body-parser");
const makeRepositories = require("./middleware/repositories");

const homeRouter = require("./controller/index");
const questionRouter = require("./controller/question");

const STORAGE_FILE_PATH = "questions.json";
const PORT = 3000;

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(makeRepositories(STORAGE_FILE_PATH));

app.use(homeRouter);
app.use(questionRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Responder app listening on port ${PORT}`);
  });
}

module.exports = app;
