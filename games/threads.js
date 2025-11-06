// THE THREADS - Fortune Wheel Game

const ThreadsGame = {
    spinCount: 0,
    spinning: false,
    currentRotation: 0,
    spinHistory: [],
    puzzles: {
        puzzle1Complete: false,
        puzzle2Complete: false,
        puzzle3Complete: false
    },
    fortunes: [
        'YOU WIN',
        'TRUST IN SEVEN',
        'A SECRET THREAD',
        'BACKWARDS REVEALS ALL',
        'THE FOOL WAITS',
        'WHAT RETURNS',
        'NIW UOY', // You Win backwards
        'THIRTEEN IS LUCKY'
    ],
    colors: ['#ff00ff', '#00ffff', '#ffff00', '#ff3366', '#00ff88', '#ff8800', '#8800ff', '#ff0088']
};

let canvas, ctx;

// Initialize Threads Game
document.addEventListener('DOMContentLoaded', () => {
    initThreadsGame();
});

function initThreadsGame() {
    canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');

    // Load saved progress
    const saved = localStorage.getItem('threadsProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        ThreadsGame.spinCount = progress.spinCount || 0;
        ThreadsGame.puzzles = progress.puzzles || ThreadsGame.puzzles;
        ThreadsGame.spinHistory = progress.spinHistory || [];
        document.getElementById('spin-count').textContent = ThreadsGame.spinCount;
    }

    // Draw initial wheel
    drawWheel();

    // Spin button
    document.getElementById('spin-btn').addEventListener('click', spinWheel);

    // Command prompt setup
    setupCommandPrompt();

    // Check for Lucky Seven hint
    if (ThreadsGame.spinHistory.includes('TRUST IN SEVEN') && !window.GameApp.hasFragment(4)) {
        showLuckySevenHint();
    }

    // Check for thread hint
    if ((ThreadsGame.spinHistory.includes('A SECRET THREAD') || ThreadsGame.spinHistory.includes('BACKWARDS REVEALS ALL')) && !window.GameApp.hasFragment(5)) {
        showThreadHint();
    }
}

// Draw the fortune wheel
function drawWheel(rotation = 0) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;
    const numSegments = ThreadsGame.fortunes.length;
    const anglePerSegment = (Math.PI * 2) / numSegments;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    for (let i = 0; i < numSegments; i++) {
        const startAngle = (i * anglePerSegment) + rotation;
        const endAngle = ((i + 1) * anglePerSegment) + rotation;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = ThreadsGame.colors[i];
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Courier New';

        // Split text if too long
        const text = ThreadsGame.fortunes[i];
        const words = text.split(' ');
        if (words.length > 2) {
            ctx.fillText(words.slice(0, 2).join(' '), radius * 0.65, -8);
            ctx.fillText(words.slice(2).join(' '), radius * 0.65, 8);
        } else {
            ctx.fillText(text, radius * 0.65, 0);
        }

        ctx.restore();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#000033';
    ctx.fill();
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw pointer at top
    ctx.beginPath();
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX - 15, 50);
    ctx.lineTo(centerX + 15, 50);
    ctx.closePath();
    ctx.fillStyle = '#ff0000';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Spin the wheel
function spinWheel() {
    if (ThreadsGame.spinning) return;

    ThreadsGame.spinning = true;
    ThreadsGame.spinCount++;
    document.getElementById('spin-count').textContent = ThreadsGame.spinCount;

    // Random spin amount (multiple rotations + random position)
    const baseSpins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = baseSpins * Math.PI * 2 + (Math.random() * Math.PI * 2);

    animateSpin(finalRotation);
    saveThreadsProgress();
}

// Animate wheel spin
function animateSpin(targetRotation) {
    const duration = 3000; // 3 seconds
    const startTime = Date.now();
    const startRotation = ThreadsGame.currentRotation;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        ThreadsGame.currentRotation = startRotation + (targetRotation * easeProgress);
        drawWheel(ThreadsGame.currentRotation);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Spin complete
            ThreadsGame.spinning = false;
            const landedFortune = getLandedFortune();
            ThreadsGame.spinHistory.push(landedFortune);
            handleFortuneResult(landedFortune);
        }
    }

    requestAnimationFrame(animate);
}

// Get which fortune the pointer landed on
function getLandedFortune() {
    const numSegments = ThreadsGame.fortunes.length;
    const anglePerSegment = (Math.PI * 2) / numSegments;

    // Normalize rotation to 0-2π
    const normalizedRotation = ThreadsGame.currentRotation % (Math.PI * 2);

    // Pointer is at top (0 degrees), so we need to find which segment is there
    // We need to account for the rotation direction
    const adjustedRotation = (Math.PI * 2 - normalizedRotation) % (Math.PI * 2);
    const segmentIndex = Math.floor(adjustedRotation / anglePerSegment);

    return ThreadsGame.fortunes[segmentIndex];
}

// Handle fortune result
function handleFortuneResult(fortune) {
    window.GameApp.showNotification(`🎡 Fortune: ${fortune}`);

    // PUZZLE 1: Land on "YOU WIN" (SURFACE)
    if (!ThreadsGame.puzzles.puzzle1Complete && fortune === 'YOU WIN') {
        ThreadsGame.puzzles.puzzle1Complete = true;
        setTimeout(() => {
            window.GameApp.revealFragment(3); // Reveals ".3921"
        }, 500);
    }

    // Show hints based on fortunes
    if (fortune === 'TRUST IN SEVEN' && !window.GameApp.hasFragment(4)) {
        showLuckySevenHint();
    }

    if ((fortune === 'A SECRET THREAD' || fortune === 'BACKWARDS REVEALS ALL') && !window.GameApp.hasFragment(5)) {
        showThreadHint();
    }

    // PUZZLE 2: Spin exactly 7 times then stop (HIDDEN)
    if (!ThreadsGame.puzzles.puzzle2Complete && ThreadsGame.spinCount === 7) {
        // Check if they wait without spinning again
        setTimeout(() => {
            if (ThreadsGame.spinCount === 7) {
                ThreadsGame.puzzles.puzzle2Complete = true;
                window.GameApp.revealFragment(4); // Reveals "3"
                window.GameApp.showNotification('SEVEN IS THE LUCKY NUMBER!');
            }
        }, 5000); // Wait 5 seconds to confirm they stopped
    }

    saveThreadsProgress();
}

// Show Lucky Seven hint
function showLuckySevenHint() {
    const hintBox = document.getElementById('hint-threads-2');
    hintBox.innerHTML = `
        <strong>🍀 Hidden Hint:</strong> Seven spins and then no more,
        The fool's lucky number opens a door.
        Don't spin eight, don't spin six,
        Seven is the number that does the trick!
        <br><br>
        <em style="color: var(--accent-yellow);">Spins so far: ${ThreadsGame.spinCount}</em>
    `;
    hintBox.classList.add('visible');
}

// Show thread hint
function showThreadHint() {
    const hintBox = document.getElementById('hint-threads-3');
    hintBox.innerHTML = `
        <strong>🧵 Hidden Hint:</strong> A thread dangles from the wheel's edge,
        Pull it to find the hidden wedge.
        Commands can reverse what fate has spun,
        Type the right words, and backward it'll run!
        <br><br>
        <em style="color: var(--accent-cyan);">Look carefully at the bottom-right of the wheel...</em>
    `;
    hintBox.classList.add('visible');

    // Show the red thread
    document.getElementById('wheel-thread').classList.remove('hidden');

    // Thread click handler
    document.getElementById('wheel-thread').addEventListener('click', () => {
        window.GameApp.showNotification('A command prompt appears...');
        document.getElementById('command-prompt').classList.remove('hidden');
        document.getElementById('cmd-input').focus();
    }, {once: true});
}

// Setup command prompt
function setupCommandPrompt() {
    const input = document.getElementById('cmd-input');
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const cmd = input.value.toLowerCase().trim();
            handleCommand(cmd);
            input.value = '';
        }
    });
}

// Handle command input
function handleCommand(cmd) {
    if (cmd === '/reverse' || cmd === 'reverse') {
        if (!ThreadsGame.puzzles.puzzle3Complete) {
            ThreadsGame.puzzles.puzzle3Complete = true;

            // Spin backwards to "NIW UOY"
            window.GameApp.showNotification('The wheel spins in reverse...');

            // Find NIW UOY index
            const targetIndex = ThreadsGame.fortunes.indexOf('NIW UOY');
            const anglePerSegment = (Math.PI * 2) / ThreadsGame.fortunes.length;
            const targetRotation = ThreadsGame.currentRotation - (Math.PI * 4) - (targetIndex * anglePerSegment);

            animateReverseSpin(targetRotation);
        }
    } else if (cmd === '/help' || cmd === 'help') {
        window.GameApp.showNotification('Available commands: /reverse');
    } else {
        window.GameApp.showNotification('Unknown command. Try /help');
    }
}

// Animate reverse spin
function animateReverseSpin(targetRotation) {
    ThreadsGame.spinning = true;
    const duration = 2000;
    const startTime = Date.now();
    const startRotation = ThreadsGame.currentRotation;

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        ThreadsGame.currentRotation = startRotation + ((targetRotation - startRotation) * easeProgress);
        drawWheel(ThreadsGame.currentRotation);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            ThreadsGame.spinning = false;
            window.GameApp.showNotification('🎡 Fortune: NIW UOY (backwards!)');
            setTimeout(() => {
                window.GameApp.revealFragment(5); // Reveals "S"
            }, 500);
        }
    }

    requestAnimationFrame(animate);
}

// Save progress
function saveThreadsProgress() {
    localStorage.setItem('threadsProgress', JSON.stringify({
        spinCount: ThreadsGame.spinCount,
        puzzles: ThreadsGame.puzzles,
        spinHistory: ThreadsGame.spinHistory
    }));
}

// Export for debugging
window.ThreadsGame = ThreadsGame;
