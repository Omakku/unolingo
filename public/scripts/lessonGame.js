const lessonElement = document.getElementById("lesson");
const quizID = lessonElement.getAttribute("data-id");
console.log(quizID);
const question = document.getElementById("question");
const answerChoices = Array.from(
  document.getElementsByClassName("choice_content")
);
const quizSelector = Array.from(
  document.getElementsByClassName("quiz_selector")
);
const progressText = document.getElementById("progressText");
const progressFull = document.getElementById("progressbarfull");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("quizTimeText");
const finalScoreText = document.getElementById("finalScoreText");
const finalScore = document.getElementById("finalScore");
const finalTimeText = document.getElementById("finalTime");
const qCounterText = document.getElementById("qCounterino");
const AddPoint = 10;
const maxquestions = 10;

let currentQuestion = {};
let answerDelay = false;
let score = 0;
let qCounter = 0;
let availableQuestions = [];

var start = new Date();

var form = document.getElementById("lesson");

let questions = [];

//Fetch Quiz Json File
fetch(`/quizscripts/${quizID}.json`)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions;

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

//BEGIN QUIZ
async function startGame() {
  qCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getRandomQuestion();
}

//TIME TRACKING FUNCTION
const tracktime = () => {
  var elapsed = new Date() - start;
  console.log("Start Date: " + start);
  console.log("Time to complete quiz: " + elapsed + "MILLISECONDS");
  return elapsed;
};

//GET NEW QUESTION FUNCTION
const getRandomQuestion = () => {
  if (!availableQuestions.length == 0 || !qCounter >= maxquestions) {
    document
      .getElementById("submitQuiz")
      .addEventListener("click", function () {
        form.submit();
      });

    qCounter++;
    progressText.innerText = `Question ${qCounter}/${maxquestions}`;

    progressFull.style.width = `${(qCounter / maxquestions) * 100}%`;

    const qIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[qIndex];
    question.innerText = currentQuestion.question;

    //STORE CORRECT ANSWER
    const correctAnswer = currentQuestion["choice" + currentQuestion.answer];

    //QUESTION CHOICES INTO ARRAY
    const allChoices = [
      currentQuestion.choice1,
      currentQuestion.choice2,
      currentQuestion.choice3,
      currentQuestion.choice4,
    ];

    //CALL SHUFFLE FUNCTION AND STORE RESULT INTO VARIABLE
    const shuffledChoices = shuffleArray(allChoices);

    //LOOK FOR NEW ANSWER INDEX AND ADD +1 TO ADJUST FOR ZERO-BASED ARRAY
    const newCorrectAnswerIndex = shuffledChoices.indexOf(correctAnswer);
    currentQuestion.answer = newCorrectAnswerIndex + 1;

    answerChoices.forEach((choice, index) => {
      choice.innerText = shuffledChoices[index];
    });

    //SUBTRACT CURRENT INDEX FROM AVAILABLE QUESTIONS
    availableQuestions.splice(qIndex, 1);

    answerDelay = true;

    //BUTTON APPEAR ON QUIZ COMPLETE
    document.getElementById("submitQuiz").style.visibility = "hidden";
    document.getElementById("submissionScreen").style.visibility = "hidden";
  } else {
    finalTime.value = tracktime();
    let milliseconds = finalTime.value;
    let timeBoy = formatTime(milliseconds);
    timeText.innerText = timeBoy;

    //CSS CHANGE ON QUIZ COMPLETE
    document.getElementById("submitQuiz").style.visibility = "visible";
    document.getElementById("submissionScreen").style.visibility = "visible";
    document.getElementById("blurboy").style.filter = "blur(0.5rem)";
    document.getElementById("blurboy").style.pointerEvents = "none";
  }
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

//TIME CONVSERION FUNCTION, THANK YOU SABE.IO
const formatTime = (milliseconds) => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / 1000 / 60) % 60);

  return [
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
};

//FOR EACH LOOP TO SELECT ANSWER IN CHOICE ARRAY
answerChoices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!answerDelay) return;

    answerDelay = false;
    const selChoice = e.target;
    const selAnswer = selChoice.dataset["number"];

    const ApplyClass =
      selAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (ApplyClass === "correct") {
      incrementScore(AddPoint);
    }

    selChoice.parentElement.classList.add(ApplyClass);

    setTimeout(() => {
      selChoice.parentElement.classList.remove(ApplyClass);
      getRandomQuestion();
    }, 1000);
  });
});

//PLAYER SCORE INCREMENTER
const incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
  finalScore.value = score;
  finalScoreText.innerText = score;
  console.log(finalScore);
};
