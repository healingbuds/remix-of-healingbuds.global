

# Remove Preloader/Loading Screen

## Summary
Remove the cinematic preloader animation that displays the Healing Buds logo with animated dots before the main app loads. This will make the site load immediately without any artificial delay.

---

## Changes Required

**File:** `src/main.tsx`

The current implementation wraps the entire app in a preloader state machine that:
1. Shows a loading screen with the logo for 2.4-3 seconds
2. Only renders the App component after the preloader completes

### What Will Be Removed
- The `isPreloaderComplete` state
- The `fontsLoaded` state
- The font loading useEffect
- The Preloader component import and usage
- The conditional rendering logic

### New Simplified Code

```typescript
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
```

---

## Cleanup (Optional)

The `src/components/Preloader.tsx` file can optionally be deleted since it will no longer be used. This is a nice-to-have cleanup step.

---

## Expected Result

After this change:
- The site will load immediately without any loading animation
- No artificial 2.4-3 second delay before content appears
- Cleaner, faster user experience

