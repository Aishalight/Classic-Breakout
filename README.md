# 🐍 Cyber Snake
A grid-based logic game featuring toroidal movement and procedural obstacle generation.



## 🛠 Features
* **Toroidal Movement (Wrapping):** Snake teleports to the opposite side of the screen when hitting a boundary.
* **Procedural Obstacles:** Static "mines" spawn dynamically every 30 points to increase difficulty.
* **Neon Aesthetics:** Utilizes `shadowBlur` and radial gradients for a cyberpunk visual style.
* **Responsive Input:** Supports both Keyboard (WASD/Arrows) and Swipe gestures for mobile play.

## 🚀 Technical Highlights
* **Array Manipulation:** The snake's body is managed via a coordinate array using `unshift()` and `pop()` for efficient movement updates.
* **Modulo Logic:** Leveraged modulo arithmetic and boundary checks to handle the seamless screen-wrapping effect.

## 🕹 How to Play
1. Open `index.html`.
2. Use **WASD** or **Swipe** to steer.
3. Eat the pink pixels to grow; avoid hitting your own tail or the red obstacles.
