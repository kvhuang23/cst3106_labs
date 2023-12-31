// Throw and round number information holders
let rollNumber = 0;
let roundNumber = 1;

// DOM elements
const rollButton = document.getElementById('rollDiceButton');
const rulesButton = document.getElementById('openRulesButton');
const closeRulesButton = document.getElementById('closeRulesButton');
const openScoreSheet = document.getElementById('openScoreSheetButton');
const closeScoreSheet = document.getElementById('closeScoreSheetButton');
const roundNumberElement = document.getElementById('round-number');
const siteWrapper = document.getElementById('site-wrapper');
const siteCanvas = document.getElementById('site-canvas');
const speculativeScoreTab = document.getElementsByClassName('speculative-score');

openScoreSheet.addEventListener('click', openNav, false);
closeScoreSheet.addEventListener('click', closeNav, false);
rulesButton.addEventListener('click', openRules, false);
closeRulesButton.addEventListener('click', closeRules, false);
window.addEventListener('resize', windowResize, false);

checkRollNumber();

const windowWidth = document.documentElement.clientWidth;

// Re-draw the dice on window resize to reset the element style transform done with JS (rotation),
// which are overriding responsive CSS transform scale styling
function windowResize() {
	if (diceOnTable.length && windowWidth !== document.documentElement.clientWidth) { // Prevent mobile Chrome from triggering this on scroll
		diceArea.innerHTML = '';
		drawDiceOnTable();
	}
}

// Update dice roll button status based on current roll number
function checkRollNumber() {
	switch (rollNumber) {
		case 0:
			rollButton.className = '';
			rollNumber += 1;
		break;
		case 1:
			rollButton.className = 'roll-1';
			rollNumber += 1;
		break;
		case 2:
			rollButton.className = 'roll-2';
			rollNumber += 1;
		break;
		case 3:
			rollButton.className = 'roll-3';
			rollButton.removeEventListener('click', rollDie, false);
			rollNumber += 1;
			setTimeout(function() {
				rollButton.className = 'roll-3 disabled';
			}, 500);
		break;
		default:
		console.log("Roll number error");
	}
}

function hideSpeculativeScores() {
	for (let i = 0; i < speculativeScoreTab.length; i++) {
		speculativeScoreTab[i].style.display = 'none';
	}
}

function updateRoundNumber() {
    roundNumberElement.innerHTML = Math.min(roundNumber, 13);
}

function resetTable() {
   diceOnTable = []; // Reset on-table die array
   diceSelected = []; // Reset selected die array
   dieIndexHolder = [0,1,2,3,4]; // Reset die index holder
   updateDiceAnywhere(); // Reset dice in play array
   rollNumber = 0;
   checkRollNumber();
   hideSpeculativeScores();
   updateRoundNumber();
   rollButton.addEventListener('click', rollDie, false);
   selectedDiceArea.innerHTML = '';
   diceArea.innerHTML = '';
}

function resetGame() {
   window.location.reload(false);
}

function openRules() {
	siteWrapper.className = 'show-rules';
	rulesButton.style.opacity = 0;
}

function closeRules() {
	siteWrapper.className = '';
	scroll(0,0);
	rulesButton.style.opacity = 1;
}


function openNav() {
	siteWrapper.className = 'show-nav';
	openScoreSheet.style.opacity = 0;
}

function closeNav() {
	siteWrapper.className = '';
	scroll(0,0);
	openScoreSheet.style.opacity = 1;
}
