
'use strict';

let correctAnswerCounter = 0;
let incorrectAnswerCounter = 0;
let questionsArray = []; // questions to be used globally

function savePreferencesAndResults() {
    const preferences = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        difficulty: document.getElementById('difficulty').value,
        numQuestions: document.getElementById('numQuestions').value,
    };

    const results = {
        correctAnswers: correctAnswerCounter,
        incorrectAnswers: incorrectAnswerCounter,
    };

    localStorage.setItem('quizPreferences', JSON.stringify(preferences));
    localStorage.setItem('quizResults', JSON.stringify(results));
}
// 
function loadPreferencesAndResults() {
    const preferences = localStorage.getItem('quizPreferences');
    const results = localStorage.getItem('quizResults');

    if (preferences) {
        const { name, category, difficulty, numQuestions } = JSON.parse(preferences);
        document.getElementById('name').value = name;
        document.getElementById('category').value = category;
        document.getElementById('difficulty').value = difficulty;
        document.getElementById('numQuestions').value = numQuestions;
    }

    if (results) {
        const { correctAnswers, incorrectAnswers } = JSON.parse(results);
        correctAnswerCounter = correctAnswers;
        incorrectAnswerCounter = incorrectAnswers;
    }
}
// 
function startQuiz() {
    const userForm = document.getElementById('userForm');
    userForm.classList.add('hidden');

    const quizSection = document.getElementById('quizSection');
    quizSection.innerHTML = '';

    const catSection = document.querySelector('.catSection');
    catSection.classList.add('hidden');

    let numberQuestions = document.getElementById('numQuestions').value;
    let difficulty = document.getElementById('difficulty').value;
    let category = document.getElementById('category').value;

    fetch(`https://opentdb.com/api.php?amount=${numberQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            questionsArray = data.results;
            displayQuestions(questionsArray);
        })
        .catch(error => console.error('Error fetching trivia questions:', error));
}

// 
function submitForm(event, questionIndex, correctAnswer) {
    event.preventDefault();
    const selectedOption = document.querySelector(`input[name="q${questionIndex}"]:checked`);

    if (selectedOption) {
        const userAnswer = selectedOption.value;
        localStorage.setItem(`userAnswer_q${questionIndex}`, userAnswer);
        console.log(`Question ${questionIndex} - User's Answer: ${userAnswer}, Correct Answer: ${correctAnswer}`);

        if (correctAnswer === userAnswer) {
            correctAnswerCounter++;
        } else {
            incorrectAnswerCounter++;
        }
    } else {
        alert('Please select an answer.');
    }
}
// 

function displayResults() {
    const resultsAnswers = document.getElementById('resultsAnswers');
    resultsAnswers.innerHTML = '';

    questionsArray.forEach((question, index) => {
        const userAnswer = localStorage.getItem(`userAnswer_q${index + 1}`);
        const isCorrect = userAnswer === question.correct_answer;

        const resultText = document.createElement('div');
        resultText.classList.add('results');
        resultText.innerHTML = `
            <h2>Question ${index + 1}</h2>
            <p>${question.question}</p>
            <p>User's Answer: ${userAnswer}</p>
            <p>Correct Answer: ${question.correct_answer}</p>
            <p>Status: ${isCorrect ? 'Correct' : 'Incorrect'}</p>
        `;
        resultsAnswers.appendChild(resultText);
    });

    const overallResultText = document.createElement('div');
    overallResultText.classList.add('card');
    overallResultText.textContent = `Overall Results: correct answers: ${correctAnswerCounter} and incorrect answers: ${incorrectAnswerCounter}`;
    resultsAnswers.appendChild(overallResultText);

}

// Cat pictures
function fetchRandomCatPicture() {
    const url = 'https://api.thecatapi.com/v1/images/search';
  
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const catImage = document.getElementById('catImage');
            catImage.src = data[0].url;
        })
        .catch(error => {
            console.error('Error fetching cat picture:', error);
        });
  }

// 
function startNewQuiz() {
    const userForm = document.getElementById('userForm');
    const quizSection = document.getElementById('quizSection');
    const catSection = document.querySelector('.catSection');
    catSection.classList.remove('hidden');

    userForm.classList.add('hidden');
    quizSection.innerHTML = '';
    correctAnswerCounter = 0;
    incorrectAnswerCounter = 0;
}

// 
function displayQuestions(questions) {
    const quizSection = document.getElementById('quizSection');
    quizSection.innerHTML = '';

    questions.forEach((question, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const questionContainer = document.createElement('div');
        questionContainer.classList.add('quiz-question');

        const options = shuffle([...question.incorrect_answers, question.correct_answer]);

        const optionsHTML = options.map(option => `
            <label>
                <input type="radio" name="q${index + 1}" value="${option}">
                ${option}
            </label>
        `).join('');

        questionContainer.innerHTML = `
            <h2>Question ${index + 1}</h2>
            <p>${question.question}</p>
            <div class="options">
                ${optionsHTML}
            </div>
            <a href="#" class="button" onclick="submitForm(event, ${index + 1}, '${question.correct_answer}')">Submit</a>
        `;

        card.appendChild(questionContainer);
        quizSection.appendChild(card);
    });

    const startNewQuizButton = document.createElement('a');
    startNewQuizButton.classList.add('button');
    startNewQuizButton.textContent = 'Start New Quiz';
    startNewQuizButton.addEventListener('click', startNewQuiz);
    quizSection.appendChild(startNewQuizButton);

    
}

//specially to mix the answers 
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}


// Second Api - API Key = 'MTc3MTc4Mw';
function fetchRandomCat() {
    const url = 'https://api.thecatapi.com/v1/images/search';
   
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Extract the cat picture URL from the response
            const catPictureUrl = data[0].url;
            const image = document.getElementById('image');// Display the picture
            image.src = catPictureUrl;
        })
        .catch(error => {
            console.error('Error fetching cat picture:', error);
        });
}

