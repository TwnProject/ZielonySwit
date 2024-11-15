
const trashContainer = document.getElementById('trash-container');
const bins = document.querySelectorAll('.bin');
const scoreElement = document.getElementById('score');
const countdownOverlay = document.getElementById('countdown-overlay');
const countdownText = document.getElementById('countdown');

let score = 0;
let gameInterval;
let countdownTimer;

const trashItems = [
    { type: 'electronics', img: 'papier.png' },
    { type: 'electronics', img: 'karton.png' },
    { type: 'compost', img: 'banan.png' },
    { type: 'landfill', img: 'butelka.png' },
    { type: 'landfill', img: 'cd.png' },
    { type: 'landfill', img: 'kabel.png' },
    { type: 'landfill', img: 'maszynka.png' },
    { type: 'landfill', img: 'puszka.png' },
    { type: 'landfill', img: 'cd.png' },
    { type: 'recycle', img: 'perfum.png' },
    { type: 'recycle', img: 'szklobutelka.png' },
    { type: 'recycle', img: 'wino.png' },
];

function createTrashItem() {
    const trash = trashItems[Math.floor(Math.random() * trashItems.length)];
    const trashElement = document.createElement('img');
    trashElement.src = trash.img;
    trashElement.classList.add('trash');
    trashElement.draggable = true;
    trashElement.dataset.type = trash.type;

    trashElement.addEventListener('dragstart', dragStart);
    trashElement.addEventListener('dragend', dragEnd);

    trashContainer.appendChild(trashElement);

    setTimeout(() => {
        if (trashContainer.contains(trashElement)) {
            trashElement.remove();
            decrementScore();
        }
    }, 6000);
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.type);
    event.target.classList.add('dragging');
    event.target.style.opacity = "0";
    console.log("Drag started for item:", event.target.dataset.type);
}

function dragEnd(event) {
    event.target.style.opacity = "1";
    const dropSuccess = event.dataTransfer.dropEffect !== "none";
    if (!dropSuccess) {
        console.log("Item dropped outside bins:", event.target.dataset.type);
        decrementScore();
        event.target.remove();
    } else {
        console.log("Item dropped successfully:", event.target.dataset.type);
        event.target.remove();
    }
}

function decrementScore() {
    if (score > 0) {
        score--;
        scoreElement.textContent = score;
    }
    if (score === 0) {
        console.log("Game Over - Score reached zero."); 
        alert('Game Over! Your score reached zero.');
        resetGame();
    }
}

function resetGame() {
    score = 0;
    scoreElement.textContent = score;
    clearInterval(gameInterval);
    clearInterval(countdownTimer);
    trashContainer.innerHTML = '';
    startCountdown();
}

function handleDrop(event) {
    event.preventDefault();
    
    let binElement = event.target;
    if (!binElement.classList.contains('bin')) {
        binElement = binElement.closest('.bin');
    }
    
    const trashType = event.dataTransfer.getData('text/plain'); 
    const binType = binElement.id.split('-')[0];

    console.log("Dropped item type:", trashType, "| Bin type:", binType);
    if(trashType == binType) {
        score++;
        scoreElement.textContent = score;
    }
    else {
        decrementScore();
    }
}

function allowDrop(event) {
    event.preventDefault();
    console.log("Allowing drop on bin with ID:", event.target.id);
}

bins.forEach(bin => {
    bin.addEventListener('dragover', allowDrop);
    bin.addEventListener('drop', handleDrop);
});

function startGame() {
    gameInterval = setInterval(createTrashItem, 3000);
}

function startCountdown() {
    countdownOverlay.style.display = "flex";
    let countdown = 5;

    countdownTimer = setInterval(() => {
        countdownText.textContent = countdown;
        countdown--;

        if (countdown < 0) {
            clearInterval(countdownTimer);
            countdownOverlay.style.display = "none";
            startGame(); 
        }
    }, 1000);
}

window.onload = startCountdown;
