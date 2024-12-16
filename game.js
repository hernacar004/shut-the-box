
console.log('Game.js');


const dice1Img = document.getElementById('dice1');
const dice2Img = document.getElementById('dice2');
const startButton = document.getElementById('start-btn');
const rollButton = document.getElementById('roll-btn');
const individualButton = document.getElementById('individual-btn');
const sumButton = document.getElementById('sum-btn');
const endTurnButton = document.getElementById('end-turn-btn');
const resetButton = document.getElementById('reset-btn');
const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');
const boxes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let currentPlayer = 1;
let currentRound = 1;
let die1 = 0;
let die2 = 0;
let player1Points = 0;
let player2Points = 0;


startButton.addEventListener('click', () => {
    const player1Name = player1Input.value.trim();
    const player2Name = player2Input.value.trim();

    if (!player1Name || !player2Name) {
        alert('Please fill in both player names.');
        player1Input.focus();
        return;
    }

    document.getElementById('player1-display').textContent = player1Name;
    document.getElementById('player2-display').textContent = player2Name;
    document.getElementById('turn-display').textContent = `${player1Name}'s Turn`;

    rollButton.disabled = false;
    document.getElementById('game-board').style.display = 'block';
    document.getElementById('players-section').style.display = 'none';
    document.getElementById('scorecard-section').style.display = 'block';
});

rollButton.addEventListener('click', () => {
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;

    dice1Img.className = `bi bi-dice-${die1}`;
    dice2Img.className = `bi bi-dice-${die2}`;

    const sum = die1 + die2;
    const die1Shut = boxes[die1] === 'X';
    const die2Shut = boxes[die2] === 'X';
    const sumShut = boxes[sum] === 'X';

    individualButton.disabled = die1 === die2 || die1Shut || die2Shut;
    sumButton.disabled = sum > 9 || sumShut;
    endTurnButton.disabled = !individualButton.disabled && !sumButton.disabled;

    rollButton.disabled = true;
});

function shut(boxNumber) {
    const boxElement = document.getElementById(`box${boxNumber}`);
    boxElement.classList.add('shut');
    boxElement.textContent = 'X';
    boxes[boxNumber] = 'X';
}

individualButton.addEventListener('click', () => {
    shut(die1);
    shut(die2);
    boxes[0] += die1 + die2;
    individualButton.disabled = true;
    sumButton.disabled = true;
    rollButton.disabled = false;
});

sumButton.addEventListener('click', () => {
    const sum = die1 + die2;
    shut(sum);
    boxes[0] += sum;
    individualButton.disabled = true;
    sumButton.disabled = true;
    rollButton.disabled = false;
});

endTurnButton.addEventListener('click', () => {
    const pointsThisTurn = 45 - boxes[0];

    if (currentPlayer === 1) {
        player1Points += pointsThisTurn;

        const newRow = buildRow(currentRound, pointsThisTurn, '-');
        document.querySelector('#score-table tbody').appendChild(newRow);

        currentPlayer = 2;
        document.getElementById('turn-display').textContent = `${document.getElementById('player2-display').textContent}'s Turn`;
    } else {
        player2Points += pointsThisTurn;

        const lastRow = document.querySelector(`#score-table tbody tr:last-child`);
        lastRow.querySelector('.p2Pts').textContent = pointsThisTurn;

        currentPlayer = 1;
        currentRound += 1;
        document.getElementById('turn-display').textContent = `${document.getElementById('player1-display').textContent}'s Turn`;
    }


    resetBoard();

    if (currentRound > 5) {
        gameOver();
    }

    endTurnButton.disabled = true;
    rollButton.disabled = false;
});



function buildRow(round, pointsP1, pointsP2 = '') {
    const row = document.createElement('tr');
    row.id = `round${round}`;

    const th = document.createElement('th');
    th.textContent = `Round ${round}`;
    row.appendChild(th);

    const tdP1 = document.createElement('td');
    tdP1.className = 'p1Pts';
    tdP1.textContent = pointsP1;
    row.appendChild(tdP1);

    const tdP2 = document.createElement('td');
    tdP2.className = 'p2Pts';
    tdP2.textContent = pointsP2;
    row.appendChild(tdP2);

    return row;
}


function resetBoard() {
    boxes.fill(0);
    const allBoxes = document.querySelectorAll('#board .box');
    allBoxes.forEach((box, index) => {
        box.classList.remove('shut');
        box.textContent = index + 1;
    });
}


function gameOver() {
    document.getElementById('game-board').style.display = 'none';
    document.getElementById('players-section').style.display = 'none';
    document.getElementById('winner-section').style.display = 'block';

    const winnerDisplay = document.getElementById('winner-display');
    if (player1Points < player2Points) {
        winnerDisplay.textContent = `Winner: ${document.getElementById('player1-display').textContent} with ${player1Points} points!`;
    } else if (player2Points < player1Points) {
        winnerDisplay.textContent = `Winner: ${document.getElementById('player2-display').textContent} with ${player2Points} points!`;
    } else {
        winnerDisplay.textContent = `It's a tie! Both players scored ${player1Points} points.`;
    }

    const playAgainButton = document.getElementById('play-again-btn');
    playAgainButton.addEventListener('click', () => {
        resetGame();
    });
}


function resetGame() {
    player1Points = 0;
    player2Points = 0;
    currentRound = 1;
    currentPlayer = 1;

    document.getElementById('game-board').style.display = 'none';
    document.getElementById('players-section').style.display = 'block';
    document.getElementById('winner-section').style.display = 'none';

    const tbody = document.querySelector('#score-table tbody');
    tbody.innerHTML = '';

    resetBoard();

    const player1Input = document.getElementById('player1-name');
    const player2Input = document.getElementById('player2-name');
    player1Input.value = '';
    player2Input.value = '';
    player1Input.focus();
}


resetButton.addEventListener('click', resetGame);
