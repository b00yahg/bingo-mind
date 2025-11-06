# 🎪 BINGO'S MIND - Y2K ARG Carnival Game

> *"Every Thought Hides a Secret"*

A Y2K flash-style browser game with a sinister ARG twist. Players solve puzzles and play carnival games to unlock fragments of a cybernetic thief's consciousness, revealing codes, coordinates, and dark lore documents.

---

## 📖 Story

Welcome to **Bingo's Mind** - a digital carnival trapped inside the consciousness of a cybernetic tiefling thief named Bingo. Bound by an infernal contract to the devil Diablo, Bingo has been augmented with cybernetic enhancements and enslaved in Little Avernus.

Players must navigate three mental games (The Schemes, The Threads, and The Masks) to recover 8 memory fragments. Each fragment reveals part of a safe code and coordinates needed for Bingo's heist - his one chance at freedom and reunion with his love, Candy.

But there's a twist: Players are unknowingly helping piece together Bingo's consciousness, making them complicit in his escape plan while simultaneously becoming trapped in his mental labyrinth.

---

## 🎮 How to Play

### Running the Game

1. **Clone or download this repository**
2. **Open `index.html` in a modern web browser** (Chrome, Firefox, Edge recommended)
3. No build process or server required - it's pure HTML/CSS/JS!

### Gameplay

- **Explore three games**: The Schemes (Balloon Pop), The Threads (Fortune Wheel), The Masks (Shell Game)
- **Collect 8 memory fragments**: Some are earned through normal play (SURFACE puzzles), others require hidden solutions (HIDDEN puzzles)
- **Unlock lore documents**: As you collect fragments, you'll unlock downloadable files revealing Bingo's story
- **Discover secrets**: Open your browser's console (F12) and type `help()` for easter eggs

---

## 🧩 Puzzle Guide (SPOILER WARNING!)

<details>
<summary>Click to reveal puzzle solutions</summary>

### The Schemes (Balloon Pop)

**Puzzle 1 - SURFACE**: Pop 10 balloons
- Reward: Fragment #1 (Coordinate: -47)

**Puzzle 2 - HIDDEN**: The Devil's Signature (6-6-6)
- Pop 6 balloons, wait 6 seconds, then pop 6 more
- Reward: Fragment #2 (Safe Code: J) + receipt.txt

### The Threads (Fortune Wheel)

**Puzzle 1 - SURFACE**: Land on "YOU WIN"
- Spin until you land on the top fortune
- Reward: Fragment #3 (Coordinate: .3921)

**Puzzle 2 - HIDDEN**: Lucky Seven
- Spin exactly 7 times, then STOP (don't spin an 8th time)
- Wait 5 seconds
- Reward: Fragment #4 (Safe Code: 3) + contract.txt

**Puzzle 3 - HIDDEN**: The Secret Thread
- Land on "A SECRET THREAD" or "BACKWARDS REVEALS ALL"
- Click the red thread at bottom-right of wheel
- Type `/reverse` in the command prompt
- Reward: Fragment #5 (Safe Code: S)

### The Masks (Shell Game)

**Puzzle 1 - SURFACE**: Win 3 times
- Track the correct shell and win 3 rounds
- Reward: Fragment #6 (Coordinate: 178.9012)

**Puzzle 2 - HIDDEN**: The Fool's Stumble
- Click the angel in the corner for a hint
- Lose 3 times in a row (choose wrong shells deliberately)
- Reward: Fragment #7 (Safe Code: T) + chatlog.txt

**Puzzle 3 - HIDDEN**: Strike the Deceiver
- After the devil starts laughing (from Puzzle 2)
- Click the knife icon
- Click the laughing devil
- Reward: Fragment #8 (Coordinate: DmPln-2387) + heist_map.png

</details>

---

## 🔓 Final Reveal

Once all 8 fragments are collected:

- **Safe Code**: `J3ST-3R` (Jester - Bingo's codename)
- **Coordinates**: `-47.3921, 178.9012 DmPln-2387` (Location of the heist)
- **Documents**: 4 lore files revealing Bingo's cybernetic modifications, infernal contract, secret deal with the angel "2NGEL", and heist plans

---

## 🎨 Features

### Y2K Flash Aesthetic
- Neon colors (magenta, cyan, yellow)
- Glitch effects and scanline overlays
- Retro web design vibes
- Animated backgrounds and pulsing text

### Progress Persistence
- All progress saved to browser LocalStorage
- Players can leave and return without losing fragments
- Reset available via console command `reset()`

### Easter Eggs
Open browser console (F12) and try:
- `help()` - See all commands
- `bingo()` - ASCII art and message from Bingo
- `collar()` - Status of Bingo's control collar
- `angel()` - Info about the mysterious 2NGEL
- `jester()` - Bingo's true identity
- `secrets()` - Puzzle hints and progress
- Konami Code: ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️ B A

### Downloadable Lore
- `receipt.txt` - Bingo's cybernetic augmentation receipt (9 years of modifications)
- `contract.txt` - The infernal contract binding Bingo to Diablo
- `chatlog.txt` - Encrypted conversation between Bingo and the angel 2NGEL
- `heist_map.png` - ASCII map of the heist location

---

## 📁 File Structure

```
bingo-mind/
├── index.html              # Main game page
├── styles.css              # Y2K styling and animations
├── app.js                  # Core app logic and fragment system
├── documents.js            # Lore documents content
├── console-commands.js     # Easter egg commands
├── games/
│   ├── schemes.js         # Balloon Pop game
│   ├── threads.js         # Fortune Wheel game
│   └── masks.js           # Shell Game
└── README.md              # This file
```

---

## 🎭 Characters

- **Bingo**: A cybernetic tiefling thief, 89% machine, bound by contract to Diablo
- **Diablo**: Devil of the Eighth Seal, Bingo's "owner" and creditor
- **Candy**: Bingo's love, the reason he's risking everything
- **2NGEL**: A mysterious "angel" with questionable motives who offers Bingo a deal
- **The Necromancer**: The surgeon who performed Bingo's cybernetic augmentations

---

## 🛠️ Technical Details

- **Framework**: Vanilla JavaScript (no dependencies!)
- **Storage**: LocalStorage for progress persistence
- **Graphics**: HTML5 Canvas for the Fortune Wheel
- **Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile**: Responsive design works on tablets and phones

---

## 🎨 Customization & Assets

### Adding Your Own heist_map.png

The current implementation uses a text-based ASCII map. To add a real image:

1. Create your heist map image (PNG format recommended)
2. Place it in the project directory
3. Update `documents.js` to reference the actual image file
4. Or use the download system to serve the existing ASCII version as a text file

### Modifying Puzzles

All puzzle logic is contained in the `games/` directory. Each game file is self-contained and can be modified independently:

- Adjust difficulty by changing timing windows
- Add new puzzles by extending the puzzle objects
- Modify rewards by changing fragment assignments

---

## 🐛 Troubleshooting

**Fragments not saving?**
- Ensure your browser allows LocalStorage
- Check browser console for errors (F12)

**Wheel not spinning?**
- Refresh the page
- Check if canvas is supported in your browser

**Can't find hints?**
- Look for pulsing/glowing elements on screen
- Try the console commands for additional hints

**Reset not working?**
- Open console (F12)
- Type `reset()` and confirm with "RESET"
- Refresh page after reset

---

## 🎯 Design Philosophy

This ARG combines:
- **Surface-level gameplay** (carnival games anyone can play)
- **Hidden depth** (secret puzzles for dedicated players)
- **Environmental storytelling** (lore revealed through documents)
- **Meta-narrative** (players unknowingly helping Bingo's consciousness)
- **Retro aesthetic** (Y2K nostalgia with modern web tech)

The goal is to make players feel like they're exploring a mind, not just playing games. Every element has narrative purpose.

---

## 📝 Credits

- **Design**: Original ARG concept
- **Art Style**: Y2K flash game aesthetic
- **Story**: Cyberpunk/fantasy fusion with D&D elements (Forgotten Realms references)
- **Technology**: Pure vanilla web technologies

---

## 🎪 License

This is a narrative ARG game. Feel free to play, share, and modify for your own campaigns!

---

## 🔮 Future Enhancements (Optional)

Ideas for expansion:
- [ ] Add actual image for heist map
- [ ] Implement sound effects and music
- [ ] Add more console easter eggs
- [ ] Create a "New Game+" mode with harder puzzles
- [ ] Add achievements system
- [ ] Implement multiplayer elements
- [ ] Create a sequel game continuing the story

---

## 🎭 Final Message from Bingo

> *"Thanks for playing my games, friend. You've helped me remember who I am. The codes, the plans, the way out - it's all clear now. In another life, maybe we could have been partners. But this circus only has room for one fool. And that's me."*
>
> *- Bingo, The Cybernetic Jester*

---

**Enjoy the game, and may you find all the secrets hidden in the fool's mind!** 🎪🎈🎡🥥
