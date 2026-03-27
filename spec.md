# Maplewood Gaming Portal

## Current State
- Roblox/TRXGAMING-style homepage with Ships 3D featured game and More Games section
- Maplewood custom open-world Three.js game in `/public/maplewood/index.html`
- Maplewood has broken graphics, black screen issues, poor mobile support
- Homepage has GameDistribution embeds that are unreliable

## Requested Changes (Diff)

### Add
- Significantly improved Maplewood graphics using Three.js with PBR materials, proper shadows, tone-mapping, SSAO-style ambient occlusion, fog, reflective water
- Better city environment with distinct neighborhoods: downtown Maplewood city, suburban Mapleville, forest/mountains
- Proper mobile touch controls: virtual joystick (left) + action buttons (right) that appear on touch devices
- Character selection screen before entering the game (3-4 avatar types)
- Day/night cycle with dynamic lighting
- Improved NPC visuals and behaviors (idle animations, patrol paths, react to player)
- Better vehicle models with working headlights
- Minimap in-game HUD
- Improved homepage design with TRXGAMING/Roblox aesthetic: dark background, neon accents, clean game cards

### Modify
- Maplewood game: full rebuild of the Three.js scene with much better rendering quality
- Mobile layout: responsive at all screen sizes, touch-friendly HUD buttons
- Homepage: polish and visual quality lift to match Roblox/TRXGAMING portal style
- Ships 3D section: keep preview + Play Now button only (no description)

### Remove
- Old broken Maplewood game code
- GameDistribution embeds that don't work reliably (keep Ships 3D embed)
- Any CrazyGames embeds

## Implementation Plan
1. Rebuild `/public/maplewood/index.html` as a standalone Three.js game with:
   - Three.js r128+ loaded via CDN
   - PCFSoftShadowMap, ToneMapping, fog, proper ambient + directional lights
   - City grid with buildings (BoxGeometry with PBR MeshStandardMaterial textures via color/roughness/metalness)
   - Water plane with MeshPhongMaterial + shininess
   - Mountain terrain using PlaneGeometry with displacement
   - Trees (cone + cylinder geometry, instanced)
   - NPC characters (capsule geometry with distinct colors per role)
   - Vehicle system with arrow key / WASD driving
   - Mobile virtual joystick using touch events
   - Action buttons: attack, interact, vehicle enter/exit, weapon switch
   - Day/night cycle (directional light color/intensity animation)
   - Character select overlay before gameplay
   - HUD: health bar, minimap, weapon indicator, mobile buttons
2. Update App.tsx homepage:
   - TRXGAMING-style dark theme with vibrant game cards
   - Ships 3D featured with preview image + Play Now only
   - Maplewood card with thumbnail + Play button linking to /maplewood/
   - More Games section with working embeds
3. Mobile responsive: all breakpoints work, touch events wired
