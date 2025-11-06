// THE MASKS - Shell Game (Properly Implemented)

const MasksGame = {
    wins: 0,
    losses: 0,
    consecutiveLosses: 0,
    correctShell: null,
    gameActive: false,
    isShuffling: false,
    devilLaughing: false,
    knifeActive: false,
    puzzles: {
        puzzle1Complete: false,
        puzzle2Complete: false,
        puzzle3Complete: false
    }
};

const SHELL_SOUNDS = {
    shuffle: new Audio('assets/sounds/shuffle.mp3'),
    win: new Audio('assets/sounds/win.mp3'),
    lose: new Audio('assets/sounds/lose.mp3'),
    devilLaugh: new Audio('assets/sounds/devil_laugh.mp3'),
    stab: new Audio('assets/sounds/stab.mp3')
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
    const startBtn = document.getElementById('start-shell-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startShellGame);
    }

    // Angel click handler
    const angel = document.getElementById('angel');
    if (angel) {
        angel.addEventListener('click', showAngelMessage);
    }

    // Knife click handler
    const knife = document.getElementById('knife');
    if (knife) {
        knife.addEventListener('click', activateKnife);
    }

    // Setup shell images
    setupShellImages();
}

// Setup shell images
function setupShellImages() {
    document.querySelectorAll('.shell').forEach(shell => {
        const shellBody = shell.querySelector('.shell-body');
        if (shellBody && !shellBody.querySelector('img')) {
            const img = document.createElement('img');
            img.src = 'assets/images/shells/shell_closed.png';
            img.alt = 'Shell';
            img.className = 'shell-img';
            img.onerror = () => {
                // Fallback styling if image doesn't load
                shellBody.style.background = 'linear-gradient(135deg, #D2691E 0%, #CD853F 100%)';
            };
            shellBody.appendChild(img);
        }
    });
}

// Update display
function updateMasksDisplay() {
    const winCount = document.getElementById('win-count');
    const lossCount = document.getElementById('loss-count');
    if (winCount) winCount.textContent = `${MasksGame.wins}/3`;
    if (lossCount) lossCount.textContent = MasksGame.losses;
}

// Start shell game
function startShellGame() {
    if (MasksGame.gameActive || MasksGame.isShuffling) return;

    // Reset shells
    document.querySelectorAll('.shell').forEach(shell => {
        shell.classList.remove('correct', 'wrong', 'disabled', 'has-ball', 'lifted');
        shell.style.pointerEvents = 'none';
    });

    // Pick random shell for the ball
    MasksGame.correctShell = Math.floor(Math.random() * 3);

    // Show the ball briefly under correct shell
    showBallBriefly();
}

// Show ball briefly before shuffle
function showBallBriefly() {
    const shells = document.querySelectorAll('.shell');
    const correctShell = shells[MasksGame.correctShell];

    // Lift shell to show ball
    correctShell.classList.add('lifted');
    correctShell.classList.add('has-ball');

    window.GameApp.showNotification('Remember which shell has the ball!');

    // Wait 2 seconds then shuffle
    setTimeout(() => {
        correctShell.classList.remove('lifted');
        shuffleShells();
    }, 2000);
}

// Shuffle shells animation
async function shuffleShells() {
    MasksGame.isShuffling = true;
    MasksGame.gameActive = false;

    const devil = document.getElementById('devil');
    if (devil) devil.style.animation = 'devil-shuffle 2s ease-in-out';

    playSound(SHELL_SOUNDS.shuffle);
    window.GameApp.showNotification('The devil shuffles...');

    const shells = document.querySelectorAll('.shell');

    // Perform shuffle animation
    for (let i = 0; i < 5; i++) {
        const shell1 = Math.floor(Math.random() * 3);
        const shell2 = Math.floor(Math.random() * 3);

        if (shell1 !== shell2) {
            // Animate shell swap
            await swapShells(shells[shell1], shells[shell2], shell1, shell2);
        }

        await new Promise(resolve => setTimeout(resolve, 400));
    }

    if (devil) devil.style.animation = '';

    MasksGame.isShuffling = false;
    MasksGame.gameActive = true;

    // Enable shell selection
    shells.forEach((shell, index) => {
        shell.style.pointerEvents = 'auto';
        shell.addEventListener('click', () => selectShell(index), {once: true});
    });

    window.GameApp.showNotification('Pick a shell!');
}

// Swap two shells with animation
async function swapShells(shell1, shell2, index1, index2) {
    const rect1 = shell1.getBoundingClientRect();
    const rect2 = shell2.getBoundingClientRect();

    const deltaX = rect2.left - rect1.left;

    // Animate
    shell1.style.transition = 'transform 0.4s';
    shell2.style.transition = 'transform 0.4s';

    shell1.style.transform = `translateX(${deltaX}px)`;
    shell2.style.transform = `translateX(${-deltaX}px)`;

    await new Promise(resolve => setTimeout(resolve, 400));

    // Swap in array (track which shell has ball)
    if (MasksGame.correctShell === index1) {
        MasksGame.correctShell = index2;
    } else if (MasksGame.correctShell === index2) {
        MasksGame.correctShell = index1;
    }

    // Reset transform
    shell1.style.transition = 'none';
    shell2.style.transition = 'none';
    shell1.style.transform = '';
    shell2.style.transform = '';
}

// Select a shell
function selectShell(index) {
    if (!MasksGame.gameActive) return;

    MasksGame.gameActive = false;

    const shells = document.querySelectorAll('.shell');
    const selectedShell = shells[index];
    const correctShell = shells[MasksGame.correctShell];

    // Disable all shells
    shells.forEach(s => s.style.pointerEvents = 'none');

    // Lift selected shell
    selectedShell.classList.add('lifted');

    setTimeout(() => {
        if (index === MasksGame.correctShell) {
            // Correct choice - WIN
            selectedShell.classList.add('correct', 'has-ball');
            MasksGame.wins++;
            MasksGame.consecutiveLosses = 0;

            playSound(SHELL_SOUNDS.win);
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
            correctShell.classList.add('lifted', 'has-ball');

            MasksGame.losses++;
            MasksGame.consecutiveLosses++;

            playSound(SHELL_SOUNDS.lose);
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

        // Reset button text
        setTimeout(() => {
            const startBtn = document.getElementById('start-shell-btn');
            if (startBtn) startBtn.textContent = 'PLAY AGAIN';

            // Reset shells after a moment
            setTimeout(() => {
                shells.forEach(s => {
                    s.classList.remove('lifted', 'correct', 'wrong', 'has-ball');
                });
            }, 2000);
        }, 2000);
    }, 800);
}

// Start devil laughing
function startDevilLaugh() {
    MasksGame.devilLaughing = true;
    const devil = document.getElementById('devil');
    if (devil) {
        devil.classList.add('laughing');
        // Update devil image
        const devilImg = devil.querySelector('img');
        if (devilImg) {
            devilImg.src = 'assets/images/characters/devil_laughing.gif';
        }
    }

    playSound(SHELL_SOUNDS.devilLaugh);

    // Show knife and hint
    const knife = document.getElementById('knife');
    if (knife) {
        knife.classList.remove('hidden');
        knife.classList.add('available');
    }

    showKnifeHint();
    saveMasksProgress();
}

// Show angel message
function showAngelMessage() {
    const hintBox = document.getElementById('hint-masks-2');
    hintBox.innerHTML = `
        <strong>👼 Angel's Wisdom:</strong> "For every win, his pride does grow,
        But everyone laughs when fools fall low.
        Three failures in a row will make the confident blind,
        A truth emerges from his twisted mind."
        <br><br>
        <em style="color: var(--accent-cyan);">💡 Try losing on purpose three times in a row...</em>
    `;
    hintBox.classList.add('visible');
}

// Show knife hint
function showKnifeHint() {
    const hintBox = document.getElementById('hint-masks-3');
    hintBox.innerHTML = `
        <strong>🔪 The Final Strike:</strong> The devil's guard is down while he laughs.
        Click the knife, then strike him down to reveal the final memory fragment!
        <br><br>
        <em style="color: #ff3366;">The knife awaits your command...</em>
    `;
    hintBox.classList.add('visible');
}

// Activate knife
function activateKnife() {
    if (MasksGame.knifeActive || !MasksGame.devilLaughing) return;

    MasksGame.knifeActive = true;
    document.body.style.cursor = `url('assets/images/weapons/knife_cursor.png'), crosshair`;

    window.GameApp.showNotification('Knife equipped! Strike the devil!');

    // Devil becomes targetable
    const devil = document.getElementById('devil');
    if (devil) {
        devil.style.cursor = 'crosshair';
        devil.addEventListener('click', stabDevil, {once: true});
    }
}

// Stab the devil
function stabDevil() {
    if (!MasksGame.puzzles.puzzle3Complete) {
        MasksGame.puzzles.puzzle3Complete = true;

        const devil = document.getElementById('devil');
        if (devil) {
            devil.classList.remove('laughing');
            devil.classList.add('stabbed');

            // Change devil image to stabbed version
            const devilImg = devil.querySelector('img');
            if (devilImg) {
                devilImg.src = 'assets/images/characters/devil_stabbed.png';
            }
        }

        document.body.style.cursor = 'default';

        playSound(SHELL_SOUNDS.stab);
        window.GameApp.showNotification('💀 The deceiver falls!');

        setTimeout(() => {
            window.GameApp.revealFragment(8); // Reveals "DmPln-2387" (FINAL FRAGMENT)
            window.GameApp.showNotification('🎉 ALL FRAGMENTS RECOVERED!');
        }, 1500);

        saveMasksProgress();
    }
}

// Utility functions
function playSound(audio) {
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

function saveMasksProgress() {
    localStorage.setItem('masksProgress', JSON.stringify({
        wins: MasksGame.wins,
        losses: MasksGame.losses,
        consecutiveLosses: MasksGame.consecutiveLosses,
        puzzles: MasksGame.puzzles,
        devilLaughing: MasksGame.devilLaughing
    }));
}

// Export for debugging
window.MasksGame = MasksGame;
