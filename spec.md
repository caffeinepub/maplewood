# Specification

## Summary
**Goal:** Build a Roblox-style homepage with TRXGAMING branding that launches a single massive open-world 3D life simulation game set in Maplewood, Canada — featuring a vast explorable map, player character controller, NPCs, animals, vehicles, jobs, criminal gameplay, social features, and persistent backend storage.

**Planned changes:**

### Homepage
- Dark gaming-themed homepage with TRXGAMING-branded header, navigation bar (logo, search, user avatar placeholder), and animated banner
- Single featured game card for "Maplewood Canada" with thumbnail, title, play count, and large "Play" button
- Neon-orange/red accent colors, bold blocky typography, animated hover/glow UI effects

### 3D Open World (Three.js / React Three Fiber)
- Large procedural terrain map with distinct biomes: city of Maplewood (downtown, commercial blocks, airport), neighborhood Mapleville, mountain ranges with ski resort, dense forest, rivers, lakes, and beach/swimming resort
- Distance fog and LOD techniques to simulate a vast world
- All buildings and houses are enterable with unique interior layouts, active NPCs, and interactive objects

### Player Character Controller
- WASD/arrow key movement with walk, run, jump, swim mechanics
- First-person / third-person camera toggle via keybind or UI button
- Interaction prompt system for nearby objects, NPCs, food/drink items, vehicles, doors
- Pick up, consume, and interact with world items
- Superhuman/flight mode toggle from ability menu

### NPC & Animal AI
- Multiple NPC types (civilians, workers, shop owners, police, party-goers) with unique dialogue, daily routines (eating, working, socializing, patrolling), and pathfinding
- NPCs present and active inside all buildings; reinforcement/alert response when NPCs are attacked
- Animal AI across biomes: passive (deer, birds, fish) flee from player; dangerous (bears, wolves) attack within aggro range
- Choppable trees with falling animation and removal

### Life Simulation System
- Hunger and thirst stats tracked and displayed on HUD
- Job selection from career menu: police officer (patrol routes), SWAT (high-alert events), first responder (emergency calls), dealership worker, and others
- Role-specific uniforms, vehicles, and equipment assigned on selection
- Home ownership with basic interior customization menu
- Family/relationship formation with NPCs through interactions

### Criminal & Chaos System
- Rob NPCs and stores; use weapons and explosives
- Wanted level indicator (stars) that escalates with criminal acts, triggering more aggressive police/SWAT NPC responses
- Violence toggle in settings to restrict gore/combat visuals

### Vehicle System
- Drivable land (cars, trucks, motorcycles), sea (boats, jet skis), and air (helicopters, planes) vehicles with basic physics
- Enterable car dealership with browsable/purchasable vehicles; player can work there
- Airport with runway supporting aircraft takeoff/landing

### Weapons & Accessories
- Inventory/loadout UI for managing equipped items
- Weapons spanning historical, modern, and futuristic eras with distinct animations
- Equippable accessories (clothing, armor, gadgets) visible on character
- Superhuman abilities (flight, super speed) toggled from inventory/ability menu

### Social Features
- Player profile page (username, avatar, friends list)
- Send/accept/remove friend requests
- In-game text chat (global and proximity) with chat bubble toggle
- Voice chat status indicator (UI only, no real audio transport)
- Friend session invite UI

### Social Event Locations
- Active party venues (indoor/outdoor) with crowd NPCs, music ambiance, dance floor, food/drink props
- Pool area with swimming interaction; ski resort with skiable slopes; hotel lobbies with check-in NPC

### HUD & UI
- In-game HUD: health bar, hunger, thirst, wanted stars, mini-map, equipped item slot
- Settings panel (homepage and pause menu): violence toggle, camera mode default, graphics quality, chat preferences, controls remapping

### Backend (Motoko)
- Single Motoko actor storing player profiles, friend relationships (pending/accepted), settings, owned homes and vehicles, and job/progression data
- Methods: `createProfile`, `getProfile`, `updateSettings`, `addFriend`, `acceptFriend`, `removeFriend`, plus home/vehicle ownership storage

**User-visible outcome:** Users land on a TRXGAMING-branded Roblox-style homepage, click "Play" on the Maplewood Canada game card, and are dropped into a vast 3D open-world life sim where they can explore a Canadian city and wilderness, take jobs, drive vehicles, interact with hundreds of NPCs and animals, cause chaos, socialize with friends via chat, and have their progress and settings saved persistently.
