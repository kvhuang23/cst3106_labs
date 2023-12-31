/*jshint esversion: 6 */

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

function checkRollNumber() {
    fetch('/gameState')
        .then(response => response.json())
        .then(data => {
            rollNumber = data.rollNumber;
            roundNumber = data.roundNumber;

            // The rest of the logic remains largely unchanged
            switch (rollNumber) {
                case 0:
                    rollButton.className = '';
                    updateRollOnServer();
                    break;
                case 1:
                    rollButton.className = 'roll-1';
                    updateRollOnServer();
                    break;
                case 2:
                    rollButton.className = 'roll-2';
                    updateRollOnServer();
                    break;
                case 3:
                    rollButton.className = 'roll-3';
                    rollButton.removeEventListener('click', rollDie, false);
                    setTimeout(function() {
                        rollButton.className = 'roll-3 disabled';
                    }, 500);
                    break;
                default:
                    console.log("Roll number error");
            }
        });
}

function updateRollOnServer() {
    fetch('/updateRoll', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        rollNumber = data.rollNumber;
        roundNumber = data.roundNumber;
    });
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
    fetch('/resetGame', {
        method: 'POST'
    })
    .then(() => {
        window.location.reload(false);
    });
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

// Get the rendered style of an element
// http://robertnyman.com/2006/04/24/get-the-rendered-style-of-an-element/
function getStyle(oElm, strCssRule){
	let strValue = "";
	if(document.defaultView && document.defaultView.getComputedStyle){
		strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
	}
	else if(oElm.currentStyle){
		strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
			return p1.toUpperCase();
		});
		strValue = oElm.currentStyle[strCssRule];
	}
	return strValue;
}

// If 'Scores' button is visible, add quick access to it with swipe touch control
if (getStyle(openScoreSheet, 'visibility') !== 'hidden') {
	const hammertime = new Hammer(siteWrapper);
	hammertime.on('swipeleft', function() {
		openNav();
	});

	hammertime.on('swiperight', function() {
		closeNav();
	});
}