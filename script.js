const questionImage = document.getElementById('question-image');
const optionsContainer = document.querySelector('.options-container');
const optionButtons = document.querySelectorAll('.option-btn');
const feedbackMessage = document.getElementById('feedback-message');
const actionBtn = document.getElementById('action-btn');
const explanationDiv = document.getElementById('explanation');
const quizContainer = document.querySelector('.quiz-container');
const resultContainer = document.getElementById('result-container');
const correctCountSpan = document.getElementById('correct-count');
const totalQuestionsSpan = document.getElementById('total-questions');
const restartBtn = document.getElementById('restart-btn');
const questionNumberHeading = document.getElementById('question-number');

let quizData = [];
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let answeredThisQuestion = false; 

async function loadQuizData() {
    try {
        const response = await fetch('quizData.json');
        quizData = await response.json();
        totalQuestionsSpan.textContent = quizData.length;
        loadQuestion();
    } catch (error) {
        console.error('Ошибка загрузки данных викторины:', error);
        feedbackMessage.textContent = 'Произошла ошибка при загрузке викторины. Пожалуйста, попробуйте позже.';
        feedbackMessage.classList.remove('hidden');
    }
}

function loadQuestion() {
    if (currentQuestionIndex < quizData.length) {
        const currentQuestion = quizData[currentQuestionIndex];
        questionNumberHeading.textContent = `Вопрос ${currentQuestionIndex + 1}`;
        questionImage.src = currentQuestion.questionImage;

        optionButtons.forEach(button => {
            button.textContent = currentQuestion.options[button.dataset.option];
            button.classList.remove('correct', 'wrong', 'selected');
            button.disabled = false;
        });

        feedbackMessage.classList.add('hidden');
        actionBtn.classList.add('hidden');
        explanationDiv.classList.add('hidden');
        answeredThisQuestion = false;

    } else {
        showResults();
    }
}

function checkAnswer(selectedOption) {
    if (answeredThisQuestion) return; 

    answeredThisQuestion = true;
    const currentQuestion = quizData[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    optionButtons.forEach(button => {
        button.disabled = true; 
        if (button.dataset.option === selectedOption) {
            button.classList.add('selected');
        }
        if (button.dataset.option === currentQuestion.correctAnswer) {
            button.classList.add('correct'); 
        }
    });

    if (isCorrect) {
        correctAnswersCount++;
        feedbackMessage.textContent = 'Правильно!';
        feedbackMessage.style.color = 'green';
        actionBtn.textContent = 'Далее';
        actionBtn.onclick = nextQuestion;
    } else {
        feedbackMessage.textContent = 'Неправильно.';
        feedbackMessage.style.color = 'red';
        actionBtn.textContent = 'Показать решение';
        actionBtn.onclick = showExplanation;
    }
    feedbackMessage.classList.remove('hidden');
    actionBtn.classList.remove('hidden');
}

function showExplanation() {
    const currentQuestion = quizData[currentQuestionIndex];
    explanationDiv.textContent = currentQuestion.explanation;
    explanationDiv.classList.remove('hidden');
    actionBtn.textContent = 'Далее';
    actionBtn.onclick = nextQuestion;
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function showResults() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    correctCountSpan.textContent = correctAnswersCount;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    quizContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    loadQuestion();
}

optionButtons.forEach(button => {
    button.addEventListener('click', () => checkAnswer(button.dataset.option));
});

restartBtn.addEventListener('click', restartQuiz);

loadQuizData();