# Maplewood Gaming Portal

## Current State
- Ships 3D embedded on homepage as featured game with PLAY NOW + QUICK PREVIEW buttons
- More Games section with 6 games using CrazyGames embed URLs (all blocked/non-functional)
- Maplewood accessible via #maplewood hash; custom Three.js game shows black screen and non-functional buttons
- Ships 3D iframe has allow="autoplay; fullscreen; keyboard" but sound reportedly doesn't work

## Requested Changes (Diff)

### Add
- Error boundary around the Maplewood Three.js Canvas to surface errors instead of black screen

### Modify
- Replace all CrazyGames embed URLs in data/games.ts with working alternatives (.io games or direct HTML5 game URLs that allow iframe embedding)
- Ships 3D iframes: expand `allow` attribute to include `autoplay *; fullscreen *; microphone; camera; encrypted-media` to unblock audio
- Maplewood GameView: investigate and fix black screen (check Canvas dimensions, error handling, and common Three.js rendering issues)

### Remove
- CrazyGames embed URLs (they block third-party embedding)

## Implementation Plan
1. Update `src/frontend/src/data/games.ts` — replace all CrazyGames URLs with embeddable .io games or GameDistribution URLs:
   - Use .io games: Venge.io (shooter), Krunker.io (FPS), Paper.io 2 (strategy), Wormate.io (snake), Little Big Snake (MMO), Shell Shockers (shooter)
   - Or use GameDistribution for Moto X3M: `https://html5.gamedistribution.com/31d9dc9f1ef74b57817bf5e7f62c1432/`
2. Update Ships 3D iframe `allow` attribute in `ShipsGamePage.tsx` and the preview iframe in `HomePage.tsx` to include `autoplay *` for sound
3. Add React error boundary around Canvas in `GameView.tsx` to catch and display Three.js errors
4. Review `GameView.tsx` canvas setup — ensure the Canvas fills the viewport and has correct gl context settings
5. Validate and build
