# Maplewood / TRXGAMING Homepage Enhancements

## Current State
- Homepage (HomePage.tsx) shows Ships 3D as featured game with hero banner, stats, features section, and a CTA.
- ShipsGamePage.tsx opens Ships 3D in a fullscreen iframe with primary/fallback URLs.
- App.tsx routes between home, ships, and maplewood (hidden via #maplewood hash).
- Maplewood (GameView.tsx) exists but has no mobile touch controls optimization.
- No "More Games" section exists on the homepage.
- No per-iframe fullscreen button exists.

## Requested Changes (Diff)

### Add
- "More Games" section on the HomePage below the features section, showing a grid of 6 popular free online games with thumbnail, title, genre tag, and a Play button.
- Each game card opens the game in a dedicated GamePlayerPage (similar to ShipsGamePage) that fills the screen with the game iframe.
- Fullscreen button on every game iframe page (including Ships 3D) that calls `element.requestFullscreen()` on the iframe element to expand just the game, not the full page.
- GamePlayerPage component: reusable page for any embedded game with title, back button, fullscreen button, and iframe with fallback support.
- Popular games to include (using free GameDistribution or CrazyGames embeds):
  1. Moto X3M (racing) - https://html5.gamedistribution.com/6e875a3882b24a6c857a599c65b3e5f6/
  2. Bullet Force (shooting) - https://html5.gamedistribution.com/9b96df03af864c3781374d0a4efb7e85/
  3. Cut the Rope Remastered (puzzle) - https://html5.gamedistribution.com/87ab34f3bd3447d8adbbc3d96b88c407/
  4. Crossy Road (casual) - https://html5.gamedistribution.com/0d6d360538694b4a9e0f7e16cb74e7f3/
  5. Subway Surfers (runner) - https://html5.gamedistribution.com/SubwaySurfersWeb/
  6. Stickman Hook (action) - https://html5.gamedistribution.com/2d2438c2cf3e48e7b7edde47f0b3d58a/

### Modify
- ShipsGamePage.tsx: Add fullscreen button that calls requestFullscreen on the iframe ref.
- App.tsx: Add routing for game player pages (pass selected game data).
- HomePage.tsx: Add "More Games" section with game cards below existing features.
- GameView.tsx (Maplewood): Ensure VirtualJoystick and TouchActionButtons are always visible on mobile (touch devices), improve layout for small screens.

### Remove
- Nothing removed.

## Implementation Plan
1. Create a `POPULAR_GAMES` data array with title, genre, embed URL, and color accent.
2. Create `GamePlayerPage.tsx` - reusable fullscreen iframe page with back button and fullscreen button (using useRef + requestFullscreen API).
3. Update `ShipsGamePage.tsx` to add fullscreen button using the same pattern.
4. Update `App.tsx` to support a `game` view that passes the selected game to `GamePlayerPage`.
5. Update `HomePage.tsx` to add a "More Games" section with game cards that call `onPlayGame(game)` prop.
6. Update `GameView.tsx` (Maplewood) touch controls: ensure VirtualJoystick renders on all touch/mobile devices, fix layout so HUD and controls fit small screens.
