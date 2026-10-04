# Tri-Surface Architecture: Web Workstation, Windows Desktop PWA, and Mobile-First Touch Experience

This plan details the implementation strategy to expand the platform into a unified tri-surface application:
1. **Universal Cloud Web App**: Instant in-browser document processing and AI intelligence.
2. **Windows Desktop App (PWA)**: Standalone window, taskbar pin, Start Menu registration, and offline execution via Service Worker.
3. **Mobile-First Touch Display**: Thumb-friendly bottom navigation, touch-optimized signatures, and responsive Liquid Mode reflow for phones and tablets.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **How PWA with Standalone Windows Window and Taskbar Pinning Works:**
> - **What It Is**: A Progressive Web App (PWA) configured with a W3C Web App Manifest (`manifest.json`) and background Service Worker (`sw.js`).
> - **How Windows Handles It**: When a user clicks "Install on Windows" in Edge or Chrome:
>   - Windows creates a native application shell registered in the Windows registry, Start Menu, and Windows Settings (`Installed Apps`).
>   - The app can be pinned to the Windows Taskbar just like Microsoft Office, Word, or native desktop Acrobat.
>   - When launched, it opens in its own dedicated, chromeless OS window (no URL bar, no browser tabs, custom window title bar).
>   - Windows manages it as an independent app in `Alt + Tab` task switching.
>   - All core code and documents cached in IndexedDB load instantly offline with zero internet connection.
> - **Confirmed Mobile Layout**: Adaptive bottom navigation bar (Tools, Pages, Sign, AI Assistant) paired with Liquid Mode responsive reading.
> - **Confirmed Data Persistence**: Full offline caching with automatic IndexedDB synchronization.

---

## 1. Overview & Core Concept

- **What It Does**: Provides seamless parity across desktop web, native-feeling Windows desktop, and mobile devices. A single reactive codebase automatically adapts its spatial topology based on viewport and device capabilities.
- **Target Audience**:
  - Corporate Windows workstation users requiring a dedicated, pinned desktop application for high-volume contract review.
  - Mobile executives needing rapid on-the-go contract reading, touch signatures, and AI audio overviews.
- **Key Value**: Zero installation barriers, zero duplicate codebases, and complete offline autonomy with enterprise-grade cryptographic security.

---

## 2. User Experience & Visual Design

### Mobile-First Interactive Display & Touch Ergonomics
- **Natural Thumb Zone (Bottom 40% of Mobile Screen)**:
  - **Fixed Bottom Tab Bar**: 4 key touch destinations with $44\text{px} \times 44\text{px}$ minimum hitboxes:
    1. `Pages` (Thumbnails, reorder, delete, rotate)
    2. `Tools` (Quick markup, highlight, redaction drawer)
    3. `Sign` (Tap-to-sign pad, signature stamps)
    4. `AI Assistant` (Voice podcast, instant Q&A summary)
- **Acrobat Liquid Mode Reflow**:
  - Automatically reflows fixed-dimension 612x792pt PDF pages into a fluid, single-column reading view.
  - Enhances font scale, line spacing, and touch-friendly paragraph tap targets for small screens.
- **Top Mobile Header**:
  - Compact $52\text{px}$ bar showing document title, Liquid Mode toggle, and PWA Install button.
  - Leaves $>85\%$ of viewport height unobstructed for reading.

### Windows Desktop PWA Experience
- **Dedicated Title Bar**: Integrated theme color (`#0F172A`) matching enterprise slate branding.
- **In-App Install Banner / Button**: Prominent, elegant "Install on Windows" button in the Global Bar with clear visual cues and instant installation trigger.
- **Offline Indicator**: Subtle notification badge when operating without network connectivity, confirming local IndexedDB caching is active.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Native Windows PWA vs. Heavy Electron Wrapper**
  - *Chosen Approach*: Progressive Web App (PWA) with `vite-plugin-pwa`, Workbox service worker caching, and Windows Start Menu/Taskbar integration.
  - *Why*: Electron packages require 150MB+ bundle sizes and separate deployment builds. Modern PWA on Windows 10/11 is natively integrated into Chromium/Edge, weighs under 2MB, updates automatically, and supports full taskbar pinning and offline storage.
  - *Alternatives Considered*: Electron or Tauri (excessive compile overhead and maintenance fragmentation).
- **Decision 2: Adaptive Responsive Surface vs. Separate Mobile Subdomain**
  - *Chosen Approach*: Dynamic CSS media queries (`md:` / `sm:`) and touch-detection hooks within the single unified React app.
  - *Why*: Guarantees that every new feature, redaction improvement, or AI capability is instantly available across web, desktop, and mobile simultaneously.
- **Decision 3: Offline Service Worker Precaching**
  - *Chosen Approach*: Precaching application shell, WebAssembly utilities, fonts, and scripts, paired with IndexedDB document store.
  - *Why*: Users can open, review, and sign documents on flights, trains, or in secure offline clean-rooms.

---

## 4. Technical Architecture & Data Strategy

### System Topology Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TRI-SURFACE CLIENT ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   DESKTOP WEB BROWSER       WINDOWS INSTALLED PWA      MOBILE TOUCH DEVICE  │
│   (Chrome / Edge / Firefox) (Standalone OS Window,     (iOS / Android Phone)│
│                              Taskbar Pin, Start Menu)   Bottom Nav & Touch  │
│          │                             │                         │          │
│          ▼                             ▼                         ▼          │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                 UNIFIED REACT + VITE CLIENT CORE                    │   │
│   │ - Adaptive Responsive Layout (Desktop Rails vs Mobile Bottom Bar)   │   │
│   │ - Acrobat Liquid Mode Reflow Engine                                 │   │
│   │ - Touch-First Signature Canvas (Stylus & Finger Gestures)           │   │
│   │ - PWA Install Trigger & Hook (`usePWAInstall.ts`)                   │   │
│   └──────────────────────────────────┬──────────────────────────────────┘   │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌──────────────────────────────────────┐     ┌────────────────────────────────┐
│      OFFLINE RUNTIME & CACHING       │     │     HYBRID CLOUD & API         │
│ - W3C Manifest (`manifest.json`)     │     │ - Live Gemini 3.8 Flash API    │
│ - Service Worker (`sw.js` / Workbox) │     │ - Audio Podcast Stream         │
│ - IndexedDB Document Store           │     │ - Microservices (Port 3000)    │
│ - Pure Client Binary Exporters       │     │ - Offline Fallback Engine      │
└──────────────────────────────────────┘     └────────────────────────────────┘
```

### Implementation Modules
1. **PWA Manifest & Service Worker Setup**:
   - Install `vite-plugin-pwa` and configure `manifest` with `id: '/'`, `display: 'standalone'`, Windows theme colors (`#0f172a`), and 192x192 / 512x512 icons.
   - Configure Workbox precaching for scripts, styles, and web fonts.
2. **In-App Windows & Mobile Install Triggers (`src/hooks/usePWAInstall.ts` & `src/components/pwa/PWAInstallButton.tsx`)**:
   - Intercepts `beforeinstallprompt` event.
   - Displays "Install on Windows" button in desktop header, and provides iOS Safari "Add to Home Screen" instructions on mobile.
3. **Adaptive Mobile Bottom Navigation (`src/components/mobile/MobileBottomNav.tsx`)**:
   - Mounts when viewport $< 768\text{px}$.
   - Houses 4 primary touch controls with active indicator highlights.
4. **Mobile Liquid Mode Reflow View (`src/components/mobile/MobileLiquidView.tsx`)**:
   - Renders touch-optimized, reflowed typography with adjustable text size slider, single-column reading, and inline tap-to-sign blocks.
5. **Offline Connectivity Banner (`src/components/pwa/OfflineIndicator.tsx`)**:
   - Detects `navigator.onLine` and alerts user smoothly when working in offline cached mode.
