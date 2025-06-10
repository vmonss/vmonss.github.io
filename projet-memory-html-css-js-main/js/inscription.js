"use strict";

window.onload = init;

function init() {
  document
    .getElementById("userPass")
    .addEventListener("input", checkPassStrength);
}

function checkPassStrength(PassEvent) {
  let passInput = PassEvent.target.value;

  // On change la propriété CSS "visibility" au fonction de la longueur du mot de passe
  if (passInput.length < 1) {
    // Champ vide
    document.querySelector(
      ".password-strength p:nth-child(1)"
    ).style.visibility = "hidden";
  } else {
    document.querySelector(
      ".password-strength p:nth-child(1)"
    ).style.visibility = "visible";

    if (passInput.length < 6) {
      document.querySelector(
        ".password-strength p:nth-child(2)"
      ).style.visibility = "hidden";
    } else {
      document.querySelector(
        ".password-strength p:nth-child(2)"
      ).style.visibility = "visible";

      if (passInput.length < 9) {
        document.querySelector(
          ".password-strength p:nth-child(3)"
        ).style.visibility = "hidden";
      } else {
        document.querySelector(
          ".password-strength p:nth-child(3)"
        ).style.visibility = "visible";
      }
    }
  }
}