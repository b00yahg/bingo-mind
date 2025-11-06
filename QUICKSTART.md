# 🚀 Quick Start Guide

## Running the Game (30 seconds)

1. **Open the game**: Double-click `index.html` OR right-click → "Open with" → Your browser
2. **Start playing**: Click any game card to begin
3. **Open console** (Optional): Press `F12` and type `help()` for easter eggs

That's it! No installation, no build process, no dependencies!

---

## Quick Puzzle Solutions

### Want to see all features quickly?

**The Schemes (Balloon Pop)**
1. Pop 10 balloons → Get Fragment #1
2. Pop 6, wait 6 seconds, pop 6 more → Get Fragment #2

**The Threads (Fortune Wheel)**
1. Spin until "YOU WIN" → Get Fragment #3
2. Spin exactly 7 times then stop → Get Fragment #4
3. Click red thread (bottom-right), type `/reverse` → Get Fragment #5

**The Masks (Shell Game)**
1. Win 3 rounds → Get Fragment #6
2. Click angel, then lose 3 times in a row → Get Fragment #7
3. Click knife, stab laughing devil → Get Fragment #8

---

## Testing Checklist

- [ ] Main hub loads with 3 game cards
- [ ] Fragment tracker shows 0/8
- [ ] Each game can be entered and exited
- [ ] Balloon pop respawns balloons
- [ ] Fortune wheel spins and lands on fortunes
- [ ] Shell game shuffles and reveals correct/wrong shells
- [ ] Fragments appear with flash effect when collected
- [ ] Fragment viewer shows collected pieces
- [ ] Files unlock and can be downloaded
- [ ] Completion screen appears after 8 fragments
- [ ] Console commands work (F12 → `help()`)
- [ ] Progress persists after refresh

---

## Browser Compatibility

✅ **Tested and Working:**
- Chrome/Chromium (Recommended)
- Firefox
- Edge
- Safari (Desktop)

⚠️ **Limited Support:**
- Mobile browsers (responsive design works but games may be harder to play)
- Internet Explorer (not supported)

---

## File Structure

```
📁 bingo-mind/
  📄 index.html          ← Open this file!
  📄 styles.css
  📄 app.js
  📄 documents.js
  📄 console-commands.js
  📁 games/
    📄 schemes.js
    📄 threads.js
    📄 masks.js
```

---

## Common Issues

**Nothing appears when I open index.html?**
- Make sure all files are in the same directory
- Check browser console (F12) for errors
- Try a different browser

**Wheel doesn't spin?**
- Canvas might not be supported
- Try refreshing the page
- Check if hardware acceleration is enabled

**Progress not saving?**
- Browser might block LocalStorage
- Check if cookies/site data are allowed
- Try in a different browser

---

## Demo/Testing Mode

To quickly test all features without solving puzzles:

1. Open browser console (F12)
2. Run these commands:

```javascript
// Unlock all fragments
for(let i = 1; i <= 8; i++) {
    window.GameApp.revealFragment(i);
}

// Check progress
window.GameApp.gameState.fragments
```

---

## Next Steps

- Read full [README.md](README.md) for detailed documentation
- Explore console easter eggs with `help()`
- Try solving puzzles without hints for the full experience
- Check out the lore documents for the full story

---

**Have fun exploring Bingo's Mind!** 🎪
