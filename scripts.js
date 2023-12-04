"use strict";
let correctAnswerCounter = 0;
let incorrectAnswerCounter = 0;
let questionsArray = []; // questions to be used globally


function loadPreferencesAndResults() {
  const preferences = localStorage.getItem("quizPreferences");
  const results = localStorage.getItem("quizResults");

  if (preferences) {
    const { name, category, difficulty, numQuestions } =
      JSON.parse(preferences);
    document.getElementById("name").value = name;
    document.getElementById("category").value = category;
    document.getElementById("difficulty").value = difficulty;
    document.getElementById("numQuestions").value = numQuestions;
  }

  if (results) {
    const { correctAnswers, incorrectAnswers } = JSON.parse(results);
    correctAnswerCounter = correctAnswers;
    incorrectAnswerCounter = incorrectAnswers;
  }
}

// SAVE TO BROWSER LOCAL STORAGE
function savePreferencesAndResults() {
  const preferences = {
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    difficulty: document.getElementById("difficulty").value,
    numQuestions: document.getElementById("numQuestions").value,
  };

  const results = {
    correctAnswers: correctAnswerCounter,
    incorrectAnswers: incorrectAnswerCounter,
  };

  localStorage.setItem("quizPreferences", JSON.stringify(preferences));
  localStorage.setItem("quizResults", JSON.stringify(results));
}


function startQuiz() {
  const userForm = document.getElementById("userForm");
  userForm.style.display = "none";

  const quizSection = document.getElementById("quizSection");
  quizSection.innerHTML = "";

  const catSection = document.querySelector(".catSection");
  catSection.classList.add("hidden");

  let numberQuestions = document.getElementById("numQuestions").value;
  let difficulty = document.getElementById("difficulty").value;
  let category = document.getElementById("category").value;

  fetch(
    `https://opentdb.com/api.php?amount=${numberQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`
  )
    .then((response) => response.json())
    .then((data) => {
      questionsArray = data.results;
      displayQuestions(questionsArray);
    })
    .catch((error) => console.error("Error fetching trivia questions:", error));
}

// USER PREFERENCES FORM
function submitForm(event, questionIndex, correctAnswer) {
  event.preventDefault();
  const selectedOption = document.querySelector(
    `input[name="q${questionIndex}"]:checked`
  );

  if (selectedOption) {
    const userAnswer = selectedOption.value;
    localStorage.setItem(`userAnswer_q${questionIndex}`, userAnswer);
    console.log(
      `Question ${questionIndex} - User's Answer: ${userAnswer}, Correct Answer: ${correctAnswer}`
    );

    if (correctAnswer === userAnswer) {
      correctAnswerCounter++;
    } else {
      incorrectAnswerCounter++;
    }
  } else {
    alert("Please select an answer.");
  }
}

// RANDOM CAT PICTURE
function fetchRandomCatPicture() {
  const url = "https://api.thecatapi.com/v1/images/search";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const catImage = document.getElementById("catImage");
      catImage.src = data[0].url;
    })
    .catch((error) => {
      console.error("Error fetching cat picture:", error);
    });
}

// GENERATE QUESTION BASED ON USER CHOICE
function displayQuestions(questions) {
  const quizSection = document.getElementById("quizSection");
  quizSection.innerHTML = "";

  questions.forEach((question, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const questionContainer = document.createElement("div");
    questionContainer.classList.add("quiz-question");

    const options = shuffle([
      ...question.incorrect_answers,
      question.correct_answer,
    ]);

    const optionsHTML = options
      .map(
        (option) => `
            <label>
                <input type="radio" name="q${index + 1}" value="${option}">
                ${option}
            </label>
        `
      )
      .join("");

    questionContainer.innerHTML = `
            <h2>Question ${index + 1}</h2>
            <p>${question.question}</p>
            <div class="options">
                ${optionsHTML}
            </div>
            <a href="#" class="button quiz-question-button" onclick="submitForm(event, ${
              index + 1
            }, '${question.correct_answer}')">Submit</a>
        `;

    card.appendChild(questionContainer);
    quizSection.appendChild(card);
  });

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("flex-container", "button-container");

  const startNewQuizButton = document.createElement("a");
  startNewQuizButton.classList.add("button");
  startNewQuizButton.textContent = "Start New Quiz";
  startNewQuizButton.addEventListener("click", startNewQuiz);
  buttonContainer.appendChild(startNewQuizButton);

  const displayResultsButton = document.createElement("a");
  displayResultsButton.id = "resultsButton";
  displayResultsButton.classList.add("button");
  displayResultsButton.textContent = "Display Results";
  displayResultsButton.addEventListener("click", displayResults);
  buttonContainer.appendChild(displayResultsButton);

  quizSection.appendChild(buttonContainer);
}


function startNewQuiz() {
  const userForm = document.getElementById("userForm");
  const quizSection = document.getElementById("quizSection");
  const catSection = document.querySelector(".catSection");
  const resultsAnswers = document.getElementById('resultsSection');

  // SHOW USER FORM - NOT WORKING BY ADDING CLASS
  userForm.style.display = "flex";

  // HIDE SECTIONS
  quizSection.innerHTML = '';
  catSection.classList.remove('hidden');
  resultsAnswers.innerHTML = ''; 

  correctAnswerCounter = 0;
  incorrectAnswerCounter = 0;
}


// REARRANGE SEQUENCE OF CORRECT ANSWERS 
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}


function displayResults() {
    const resultsAnswers = document.getElementById('resultsSection');
    resultsAnswers.innerHTML = '';

    // Create a card for all answers
    const answersCard = document.createElement('div');
    answersCard.classList.add('answer-card');

    questionsArray.forEach((question, index) => {
        const userAnswer = localStorage.getItem(`userAnswer_q${index + 1}`);
        const isCorrect = userAnswer === question.correct_answer;

        const resultText = document.createElement('div');
        resultText.innerHTML = `
            <h2>Question ${index + 1}</h2>
            <p>${question.question}</p>
            <p>User's Answer: ${userAnswer}</p>
            <p>Correct Answer: ${question.correct_answer}</p>
            <p>Status: ${isCorrect ? 'Correct' : 'Incorrect'}</p>
            <br>
        `;
        answersCard.appendChild(resultText);
    });

    // Display Overall result
    const overallResultCard = document.createElement('div');
    overallResultCard.textContent = `Overall Results: correct answers: ${correctAnswerCounter} and incorrect answers: ${incorrectAnswerCounter}`;

    resultsAnswers.appendChild(answersCard);
    resultsAnswers.appendChild(overallResultCard);

    // Create a download button
    const downloadContainer = document.createElement('div');
    downloadContainer.classList.add('flex-container');
    
    // Create a download button
    const downloadButton = document.createElement('a');
    downloadButton.classList.add('button');
    downloadButton.textContent = 'Download Quiz Data';
    downloadButton.addEventListener('click', downloadUserData);
    
    
    downloadContainer.appendChild(downloadButton);
    resultsAnswers.appendChild(downloadContainer);
}

function downloadUserData() {
    // Create a data object with user preferences and quiz results
    const userData = {
        preferences: {
            name: document.getElementById('name').value,
            category: document.getElementById('category').value,
            difficulty: document.getElementById('difficulty').value,
            numQuestions: document.getElementById('numQuestions').value,
        },
        results: {
            correctAnswers: correctAnswerCounter,
            incorrectAnswers: incorrectAnswerCounter,
            questions: questionsArray.map((question, index) => {
                const userAnswer = localStorage.getItem(`userAnswer_q${index + 1}`);
                const isCorrect = userAnswer === question.correct_answer;
                return {
                    questionNumber: index + 1,
                    questionText: question.question,
                    userAnswer: userAnswer,
                    correctAnswer: question.correct_answer,
                    status: isCorrect ? 'Correct' : 'Incorrect',
                };
            }),
        },
    };

    // Convert the data to a JSON string
    const jsonData = JSON.stringify(userData);

    // Create a Blob containing the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Create a zip file containing the JSON file
    const zip = new JSZip();
    zip.file('quiz_data.json', blob);

    // Generate the zip file
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        // Create a download link for the zip file
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'quiz_data.zip';

        // Append the link to the document
        document.body.appendChild(link);
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
    });
}

