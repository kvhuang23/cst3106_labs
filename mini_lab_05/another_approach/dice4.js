const diceFaces = {
    1: ['dot5'],
    2: ['dot1', 'dot4'],
    3: ['dot1', 'dot5', 'dot4'],
    4: ['dot1', 'dot2', 'dot3', 'dot4'],
    5: ['dot1', 'dot2', 'dot3', 'dot4', 'dot5'],
    6: ['dot1', 'dot2', 'dot3', 'dot4', 'dot6', 'dot7']
};

function rollDice() {
    let dice1 = document.getElementById('dice1');
    let roll = Math.floor(Math.random() * 6) + 1;
    animateDice(dice1, roll);
}

function animateDice(dice, roll) {
    let count = 0;
    let interval = setInterval(function() {
        count++;
        dice.style.animation = 'roll 0.25s infinite';
        if (count >= roll) {
            clearInterval(interval);
            dice.style.animation = '';
            displayDots(roll);
        }
    }, 250);
}

function displayDots(roll) {
    let dots = document.getElementsByClassName('dot');
    for (let dot of dots) {
        dot.style.display = 'none';
    }
    let faces = diceFaces[roll];
    for (let face of faces) {
        document.getElementById(face).style.display = 'block';
    }
}
