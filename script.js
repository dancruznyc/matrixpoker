const grid = document.querySelector(".game-grid");
const marqueeMessage = document.querySelector(".marquee-content");
const gameScoreDisplay = document.querySelector(".game-score");
const roundScoreDisplay = document.querySelector(".round-score");
const roundClockDisplay = document.querySelector(".game-timer");
const scoreBoard = document.querySelector(".score-board");
const gameModal = document.querySelector(".game-modal");
const modalDisplay = document.querySelector(".modal-display");
const roundDisplay = document.querySelector(".game-round");
const roundGoalDisplay = document.querySelector(".round-goal");
const highScoresInit = document.querySelector(".high-scores-list");
const width = 8;
let cards = [];
const shuffle = new Audio("sounds/shuffle.wav");
const cardSound = new Audio("sounds/card-click.mp3");
const gameMusic = new Audio("sounds/In-Summer.wav");
const userMusicOption = true;
const newDeckBtn = document.querySelector(".new-deck");
let newdecks = 3;
let highScores = [];
getHighScores();
highScoresInit.innerHTML = `
 <li class="high-scores">${highScores[0].name} - ${highScores[0].score}</li>
  <li class="high-scores">${highScores[1].name} - ${highScores[1].score}</li>
  <li class="high-scores">${highScores[2].name} - ${highScores[2].score}</li>
`;

gameMusic.loop = true;
gameMusic.volume = 0.05;
let round = 0;
let roundStarted = false;
let roundScore = 0;
let gameScore = 0;
let roundGoalMet = false;
let roundGoals = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500];
const suits = ["hearts", "diamonds", "spades", "clubs"];
const faces = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "8",
  "10",
  "J",
  "Q",
  "K",
];

function createBoard() {
  console.log(grid);
  if (!(grid.innerText === "")) {
    grid.innerHTML = "";
  }
  for (let i = 0; i < width * width; i++) {
    const card = document.createElement("div");
    let randomSuit = Math.floor(Math.random() * suits.length);
    let randomFace = Math.floor(Math.random() * faces.length);
    card.innerText = faces[randomFace];
    card.setAttribute("draggable", true);
    card.style.backgroundImage = `url(./images/${suits[randomSuit]}.png)`;
    card.setAttribute("data-suit", suits[randomSuit]);
    card.setAttribute("id", i);
    grid.appendChild(card);
    cards.push(card);
  }
  console.log(cards);
}

createBoard();

cards.forEach((card) => {
  card.addEventListener("dragstart", dragStart);
  card.addEventListener("dragend", dragEnd);
  card.addEventListener("dragenter", dragEnter);
  card.addEventListener("dragover", dragOver);
  card.addEventListener("dragleave", dragLeave);
  card.addEventListener("drop", dragDrop);
});

// Dragging Feature
let cardDraggedSuit;
let cardDraggedFace;
let cardReplacedSuit;
let cardReplacedFace;
let cardIdDragged;
let cardIdReplaced;

function dragStart() {
  console.log("drag start");
  if (!cardSound.paused) {
    cardSound.pause();
    cardSound.currentTime = 0;
    cardSound.play();
  }
  console.log(this.dataset.suit);
  cardSound.play();

  cardDraggedSuit = this.dataset.suit;
  cardDraggedFace = this.innerText;
  cardIdDragged = parseInt(this.id);
  setTimeout(() => this.classList.add("invisible"), 0);
  console.log(cardDraggedSuit, cardDraggedFace, this.style.backgroundImage);
}

function dragEnd() {
  this.classList.remove("invisible");
  // What is a Valid Move?
  let validMoves = [
    cardIdDragged - 1,
    cardIdDragged - width,
    cardIdDragged + 1,
    cardIdDragged + width,
  ];
  let validMove = validMoves.includes(cardIdReplaced);
  if (cardIdReplaced && validMove) {
    cardIdReplaced = null;
  } else if (cardIdReplaced && !validMove) {
    cards[
      cardIdReplaced
    ].style.backgroundImage = `url(/images/${cardReplacedSuit}.png)`;
    cards[cardIdReplaced].innerText = cardReplacedFace;
    cards[cardIdReplaced].setAttribute("data-suit", cardReplacedSuit);
    cards[
      cardIdDragged
    ].style.backgroundImage = `url(/images/${cardDraggedSuit}.png)`;
    cards[cardIdDragged].innerText = cardDraggedFace;
    cards[cardIdDragged].setAttribute("data-suit", cardDraggedSuit);
  } else
    cards[
      cardIdDragged
    ].style.backgroundImage = `url(/images/${cardDraggedSuit}.png)`;
  //   cards[cardIdDragged].innerText = cardDraggedFace;
}
function dragEnter(e) {
  e.preventDefault();
}
function dragOver(e) {
  e.preventDefault();
}
function dragLeave() {}
function dragDrop() {
  cardReplacedSuit = this.dataset.suit;
  cardReplacedFace = this.innerText;
  cardIdReplaced = parseInt(this.id);
  this.style.backgroundImage = `url(/images/${cardDraggedSuit}.png)`;
  this.innerText = cardDraggedFace;
  this.setAttribute("data-suit", cardDraggedSuit);
  cards[
    cardIdDragged
  ].style.backgroundImage = `url(/images/${cardReplacedSuit}.png)`;
  cards[cardIdDragged].innerText = cardReplacedFace;
  cards[cardIdDragged].setAttribute("data-suit", cardReplacedSuit);
  checkForStraightRow();
  checkForStraightColumn();
  checkColumnOfFive();
  checkRowOfFive();
  checkForFlushRow();
  checkForFlushColumn();
  checkRowOfFour();
  checkColumnOfFour();
  checkRowOfThree();
  checkColumnOfThree();
  topRowBugFix();
  if (cards.some((card) => card.style.backgroundImage === "")) moveTilesDown();
}

// Match of 3 in a Row
function checkRowOfThree() {
  for (i = 0; i <= 61; i++) {
    let rowOfThree = [i, i + 1, i + 2];
    let faceToMatch = cards[i].innerText;
    const isBlank = cards[i].style.backgroundImage === "";
    const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
    if (notValid.includes(i)) continue;
    if (
      rowOfThree.every((i) => cards[i].innerText === faceToMatch && !isBlank)
    ) {
      gameScoreUpdate(5000);
      rowOfThree.forEach((index) => {
        cards[index].style.backgroundImage = "";
        cards[index].innerText = "";
        cards[index].setAttribute("data-suit", "");
      });
      updateMarquee("Three Of A Kind!");
      console.log("You got 3 in a row (row)");
      return true;
    }
  }
}

// Match of 3 in a Column
function checkColumnOfThree() {
  for (i = 0; i <= 47; i++) {
    let columnOfThree = [i, i + width, i + width * 2];
    let faceToMatch = cards[i].innerText;
    const isBlank = cards[i].style.backgroundImage === "";
    if (
      columnOfThree.every((i) => cards[i].innerText === faceToMatch && !isBlank)
    ) {
      gameScoreUpdate(100);
      columnOfThree.forEach((index) => {
        cards[index].style.backgroundImage = "";
        cards[index].innerText = "";
        cards[index].setAttribute("data-suit", "");
      });
      console.log("You got 3 in a row (col)");
      updateMarquee("Three Of A Kind!");
      return true;
    }
  }
}

// Match of 4 in a Row
function checkRowOfFour() {
  for (i = 0; i <= 60; i++) {
    let rowOfFour = [i, i + 1, i + 2, i + 3];
    let faceToMatch = cards[i].innerText;
    const isBlank = cards[i].style.backgroundImage === "";
    const notValid = [
      5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
      54, 55,
    ];
    if (notValid.includes(i)) continue;
    if (
      rowOfFour.every((i) => cards[i].innerText === faceToMatch && !isBlank)
    ) {
      gameScoreUpdate(300);
      rowOfFour.forEach((index) => {
        cards[index].style.backgroundImage = "";
        cards[index].innerText = "";
        cards[index].setAttribute("data-suit", "");
      });
      console.log("You got 4 in a row (row)");
      updateMarquee("Four Of A Kind!");
      return true;
    }
  }
}

// Match of 4 in a Column
function checkColumnOfFour() {
  for (i = 0; i < 39; i++) {
    let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
    let faceToMatch = cards[i].innerText;
    const isBlank = cards[i].style.backgroundImage === "";
    if (
      columnOfFour.every((i) => cards[i].innerText === faceToMatch && !isBlank)
    ) {
      gameScoreUpdate(300);
      columnOfFour.forEach((index) => {
        cards[index].style.backgroundImage = "";
        cards[index].innerText = "";
        cards[index].setAttribute("data-suit", "");
      });
      console.log("you got 4 in a row (col)");
      updateMarquee("Four Of A Kind!");
      return true;
    }
  }
}

// Match of 5 in a Row
function checkRowOfFive() {
  for (i = 0; i <= 59; i++) {
    let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
    let faceToMatch = cards[i].innerText;
    const isBlank = cards[i].style.backgroundImage === "";
    const notValid = [
      4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38,
      39, 44, 45, 46, 47, 52, 53, 54, 55,
    ];
    if (notValid.includes(i)) continue;
    if (
      rowOfFive.every((i) => cards[i].innerText === faceToMatch && !isBlank)
    ) {
      gameScoreUpdate(600);
      rowOfFive.forEach((index) => {
        cards[index].style.backgroundImage = "";
        cards[index].innerText = "";
        cards[index].setAttribute("data-suit", "");
      });
      console.log("You got 5 in a row (row)");
      updateMarquee("Five Of A Kind!");
      return true;
    }
  }
}

// Match of 5 in a Column
function checkColumnOfFive() {
  for (i = 0; i < 31; i++) {
    let columnOfFive = [
      i,
      i + width,
      i + width * 2,
      i + width * 3,
      i + width * 4,
    ];
    let faceToMatch = cards[i].innerText;
    const isBlank = cards[i].style.backgroundImage === "";
    if (
      columnOfFive.every((i) => cards[i].innerText === faceToMatch && !isBlank)
    ) {
      gameScoreUpdate(600);
      columnOfFive.forEach((index) => {
        cards[index].style.backgroundImage = "";
        cards[index].innerText = "";
        cards[index].setAttribute("data-suit", "");
      });
      console.log("You got 5 in a row (col)");
      updateMarquee("Five Of A Kind!");
      return true;
    }
  }
}

// Check for a flush row
function checkForFlushRow() {
  for (i = 0; i <= 59; i++) {
    let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
    let suitToMatch = cards[i].dataset.suit;
    const isBlank = cards[i].style.backgroundImage === "";
    const notValid = [
      4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38,
      39, 44, 45, 46, 47, 52, 53, 54, 55,
    ];
    if (notValid.includes(i)) continue;
    if (
      rowOfFive.every((i) => cards[i].dataset.suit === suitToMatch && !isBlank)
    ) {
      gameScoreUpdate(50);
      rowOfFive.forEach((index) => {
        cards[index].style.backgroundImage = "";
        cards[index].innerText = "";
        cards[index].setAttribute("data-suit", "");
      });
      console.log("You got a flush (row)");
      updateMarquee("Flush!!");
      return true;
    }
  }
}

// Check for Flush Column
function checkForFlushColumn() {
  for (i = 0; i <= 31; i++) {
    let columnOfFive = [
      i,
      i + width,
      i + width * 2,
      i + width * 3,
      i + width * 4,
    ];
    let suitToMatch = cards[i].dataset.suit;
    const isBlank = cards[i].style.backgroundImage === "";
    if (
      columnOfFive.every(
        (i) => cards[i].dataset.suit === suitToMatch && !isBlank
      )
    ) {
      // update score
      gameScoreUpdate(50);
      columnOfFive.forEach((index) => {
        cards[index].style.backgroundImage = "";
        cards[index].innerText = "";
        cards[index].setAttribute("data-suit", "");
      });
      console.log("You got a flush (col)");
      updateMarquee("Flush!!");
      return true;
    }
  }
}

// check for a straight Row
function checkForStraightRow() {
  for (i = 0; i <= 59; i++) {
    let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
    const setToMatch = rowOfFive.map((i) => cards[i].innerText).join("");
    let faceToMatch = cards[i].innerText;
    let suitToMatch = cards[i].dataset.suit;
    const isBlank = cards[i].style.backgroundImage === "";
    const notValid = [
      4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38,
      39, 44, 45, 46, 47, 52, 53, 54, 55,
    ];
    if (notValid.includes(i)) continue;
    if (isStraight(setToMatch) && !isBlank) {
      // score += 50;
      gameScoreUpdate(250);
      rowOfFive.forEach((index) => {
        cards[index].style.backgroundImage = "";
        cards[index].innerText = "";
        cards[index].setAttribute("data-suit", "");
      });
      console.log("You got a straight (row)");
      updateMarquee("Five Straight!");
      return true;
    }
  }
}

// Check for Straight Column
function checkForStraightColumn() {
  for (i = 0; i < 31; i++) {
    let columnOfFive = [
      i,
      i + width,
      i + width * 2,
      i + width * 3,
      i + width * 4,
    ];
    const setToMatch = columnOfFive.map((i) => cards[i].innerText).join("");
    let faceToMatch = cards[i].innerText;
    const isBlank = cards[i].style.backgroundImage === "";
    if (isStraight(setToMatch) && !isBlank) {
      // update score
      gameScoreUpdate(250);
      columnOfFive.forEach((index) => {
        cards[index].style.backgroundImage = "";
        cards[index].innerText = "";
        cards[index].setAttribute("data-suit", "");
      });
      console.log("You got a straight (col)");
      updateMarquee("Five Straight!");
      return true;
    }
  }
}

// Straight not in order true or false
function isStraight(str) {
  const sequence = "A2345678910JQKA";
  let subString = [];

  for (let i = 0; i <= sequence.length - str.length; i++) {
    if (str.length === 5) subString = [i, i + 1, i + 2, i + 3, i + 4];
    else subString = [i, i + 1, i + 2, i + 3, i + 4, i + 5];
    let string1 = subString
      .map((index) => sequence[index])
      .sort()
      .join("");

    if (string1 === str.split("").sort().join("")) return true;
  }
  return false;
}

function topRowBugFix() {
  const firstRowCards = [];
  const restOfCards = [];
  for (let i = 0; i <= 63; i++) {
    if (i < 8) firstRowCards.push(cards[i]);
    else restOfCards.push(cards[i]);
  }
  if (
    firstRowCards.some((card) => card.innerText === "") &&
    !restOfCards.some((card) => card.innerText === "")
  ) {
    firstRowCards.forEach((card) => {
      if (card.innerText === "") {
        let randomSuit = Math.floor(Math.random() * suits.length);
        let randomFace = Math.floor(Math.random() * faces.length);
        card.innerText = faces[randomFace];
        card.style.backgroundImage = `url(/images/${suits[randomSuit]}.png)`;
        card.setAttribute("data-suit", suits[randomSuit]);
      }
      shuffle.play();
    });
    return true;
  }
}

// Tiles fall down
function moveTilesDown() {
  const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
  for (let i = 0; i <= 55; i++) {
    if (
      cards[i + width].style.backgroundImage === "" ||
      cards[i + width].style.backgroundImage === `url("/images/.png")`
    ) {
      cards[i + width].style.backgroundImage = cards[i].style.backgroundImage;
      cards[i + width].innerText = cards[i].innerText;
      cards[i + width].setAttribute("data-suit", cards[i].dataset.suit);
      cards[i].style.backgroundImage = "";
      cards[i].innerText = "";
      cards[i].setAttribute("data-suit", "");
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && cards[i].style.backgroundImage === "") {
        let randomSuit = Math.floor(Math.random() * suits.length);
        let randomFace = Math.floor(Math.random() * faces.length);
        cards[i].innerText = faces[randomFace];
        cards[
          i
        ].style.backgroundImage = `url(/images/${suits[randomSuit]}.png)`;
        cards[i].setAttribute("data-suit", suits[randomSuit]);
      }
    }
  }
  if (!cards.some((card) => card.style.backgroundImage === "")) shuffle.play();
  if (cards.some((card) => card.style.backgroundImage === "")) moveTilesDown();
  else if (
    checkForStraightRow() ||
    checkForStraightColumn() ||
    checkColumnOfFive() ||
    checkRowOfFive() ||
    checkForFlushRow() ||
    checkForFlushColumn() ||
    checkRowOfFour() ||
    checkColumnOfFour() ||
    checkRowOfThree() ||
    checkColumnOfThree()
  ) {
    topRowBugFix();
    moveTilesDown();
  } else {
    return;
  }
}

function updateMarquee(message) {
  marqueeMessage.replaceChildren("");
  const newMessage = `<li>${message}</li>`;
  marqueeMessage.innerHTML = newMessage;
}

function gameScoreUpdate(points, roundStarted) {
  // if (!roundStarted) return;
  length = 9;
  gameScore += points;
  roundScore += points;
  if (roundScore >= roundGoals[round]) roundGoalMet = true;
  else roundGoalMet = false;
  let gameScoreString = gameScore + "";
  let roundScoreString = roundScore + "";
  while (gameScoreString.length < length) {
    gameScoreString = "0" + gameScoreString;
  }
  while (roundScoreString.length < length) {
    roundScoreString = "0" + roundScoreString;
  }
  gameScoreDisplay.innerText = gameScoreString;
  roundScoreDisplay.innerText = roundScoreString;
}

function roundClockUpdate() {
  let timeInSeconds = 30;
  const reduceTime = setInterval(() => {
    timeInSeconds--;
    let min = Math.floor(timeInSeconds / 60);
    let sec = Math.floor(timeInSeconds % 60);
    roundClockDisplay.innerText = `${min}:${sec < 10 ? "0" : ""}${sec}`;
    if (timeInSeconds <= 0) {
      roundScoreDisplay.innerText = "000000000";
      nextRound();
      clearInterval(reduceTime);
    }
  }, 1000);
}

const startRoundButton = document.querySelector(".game-button");
startRoundButton.addEventListener("click", startRound);
function startRound() {
  roundScore = 0;
  grid.classList.remove("invisible");
  gameMusic.play();
  grid.style.display = "flex";
  roundClockUpdate();
  scoreBoard.style.display = "flex";
  gameModal.style.display = "none";
}

async function nextRound() {
  gameMusic.pause();
  newdecks = 3;
  newDeckBtn.innerText = `New Deck: ${newdecks}`;

  scoreBoard.style.display = "none";
  grid.classList.add("invisible");
  if (roundScore >= roundGoals[round] && round < 9) {
    gameModal.style.display = "flex";
    roundGoalMet = true;
    const modalRoundDisplay = `
    
    <h2>Round ${round + 1} Successful!</h2>
    <ul>
    <li>Round Score: ${roundScore}</li>
    <li>Game Score: ${gameScore}</li>
    </ul>
    
    `;
    roundDisplay.innerText = `Round: ${round + 2}`;
    modalDisplay.innerHTML = modalRoundDisplay;
    startRoundButton.innerText = `Start Round ${round + 2}`;
    round++;
    roundScore = 0;
    roundGoalDisplay.innerText = `Round Goal: ${roundGoals[round]}`;
  } else if (roundScore < roundGoals[round]) {
    modalDisplay.innerHTML = await updateHighScore(gameScore);
    gameModal.style.display = "flex";
    console.log(modalDisplay);
    startRoundButton.innerText = `Start Game`;
    round = 0;
    gameScore = 0;
    roundScore = 0;
    gameScoreDisplay.innerText = "000000000";
    roundDisplay.innerText = `Round: ${round + 1}`;
    roundGoalDisplay.innerText = `Round Goal: ${roundGoals[round]}`;
  } else if (roundScore >= roundGoals[round] && round === 9) {
    modalDisplay.innerHTML = await updateHighScore(gameScore);
    gameModal.style.display = "flex";
    startRoundButton.innerText = `Start Game`;
    round = 0;
    gameScore = 0;
    roundScore = 0;
    gameScoreDisplay.innerText = "000000000";
    roundDisplay.innerText = `Round: ${round + 1}`;
    roundGoalDisplay.innerText = `Round Goal: ${roundGoals[round]}`;
  }
}

async function updateHighScore(score) {
  console.log(highScores);
  if (highScores.some((oldScores) => score > oldScores.score)) {
    let name = await getUsersName();
    let index = highScores.findIndex((oldScores) => score > oldScores.score);

    highScores.splice(index, 0, {
      name: name.toUpperCase(),
      score: score,
    });
    highScores.pop();
  }

  localStorage.setItem("highScores", JSON.stringify(highScores));

  const highScoreHTML = `
  ${
    round === 9 && roundScore >= roundGoals[round]
      ? "<h2>Congratulations! Game Completed!</h2>"
      : "<h2>Game Over</h2>"
  }
  <h2>High Scores</h2>
  <ul class="high-scores-list">
  <li class="high-scores">${highScores[0].name} - ${highScores[0].score}</li>
  <li class="high-scores">${highScores[1].name} - ${highScores[1].score}</li>
  <li class="high-scores">${highScores[2].name} - ${highScores[2].score}</li>
  </ul>
  `;
  return highScoreHTML;
}

const nameModal = document.querySelector(".name-input-modal");

async function getUsersName(name) {
  nameModal.style.display = "flex";
  return new Promise((resolve, reject) => {
    document.querySelector(".name-btn").addEventListener("click", () => {
      console.log("123");
      resolve(document.querySelector(".name-input").value);
      console.log(document.querySelector(".name-input").value);
      nameModal.style.display = "none";
    });
  });
}

function getHighScores() {
  if (localStorage.getItem("highScores") === null) {
    highScores = [
      { name: "DAN", score: "000000000" },
      { name: "ABC", score: "000000000" },
      { name: "QQQ", score: "000000000" },
    ];
    return;
  } else {
    highScores = JSON.parse(localStorage.getItem("highScores"));
  }
  console.log(highScores);
}

const musicCheckBox = document.querySelector("input[name=music");
const soundFXCheckBox = document.querySelector("input[name=soundfx");

musicCheckBox.addEventListener("change", (e) => {
  if (e.target.checked === true) {
    gameMusic.muted = false;
  } else gameMusic.muted = true;
});

soundFXCheckBox.addEventListener("change", (e) => {
  if (e.target.checked === true) {
    cardSound.muted = false;
    shuffle.muted = false;
  } else {
    cardSound.muted = true;
    shuffle.muted = true;
  }
});

newDeckBtn.addEventListener("click", newDeck);

function newDeck() {
  if (newdecks === 0) return;
  cards = [];
  createBoard();
  newdecks--;
  newDeckBtn.innerText = `New Deck: ${newdecks}`;
  cards.forEach((card) => {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
    card.addEventListener("dragenter", dragEnter);
    card.addEventListener("dragover", dragOver);
    card.addEventListener("dragleave", dragLeave);
    card.addEventListener("drop", dragDrop);
  });
}
