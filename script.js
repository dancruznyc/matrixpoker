const grid = document.querySelector(".game-grid");
const width = 8;
const cards = [];
let score = 0;
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
  for (let i = 0; i < width * width; i++) {
    const card = document.createElement("div");
    let randomSuit = Math.floor(Math.random() * suits.length);
    let randomFace = Math.floor(Math.random() * faces.length);
    card.innerText = faces[randomFace];
    card.setAttribute("draggable", true);
    card.style.backgroundImage = `url(/images/${suits[randomSuit]}.png)`;
    card.setAttribute("data-suit", suits[randomSuit]);
    card.setAttribute("id", i);
    grid.appendChild(card);
    cards.push(card);
  }
}

createBoard();

// Dragging Feature
let cardDraggedSuit;
let cardDraggedFace;
let cardReplacedSuit;
let cardReplacedFace;
let cardIdDragged;
let cardIdReplaced;

cards.forEach((card) => {
  card.addEventListener("dragstart", dragStart);
  card.addEventListener("dragend", dragEnd);
  card.addEventListener("dragenter", dragEnter);
  card.addEventListener("dragover", dragOver);
  card.addEventListener("dragleave", dragLeave);
  card.addEventListener("drop", dragDrop);
});

function dragStart() {
  cardDraggedSuit = this.dataset.suit;
  cardDraggedFace = this.innerText;
  cardIdDragged = parseInt(this.id);
  console.log(cardDraggedSuit, cardDraggedFace);
}

function dragEnd() {
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
}
