
  // ===== Sélection des éléments du DOM =====
  // L'écran d'affichage de la calculatrice
  const displayEl = document.getElementById('display');
  // Le conteneur de toutes les touches (délégation d'événements)
  const keysEl    = document.querySelector('.keys');

  // ===== Variables d'état =====
  // current : valeur affichée à l'écran (chaîne de caractères)
  // previous: valeur mémorisée pour l'opération (nombre)
  // op      : opérateur sélectionné ('+', '-', '*', '/')
  // resetNext: flag pour indiquer qu'au prochain chiffre, l'écran doit être réinitialisé
  let current    = '0',
      previous   = null,
      op         = null,
      resetNext  = false;

  // ===== Mise à jour de l'affichage =====
  // Affiche la chaîne `current` dans l'élément displayEl
  function updateDisplay() {
    displayEl.textContent = current;
  }

  // ===== Gestion de la saisie d'un chiffre ou du point =====
  // d : caractère à ajouter ('0'–'9' ou '.')
  function appendDigit(d) {
    // Si on vient juste de faire un calcul, on écrase l'écran au prochain chiffre
    if (resetNext) {
      current = '0';
      resetNext = false;
    }

    // Cas : écran affiche '0' et l'utilisateur tape un autre chiffre (pas un point)
    if (current === '0' && d !== '.') {
      current = d;            // remplace '0' par ce chiffre
    }
    // Cas : point décimal déjà présent, on empêche l'ajout d'un second point
    else if (d === '.' && current.includes('.')) {
      return;                 // on sort sans rien faire
    }
    // Cas général : on concatène le nouveau caractère
    else {
      current += d;
    }
  }

  // ===== Choix d'un opérateur =====
  // o : opérateur sélectionné ('+', '-', '*', '/')
  function chooseOp(o) {
    // Si un opérateur était déjà actif, on effectue d'abord ce calcul
    if (op !== null) {
      compute();
    }
    // On mémorise la valeur actuelle comme "précédente"
    previous = parseFloat(current);
    // On stocke le nouvel opérateur
    op = o;
    // Au prochain chiffre, l'écran doit être réinitialisé
    resetNext = true;
  }

  // ===== Exécution du calcul =====
  function compute() {
    // Conversion de la valeur actuelle en nombre
    const cur = parseFloat(current);
    // Si pas d'opérateur défini ou pas de valeur précédente, rien à faire
    if (op === null || previous === null) return;

    let res;
    // Selon l'opérateur, on effectue l'opération adéquate
    switch (op) {
      case '+':
        res = previous + cur;
        break;
      case '-':
        res = previous - cur;
        break;
      case '*':
        res = previous * cur;
        break;
      case '/':
        // On gère la division par zéro : affiche "Erreur"
        res = (cur === 0) ? 'Erreur' : previous / cur;
        break;
      default:
        return;
    }

    // On met le résultat dans `current` pour l'affichage
    current = res.toString();
    // On réinitialise l'opérateur et la valeur précédente
    op = null;
    previous = null;
  }

  // ===== Réinitialisation complète =====
  function clearAll() {
    current   = '0';
    previous  = null;
    op        = null;
    resetNext = false;
  }

  // ===== Gestion des clics sur les touches =====
  // Utilisation de la délégation d'événements sur le conteneur .keys
  keysEl.addEventListener('click', e => {
    const b = e.target;  // le bouton cliqué

    // 1) Si c'est un bouton chiffré ou '.', on ajoute le caractère
    if (b.dataset.num) {
      appendDigit(b.dataset.num);
      updateDisplay();
    }
    // 2) Si c'est un opérateur (+, −, ×, ÷)
    else if (b.dataset.op) {
      chooseOp(b.dataset.op);
    }
    // 3) Si c'est le bouton égal
    else if (b.id === 'equal') {
      compute();
      updateDisplay();
      // On indique qu'au prochain chiffre, on doit écraser l'écran
      resetNext = true;
    }
    // 4) Si c'est le bouton clear (C)
    else if (b.id === 'clear') {
      clearAll();
      updateDisplay();
    }
  });

  // ===== Initialisation =====
  // Affiche la valeur de départ ("0") à l'écran
  updateDisplay();

