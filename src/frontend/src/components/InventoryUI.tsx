import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Shield, Sword, X, Zap } from "lucide-react";
import { useState } from "react";
import { GameJob } from "../backend";

interface InventoryItem {
  id: string;
  name: string;
  type: "weapon" | "accessory" | "consumable" | "ability";
  era?: "historical" | "modern" | "futuristic";
  equipped: boolean;
  imageUrl: string;
  description: string;
  jobRequired?: GameJob;
  quantity?: number;
  usable?: boolean;
}

interface InventoryUIProps {
  onClose: () => void;
  onEquip: (itemId: string) => void;
  flightEnabled: boolean;
  onToggleFlight: () => void;
  currentJob?: GameJob;
}

// Photorealistic weapon images from online sources
const WEAPON_IMAGES: Record<string, string> = {
  fists:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=128&h=128&fit=crop",
  sword:
    "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=128&h=128&fit=crop",
  pistol:
    "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=128&h=128&fit=crop",
  rifle:
    "https://images.unsplash.com/photo-1584515933487-779824d29309?w=128&h=128&fit=crop",
  laser:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=128&h=128&fit=crop",
  grenade:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=128&h=128&fit=crop",
  jacket:
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=128&h=128&fit=crop",
  helmet:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=128&h=128&fit=crop",
  food: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=128&h=128&fit=crop",
  water:
    "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=128&h=128&fit=crop",
  flight:
    "https://images.unsplash.com/photo-1436891620584-47fd0e565afb?w=128&h=128&fit=crop",
  speed:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=128&h=128&fit=crop",
  baton:
    "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=128&h=128&fit=crop",
  taser:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=128&h=128&fit=crop",
  handcuffs:
    "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=128&h=128&fit=crop",
  armor_vest:
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=128&h=128&fit=crop",
  heavy_armor:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=128&h=128&fit=crop",
  assault_rifle:
    "https://images.unsplash.com/photo-1584515933487-779824d29309?w=128&h=128&fit=crop",
  flashbang:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=128&h=128&fit=crop",
  medkit:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=128&h=128&fit=crop",
  extinguisher:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=128&h=128&fit=crop",
};

const DEFAULT_ITEMS: InventoryItem[] = [
  {
    id: "fists",
    name: "Fists",
    type: "weapon",
    era: "historical",
    equipped: true,
    imageUrl: WEAPON_IMAGES.fists,
    description: "Your bare hands",
  },
  {
    id: "sword",
    name: "Iron Sword",
    type: "weapon",
    era: "historical",
    equipped: false,
    imageUrl: WEAPON_IMAGES.sword,
    description: "A classic blade from medieval times",
  },
  {
    id: "pistol",
    name: "Pistol",
    type: "weapon",
    era: "modern",
    equipped: false,
    imageUrl: WEAPON_IMAGES.pistol,
    description: "Standard 9mm handgun",
  },
  {
    id: "rifle",
    name: "Assault Rifle",
    type: "weapon",
    era: "modern",
    equipped: false,
    imageUrl: WEAPON_IMAGES.rifle,
    description: "Military-grade automatic rifle",
  },
  {
    id: "laser",
    name: "Laser Blaster",
    type: "weapon",
    era: "futuristic",
    equipped: false,
    imageUrl: WEAPON_IMAGES.laser,
    description: "Futuristic energy weapon",
  },
  {
    id: "grenade",
    name: "Grenade",
    type: "weapon",
    era: "modern",
    equipped: false,
    imageUrl: WEAPON_IMAGES.grenade,
    description: "Explosive device",
  },
  {
    id: "jacket",
    name: "Leather Jacket",
    type: "accessory",
    equipped: false,
    imageUrl: WEAPON_IMAGES.jacket,
    description: "+5 armor",
  },
  {
    id: "helmet",
    name: "Combat Helmet",
    type: "accessory",
    equipped: false,
    imageUrl: WEAPON_IMAGES.helmet,
    description: "+10 armor",
  },
  {
    id: "food",
    name: "Burger",
    type: "consumable",
    equipped: false,
    imageUrl: WEAPON_IMAGES.food,
    description: "+30 hunger",
    usable: true,
  },
  {
    id: "water",
    name: "Water Bottle",
    type: "consumable",
    equipped: false,
    imageUrl: WEAPON_IMAGES.water,
    description: "+30 thirst",
    usable: true,
  },
  {
    id: "flight",
    name: "Flight Power",
    type: "ability",
    equipped: false,
    imageUrl: WEAPON_IMAGES.flight,
    description: "Superhuman flight ability",
  },
  {
    id: "speed",
    name: "Super Speed",
    type: "ability",
    equipped: false,
    imageUrl: WEAPON_IMAGES.speed,
    description: "Move at superhuman speed",
  },
];

// Career-specific items per job
const JOB_ITEMS: Record<string, InventoryItem[]> = {
  [GameJob.policeOfficer]: [
    {
      id: "baton",
      name: "Police Baton",
      type: "weapon",
      era: "modern",
      equipped: false,
      imageUrl: WEAPON_IMAGES.baton,
      description: "Standard issue baton",
      jobRequired: GameJob.policeOfficer,
    },
    {
      id: "taser",
      name: "Taser",
      type: "weapon",
      era: "modern",
      equipped: false,
      imageUrl: WEAPON_IMAGES.taser,
      description: "Non-lethal stun weapon",
      jobRequired: GameJob.policeOfficer,
    },
    {
      id: "handcuffs",
      name: "Handcuffs",
      type: "accessory",
      equipped: false,
      imageUrl: WEAPON_IMAGES.handcuffs,
      description: "For arresting suspects [E near NPC]",
      jobRequired: GameJob.policeOfficer,
    },
    {
      id: "armor_vest",
      name: "Bulletproof Vest",
      type: "accessory",
      equipped: true,
      imageUrl: WEAPON_IMAGES.armor_vest,
      description: "+25 armor",
      jobRequired: GameJob.policeOfficer,
    },
  ],
  [GameJob.swat]: [
    {
      id: "heavy_armor",
      name: "Heavy Armor",
      type: "accessory",
      equipped: true,
      imageUrl: WEAPON_IMAGES.heavy_armor,
      description: "+50 armor",
      jobRequired: GameJob.swat,
    },
    {
      id: "assault_rifle",
      name: "SWAT Rifle",
      type: "weapon",
      era: "modern",
      equipped: true,
      imageUrl: WEAPON_IMAGES.assault_rifle,
      description: "High-powered tactical rifle",
      jobRequired: GameJob.swat,
    },
    {
      id: "flashbang",
      name: "Flashbang",
      type: "consumable",
      equipped: false,
      imageUrl: WEAPON_IMAGES.flashbang,
      description: "Stuns NPCs in 5-unit radius for 3s",
      jobRequired: GameJob.swat,
      quantity: 3,
      usable: true,
    },
  ],
  [GameJob.firstResponder]: [
    {
      id: "medkit",
      name: "Med Kit",
      type: "consumable",
      equipped: false,
      imageUrl: WEAPON_IMAGES.medkit,
      description: "Heals injured NPCs and restores health [E near NPC]",
      jobRequired: GameJob.firstResponder,
      quantity: 5,
      usable: true,
    },
    {
      id: "extinguisher",
      name: "Fire Extinguisher",
      type: "consumable",
      equipped: false,
      imageUrl: WEAPON_IMAGES.extinguisher,
      description: "Suppresses fire effects",
      jobRequired: GameJob.firstResponder,
      quantity: 3,
      usable: true,
    },
  ],
};

const ERA_COLORS: Record<string, string> = {
  historical: "text-yellow-600",
  modern: "text-blue-400",
  futuristic: "text-purple-400",
};

export default function InventoryUI({
  onClose,
  onEquip,
  flightEnabled,
  onToggleFlight,
  currentJob,
}: InventoryUIProps) {
  const jobItems = currentJob ? (JOB_ITEMS[currentJob] ?? []) : [];
  const allItems = [...DEFAULT_ITEMS, ...jobItems];
  const [items, setItems] = useState<InventoryItem[]>(allItems);
  const [_usedItems, setUsedItems] = useState<Set<string>>(new Set());

  const handleEquip = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.type === "weapon") {
          return {
            ...item,
            equipped: item.id === itemId ? !item.equipped : false,
          };
        }
        if (item.id === itemId) return { ...item, equipped: !item.equipped };
        return item;
      }),
    );
    onEquip(itemId);
  };

  const handleUse = (item: InventoryItem) => {
    if (item.quantity !== undefined && item.quantity > 0) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: Math.max(0, (i.quantity ?? 1) - 1) }
            : i,
        ),
      );
    }
    setUsedItems((prev) => new Set([...prev, item.id]));
    onEquip(item.id);
  };

  const weapons = items.filter((i) => i.type === "weapon");
  const accessories = items.filter((i) => i.type === "accessory");
  const consumables = items.filter((i) => i.type === "consumable");
  const abilities = items.filter((i) => i.type === "ability");

  const ItemGrid = ({ itemList }: { itemList: InventoryItem[] }) => (
    <div className="grid grid-cols-3 gap-2">
      {itemList.map((item) => (
        <div
          key={item.id}
          className={`p-2 rounded border text-center transition-all ${
            item.equipped || (item.id === "flight" && flightEnabled)
              ? "border-neon-orange/60 bg-neon-orange/10 neon-glow-orange"
              : "border-border bg-muted/30 hover:border-neon-orange/30"
          }`}
        >
          {/* Item image */}
          <button
            type="button"
            onClick={() =>
              item.id === "flight" ? onToggleFlight() : handleEquip(item.id)
            }
            className="w-full"
          >
            <div className="w-full aspect-square mb-1 rounded overflow-hidden bg-muted/50">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="text-xs font-gaming text-foreground leading-tight">
              {item.name}
            </div>
            {item.era && (
              <div
                className={`text-[9px] ${ERA_COLORS[item.era] || "text-muted-foreground"} mt-0.5`}
              >
                {item.era}
              </div>
            )}
            {item.quantity !== undefined && (
              <div className="text-[9px] text-neon-yellow mt-0.5">
                x{item.quantity}
              </div>
            )}
            {(item.equipped || (item.id === "flight" && flightEnabled)) && (
              <Badge className="mt-1 text-[8px] bg-neon-orange/20 text-neon-orange border-neon-orange/40 px-1 py-0">
                EQUIPPED
              </Badge>
            )}
          </button>
          {/* Use button for usable consumables */}
          {item.usable && (
            <button
              type="button"
              onClick={() => handleUse(item)}
              disabled={(item.quantity ?? 1) <= 0}
              className="mt-1 w-full text-[9px] font-gaming bg-neon-orange/20 hover:bg-neon-orange/40 text-neon-orange border border-neon-orange/40 rounded px-1 py-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              USE
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-2">
      <div className="panel-dark rounded-lg w-full max-w-md mx-auto border border-neon-orange/30 animate-slide-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 md:w-5 md:h-5 text-neon-orange" />
            <h2 className="font-gaming text-neon-orange text-base md:text-lg tracking-wider">
              INVENTORY
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 md:h-9 md:w-9"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Tabs
          defaultValue="weapons"
          className="p-3 md:p-4 overflow-y-auto scrollbar-gaming flex-1"
        >
          <TabsList className="grid grid-cols-4 mb-3 md:mb-4 bg-muted">
            <TabsTrigger
              value="weapons"
              className="font-gaming text-[9px] md:text-[10px] px-1"
            >
              <Sword className="w-3 h-3 mr-0.5 md:mr-1" />
              WEAPONS
            </TabsTrigger>
            <TabsTrigger
              value="accessories"
              className="font-gaming text-[9px] md:text-[10px] px-1"
            >
              <Shield className="w-3 h-3 mr-0.5 md:mr-1" />
              GEAR
            </TabsTrigger>
            <TabsTrigger
              value="consumables"
              className="font-gaming text-[9px] md:text-[10px] px-1"
            >
              ITEMS
            </TabsTrigger>
            <TabsTrigger
              value="abilities"
              className="font-gaming text-[9px] md:text-[10px] px-1"
            >
              <Zap className="w-3 h-3 mr-0.5 md:mr-1" />
              POWERS
            </TabsTrigger>
          </TabsList>
          <TabsContent value="weapons">
            <ItemGrid itemList={weapons} />
          </TabsContent>
          <TabsContent value="accessories">
            <ItemGrid itemList={accessories} />
          </TabsContent>
          <TabsContent value="consumables">
            <ItemGrid itemList={consumables} />
          </TabsContent>
          <TabsContent value="abilities">
            <ItemGrid itemList={abilities} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
