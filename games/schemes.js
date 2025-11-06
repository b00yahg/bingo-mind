// THE SCHEMES - Simon Says Balloon Game

const SchemesGame = {
    colors: ['red', 'blue', 'yellow'],
    pattern: [],
    playerInput: [],
    round: 0,
    isShowingPattern: false,
    isPlayerTurn: false,
    inGameMode: false, // NEW: Track if in active game
    score: 0,
    // NEW: Track clicks per color for 666 puzzle
    colorClicks: {
        red: 0,
        blue: 0,
        yellow: 0
    },
    puzzles: {
        puzzle1Complete: false,
        puzzle2Complete: false
    }
};

const SOUNDS = {
    balloonPop: new Audio('assets/sounds/balloon_pop.mp3'),
    correctChime: new Audio('assets/sounds/correct_chime.mp3'),
    wrongBuzzer: new Audio('assets/sounds/wrong_buzzer.mp3')
};

// Initialize Schemes Game
document.addEventListener('DOMContentLoaded', () => {
    initSchemesGame();
});

function initSchemesGame() {
    // Load saved progress
    const saved = localStorage.getItem('schemesProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        SchemesGame.score = progress.score || 0;
        SchemesGame.round = progress.round || 0;
        SchemesGame.puzzles = progress.puzzles || SchemesGame.puzzles;
    }

    // Generate balloon buttons
    generateBalloons();

    // Start button
    const startBtn = document.getElementById('start-balloon-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startNewGame);
    }

    updateDisplay();
}

// Generate balloon buttons
function generateBalloons() {
    const grid = document.getElementById('balloon-grid');
    grid.innerHTML = '';

    SchemesGame.colors.forEach((color, index) => {
        const balloonBtn = createBalloonButton(color, index);
        grid.appendChild(balloonBtn);
    });
}

// Create balloon button
function createBalloonButton(color, index) {
    const container = document.createElement('div');
    container.className = 'balloon-container';

    const balloon = document.createElement('div');
    balloon.className = `balloon ${color}`;
    balloon.setAttribute('data-color', color);

    // Use image if available, fallback to emoji
    const img = document.createElement('img');
    img.src = `assets/images/balloons/${color}_balloon.png`;
    img.alt = `${color} balloon`;
    img.onerror = () => {
        // Fallback to emoji if image not found
        balloon.innerHTML = '<span class="balloon-emoji">🎈</span>';
    };
    balloon.appendChild(img);

    balloon.style.animationDelay = `${index * 0.15}s`;

    balloon.addEventListener('click', () => {
        if (SchemesGame.inGameMode) {
            // In game mode: Simon Says logic
            if (SchemesGame.isPlayerTurn && !SchemesGame.isShowingPattern) {
                handlePlayerClick(color, balloon);
            }
        } else {
            // Outside game mode: Free clicking for 666 puzzle
            handleFreeClick(color, balloon);
        }
    });

    container.appendChild(balloon);
    return container;
}

// Start new game
function startNewGame() {
    SchemesGame.inGameMode = true;
    SchemesGame.pattern = [];
    SchemesGame.playerInput = [];
    SchemesGame.round = 0;
    nextRound();
}

// Next round
function nextRound() {
    SchemesGame.round++;
    SchemesGame.playerInput = [];

    // Add new color to pattern
    const randomColor = SchemesGame.colors[Math.floor(Math.random() * SchemesGame.colors.length)];
    SchemesGame.pattern.push(randomColor);

    updateDisplay();

    // Show pattern to player
    setTimeout(() => {
        showPattern();
    }, 1000);
}

// Show pattern to player
async function showPattern() {
    SchemesGame.isShowingPattern = true;
    SchemesGame.isPlayerTurn = false;

    document.getElementById('game-status').textContent = "Watch the pattern!";
    disableAllBalloons();

    for (let i = 0; i < SchemesGame.pattern.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        flashBalloon(SchemesGame.pattern[i]);
        await new Promise(resolve => setTimeout(resolve, 600));
    }

    SchemesGame.isShowingPattern = false;
    SchemesGame.isPlayerTurn = true;
    document.getElementById('game-status').textContent = "Your turn! Repeat the pattern!";
    enableAllBalloons();
}

// Flash balloon
function flashBalloon(color) {
    const balloon = document.querySelector(`.balloon[data-color="${color}"]`);
    if (balloon) {
        balloon.classList.add('flash');
        playSound(SOUNDS.balloonPop);

        setTimeout(() => {
            balloon.classList.remove('flash');
        }, 500);
    }
}

// Handle player click (during game)
function handlePlayerClick(color, balloon) {
    SchemesGame.playerInput.push(color);

    // Visual feedback
    balloon.classList.add('flash');
    playSound(SOUNDS.balloonPop);
    setTimeout(() => {
        balloon.classList.remove('flash');
    }, 300);

    // Check if pattern matches so far
    const currentIndex = SchemesGame.playerInput.length - 1;

    if (SchemesGame.playerInput[currentIndex] !== SchemesGame.pattern[currentIndex]) {
        // Wrong! Reset progress
        gameOver();
        return;
    }

    // Check if pattern complete
    if (SchemesGame.playerInput.length === SchemesGame.pattern.length) {
        // Correct!
        patternComplete();
    }
}

// Handle free click (outside game, for 666 puzzle)
function handleFreeClick(color, balloon) {
    // Visual feedback
    balloon.classList.add('flash');
    playSound(SOUNDS.balloonPop);
    setTimeout(() => {
        balloon.classList.remove('flash');
    }, 300);

    // Track clicks per color for 666 puzzle
    SchemesGame.colorClicks[color]++;
    console.log(`[666 Puzzle] ${color}: ${SchemesGame.colorClicks[color]}/6 clicks`);

    check666Puzzle();
}

// Pattern complete
function patternComplete() {
    SchemesGame.isPlayerTurn = false;
    SchemesGame.score++;

    playSound(SOUNDS.correctChime);
    document.getElementById('game-status').textContent = "Correct! Get ready...";

    updateDisplay();
    saveSchemesProgress();

    // PUZZLE 1: Complete 5 rounds successfully (SURFACE)
    if (!SchemesGame.puzzles.puzzle1Complete && SchemesGame.score >= 5) {
        SchemesGame.puzzles.puzzle1Complete = true;
        setTimeout(() => {
            window.GameApp.revealFragment(1); // Reveals "-47"
        }, 500);
    }

    // Next round
    setTimeout(() => {
        nextRound();
    }, 1500);
}

// Game over - RESET PROGRESS
function gameOver() {
    SchemesGame.isPlayerTurn = false;
    SchemesGame.inGameMode = false;
    playSound(SOUNDS.wrongBuzzer);

    document.getElementById('game-status').textContent = `Wrong! You reached round ${SchemesGame.round}. Your progress has been reset.`;

    // RESET SCORE - this is the key fix!
    SchemesGame.score = 0;
    SchemesGame.round = 0;
    SchemesGame.pattern = [];
    SchemesGame.playerInput = [];

    updateDisplay();
    saveSchemesProgress();

    // Reset button
    setTimeout(() => {
        document.getElementById('game-status').textContent = "Click 'Start Game' to try again!";
    }, 2000);
}

// Check 666 puzzle (each color clicked 6 times)
function check666Puzzle() {
    if (SchemesGame.puzzles.puzzle2Complete) return;

    // Check if ALL three colors have been clicked exactly 6 times each
    const red = SchemesGame.colorClicks.red;
    const blue = SchemesGame.colorClicks.blue;
    const yellow = SchemesGame.colorClicks.yellow;

    console.log(`[666 Puzzle] Progress: Red=${red}/6, Blue=${blue}/6, Yellow=${yellow}/6`);

    if (red >= 6 && blue >= 6 && yellow >= 6) {
        SchemesGame.puzzles.puzzle2Complete = true;
        window.GameApp.revealFragment(2); // Reveals "J"
        window.GameApp.showNotification('🔥 THE DEVIL\'S SIGNATURE DECODED! 🔥');

        // Visual effect
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 1000);

        // Reset counter
        SchemesGame.colorClicks = { red: 0, blue: 0, yellow: 0 };
        saveSchemesProgress();
    }
}

// Utility functions
function disableAllBalloons() {
    document.querySelectorAll('.balloon').forEach(b => {
        b.style.pointerEvents = 'none';
        b.style.opacity = '0.5';
    });
}

function enableAllBalloons() {
    document.querySelectorAll('.balloon').forEach(b => {
        b.style.pointerEvents = 'auto';
        b.style.opacity = '1';
    });
}

function updateDisplay() {
    const statusEl = document.getElementById('game-status');
    const roundEl = document.getElementById('balloon-round');
    const scoreEl = document.getElementById('balloon-score');

    if (statusEl && SchemesGame.round === 0 && !SchemesGame.inGameMode) {
        statusEl.textContent = "Click 'Start Game' to begin! (Or click balloons freely...)";
    }
    if (roundEl) roundEl.textContent = SchemesGame.round;
    if (scoreEl) scoreEl.textContent = SchemesGame.score;
}

function playSound(audio) {
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

function saveSchemesProgress() {
    localStorage.setItem('schemesProgress', JSON.stringify({
        score: SchemesGame.score,
        round: SchemesGame.round,
        puzzles: SchemesGame.puzzles
    }));
}

// Export for debugging
window.SchemesGame = SchemesGame;
