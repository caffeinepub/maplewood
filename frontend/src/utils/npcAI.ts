import * as THREE from 'three';

export type NPCRole = 'civilian' | 'worker' | 'shopOwner' | 'partyGoer' | 'police' | 'swat' | 'dealer' | 'criminal';
export type NPCState = 'idle' | 'walking' | 'working' | 'socializing' | 'fleeing' | 'fighting' | 'patrolling' | 'dancing';

export interface NPCData {
  id: string;
  role: NPCRole;
  name: string;
  state: NPCState;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  health: number;
  isAlive: boolean;
  dialogues: string[];
  color: string;
}

const CIVILIAN_NAMES = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Drew', 'Quinn', 'Avery'];
const WORKER_NAMES = ['Bob', 'Linda', 'Mike', 'Sarah', 'Tom', 'Emma', 'Jake', 'Lisa', 'Chris', 'Amy'];

const DIALOGUES: Record<NPCRole, string[]> = {
  civilian: [
    "Beautiful day in Maplewood!",
    "Have you tried the new café downtown?",
    "The mountains look amazing today.",
    "Watch where you're going!",
    "I love living in this city.",
  ],
  worker: [
    "Just finishing my shift.",
    "Hard day at work today.",
    "The boss is in a mood today.",
    "Coffee break time!",
    "Another day, another dollar.",
  ],
  shopOwner: [
    "Welcome to my shop!",
    "Best prices in Maplewood!",
    "Can I help you find something?",
    "Come back anytime!",
    "We have a sale today!",
  ],
  partyGoer: [
    "This party is amazing!",
    "Want to dance?",
    "The music is great tonight!",
    "Have you tried the punch?",
    "Best night ever!",
  ],
  police: [
    "Move along, citizen.",
    "Everything okay here?",
    "I'm watching you.",
    "Stay out of trouble.",
    "Maplewood PD. Can I help you?",
  ],
  swat: [
    "Stand down!",
    "SWAT team, freeze!",
    "Drop your weapons!",
    "Area is secured.",
    "Threat neutralized.",
  ],
  dealer: [
    "Looking for a new ride?",
    "We have the best cars in town!",
    "Test drive today?",
    "Great financing options available.",
    "This beauty just came in!",
  ],
  criminal: [
    "Stay back!",
    "This is a robbery!",
    "Don't try anything funny.",
    "Hand over the cash!",
    "You didn't see anything.",
  ],
};

export function createNPC(id: string, role: NPCRole, position: THREE.Vector3): NPCData {
  const names = role === 'worker' ? WORKER_NAMES : CIVILIAN_NAMES;
  const name = names[Math.floor(Math.random() * names.length)];

  const colorMap: Record<NPCRole, string> = {
    civilian: '#4488ff',
    worker: '#44aa44',
    shopOwner: '#ffaa00',
    partyGoer: '#ff44aa',
    police: '#2244ff',
    swat: '#222222',
    dealer: '#ffcc00',
    criminal: '#ff2222',
  };

  return {
    id,
    role,
    name,
    state: 'idle',
    position: position.clone(),
    targetPosition: position.clone(),
    health: 100,
    isAlive: true,
    dialogues: DIALOGUES[role],
    color: colorMap[role],
  };
}

export function getRandomDialogue(npc: NPCData): string {
  return npc.dialogues[Math.floor(Math.random() * npc.dialogues.length)];
}

export function updateNPCState(npc: NPCData, playerPos: THREE.Vector3, wantedLevel: number): NPCState {
  const distToPlayer = npc.position.distanceTo(playerPos);

  if (wantedLevel >= 3 && npc.role === 'civilian' && distToPlayer < 15) {
    return 'fleeing';
  }
  if (wantedLevel >= 2 && npc.role === 'police' && distToPlayer < 30) {
    return 'patrolling';
  }
  if (npc.role === 'partyGoer') return 'dancing';
  if (npc.role === 'police') return 'patrolling';
  if (npc.role === 'worker') return 'working';
  if (distToPlayer < 5) return 'socializing';

  return Math.random() < 0.3 ? 'walking' : 'idle';
}

export function getNextWaypoint(current: THREE.Vector3, bounds: { min: THREE.Vector3; max: THREE.Vector3 }): THREE.Vector3 {
  return new THREE.Vector3(
    bounds.min.x + Math.random() * (bounds.max.x - bounds.min.x),
    current.y,
    bounds.min.z + Math.random() * (bounds.max.z - bounds.min.z)
  );
}
