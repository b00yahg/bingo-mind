// THE MASKS - Shell Game

const MasksGame = {
    wins: 0,
    losses: 0,
    consecutiveLosses: 0,
    correctShell: null,
    gameActive: false,
    devilLaughing: false,
    knifeActive: false,
    puzzles: {
        puzzle1Complete: false,
        puzzle2Complete: false,
        puzzle3Complete: false
    }
};

// Initialize Masks Game
document.addEventListener('DOMContentLoaded', () => {
    initMasksGame();
});

function initMasksGame() {
    // Load saved progress
    const saved = localStorage.getItem('masksProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        MasksGame.wins = progress.wins || 0;
        MasksGame.losses = progress.losses || 0;
        MasksGame.consecutiveLosses = progress.consecutiveLosses || 0;
        MasksGame.puzzles = progress.puzzles || MasksGame.puzzles;
        MasksGame.devilLaughing = progress.devilLaughing || false;

        updateMasksDisplay();

        if (MasksGame.devilLaughing) {
            startDevilLaugh();
        }
    }

    // Start game button
    document.getElementById('start-shell-btn').addEventListener('click', startShellGame);

    // Angel click handler
    document.getElementById('angel').addEventListener('click', showAngelMessage);

    // Knife click handler
    document.getElementById('knife').addEventListener('click', activateKnife);
}

// Update display
function updateMasksDisplay() {
    document.getElementById('win-count').textContent = `${MasksGame.wins}/3`;
    document.getElementById('loss-count').textContent = MasksGame.losses;
}

// Start shell game
function startShellGame() {
    if (MasksGame.gameActive) return;

    MasksGame.gameActive = true;
    MasksGame.correctShell = Math.floor(Math.random() * 3);

    // Hide all shell indicators
    document.querySelectorAll('.shell').forEach(shell => {
        shell.classList.remove('correct', 'wrong', 'disabled');
    });

    // Shuffle animation
    shuffleShells();

    // Enable shell selection after shuffle
    setTimeout(() => {
        document.querySelectorAll('.shell').forEach((shell, index) => {
            shell.addEventListener('click', () => selectShell(index), {once: true});
        });
    }, 2000);
}

// Shuffle shells animation
function shuffleShells() {
    const devil = document.getElementById('devil');
    devil.style.animation = 'devil-shuffle 2s ease-in-out';

    window.GameApp.showNotification('The devil shuffles...');

    setTimeout(() => {
        devil.style.animation = '';
    }, 2000);
}

// Select a shell
function selectShell(index) {
    if (!MasksGame.gameActive) return;

    MasksGame.gameActive = false;

    const shells = document.querySelectorAll('.shell');
    const selectedShell = shells[index];

    if (index === MasksGame.correctShell) {
        // Correct choice - WIN
        selectedShell.classList.add('correct');
        MasksGame.wins++;
        MasksGame.consecutiveLosses = 0;

        window.GameApp.showNotification('🎉 You found the truth!');

        // PUZZLE 1: Win 3 times (SURFACE)
        if (!MasksGame.puzzles.puzzle1Complete && MasksGame.wins >= 3) {
            MasksGame.puzzles.puzzle1Complete = true;
            setTimeout(() => {
                window.GameApp.revealFragment(6); // Reveals "178.9012"
            }, 1000);
        }
    } else {
        // Wrong choice - LOSS
        selectedShell.classList.add('wrong');
        shells[MasksGame.correctShell].classList.add('correct');
        MasksGame.losses++;
        MasksGame.consecutiveLosses++;

        window.GameApp.showNotification('❌ The devil deceived you!');

        // PUZZLE 2: Lose 3 times in a row (HIDDEN)
        if (!MasksGame.puzzles.puzzle2Complete && MasksGame.consecutiveLosses >= 3) {
            MasksGame.puzzles.puzzle2Complete = true;
            setTimeout(() => {
                startDevilLaugh();
                window.GameApp.revealFragment(7); // Reveals "T"
                window.GameApp.showNotification('The devil laughs at your failures!');
            }, 1000);
        }
    }

    updateMasksDisplay();
    saveMasksProgress();

    // Reset button
    setTimeout(() => {
        document.getElementById('start-shell-btn').textContent = 'PLAY AGAIN';
    }, 2000);
}

// Start devil laughing
function startDevilLaugh() {
    MasksGame.devilLaughing = true;
    const devil = document.getElementById('devil');
    devil.classList.add('laughing');

    // Show knife and hint
    document.getElementById('knife').classList.remove('hidden');
    document.getElementById('knife').classList.add('available');

    showKnifeHint();
    saveMasksProgress();
}

// Show angel message
function showAngelMessage() {
    const hintBox = document.getElementById('hint-masks-2');
    hintBox.innerHTML = `
        <strong>👼 Angel's Wisdom:</strong> "For every win, his pride does grow,
        But everyone laughs when fools fall low.
        Slip on the peel once, twice, then thrice,
        And watch the devil's guard suffice.
        Three failures make the confident blind,
        A truth emerges from his twisted mind."
        <br><br>
        <em style="color: var(--accent-cyan);">💡 Tip: Sometimes losing reveals more than winning...</em>
    `;
    hintBox.classList.add('visible');
}

// Show knife hint
function showKnifeHint() {
    const hintBox = document.getElementById('hint-masks-3');
    hintBox.innerHTML = `
        <strong>🔪 Hidden Hint:</strong> "His laughter blinds him to the blade,
        Click the tool his cruelty made.
        Then strike the one who hides the truth,
        Pierce his game, reclaim your youth!"
        <br><br>
        <em style="color: var(--accent-red);">The knife glows with opportunity...</em>
    `;
    hintBox.classList.add('visible');
}

// Activate knife
function activateKnife() {
    if (MasksGame.knifeActive || !MasksGame.devilLaughing) return;

    MasksGame.knifeActive = true;
    document.body.style.cursor = 'crosshair';

    window.GameApp.showNotification('Knife equipped! Strike the devil!');

    // Devil becomes targetable
    const devil = document.getElementById('devil');
    devil.style.cursor = 'crosshair';

    devil.addEventListener('click', stabDevil, {once: true});
}

// Stab the devil
function stabDevil() {
    if (!MasksGame.puzzles.puzzle3Complete) {
        MasksGame.puzzles.puzzle3Complete = true;

        const devil = document.getElementById('devil');
        devil.classList.remove('laughing');
        devil.classList.add('stabbed');
        devil.textContent = '😵';

        document.body.style.cursor = 'default';

        window.GameApp.showNotification('💀 The deceiver falls!');

        setTimeout(() => {
            window.GameApp.revealFragment(8); // Reveals "DmPln-2387" (FINAL FRAGMENT)
            window.GameApp.showNotification('🎉 ALL FRAGMENTS RECOVERED!');
        }, 1500);

        saveMasksProgress();
    }
}

// Save progress
function saveMasksProgress() {
    localStorage.setItem('masksProgress', JSON.stringify({
        wins: MasksGame.wins,
        losses: MasksGame.losses,
        consecutiveLosses: MasksGame.consecutiveLosses,
        puzzles: MasksGame.puzzles,
        devilLaughing: MasksGame.devilLaughing
    }));
}

// Add shuffle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes devil-shuffle {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-30px); }
        50% { transform: translateX(30px); }
        75% { transform: translateX(-15px); }
    }
`;
document.head.appendChild(style);

// Export for debugging
window.MasksGame = MasksGame;
