"use strict";

window.onload = init;

const NB_ROWS = 3;
const NB_COLUMNS = 4;
const NB_CARDS = NB_ROWS * NB_COLUMNS;

const TIME_BEFORE_UNFLIP = 2000;

// Variable pour savoir si c'est la première ou la deuxième carte
let isFirstCard = true;

let turnCount = 0;
let couplesRevealed = 0;

// Booléen qui permet d'empêcher les clics sur des cartes
// pendant la période d'affichage de deux cartes différentes
let unlocked = true;

function init() {
  sessionStorage.setItem("secondCard", 0);
  sessionStorage.setItem("firstCard", 0);

  let randNumber = 0;
  let orderSet = new Set();

  // Remplissage du Set qui va définir l'ordre de mes cartes
  do {
    randNumber = Math.floor(Math.random() * NB_CARDS);
    orderSet.add(randNumber);
  } while (orderSet.size < NB_CARDS);

  // On enregistre tout les "card-environnement" dans un tableau
  let cards = document.querySelectorAll(".card-environnement");

  // On utilise le orderSet pour donner les valeurs d'"order" aux cartes
  //   => On mélange le jeu
  // Et on en profite pour ajouter les EventListener
  let i = 0;
  orderSet.forEach((orderValue) => {
    cards[i].style.order = orderValue;
    cards[i].addEventListener("click", clickOnCardEnvironnement);
    i++;
  });
}

// On récupère en paramètre l’évènement, même sans rien avoir explicitement défini avant
function clickOnCardEnvironnement(EventClickedBackImg) {
  if (unlocked) {
    let ClickedBackImg = EventClickedBackImg.target;

    let cardID = new String();
    cardID = ClickedBackImg.getAttribute("id");

    // On affecte la classe CSS "is-flipped" qui permet de faire l'animation
    /* Chaque card-container a une classe unique du type containerX_Y
       Où X_Y correspond à l'ID de l'image contenue */
    document.querySelector(".container" + cardID).classList.add("is-flipped");

    if (isFirstCard) {
      sessionStorage.setItem("firstCard", cardID);
      isFirstCard = false;
    } else {
      unlocked = false;
      sessionStorage.setItem("secondCard", cardID);

      isFirstCard = true;

      turnCount++;

      document.querySelector(".countParagraph").innerText =
        "Nombre de coups : " + turnCount;

      if (
        sessionStorage.getItem("firstCard").charAt(0) !=
        sessionStorage.getItem("secondCard").charAt(0)
      ) {
        // Les deux dernières cartes retournées ne sont pas identiques
        setTimeout(hideCards, TIME_BEFORE_UNFLIP);
      } else {
        unlocked = true;

        // Remove Listener sur les deux "card-environnement" révélés
        document
          .querySelector(".environnement" + sessionStorage.getItem("firstCard"))
          .removeEventListener("click", clickOnCardEnvironnement);
        document
          .querySelector(
            ".environnement" + sessionStorage.getItem("secondCard")
          )
          .removeEventListener("click", clickOnCardEnvironnement);
        couplesRevealed++;

        if (couplesRevealed >= NB_CARDS / 2) {
          // Jeu Gagné
          unlocked = false;

          // Permet de décaler un peu l'affichage de la pop-up pour que
          // l'animation de la carte puisse se lancer
          setTimeout(() => {
            alert("Félicitation vous avez gagné en " + turnCount + " coups !");
          }, 50);

          document.querySelector(".relaunchGameText").style.visibility =
            "visible";

          window.addEventListener("keydown", testKeyForReset);
        }
      }
    }
  } /*else {
    alert("Attendez que les cartes soient masquées");
  }*/
}

function hideCards() {
  // On supprime la classe "is-flipped" pour rejouer l'animation dans l'autre sens
  document
    .querySelector(".container" + sessionStorage.getItem("firstCard"))
    .classList.remove("is-flipped");

  document
    .querySelector(".container" + sessionStorage.getItem("secondCard"))
    .classList.remove("is-flipped");

  unlocked = true;
}

function testKeyForReset(keyPressed) {
  keyPressed.preventDefault();
  if (keyPressed.code == "Space") {
    window.removeEventListener("keydown", testKeyForReset);
    document.querySelector(".relaunchGameText").style.visibility =
    "hidden";

    // Reset des variables
    isFirstCard = true;
    turnCount = 0;
    couplesRevealed = 0;
    unlocked = true;

    document.querySelector(".countParagraph").innerText =
      "Nombre de coups : " + turnCount;

    // Retournement des cartes
    let cards = document.querySelectorAll(".card-container");

    cards.forEach((cardContainer) => {
      cardContainer.classList.remove("is-flipped");
    });

    // Diffère le lancement de "init" pour attendre que
    // les cartes soient retournées avant de les mélanger
    setTimeout(init, 400);
  }
}
