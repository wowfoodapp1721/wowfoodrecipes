# WOW FOOD RECIPES — GLOBAL NAVIGATION & STATE MACHINE SPECIFICATION
**Version:** 3.4.0 • Production Blueprint
**Theme Ecosystem:** Crimson & Charcoal AMOLED Dark Mode (`#000000`, `#FF3B30`, `#1C1C1E`)

---

### 1. Social Feed to Cooking Intent Link Matrix (SCR-09A ➔ SCR-03A)

```
┌─────────────────────────────────────────────────────────┐
│ SCREEN 9A: Social Cooking Feed (Community Hub)         │
│  ├─ Post: Chef Sarah ("Classic Roasted Tomato Soup")    │
│  ├─ Interactive Overlay Trigger:                        │
│  │   [ Try This Recipe > ]                              │
│  │   (data-action="launch-recipe-intent")               │
└───────────────────────────┬─────────────────────────────┘
                            │
              PUSH NAVIGATION EVENT (250ms ease-out)
              Payload: { recipeId: "rec_tomato_soup_01", targetTab: "ingredients" }
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ SCREEN 3A: Recipe Detail View (Ingredients Profile Tab) │
│  ├─ Title: "Honey Sesame Chicken" / Dynamic Matched     │
│  ├─ Active Tab: "Ingredients" (Highlighted #FF3B30)     │
│  ├─ Subview: Servings Selector & Dynamic Checklist      │
│  └─ Sticky CTA: [ Start Cooking Session ] ➔ SCR-04A     │
└─────────────────────────────────────────────────────────┘
```

#### State Machine Implementation:
* **Source Event:** `onClick` / `onTouchEnd` on `button[data-intent="try-recipe"]` or `.try-recipe-btn` in Screen 9A.
* **Navigation Action:** `Router.push('/recipe/:recipeId?tab=ingredients')`
* **Transition Animation:** `slideLeft` with slight parallax scale down on origin viewport (origin scale: `0.96`, destination entering from `translateX(100%)` to `0%`).
* **State Binding:** Initializes Screen 3A with:
  ```json
  {
    "origin": "SCR_09A_SOCIAL_FEED",
    "recipeId": "rec_roasted_tomato_01",
    "activeTab": "INGREDIENTS",
    "scrollOffset": 0,
    "backStack": ["SCR_01_HOME", "SCR_09A_FEED"]
  }
  ```

---

### 2. IoT Hardware Diagnostic Re-route Mapping (SCR-12B ➔ SCR-03H)

```
┌─────────────────────────────────────────────────────────┐
│ SCREEN 12B: IoT Smart Robot Pairing & Connectivity      │
│  ├─ Hardware Status: Pairing Session / Connection Hub   │
│  ├─ Diagnostic Trigger:                                 │
│  │   "Troubleshoot / Run Diagnostics"                   │
│  │   (data-action="launch-hardware-diagnostic")         │
└───────────────────────────┬─────────────────────────────┘
                            │
              ROUTER REDIRECT with LOG CONTEXT
              Params: { category: "HARDWARE_IOT", logId: "ERR_12B_PAIRING_TIMEOUT" }
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ SCREEN 3H: Submit Issue Details Form (Support Core)     │
│  ├─ Category: "Smart Appliance / Robot Connection"      │
│  ├─ Pre-populated Log Parameter Tag:                    │
│  │   textarea[name="issue_description"] =               │
│  │   "[HARDWARE_LOG_ERR_12B]: Connection handshake      │
│  │    timeout on channel BLE_2.4G. Error code: 0x7E3..."│
│  └─ Primary Action: [ Submit Issue Details ]            │
└─────────────────────────────────────────────────────────┘
```

#### Hardware Log Injection Specification:
* **Source Element:** Screen 12B action link `a[data-action="troubleshoot-diagnostics"]` or text node `Troubleshoot / Run Diagnostics`.
* **State Machine Rule:** Captures system hardware stack trace and triggers `Router.push('/support/submit-issue')` with pre-filled state payload:
  ```javascript
  const diagnosticLogPayload = {
    sourceScreen: "SCREEN_12B_IOT_PAIRING",
    errorCode: "HARDWARE_LOG_ERR_12B",
    timestamp: new Date().toISOString(),
    injectedLogTag: "[HARDWARE_LOG_ERR_12B]\n-- Diagnostic Trace: BLE Hardware handshake timed out at retry cycle 3.\n-- Device: ChefBot Pro 4L (MAC: 3C:84:27:E1:59:B0)\n----------------------------------------\nUser details: "
  };
  ```
* **Form Context Binding:** On Screen 3H render, form textarea `#issue-description-input` immediately hydrates with `diagnosticLogPayload.injectedLogTag`, positioning the cursor at the terminal string index for seamless user context entry.
* **Return Navigation Target:** Upon successful issue submission or back action, user routes back to Screen 12A / Screen 12 (`Screen 12A - Premium Profile & Settings`).
