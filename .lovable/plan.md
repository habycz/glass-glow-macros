
## GlassMacro — Calorie Tracking App

A hyper-minimalist calorie tracking PWA with a macOS Glassmorphism aesthetic, built mobile-first on a pure black canvas.

---

### Design System
- **Background:** Pure black (`#000000`) with subtle radial glow effects
- **Accent:** Neon pink (`#f74db9`) for the progress ring, FAB button, and interactive highlights
- **Glass Cards:** `bg-white/10` with `backdrop-blur-xl`, `border border-white/10`, `rounded-3xl`
- **Typography:** Inter font — clean, modern, generous spacing

---

### Screen 1: Dashboard (Home)

**Top Half — Circular Progress Ring**
- Large SVG-based animated ring (~260px) centered on screen
- Pink (`#f74db9`) stroke with a soft glow/shadow effect
- Inner text: large bold current calorie count (e.g. `1,240`) + small `Kcal` label
- Ring animates smoothly when calories are logged (CSS stroke-dashoffset transition)

**Middle — Macro Stats Row**
- Three glass cards side-by-side: **Protein**, **Carbs**, **Fats**
- Each shows current total in grams with a small colored dot indicator
- Cards use glassmorphism: translucent, blurred, 1px white border

**Bottom — Floating Action Button**
- Centered glowing pink button with a `+` or camera icon
- Subtle pulse/glow animation to draw attention

---

### Interaction Flow: Logging a Meal

Triggered by the FAB, a bottom sheet/modal slides up with smooth transitions:

**Step 1 — Scan Nutrition Label**
- A glass-styled upload area with a camera icon
- Dashed border, tap-to-upload prompt ("Scan Nutrition Label")
- Once an image is selected, it transitions to Step 2

**Step 2 — Enter Grams**
- Smooth animated transition reveals a large number input
- Label: "How many grams did you eat?"
- Styled input with pink focus ring, large font

**Step 3 — Macro Summary Preview**
- A glass card slides in showing calculated macros (mocked from the image)
- E.g.: "Based on 150g → 300 kcal · 20g Protein · 35g Carbs · 8g Fat"
- Pink "Log Food" button at the bottom

**Step 4 — Logging & Animation**
- Modal dismisses with a slide-down
- The circular ring animates from its current value to the new total
- Numbers count up smoothly
- Macro stat cards update with a brief flash

---

### Technical Approach
- All state managed locally in React (no backend needed)
- SVG circle with animated `stroke-dashoffset` for the ring
- CSS transitions for step transitions in the logging flow
- Mock nutrition data returned after "scanning" (fixed example values)
- PWA-ready: viewport meta, hide scrollbars, prevent overscroll
- Daily goal preset to 2,000 kcal (configurable later)
- Food log list shown below the macro cards (today's logged items)
