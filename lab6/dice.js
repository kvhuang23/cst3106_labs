// Dice information holders
let diceAnywhere = []; // All dice currently in play array
let diceOnTable = []; // On-table die array
let diceSelected = []; // Selected die array
let currentDieIndex; // Keep track of die selection/deselection
let dieIndexHolder = [0,1,2,3,4];
let selectedDiceElements; // HTMLCollection

// DOM elements
const diceArea = document.getElementById('diceArea');
const selectedDiceArea = document.getElementById('selectedDiceArea');

// This event listener is directly related to the dice operation (rollDie function).
rollButton.addEventListener('click', rollDie, false);

// Randomize a number between 1-6
function randomizeDie() {
	return Math.floor(Math.random() * (6 - 1 + 1)) + 1;
}

function rollDie() {
	checkRollNumber(); // Update roll number indicator on the roll button

	// Set round number indicator visible if this is the first round
	if (roundNumber === 1) {
		document.getElementById('round-number-wrapper').className = 'visible';
	}

	document.getElementById('diceArea').innerHTML = ''; // Clear table
	diceOnTable = []; // Reset on-table array

	// Do the actual dice roll
	let amountToRoll = 5 - diceSelected.length; // Check number of die to roll
	for (let i = 0; i <= amountToRoll - 1; i++) { // Loop through the dice roll
		let diceRoll = randomizeDie(); // Roll die
		diceOnTable.push(diceRoll); // Add rolled die to on-table array
	}

	drawDiceOnTable();
	updateDiceAnywhere(); // Reset dice in play array
	updateScoreTable(); // Always update score table to show correct values on scores that count sum of all dice
}

// Draw the dice on table after a new roll
function drawDiceOnTable() {
	dieIndexHolder = [0,1,2,3,4]; // Reset die index holder

	for (let i = diceOnTable.length - 1; i >= 0; i--) {
		drawDieOnTable(diceOnTable[i], dieIndexHolder[i]);
	}

	// Assign new indices for dice left over from the last roll (so they don't get placed on top of the new dice when de-selected)
	updateSelectedDiceElements();
	if (selectedDiceElements) {
		for (let j = 0; j < selectedDiceElements.length; j++) {
			selectedDiceElements[j].setAttribute('die-index', diceOnTable.length + j);
		}
	}
}

// Pick a die from table
function selectDieFromTable() {
	let diceValue = parseInt(this.getAttribute('die-value'), 10); // Get value
	currentDieIndex = parseInt(this.getAttribute('die-index'), 10); // Get index
	let position = diceOnTable.indexOf(diceValue); // Find on-table array position for this die
	diceOnTable.splice(position, 1); // Remove die from on-table array
	this.parentNode.removeChild(this); // Remove selected from DOM
	diceSelected.push(diceValue); // Add selected die to selected-die array
	drawSelectedDice(diceValue, currentDieIndex);
	updateDiceAnywhere(); // Reset dice in play array
	updateScoreTable();
}

// Draw the selected die on selected dice tray
function drawSelectedDice(value, index) {
	let dieDiv = document.createElement('div');
	dieDiv.className += 'die-selected';
	selectedDiceArea.appendChild(dieDiv);
	dieDiv.setAttribute('die-value', value);
	dieDiv.setAttribute('die-index', index);
	dieDiv.addEventListener('click', removeDieSelection, false);
}

// Remove die from selected dice tray
function removeDieSelection() {
	let diceValue = parseInt(this.getAttribute('die-value'), 10); // Get value
	currentDieIndex = parseInt(this.getAttribute('die-index'), 10); // Get value
	let position = diceSelected.indexOf(diceValue); // Find selected-die array position for this die
	diceSelected.splice(position, 1); // Remove die from selected dice array
	diceOnTable.push(diceValue); // Add de-selected die to on-table array
	drawDieOnTable(diceValue, currentDieIndex);
	this.parentNode.removeChild(this); // Remove selected from DOM
	updateDiceAnywhere(); // Reset dice in play array
	updateScoreTable();
}

// Draw a die on table
function drawDieOnTable(value, index) {
	let dieDiv = document.createElement('div');
	dieDiv.className += 'die';
	diceArea.appendChild(dieDiv);
	let currentTransformation = getStyle(dieDiv, 'transform'); // Get current rendered transformation styles
	dieDiv.style.transform = currentTransformation + ' rotate('+randomizeRotation()+'deg)'; // Add random rotation to transform styles
	dieDiv.setAttribute('die-value', value);
	dieDiv.setAttribute('die-index', index);
	dieDiv.addEventListener('click', selectDieFromTable, false);
}

function randomizeRotation() {
	return Math.floor(Math.random() * (360 - 1) + 1); // Randomize a number between 1-360
}

function updateSelectedDiceElements() {
	if (selectedDiceArea.innerHTML !== '') {
		selectedDiceElements = document.getElementsByClassName('die-selected');
	}
}

function updateDiceAnywhere () {
	if (diceSelected) {
		diceAnywhere = diceOnTable.concat(diceSelected);
	} else {
		diceAnywhere = diceOnTable;
	}
}

