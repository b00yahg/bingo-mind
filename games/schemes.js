// THE SCHEMES - Balloon Pop Game

const SchemesGame = {
    popCount: 0,
    colors: ['red', 'blue', 'yellow'],
    devilSequence: [],
    devilTimer: null,
    puzzles: {
        puzzle1Complete: false,
        puzzle2Complete: false
    }
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
        SchemesGame.popCount = progress.popCount || 0;
        SchemesGame.puzzles = progress.puzzles || SchemesGame.puzzles;
        document.getElementById('pop-count').textContent = SchemesGame.popCount;
    }

    // Generate initial balloons
    generateBalloons();

    // Check if Fragment #1 was collected to show hint #2
    if (window.GameApp && window.GameApp.hasFragment(1) && !window.GameApp.hasFragment(2)) {
        showDevilHint();
    }
}

// Generate balloon grid
function generateBalloons() {
    const grid = document.getElementById('balloon-grid');
    grid.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const color = SchemesGame.colors[Math.floor(Math.random() * 3)];
        const balloon = createBalloon(color, i);
        grid.appendChild(balloon);
    }
}

// Create individual balloon
function createBalloon(color, index) {
    const balloon = document.createElement('div');
    balloon.className = `balloon ${color}`;
    balloon.textContent = '🎈';
    balloon.style.animationDelay = `${index * 0.1}s`;

    balloon.addEventListener('click', () => {
        popBalloon(balloon, color);
    });

    return balloon;
}

// Pop balloon action
function popBalloon(balloon, color) {
    if (balloon.classList.contains('popping')) return;

    // Animation
    balloon.classList.add('popping');

    // Update count
    SchemesGame.popCount++;
    document.getElementById('pop-count').textContent = SchemesGame.popCount;

    // Track for devil sequence (puzzle 2)
    SchemesGame.devilSequence.push({
        time: Date.now(),
        count: SchemesGame.popCount
    });

    // Respawn balloon after pop
    setTimeout(() => {
        const newColor = SchemesGame.colors[Math.floor(Math.random() * 3)];
        balloon.className = `balloon ${newColor}`;
        balloon.style.animationDelay = '0s';
    }, 300);

    // Check puzzles
    checkSchemesPuzzles();

    // Save progress
    saveSchemesProgress();
}

// Check puzzle conditions
function checkSchemesPuzzles() {
    // PUZZLE 1: Pop 10 balloons (SURFACE)
    if (!SchemesGame.puzzles.puzzle1Complete && SchemesGame.popCount >= 10) {
        SchemesGame.puzzles.puzzle1Complete = true;
        setTimeout(() => {
            window.GameApp.revealFragment(1); // Reveals "-47"
            showDevilHint();
        }, 500);
    }

    // PUZZLE 2: The Devil's Signature - 6-6-6 pattern (HIDDEN)
    if (!SchemesGame.puzzles.puzzle2Complete && window.GameApp.hasFragment(1)) {
        checkDevilSequence();
    }
}

// Check for 6-6-6 pattern
function checkDevilSequence() {
    // Clean old entries (older than 30 seconds)
    const now = Date.now();
    SchemesGame.devilSequence = SchemesGame.devilSequence.filter(
        entry => now - entry.time < 30000
    );

    // Look for pattern: pop 6, wait ~6 seconds, pop 6 more
    if (SchemesGame.devilSequence.length >= 12) {
        const recent = SchemesGame.devilSequence.slice(-12);

        // Check if there's a ~6 second gap between 6th and 7th pop
        const firstSix = recent.slice(0, 6);
        const secondSix = recent.slice(6, 12);

        const gapTime = secondSix[0].time - firstSix[5].time;

        // Gap should be between 5-7 seconds (5000-7000ms)
        if (gapTime >= 5000 && gapTime <= 7000) {
            SchemesGame.puzzles.puzzle2Complete = true;
            window.GameApp.revealFragment(2); // Reveals "J"
            window.GameApp.showNotification('THE DEVIL\'S SIGNATURE DECODED!');
        }
    }
}

// Show devil hint after Fragment #1
function showDevilHint() {
    const hintBox = document.getElementById('hint-schemes-2');
    hintBox.innerHTML = `
        <strong>😈 Hidden Hint:</strong> The devil's number marks his work... Six-six-six in the score that lurks.
        But hundreds are too many, I agree, Try his signature another way you see.
        When balloons match the beast in count, His first mark appears from your account.
        <br><br>
        <em style="color: var(--accent-yellow);">💡 Tip: Pop 6 balloons, wait 6 seconds, then pop 6 more...</em>
    `;
    hintBox.classList.add('visible');

    // Make high score pulse more
    document.getElementById('high-score').parentElement.style.animation = 'pulse-glow 1s ease-in-out infinite';
}

// Save progress
function saveSchemesProgress() {
    localStorage.setItem('schemesProgress', JSON.stringify({
        popCount: SchemesGame.popCount,
        puzzles: SchemesGame.puzzles
    }));
}

// Export for debugging
window.SchemesGame = SchemesGame;
