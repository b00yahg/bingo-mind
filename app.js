// Main Application Logic and Fragment Collection System

// Fragment Data
const FRAGMENTS = {
    safeCode: {
        2: 'J',
        4: '3',
        5: 'S',
        7: 'T',
        // -, 3, R revealed at completion
        complete: ['J', '3', 'S', 'T', '-', '3', 'R']
    },
    coordinates: {
        1: '-47',
        3: '.3921',
        6: '178.9012',
        8: 'DmPln-2387'
    }
};

// File Unlocks
const FILE_UNLOCKS = {
    2: 'receipt.txt',
    4: 'contract.txt',
    7: 'chatlog.txt',
    8: 'heist_map.png'
};

// Game State
const gameState = {
    fragments: [],
    unlockedFiles: [],
    currentScreen: 'hub'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Clear all saved progress on page load (fresh start every time)
    localStorage.clear();
    console.log('🎪 Fresh circus experience! All progress cleared.');

    loadGameState();
    setupEventListeners();
    updateFragmentDisplay();
    checkCompletion();
    initBackgroundMusic();
});

// Load saved game state from LocalStorage
function loadGameState() {
    const saved = localStorage.getItem('bingoMindState');
    if (saved) {
        const parsed = JSON.parse(saved);
        gameState.fragments = parsed.fragments || [];
        gameState.unlockedFiles = parsed.unlockedFiles || [];
    }
}

// Save game state to LocalStorage
function saveGameState() {
    localStorage.setItem('bingoMindState', JSON.stringify({
        fragments: gameState.fragments,
        unlockedFiles: gameState.unlockedFiles
    }));
}

// Setup Event Listeners
function setupEventListeners() {
    // Game navigation buttons
    document.querySelectorAll('.btn-game').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const gameName = e.target.getAttribute('data-game');
            navigateToScreen(`${gameName}-game`);
        });
    });

    // Back buttons
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateToScreen('hub');
        });
    });

    // View Fragments button
    document.getElementById('view-fragments-btn').addEventListener('click', () => {
        showFragmentViewer();
    });

    // Close modal
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Download memories button
    const downloadBtn = document.getElementById('download-memories-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadAllMemories);
    }

    // Portrait glitch effect
    const portrait = document.getElementById('bingo-portrait');
    setInterval(() => {
        if (Math.random() > 0.9) {
            portrait.classList.add('glitch');
            setTimeout(() => portrait.classList.remove('glitch'), 200);
        }
    }, 5000);
}

// Navigate between screens
function navigateToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    gameState.currentScreen = screenId;

    // Re-initialize wheel when entering threads game
    if (screenId === 'threads-game' && window.ThreadsGame) {
        console.log('Re-initializing threads game wheel...');
        // Give DOM a moment to update, then redraw wheel
        setTimeout(() => {
            if (window.ThreadsGame.redrawWheel) {
                window.ThreadsGame.redrawWheel();
            }
        }, 100);
    }
}

// Reveal Fragment with memory flash effect
function revealFragment(fragmentNumber, fragmentType = 'auto') {
    // Check if already collected
    if (gameState.fragments.includes(fragmentNumber)) {
        return;
    }

    // Add to collected fragments
    gameState.fragments.push(fragmentNumber);

    // Determine fragment content
    let fragmentContent = '';
    let fragmentLabel = '';

    if (FRAGMENTS.coordinates[fragmentNumber]) {
        fragmentContent = FRAGMENTS.coordinates[fragmentNumber];
        fragmentLabel = 'COORDINATE FRAGMENT';
    } else if (FRAGMENTS.safeCode[fragmentNumber]) {
        fragmentContent = FRAGMENTS.safeCode[fragmentNumber];
        fragmentLabel = 'SAFE CODE FRAGMENT';
    }

    // Show memory flash effect
    showMemoryFlash(fragmentContent, fragmentLabel);

    // Update displays
    setTimeout(() => {
        updateFragmentDisplay();
        checkFileUnlock(fragmentNumber);
        saveGameState();
        checkCompletion();
    }, 2000);
}

// Show memory flash overlay
function showMemoryFlash(content, label) {
    const flash = document.getElementById('memory-flash');
    const flashText = flash.querySelector('.flash-text');

    flashText.innerHTML = `
        <div style="margin-bottom: 20px; color: var(--accent-yellow);">${label}</div>
        <div style="font-size: 2em;">${content}</div>
        <div style="margin-top: 20px; font-size: 0.5em; color: var(--accent-cyan);">MEMORY RECOVERED</div>
    `;

    flash.classList.remove('hidden');

    setTimeout(() => {
        flash.classList.add('hidden');
    }, 2500);
}

// Update fragment display
function updateFragmentDisplay() {
    // Update count
    document.getElementById('fragment-count').textContent = `${gameState.fragments.length}/8`;

    // Update fragment slots
    document.querySelectorAll('.fragment-slot').forEach(slot => {
        const fragmentNum = parseInt(slot.getAttribute('data-fragment'));
        if (gameState.fragments.includes(fragmentNum)) {
            slot.classList.add('collected');
            slot.textContent = '✓';
        }
    });

    // Update fragment viewer if open
    updateFragmentViewer();
}

// Show fragment viewer modal
function showFragmentViewer() {
    updateFragmentViewer();
    document.getElementById('fragment-viewer').classList.add('active');
}

// Update fragment viewer content
function updateFragmentViewer() {
    // Update safe code
    const safeCodeMap = {0: 2, 1: 4, 2: 5, 3: 7, 4: 'auto', 5: 'auto', 6: 'auto'};
    document.querySelectorAll('.code-char').forEach((char, index) => {
        const fragmentNum = safeCodeMap[index];
        if (fragmentNum === 'auto') {
            // These are revealed at completion
            if (gameState.fragments.length === 8) {
                const chars = ['J', '3', 'S', 'T', '-', '3', 'R'];
                char.textContent = chars[index];
                char.classList.add('revealed');
            }
        } else if (gameState.fragments.includes(fragmentNum)) {
            char.textContent = FRAGMENTS.safeCode[fragmentNum];
            char.classList.add('revealed');
        }
    });

    // Update coordinates
    const coordMap = {0: 1, 1: 3, 2: 6, 3: 8};
    document.querySelectorAll('.coord-part').forEach((part, index) => {
        const fragmentNum = coordMap[index];
        if (gameState.fragments.includes(fragmentNum)) {
            part.textContent = FRAGMENTS.coordinates[fragmentNum];
            part.classList.add('revealed');
        }
    });

    // Update unlocked files
    const filesList = document.getElementById('files-list');
    filesList.innerHTML = '';
    if (gameState.unlockedFiles.length > 0) {
        gameState.unlockedFiles.forEach(file => {
            const li = document.createElement('li');
            li.textContent = `📄 ${file}`;
            li.addEventListener('click', () => downloadFile(file));
            filesList.appendChild(li);
        });
    } else {
        filesList.innerHTML = '<li style="opacity: 0.6;">No files unlocked yet...</li>';
    }
}

// Check if fragment unlocks a file
function checkFileUnlock(fragmentNumber) {
    if (FILE_UNLOCKS[fragmentNumber]) {
        const file = FILE_UNLOCKS[fragmentNumber];
        if (!gameState.unlockedFiles.includes(file)) {
            gameState.unlockedFiles.push(file);
            showNotification(`🔓 FILE UNLOCKED: ${file} - Downloading...`);

            // Auto-download the file after a brief delay
            setTimeout(() => {
                downloadFile(file);
                showNotification(`📄 ${file} downloaded to your browser!`);
            }, 1500);
        }
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--accent-neon) 0%, var(--accent-cyan) 100%);
        color: #000;
        padding: 20px 30px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 4000;
        box-shadow: 0 0 30px var(--accent-cyan);
        animation: slideIn 0.5s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Check if all fragments collected (completion)
function checkCompletion() {
    if (gameState.fragments.length === 8) {
        setTimeout(() => {
            showCompletionScreen();
        }, 1000);
    }
}

// Show completion screen
function showCompletionScreen() {
    const modal = document.getElementById('completion-screen');
    document.getElementById('final-safe-code').textContent = 'J3ST-3R';
    document.getElementById('final-coordinates').textContent = '-47.3921, 178.9012 DmPln-2387';
    modal.classList.add('active');
}

// Download individual file
function downloadFile(filename) {
    if (window.DOCUMENTS && window.DOCUMENTS[filename]) {
        const content = window.DOCUMENTS[filename];
        const blob = new Blob([content], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    } else {
        showNotification('File not found!');
    }
}

// Download all memories as a ZIP (simplified version - individual downloads)
function downloadAllMemories() {
    showNotification('Downloading recovered memories...');

    // Download each file sequentially
    gameState.unlockedFiles.forEach((file, index) => {
        setTimeout(() => {
            downloadFile(file);
        }, index * 500);
    });

    // Also download a summary file
    setTimeout(() => {
        const summary = `
BINGO'S MIND - MEMORY RECOVERY COMPLETE
========================================

SAFE CODE: J3ST-3R
COORDINATES: -47.3921, 178.9012 DmPln-2387

FILES RECOVERED: ${gameState.unlockedFiles.length}
${gameState.unlockedFiles.map(f => `- ${f}`).join('\n')}

"You've pieced together what I hid away,
The codes, the plans, the getaway.
My mind is clear, the path is shown,
Now use these secrets I've made known."

- Bingo
`;
        const blob = new Blob([summary], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'MEMORY_RECOVERY_SUMMARY.txt';
        a.click();
        URL.revokeObjectURL(url);
    }, gameState.unlockedFiles.length * 500 + 500);
}

// Utility: Check if fragment is collected
function hasFragment(num) {
    return gameState.fragments.includes(num);
}

// Initialize background music (plays on first user interaction)
function initBackgroundMusic() {
    const music = document.getElementById('background-music');
    if (!music) return;

    let musicStarted = false;
    music.volume = 0.3; // Set volume to 30%

    // Try to play music on any user interaction
    const startMusic = () => {
        if (!musicStarted) {
            music.play().then(() => {
                musicStarted = true;
                console.log('Background music started');
            }).catch(e => {
                console.log('Background music autoplay blocked, will try on next interaction');
            });
        }
    };

    // Listen for various user interactions
    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('keydown', startMusic, { once: true });
    document.addEventListener('touchstart', startMusic, { once: true });
}

// Export functions for use by game modules
window.GameApp = {
    revealFragment,
    hasFragment,
    showNotification,
    gameState
};

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
