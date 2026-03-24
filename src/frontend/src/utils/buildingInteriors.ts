export type FurnitureType =
  | "desk"
  | "chair"
  | "bed"
  | "sofa"
  | "table"
  | "counter"
  | "shelf"
  | "locker"
  | "cell"
  | "toilet"
  | "sink"
  | "fridge"
  | "stove"
  | "tv"
  | "plant"
  | "lamp"
  | "car_display"
  | "reception"
  | "gate"
  | "pool_water";

export type InteractiveObjectType =
  | "food"
  | "drink"
  | "weapon"
  | "medkit"
  | "handcuffs"
  | "baton"
  | "taser"
  | "extinguisher"
  | "flashbang"
  | "armor"
  | "rifle";

export type NPCRole =
  | "officer"
  | "swat"
  | "criminal"
  | "civilian"
  | "doctor"
  | "nurse"
  | "firefighter"
  | "paramedic"
  | "dealer"
  | "customer"
  | "receptionist";

export interface FurnitureItem {
  type: FurnitureType;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  label?: string;
}

export interface InteractiveObject {
  id: string;
  type: InteractiveObjectType;
  position: [number, number, number];
  label: string;
  quantity?: number;
}

export interface NPCSpawn {
  id: string;
  role: NPCRole;
  position: [number, number, number];
  name: string;
}

export interface RoomLayout {
  id: string;
  name: string;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  floorColor: string;
  wallColor: string;
  furniture: FurnitureItem[];
}

export interface BuildingInteriorLayout {
  buildingType: string;
  displayName: string;
  size: [number, number]; // width, depth
  rooms: RoomLayout[];
  interactiveObjects: InteractiveObject[];
  npcSpawns: NPCSpawn[];
  exitPosition: [number, number, number];
  playerSpawnPosition: [number, number, number];
  floorColor: string;
  wallColor: string;
  ceilingColor: string;
}

export const BUILDING_INTERIORS: Record<string, BuildingInteriorLayout> = {
  policeStation: {
    buildingType: "policeStation",
    displayName: "Police Station",
    size: [20, 16],
    floorColor: "#c8c8c8",
    wallColor: "#e0e0e0",
    ceilingColor: "#f5f5f5",
    playerSpawnPosition: [0, 0.5, 6],
    exitPosition: [0, 0.5, 8],
    rooms: [
      {
        id: "lobby",
        name: "Lobby",
        bounds: { minX: -10, maxX: 10, minZ: 4, maxZ: 8 },
        floorColor: "#b0b8c0",
        wallColor: "#d0d8e0",
        furniture: [
          {
            type: "reception",
            position: [0, 0.5, 5],
            color: "#8090a0",
            label: "Reception Desk",
          },
          { type: "chair", position: [-6, 0.5, 7], color: "#607080" },
          { type: "chair", position: [-4, 0.5, 7], color: "#607080" },
          { type: "chair", position: [4, 0.5, 7], color: "#607080" },
          { type: "chair", position: [6, 0.5, 7], color: "#607080" },
          { type: "plant", position: [-9, 0.5, 7.5], color: "#2d6a2d" },
          { type: "plant", position: [9, 0.5, 7.5], color: "#2d6a2d" },
        ],
      },
      {
        id: "officerRoom",
        name: "Officer Desks",
        bounds: { minX: -10, maxX: 2, minZ: -4, maxZ: 4 },
        floorColor: "#c0c8d0",
        wallColor: "#d8e0e8",
        furniture: [
          {
            type: "desk",
            position: [-7, 0.5, 2],
            color: "#8b7355",
            label: "Officer Desk",
          },
          { type: "chair", position: [-7, 0.5, 3], color: "#4a4a4a" },
          {
            type: "desk",
            position: [-4, 0.5, 2],
            color: "#8b7355",
            label: "Officer Desk",
          },
          { type: "chair", position: [-4, 0.5, 3], color: "#4a4a4a" },
          {
            type: "desk",
            position: [-7, 0.5, -1],
            color: "#8b7355",
            label: "Officer Desk",
          },
          { type: "chair", position: [-7, 0.5, 0], color: "#4a4a4a" },
          {
            type: "desk",
            position: [-4, 0.5, -1],
            color: "#8b7355",
            label: "Officer Desk",
          },
          { type: "chair", position: [-4, 0.5, 0], color: "#4a4a4a" },
          { type: "shelf", position: [-9.5, 1, 0], color: "#8b7355" },
          {
            type: "tv",
            position: [-1, 1.5, -3.5],
            color: "#1a1a1a",
            label: "Monitor",
          },
        ],
      },
      {
        id: "weaponsLocker",
        name: "Weapons Locker",
        bounds: { minX: 2, maxX: 10, minZ: -4, maxZ: 4 },
        floorColor: "#a8b0b8",
        wallColor: "#c8d0d8",
        furniture: [
          {
            type: "locker",
            position: [4, 1, -3.5],
            color: "#5a6a7a",
            label: "Weapons Locker",
          },
          {
            type: "locker",
            position: [6, 1, -3.5],
            color: "#5a6a7a",
            label: "Equipment Locker",
          },
          {
            type: "locker",
            position: [8, 1, -3.5],
            color: "#5a6a7a",
            label: "Armor Locker",
          },
          {
            type: "table",
            position: [6, 0.5, 0],
            color: "#8b7355",
            label: "Briefing Table",
          },
          { type: "chair", position: [4, 0.5, 0], color: "#4a4a4a" },
          { type: "chair", position: [8, 0.5, 0], color: "#4a4a4a" },
        ],
      },
      {
        id: "holdingCells",
        name: "Holding Cells",
        bounds: { minX: -10, maxX: 10, minZ: -8, maxZ: -4 },
        floorColor: "#909898",
        wallColor: "#b0b8b8",
        furniture: [
          {
            type: "cell",
            position: [-7, 0.5, -6],
            color: "#606868",
            label: "Cell 1",
          },
          {
            type: "cell",
            position: [-3, 0.5, -6],
            color: "#606868",
            label: "Cell 2",
          },
          {
            type: "cell",
            position: [1, 0.5, -6],
            color: "#606868",
            label: "Cell 3",
          },
          {
            type: "cell",
            position: [5, 0.5, -6],
            color: "#606868",
            label: "Cell 4",
          },
          {
            type: "desk",
            position: [8.5, 0.5, -5],
            color: "#8b7355",
            label: "Guard Desk",
          },
          { type: "chair", position: [8.5, 0.5, -4.5], color: "#4a4a4a" },
        ],
      },
    ],
    interactiveObjects: [
      {
        id: "pistol",
        type: "weapon",
        position: [4, 1.2, -3.5],
        label: "Service Pistol",
      },
      {
        id: "baton",
        type: "baton",
        position: [6, 1.2, -3.5],
        label: "Police Baton",
      },
      {
        id: "taser",
        type: "taser",
        position: [6.5, 1.2, -3.5],
        label: "Taser",
      },
      {
        id: "handcuffs",
        type: "handcuffs",
        position: [8, 1.2, -3.5],
        label: "Handcuffs",
      },
      {
        id: "armor_vest",
        type: "armor",
        position: [8.5, 1.2, -3.5],
        label: "Bulletproof Vest",
      },
      {
        id: "coffee",
        type: "drink",
        position: [-7, 1.1, 1.5],
        label: "Coffee",
      },
      { id: "donut", type: "food", position: [-4, 1.1, 1.5], label: "Donut" },
    ],
    npcSpawns: [
      {
        id: "officer1",
        role: "officer",
        position: [-7, 0.5, 2.5],
        name: "Officer Chen",
      },
      {
        id: "officer2",
        role: "officer",
        position: [-4, 0.5, 2.5],
        name: "Officer Davis",
      },
      {
        id: "receptionist1",
        role: "receptionist",
        position: [0, 0.5, 4.5],
        name: "Dispatch Kim",
      },
      {
        id: "officer3",
        role: "officer",
        position: [6, 0.5, 0.5],
        name: "Sgt. Williams",
      },
    ],
  },

  hospital: {
    buildingType: "hospital",
    displayName: "Hospital",
    size: [22, 18],
    floorColor: "#f0f0f0",
    wallColor: "#ffffff",
    ceilingColor: "#fafafa",
    playerSpawnPosition: [0, 0.5, 7],
    exitPosition: [0, 0.5, 9],
    rooms: [
      {
        id: "lobby",
        name: "Hospital Lobby",
        bounds: { minX: -11, maxX: 11, minZ: 5, maxZ: 9 },
        floorColor: "#e8f0f8",
        wallColor: "#f0f8ff",
        furniture: [
          {
            type: "reception",
            position: [0, 0.5, 6],
            color: "#a0b8d0",
            label: "Reception",
          },
          { type: "chair", position: [-7, 0.5, 8], color: "#4080c0" },
          { type: "chair", position: [-5, 0.5, 8], color: "#4080c0" },
          { type: "chair", position: [5, 0.5, 8], color: "#4080c0" },
          { type: "chair", position: [7, 0.5, 8], color: "#4080c0" },
          { type: "plant", position: [-10, 0.5, 8.5], color: "#2d8a2d" },
          { type: "plant", position: [10, 0.5, 8.5], color: "#2d8a2d" },
        ],
      },
      {
        id: "emergencyRoom",
        name: "Emergency Room",
        bounds: { minX: -11, maxX: 0, minZ: -2, maxZ: 5 },
        floorColor: "#e0f0e0",
        wallColor: "#f0fff0",
        furniture: [
          {
            type: "bed",
            position: [-8, 0.5, 3],
            color: "#ffffff",
            label: "Patient Bed",
          },
          {
            type: "bed",
            position: [-5, 0.5, 3],
            color: "#ffffff",
            label: "Patient Bed",
          },
          {
            type: "bed",
            position: [-8, 0.5, 0],
            color: "#ffffff",
            label: "Patient Bed",
          },
          {
            type: "bed",
            position: [-5, 0.5, 0],
            color: "#ffffff",
            label: "Patient Bed",
          },
          {
            type: "shelf",
            position: [-10.5, 1, 1],
            color: "#c0d8c0",
            label: "Medical Supplies",
          },
          {
            type: "desk",
            position: [-2, 0.5, 3],
            color: "#a0b8a0",
            label: "Nurse Station",
          },
          { type: "chair", position: [-2, 0.5, 4], color: "#4080c0" },
        ],
      },
      {
        id: "pharmacy",
        name: "Pharmacy",
        bounds: { minX: 0, maxX: 11, minZ: -2, maxZ: 5 },
        floorColor: "#f0f0e8",
        wallColor: "#fffff0",
        furniture: [
          {
            type: "counter",
            position: [5, 0.5, 3],
            color: "#c0c8a0",
            label: "Pharmacy Counter",
          },
          {
            type: "shelf",
            position: [9.5, 1, 0],
            color: "#c0c8a0",
            label: "Medicine Shelf",
          },
          {
            type: "shelf",
            position: [9.5, 1, 2],
            color: "#c0c8a0",
            label: "Medicine Shelf",
          },
          { type: "chair", position: [2, 0.5, 4], color: "#4080c0" },
          { type: "chair", position: [4, 0.5, 4], color: "#4080c0" },
        ],
      },
      {
        id: "icu",
        name: "ICU",
        bounds: { minX: -11, maxX: 11, minZ: -9, maxZ: -2 },
        floorColor: "#e8e8f8",
        wallColor: "#f0f0ff",
        furniture: [
          {
            type: "bed",
            position: [-8, 0.5, -4],
            color: "#ffffff",
            label: "ICU Bed",
          },
          {
            type: "bed",
            position: [-4, 0.5, -4],
            color: "#ffffff",
            label: "ICU Bed",
          },
          {
            type: "bed",
            position: [0, 0.5, -4],
            color: "#ffffff",
            label: "ICU Bed",
          },
          {
            type: "bed",
            position: [4, 0.5, -4],
            color: "#ffffff",
            label: "ICU Bed",
          },
          {
            type: "bed",
            position: [-8, 0.5, -7],
            color: "#ffffff",
            label: "ICU Bed",
          },
          {
            type: "bed",
            position: [-4, 0.5, -7],
            color: "#ffffff",
            label: "ICU Bed",
          },
          {
            type: "desk",
            position: [8, 0.5, -5],
            color: "#a0b8a0",
            label: "Doctor Station",
          },
          {
            type: "shelf",
            position: [10.5, 1, -7],
            color: "#c0d8c0",
            label: "Equipment",
          },
        ],
      },
    ],
    interactiveObjects: [
      {
        id: "medkit1",
        type: "medkit",
        position: [-10.5, 1.5, 1],
        label: "Med Kit",
        quantity: 3,
      },
      {
        id: "medkit2",
        type: "medkit",
        position: [9.5, 1.5, 0],
        label: "Med Kit",
        quantity: 2,
      },
      {
        id: "food1",
        type: "food",
        position: [5, 1.2, 2.5],
        label: "Hospital Meal",
      },
      { id: "drink1", type: "drink", position: [5, 1.2, 2.8], label: "Water" },
    ],
    npcSpawns: [
      {
        id: "doctor1",
        role: "doctor",
        position: [-2, 0.5, 3.5],
        name: "Dr. Patel",
      },
      {
        id: "nurse1",
        role: "nurse",
        position: [0, 0.5, 5.5],
        name: "Nurse Johnson",
      },
      {
        id: "nurse2",
        role: "nurse",
        position: [-8, 0.5, 1.5],
        name: "Nurse Martinez",
      },
      {
        id: "paramedic1",
        role: "paramedic",
        position: [5, 0.5, 3.5],
        name: "Paramedic Lee",
      },
    ],
  },

  dealership: {
    buildingType: "dealership",
    displayName: "Car Dealership",
    size: [24, 16],
    floorColor: "#e8e8e8",
    wallColor: "#f0f0f0",
    ceilingColor: "#ffffff",
    playerSpawnPosition: [0, 0.5, 6],
    exitPosition: [0, 0.5, 8],
    rooms: [
      {
        id: "showroom",
        name: "Showroom Floor",
        bounds: { minX: -12, maxX: 12, minZ: -4, maxZ: 8 },
        floorColor: "#d8d8d8",
        wallColor: "#f0f0f0",
        furniture: [
          {
            type: "car_display",
            position: [-8, 0.5, 2],
            color: "#cc2222",
            label: "Sports Car - $45,000",
          },
          {
            type: "car_display",
            position: [-3, 0.5, 2],
            color: "#2244cc",
            label: "Sedan - $28,000",
          },
          {
            type: "car_display",
            position: [3, 0.5, 2],
            color: "#22aa44",
            label: "SUV - $38,000",
          },
          {
            type: "car_display",
            position: [8, 0.5, 2],
            color: "#222222",
            label: "Luxury Car - $75,000",
          },
          {
            type: "car_display",
            position: [-8, 0.5, -2],
            color: "#ffaa00",
            label: "Pickup Truck - $35,000",
          },
          {
            type: "car_display",
            position: [8, 0.5, -2],
            color: "#ffffff",
            label: "Electric Car - $55,000",
          },
          { type: "plant", position: [-11, 0.5, 7.5], color: "#2d6a2d" },
          { type: "plant", position: [11, 0.5, 7.5], color: "#2d6a2d" },
        ],
      },
      {
        id: "salesOffice",
        name: "Sales Office",
        bounds: { minX: -12, maxX: 12, minZ: -8, maxZ: -4 },
        floorColor: "#c8c8c8",
        wallColor: "#e8e8e8",
        furniture: [
          {
            type: "desk",
            position: [-7, 0.5, -6],
            color: "#8b7355",
            label: "Sales Desk",
          },
          { type: "chair", position: [-7, 0.5, -5], color: "#4a4a4a" },
          { type: "chair", position: [-7, 0.5, -7], color: "#8b7355" },
          {
            type: "desk",
            position: [-2, 0.5, -6],
            color: "#8b7355",
            label: "Sales Desk",
          },
          { type: "chair", position: [-2, 0.5, -5], color: "#4a4a4a" },
          { type: "chair", position: [-2, 0.5, -7], color: "#8b7355" },
          {
            type: "desk",
            position: [4, 0.5, -6],
            color: "#8b7355",
            label: "Finance Desk",
          },
          { type: "chair", position: [4, 0.5, -5], color: "#4a4a4a" },
          {
            type: "shelf",
            position: [10.5, 1, -6],
            color: "#8b7355",
            label: "Brochures",
          },
          {
            type: "tv",
            position: [0, 1.5, -7.5],
            color: "#1a1a1a",
            label: "Promotions Screen",
          },
        ],
      },
    ],
    interactiveObjects: [
      {
        id: "coffee_d",
        type: "drink",
        position: [-7, 1.1, -5.5],
        label: "Coffee",
      },
      {
        id: "brochure",
        type: "food",
        position: [10.5, 1.5, -6],
        label: "Car Brochure",
      },
    ],
    npcSpawns: [
      {
        id: "dealer1",
        role: "dealer",
        position: [-7, 0.5, -5.5],
        name: "Sales Rep Tom",
      },
      {
        id: "dealer2",
        role: "dealer",
        position: [-2, 0.5, -5.5],
        name: "Sales Rep Sarah",
      },
      {
        id: "customer1",
        role: "customer",
        position: [-3, 0.5, 3],
        name: "Customer Mike",
      },
      {
        id: "customer2",
        role: "customer",
        position: [4, 0.5, 1],
        name: "Customer Lisa",
      },
    ],
  },

  home: {
    buildingType: "home",
    displayName: "Residential Home",
    size: [14, 12],
    floorColor: "#d4c4a0",
    wallColor: "#f0e8d8",
    ceilingColor: "#faf8f0",
    playerSpawnPosition: [0, 0.5, 4],
    exitPosition: [0, 0.5, 6],
    rooms: [
      {
        id: "livingRoom",
        name: "Living Room",
        bounds: { minX: -7, maxX: 7, minZ: 2, maxZ: 6 },
        floorColor: "#c8b890",
        wallColor: "#ede0c8",
        furniture: [
          {
            type: "sofa",
            position: [0, 0.5, 4.5],
            color: "#8b6914",
            label: "Sofa",
          },
          {
            type: "tv",
            position: [0, 1.2, 2.5],
            color: "#1a1a1a",
            label: "TV",
          },
          {
            type: "table",
            position: [0, 0.3, 3.5],
            color: "#8b7355",
            label: "Coffee Table",
          },
          { type: "plant", position: [-6, 0.5, 5.5], color: "#2d6a2d" },
          { type: "lamp", position: [5, 1, 5.5], color: "#f0d060" },
        ],
      },
      {
        id: "kitchen",
        name: "Kitchen",
        bounds: { minX: -7, maxX: 0, minZ: -2, maxZ: 2 },
        floorColor: "#d0c8b0",
        wallColor: "#f0e8d0",
        furniture: [
          {
            type: "counter",
            position: [-5, 0.5, 0],
            color: "#c0a870",
            label: "Kitchen Counter",
          },
          {
            type: "stove",
            position: [-5, 0.5, -1.5],
            color: "#808080",
            label: "Stove",
          },
          {
            type: "fridge",
            position: [-6.5, 1, -1.5],
            color: "#d0d0d0",
            label: "Fridge",
          },
          {
            type: "table",
            position: [-2, 0.5, 0],
            color: "#8b7355",
            label: "Dining Table",
          },
          { type: "chair", position: [-3, 0.5, 0], color: "#6b5335" },
          { type: "chair", position: [-1, 0.5, 0], color: "#6b5335" },
          { type: "chair", position: [-2, 0.5, 1], color: "#6b5335" },
          { type: "chair", position: [-2, 0.5, -1], color: "#6b5335" },
        ],
      },
      {
        id: "bedroom",
        name: "Bedroom",
        bounds: { minX: 0, maxX: 7, minZ: -2, maxZ: 2 },
        floorColor: "#c0b8a0",
        wallColor: "#e8e0d0",
        furniture: [
          {
            type: "bed",
            position: [4, 0.5, 0],
            color: "#8b6914",
            label: "Bed",
          },
          {
            type: "desk",
            position: [1, 0.5, -1.5],
            color: "#8b7355",
            label: "Desk",
          },
          { type: "chair", position: [1, 0.5, -0.5], color: "#6b5335" },
          {
            type: "shelf",
            position: [6.5, 1, 1.5],
            color: "#8b7355",
            label: "Wardrobe",
          },
          { type: "lamp", position: [6, 1, -1.5], color: "#f0d060" },
        ],
      },
      {
        id: "bathroom",
        name: "Bathroom",
        bounds: { minX: -7, maxX: 7, minZ: -6, maxZ: -2 },
        floorColor: "#d0d8e0",
        wallColor: "#e8f0f8",
        furniture: [
          {
            type: "toilet",
            position: [-5, 0.5, -4],
            color: "#f0f0f0",
            label: "Toilet",
          },
          {
            type: "sink",
            position: [-2, 0.5, -4],
            color: "#f0f0f0",
            label: "Sink",
          },
          {
            type: "shelf",
            position: [0, 1, -5.5],
            color: "#c0c8d0",
            label: "Medicine Cabinet",
          },
        ],
      },
    ],
    interactiveObjects: [
      {
        id: "food_home",
        type: "food",
        position: [-5, 1.1, 0],
        label: "Home Cooked Meal",
      },
      {
        id: "drink_home",
        type: "drink",
        position: [-5, 1.1, 0.3],
        label: "Water",
      },
      {
        id: "medkit_home",
        type: "medkit",
        position: [0, 1.5, -5.5],
        label: "First Aid Kit",
      },
    ],
    npcSpawns: [
      {
        id: "family1",
        role: "civilian",
        position: [-2, 0.5, 0.5],
        name: "Family Member",
      },
    ],
  },

  airport: {
    buildingType: "airport",
    displayName: "Airport Terminal",
    size: [30, 20],
    floorColor: "#e0e0e0",
    wallColor: "#f0f0f0",
    ceilingColor: "#ffffff",
    playerSpawnPosition: [0, 0.5, 8],
    exitPosition: [0, 0.5, 10],
    rooms: [
      {
        id: "checkIn",
        name: "Check-In Area",
        bounds: { minX: -15, maxX: 15, minZ: 5, maxZ: 10 },
        floorColor: "#d8d8e0",
        wallColor: "#f0f0f8",
        furniture: [
          {
            type: "counter",
            position: [-8, 0.5, 7],
            color: "#a0a8b8",
            label: "Check-In Counter A",
          },
          {
            type: "counter",
            position: [-3, 0.5, 7],
            color: "#a0a8b8",
            label: "Check-In Counter B",
          },
          {
            type: "counter",
            position: [3, 0.5, 7],
            color: "#a0a8b8",
            label: "Check-In Counter C",
          },
          {
            type: "counter",
            position: [8, 0.5, 7],
            color: "#a0a8b8",
            label: "Check-In Counter D",
          },
          {
            type: "tv",
            position: [0, 2, 9.5],
            color: "#1a1a1a",
            label: "Departures Board",
          },
        ],
      },
      {
        id: "waitingArea",
        name: "Waiting Area",
        bounds: { minX: -15, maxX: 15, minZ: -2, maxZ: 5 },
        floorColor: "#d0d8e8",
        wallColor: "#e8f0f8",
        furniture: [
          { type: "chair", position: [-10, 0.5, 2], color: "#4060a0" },
          { type: "chair", position: [-8, 0.5, 2], color: "#4060a0" },
          { type: "chair", position: [-6, 0.5, 2], color: "#4060a0" },
          { type: "chair", position: [-4, 0.5, 2], color: "#4060a0" },
          { type: "chair", position: [4, 0.5, 2], color: "#4060a0" },
          { type: "chair", position: [6, 0.5, 2], color: "#4060a0" },
          { type: "chair", position: [8, 0.5, 2], color: "#4060a0" },
          { type: "chair", position: [10, 0.5, 2], color: "#4060a0" },
          { type: "chair", position: [-10, 0.5, -1], color: "#4060a0" },
          { type: "chair", position: [-8, 0.5, -1], color: "#4060a0" },
          { type: "chair", position: [8, 0.5, -1], color: "#4060a0" },
          { type: "chair", position: [10, 0.5, -1], color: "#4060a0" },
          { type: "plant", position: [-14, 0.5, 4.5], color: "#2d6a2d" },
          { type: "plant", position: [14, 0.5, 4.5], color: "#2d6a2d" },
        ],
      },
      {
        id: "gates",
        name: "Gate Area",
        bounds: { minX: -15, maxX: 15, minZ: -10, maxZ: -2 },
        floorColor: "#c8d0e0",
        wallColor: "#e0e8f0",
        furniture: [
          {
            type: "gate",
            position: [-10, 0.5, -4],
            color: "#6080b0",
            label: "Gate A1",
          },
          {
            type: "gate",
            position: [-5, 0.5, -4],
            color: "#6080b0",
            label: "Gate A2",
          },
          {
            type: "gate",
            position: [0, 0.5, -4],
            color: "#6080b0",
            label: "Gate A3",
          },
          {
            type: "gate",
            position: [5, 0.5, -4],
            color: "#6080b0",
            label: "Gate A4",
          },
          {
            type: "gate",
            position: [10, 0.5, -4],
            color: "#6080b0",
            label: "Gate A5",
          },
          { type: "chair", position: [-10, 0.5, -7], color: "#4060a0" },
          { type: "chair", position: [-8, 0.5, -7], color: "#4060a0" },
          { type: "chair", position: [-5, 0.5, -7], color: "#4060a0" },
          { type: "chair", position: [-3, 0.5, -7], color: "#4060a0" },
          { type: "chair", position: [3, 0.5, -7], color: "#4060a0" },
          { type: "chair", position: [5, 0.5, -7], color: "#4060a0" },
          { type: "chair", position: [8, 0.5, -7], color: "#4060a0" },
          { type: "chair", position: [10, 0.5, -7], color: "#4060a0" },
        ],
      },
    ],
    interactiveObjects: [
      {
        id: "airport_food",
        type: "food",
        position: [0, 1.1, 0],
        label: "Airport Snack",
      },
      {
        id: "airport_drink",
        type: "drink",
        position: [0.5, 1.1, 0],
        label: "Bottled Water",
      },
    ],
    npcSpawns: [
      {
        id: "checkin1",
        role: "receptionist",
        position: [-8, 0.5, 6.5],
        name: "Check-In Agent",
      },
      {
        id: "checkin2",
        role: "receptionist",
        position: [-3, 0.5, 6.5],
        name: "Check-In Agent",
      },
      {
        id: "passenger1",
        role: "civilian",
        position: [-6, 0.5, 2],
        name: "Passenger",
      },
      {
        id: "passenger2",
        role: "civilian",
        position: [6, 0.5, 2],
        name: "Passenger",
      },
      {
        id: "passenger3",
        role: "civilian",
        position: [-5, 0.5, -7],
        name: "Passenger",
      },
    ],
  },

  hotel: {
    buildingType: "hotel",
    displayName: "Hotel",
    size: [20, 18],
    floorColor: "#d4c8a8",
    wallColor: "#ede0c0",
    ceilingColor: "#faf5e8",
    playerSpawnPosition: [0, 0.5, 7],
    exitPosition: [0, 0.5, 9],
    rooms: [
      {
        id: "lobby",
        name: "Hotel Lobby",
        bounds: { minX: -10, maxX: 10, minZ: 4, maxZ: 9 },
        floorColor: "#c8b888",
        wallColor: "#e8d8a8",
        furniture: [
          {
            type: "reception",
            position: [0, 0.5, 5.5],
            color: "#a08040",
            label: "Front Desk",
          },
          { type: "sofa", position: [-6, 0.5, 7.5], color: "#8b6914" },
          { type: "sofa", position: [6, 0.5, 7.5], color: "#8b6914" },
          {
            type: "table",
            position: [0, 0.3, 7.5],
            color: "#8b7355",
            label: "Lobby Table",
          },
          { type: "plant", position: [-9, 0.5, 8.5], color: "#2d6a2d" },
          { type: "plant", position: [9, 0.5, 8.5], color: "#2d6a2d" },
          { type: "lamp", position: [-8, 1.5, 5], color: "#f0d060" },
          { type: "lamp", position: [8, 1.5, 5], color: "#f0d060" },
        ],
      },
      {
        id: "hotelRoom1",
        name: "Hotel Room 101",
        bounds: { minX: -10, maxX: -3, minZ: -2, maxZ: 4 },
        floorColor: "#c0b090",
        wallColor: "#e0d0b0",
        furniture: [
          {
            type: "bed",
            position: [-7, 0.5, 1],
            color: "#8b6914",
            label: "King Bed",
          },
          {
            type: "desk",
            position: [-4, 0.5, -1.5],
            color: "#8b7355",
            label: "Work Desk",
          },
          { type: "chair", position: [-4, 0.5, -0.5], color: "#6b5335" },
          {
            type: "tv",
            position: [-9.5, 1.2, 1],
            color: "#1a1a1a",
            label: "TV",
          },
          { type: "lamp", position: [-4, 1, 3.5], color: "#f0d060" },
        ],
      },
      {
        id: "hotelRoom2",
        name: "Hotel Room 102",
        bounds: { minX: 3, maxX: 10, minZ: -2, maxZ: 4 },
        floorColor: "#c0b090",
        wallColor: "#e0d0b0",
        furniture: [
          {
            type: "bed",
            position: [7, 0.5, 1],
            color: "#8b6914",
            label: "King Bed",
          },
          {
            type: "desk",
            position: [4, 0.5, -1.5],
            color: "#8b7355",
            label: "Work Desk",
          },
          { type: "chair", position: [4, 0.5, -0.5], color: "#6b5335" },
          {
            type: "tv",
            position: [9.5, 1.2, 1],
            color: "#1a1a1a",
            label: "TV",
          },
          { type: "lamp", position: [4, 1, 3.5], color: "#f0d060" },
        ],
      },
      {
        id: "pool",
        name: "Indoor Pool",
        bounds: { minX: -10, maxX: 10, minZ: -9, maxZ: -2 },
        floorColor: "#a0c8e0",
        wallColor: "#c0e0f0",
        furniture: [
          {
            type: "pool_water",
            position: [0, 0.1, -5.5],
            color: "#2080c0",
            label: "Swimming Pool",
          },
          {
            type: "chair",
            position: [-8, 0.5, -3],
            color: "#f0e0a0",
            label: "Pool Chair",
          },
          {
            type: "chair",
            position: [-6, 0.5, -3],
            color: "#f0e0a0",
            label: "Pool Chair",
          },
          {
            type: "chair",
            position: [6, 0.5, -3],
            color: "#f0e0a0",
            label: "Pool Chair",
          },
          {
            type: "chair",
            position: [8, 0.5, -3],
            color: "#f0e0a0",
            label: "Pool Chair",
          },
          { type: "plant", position: [-9, 0.5, -8.5], color: "#2d8a2d" },
          { type: "plant", position: [9, 0.5, -8.5], color: "#2d8a2d" },
        ],
      },
    ],
    interactiveObjects: [
      {
        id: "hotel_food",
        type: "food",
        position: [0, 1.1, 7],
        label: "Room Service",
      },
      {
        id: "hotel_drink",
        type: "drink",
        position: [0.5, 1.1, 7],
        label: "Cocktail",
      },
    ],
    npcSpawns: [
      {
        id: "concierge",
        role: "receptionist",
        position: [0, 0.5, 5],
        name: "Concierge Alex",
      },
      {
        id: "guest1",
        role: "civilian",
        position: [-5, 0.5, 7],
        name: "Hotel Guest",
      },
      {
        id: "guest2",
        role: "civilian",
        position: [5, 0.5, 7],
        name: "Hotel Guest",
      },
    ],
  },
};

export function getInteriorLayout(
  buildingType: string,
): BuildingInteriorLayout | null {
  return BUILDING_INTERIORS[buildingType] ?? null;
}

export const BUILDING_DOOR_POSITIONS: Record<
  string,
  { position: [number, number, number]; buildingType: string; label: string }[]
> = {
  policeStation: [
    {
      position: [0, 0.5, 8],
      buildingType: "policeStation",
      label: "Police Station",
    },
  ],
  hospital: [
    { position: [0, 0.5, 9], buildingType: "hospital", label: "Hospital" },
  ],
  dealership: [
    {
      position: [0, 0.5, 8],
      buildingType: "dealership",
      label: "Car Dealership",
    },
  ],
  home: [{ position: [0, 0.5, 6], buildingType: "home", label: "Home" }],
  airport: [
    {
      position: [0, 0.5, 10],
      buildingType: "airport",
      label: "Airport Terminal",
    },
  ],
  hotel: [{ position: [0, 0.5, 9], buildingType: "hotel", label: "Hotel" }],
};
