# 🧱 Retro Breakout
A classic brick-breaking experience focused on reactive paddle physics and collision angles.



## 🛠 Features
* **Reactive Paddle Physics:** The ball's return angle changes depending on where it strikes the paddle.
* **Dynamic HUD:** Real-time score and life tracking drawn directly to the canvas context.
* **Progressive Difficulty:** Brick layouts are generated with increasing complexity.
* **Optimized Rendering:** Uses `requestAnimationFrame` for a buttery-smooth 60FPS experience.

## 🚀 Technical Highlights
* **Collision Normalization:** Calculated bounce vectors based on brick boundaries to handle multi-brick collisions in a single frame.
* **Responsive Canvas:** The game container scales proportionally to the viewport using CSS aspect-ratio and JS resize listeners.

## 🕹 How to Play
1. Open `index.html`.
2. Use the **Mouse** or **Touch** to move the paddle.
3. Clear all bricks without letting the ball hit the floor.
