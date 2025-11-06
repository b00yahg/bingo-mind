// THE THREADS - Fortune Wheel Game (Fixed)

const ThreadsGame = {
    spinCount: 0,
    spinning: false,
    currentRotation: 0,
    spinHistory: [],
    lastLandedFortune: null,
    threadDiscovered: false,
    puzzles: {
        puzzle1Complete: false,
        puzzle2Complete: false,
        puzzle3Complete: false
    },
    fortunes: [
        { text: 'YOU WIN', color: '#ff00ff', hint: 'surface' },
        { text: 'SEVEN IS LUCKY', color: '#00ffff', hint: 'hidden' },
        { text: 'A SECRET THREAD', color: '#ffff00', hint: 'thread' },
        { text: 'BACKWARDS REVEALS ALL', color: '#ff3366', hint: 'thread' },
        { text: 'THE FOOL WAITS', color: '#00ff88', hint: 'lore' },
        { text: 'WHAT RETURNS', color: '#ff8800', hint: 'lore' },
        { text: 'NIW UOY', color: '#8800ff', hint: 'reverse' },  // "You Win" backwards
        { text: 'THIRTEEN IS LUCKY', color: '#ff0088', hint: 'red-herring' }
    ]
};

const WHEEL_SOUNDS = {
    spin: new Audio('assets/sounds/wheel_spin.mp3'),
    stop: new Audio('assets/sounds/wheel_stop.mp3'),
    fragment: new Audio('assets/sounds/fragment_get.mp3')
};

let canvas, ctx;
let wheelInitialized = false;

// Initialize Threads Game - ONLY call this when entering the game screen!
function initThreadsGame() {
    if (wheelInitialized) {
        console.log('Wheel already initialized, just redrawing...');
        drawWheel(ThreadsGame.currentRotation);
        return;
    }

    console.log('🎡 Initializing wheel for the first time...');

    canvas = document.getElementById('wheel-canvas');
    if (!canvas) {
        console.error('❌ Canvas element not found!');
        return;
    }

    console.log('✓ Canvas element found:', canvas.width, 'x', canvas.height);

    ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('❌ Could not get 2d context!');
        return;
    }

    console.log('✓ Canvas context created');

    // Update spin count display
    const spinCountEl = document.getElementById('spin-count');
    if (spinCountEl) {
        spinCountEl.textContent = ThreadsGame.spinCount;
        console.log('✓ Spin count display updated:', ThreadsGame.spinCount);
    }

    // Draw initial wheel
    console.log('🎨 Drawing wheel...');
    drawWheel(0);
    console.log('✓ Wheel drawn!');

    // Spin button - remove old handlers first to avoid duplicates
    const spinBtn = document.getElementById('spin-btn');
    if (spinBtn) {
        const newSpinBtn = spinBtn.cloneNode(true);
        spinBtn.parentNode.replaceChild(newSpinBtn, spinBtn);
        newSpinBtn.addEventListener('click', spinWheel);
        console.log('✓ Spin button handler attached');
    }

    // Command prompt setup
    setupCommandPrompt();

    wheelInitialized = true;
    console.log('✓✓✓ Wheel initialization complete!');
}

// Draw the fortune wheel (with text on segments)
function drawWheel(rotation = 0) {
    if (!canvas || !ctx) {
        console.error('Canvas or context not available in drawWheel!');
        return;
    }

    console.log('drawWheel executing with rotation:', rotation);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;
    const numSegments = ThreadsGame.fortunes.length;
    const anglePerSegment = (Math.PI * 2) / numSegments;

    console.log('Drawing wheel - center:', centerX, centerY, 'radius:', radius);

    // Clear canvas with a visible background first (for testing)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill background to prove canvas is working
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    for (let i = 0; i < numSegments; i++) {
        const startAngle = (i * anglePerSegment) + rotation - (Math.PI / 2); // Start at top
        const endAngle = ((i + 1) * anglePerSegment) + rotation - (Math.PI / 2);

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = ThreadsGame.fortunes[i].color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw fortune text on each segment
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 4;

        // Split text into multiple lines if needed
        const text = ThreadsGame.fortunes[i].text;
        const words = text.split(' ');
        if (words.length > 2) {
            ctx.fillText(words.slice(0, 2).join(' '), radius * 0.65, -8);
            ctx.fillText(words.slice(2).join(' '), radius * 0.65, 8);
        } else if (words.length === 2) {
            ctx.fillText(words[0], radius * 0.65, -6);
            ctx.fillText(words[1], radius * 0.65, 6);
        } else {
            ctx.fillText(text, radius * 0.65, 0);
        }

        ctx.restore();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw "FATE" text in center
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 5;
    ctx.fillText('FATE', centerX, centerY);

    // Draw pointer at top
    ctx.beginPath();
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX - 20, 60);
    ctx.lineTo(centerX + 20, 60);
    ctx.closePath();
    ctx.fillStyle = '#ff0000';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();

    console.log('✓ Wheel drawing complete');
}

// Spin the wheel
function spinWheel() {
    console.log('🎰 SPIN BUTTON CLICKED!');

    if (ThreadsGame.spinning) {
        console.log('Already spinning, ignoring click');
        return;
    }

    ThreadsGame.spinning = true;
    ThreadsGame.spinCount++;
    console.log('Spin count increased to:', ThreadsGame.spinCount);

    const spinCountEl = document.getElementById('spin-count');
    if (spinCountEl) {
        spinCountEl.textContent = ThreadsGame.spinCount;
        console.log('✓ Spin count display updated');
    }

    playSound(WHEEL_SOUNDS.spin);

    // Random spin amount (multiple rotations + random position)
    const baseSpins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = baseSpins * Math.PI * 2 + (Math.random() * Math.PI * 2);
    console.log('Starting animation to rotation:', finalRotation);

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

        // Easing function (ease out cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        ThreadsGame.currentRotation = startRotation + (targetRotation * easeProgress);
        drawWheel(ThreadsGame.currentRotation);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Spin complete
            ThreadsGame.spinning = false;
            playSound(WHEEL_SOUNDS.stop);

            const landedFortune = getLandedFortune();
            ThreadsGame.lastLandedFortune = landedFortune;
            ThreadsGame.spinHistory.push(landedFortune.text);
            handleFortuneResult(landedFortune);
        }
    }

    requestAnimationFrame(animate);
}

// Get which fortune the pointer landed on (FIXED ALIGNMENT)
function getLandedFortune() {
    const numSegments = ThreadsGame.fortunes.length;
    const anglePerSegment = (Math.PI * 2) / numSegments;

    // Normalize rotation to 0-2π
    let normalizedRotation = ThreadsGame.currentRotation % (Math.PI * 2);
    if (normalizedRotation < 0) normalizedRotation += Math.PI * 2;

    // Add PI/2 to account for starting at top
    normalizedRotation = (normalizedRotation + Math.PI / 2) % (Math.PI * 2);

    // Calculate which segment
    const segmentIndex = Math.floor(normalizedRotation / anglePerSegment);

    console.log('🎯 Landed on segment index:', segmentIndex, '=', ThreadsGame.fortunes[segmentIndex].text);

    return ThreadsGame.fortunes[segmentIndex];
}

// Handle fortune result
function handleFortuneResult(fortune) {
    console.log('🎲 Handling fortune:', fortune.text);

    // Simple notification instead of popup
    window.GameApp.showNotification(`🎡 ${fortune.text}`);

    // PUZZLE 1: Land on "YOU WIN" (SURFACE)
    if (!ThreadsGame.puzzles.puzzle1Complete && fortune.text === 'YOU WIN') {
        ThreadsGame.puzzles.puzzle1Complete = true;
        setTimeout(() => {
            playSound(WHEEL_SOUNDS.fragment);
            window.GameApp.revealFragment(3); // Reveals ".3921"
        }, 1500);
    }

    // PUZZLE 2: Spin exactly 7 times then wait (HIDDEN)
    if (!ThreadsGame.puzzles.puzzle2Complete && ThreadsGame.spinCount === 7) {
        // Start timer to check if they don't spin again
        setTimeout(() => {
            if (ThreadsGame.spinCount === 7 && !ThreadsGame.puzzles.puzzle2Complete) {
                ThreadsGame.puzzles.puzzle2Complete = true;
                playSound(WHEEL_SOUNDS.fragment);
                window.GameApp.revealFragment(4); // Reveals "3"
                window.GameApp.showNotification('✨ SEVEN IS THE LUCKY NUMBER! ✨');
            }
        }, 5000);
    }

    // Show thread for certain fortunes
    if ((fortune.text === 'A SECRET THREAD' || fortune.text === 'BACKWARDS REVEALS ALL') && !ThreadsGame.threadDiscovered) {
        showThread();
    }

    // CREEPY EFFECT: Landing on "NIW UOY" without using /reverse
    if (fortune.text === 'NIW UOY' && !ThreadsGame.puzzles.puzzle3Complete) {
        triggerCreepyEffect();
    }

    saveThreadsProgress();
}

// Show fortune popup
function showFortunePopup(fortune) {
    // Create popup
    const popup = document.createElement('div');
    popup.className = 'fortune-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, ${fortune.color} 0%, #000 100%);
        color: #fff;
        padding: 40px 60px;
        border: 5px solid #fff;
        border-radius: 20px;
        font-size: 2em;
        font-weight: bold;
        text-align: center;
        z-index: 5000;
        box-shadow: 0 0 50px ${fortune.color};
        animation: popup-appear 0.5s ease-out forwards;
        text-shadow: 2px 2px 4px #000;
    `;
    popup.textContent = fortune.text;

    document.body.appendChild(popup);

    // Auto remove after 3 seconds
    setTimeout(() => {
        popup.style.animation = 'popup-disappear 0.5s ease-out forwards';
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}

// Trigger creepy effect for "NIW UOY"
function triggerCreepyEffect() {
    window.GameApp.showNotification('⚠️ Something feels... wrong...');

    // Glitch effect
    document.body.style.animation = 'glitch-shake 0.5s ease-in-out';
    document.body.style.filter = 'hue-rotate(180deg) invert(1)';

    // Play reversed/distorted sound if available
    const creepyAudio = new Audio('assets/sounds/creepy_reverse.mp3');
    creepyAudio.volume = 0.2;
    creepyAudio.play().catch(e => console.log('Audio failed:', e));

    // Show warning message
    const warning = document.createElement('div');
    warning.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #000;
        color: #ff0000;
        padding: 30px;
        border: 3px solid #ff0000;
        font-size: 1.5em;
        text-align: center;
        z-index: 5001;
        font-family: 'Courier New', monospace;
        animation: glitch-text 0.1s infinite;
    `;
    warning.innerHTML = `
        YOU SHOULDN'T BE HERE<br>
        THIS ISN'T YOUR WIN<br>
        <span style="font-size: 0.7em;">Type /reverse to escape...</span>
    `;
    document.body.appendChild(warning);

    // Reset after 4 seconds
    setTimeout(() => {
        document.body.style.animation = '';
        document.body.style.filter = '';
        warning.remove();
    }, 4000);
}

// Show thread
function showThread() {
    ThreadsGame.threadDiscovered = true;
    const thread = document.getElementById('wheel-thread');
    if (thread) {
        thread.classList.remove('hidden');

        thread.addEventListener('click', () => {
            window.GameApp.showNotification('A command prompt appears...');
            document.getElementById('command-prompt').classList.remove('hidden');
            document.getElementById('cmd-input').focus();
        }, {once: true});
    }

    saveThreadsProgress();
}

// Show thread hint
function showThreadHint() {
    const hintBox = document.getElementById('hint-threads-3');
    if (hintBox) {
        hintBox.innerHTML = `
            <strong>🧵 Hidden Puzzle:</strong> A thread dangles from the wheel's edge.
            Pull it to reveal a command prompt. Commands can reverse what fate has spun.
            Type the right words, and backward it'll run!
            <br><br>
            <em style="color: #ff3366;">Look for the red thread at the bottom-right...</em>
        `;
        hintBox.classList.add('visible');
    }
}

// Show seven hint
function showSevenHint() {
    const hintBox = document.getElementById('hint-threads-2');
    if (hintBox) {
        hintBox.innerHTML = `
            <strong>🍀 Lucky Seven:</strong> You've spun ${ThreadsGame.spinCount} time(s) so far.
            Seven is a lucky number. What if you stopped at exactly seven spins?
            Don't spin eight, don't spin six - seven is the number that does the trick!
        `;
        hintBox.classList.add('visible');
    }
}

// Check which hints to show
function checkHintsToShow() {
    if (ThreadsGame.spinHistory.includes('SEVEN IS LUCKY') && !window.GameApp.hasFragment(4)) {
        showSevenHint();
    }

    if ((ThreadsGame.spinHistory.includes('A SECRET THREAD') || ThreadsGame.spinHistory.includes('BACKWARDS REVEALS ALL')) && !ThreadsGame.threadDiscovered) {
        showThreadHint();
        showThread();
    }
}

// Setup command prompt
function setupCommandPrompt() {
    const input = document.getElementById('cmd-input');
    if (!input) return;

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
            window.GameApp.showNotification('⚡ The wheel spins in REVERSE! ⚡');

            // Find NIW UOY index
            const targetIndex = ThreadsGame.fortunes.findIndex(f => f.text === 'NIW UOY');
            const anglePerSegment = (Math.PI * 2) / ThreadsGame.fortunes.length;

            // Calculate target rotation to land on NIW UOY
            const targetRotation = ThreadsGame.currentRotation - (Math.PI * 4) - (targetIndex * anglePerSegment);

            animateReverseSpin(targetRotation);
        } else {
            window.GameApp.showNotification('Already used /reverse!');
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

    playSound(WHEEL_SOUNDS.spin);

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
            playSound(WHEEL_SOUNDS.stop);

            // Show success popup
            const fortune = ThreadsGame.fortunes.find(f => f.text === 'NIW UOY');
            showFortunePopup(fortune);

            window.GameApp.showNotification('✨ YOU REVERSED FATE! ✨');

            setTimeout(() => {
                playSound(WHEEL_SOUNDS.fragment);
                window.GameApp.revealFragment(5); // Reveals "S"
            }, 1500);
        }
    }

    requestAnimationFrame(animate);
}

// Utility functions
function playSound(audio) {
    if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

function saveThreadsProgress() {
    localStorage.setItem('threadsProgress', JSON.stringify({
        spinCount: ThreadsGame.spinCount,
        puzzles: ThreadsGame.puzzles,
        spinHistory: ThreadsGame.spinHistory,
        threadDiscovered: ThreadsGame.threadDiscovered
    }));
}

// Add popup animations to CSS
const threadsStyle = document.createElement('style');
threadsStyle.textContent = `
    @keyframes popup-appear {
        0% { transform: translate(-50%, -50%) scale(0) rotate(-180deg); opacity: 0; }
        100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes popup-disappear {
        0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0) rotate(180deg); opacity: 0; }
    }
    @keyframes thread-pulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 10px #ff0000; }
        50% { transform: scale(1.1); box-shadow: 0 0 25px #ff0000; }
    }
    @keyframes glitch-shake {
        0%, 100% { transform: translate(0, 0); }
        10% { transform: translate(-5px, 5px); }
        20% { transform: translate(5px, -5px); }
        30% { transform: translate(-5px, -5px); }
        40% { transform: translate(5px, 5px); }
        50% { transform: translate(-5px, 5px); }
        60% { transform: translate(5px, -5px); }
        70% { transform: translate(-5px, -5px); }
        80% { transform: translate(5px, 5px); }
        90% { transform: translate(-5px, -5px); }
    }
    @keyframes glitch-text {
        0% { opacity: 1; }
        50% { opacity: 0.8; transform: skew(5deg); }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(threadsStyle);

// Export for use by app.js and debugging
window.ThreadsGame = ThreadsGame;
window.initThreadsGame = initThreadsGame;
