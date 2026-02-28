import { useState } from 'react';
import { X, Sword, Zap, Shield, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InventoryItem {
  id: string;
  name: string;
  type: 'weapon' | 'accessory' | 'consumable' | 'ability';
  era?: 'historical' | 'modern' | 'futuristic';
  equipped: boolean;
  icon: string;
  description: string;
}

interface InventoryUIProps {
  onClose: () => void;
  onEquip: (itemId: string) => void;
  flightEnabled: boolean;
  onToggleFlight: () => void;
}

const DEFAULT_ITEMS: InventoryItem[] = [
  { id: 'fists', name: 'Fists', type: 'weapon', era: 'historical', equipped: true, icon: '👊', description: 'Your bare hands' },
  { id: 'sword', name: 'Iron Sword', type: 'weapon', era: 'historical', equipped: false, icon: '⚔️', description: 'A classic blade from medieval times' },
  { id: 'pistol', name: 'Pistol', type: 'weapon', era: 'modern', equipped: false, icon: '🔫', description: 'Standard 9mm handgun' },
  { id: 'rifle', name: 'Assault Rifle', type: 'weapon', era: 'modern', equipped: false, icon: '🔫', description: 'Military-grade automatic rifle' },
  { id: 'laser', name: 'Laser Blaster', type: 'weapon', era: 'futuristic', equipped: false, icon: '⚡', description: 'Futuristic energy weapon' },
  { id: 'grenade', name: 'Grenade', type: 'weapon', era: 'modern', equipped: false, icon: '💣', description: 'Explosive device' },
  { id: 'jacket', name: 'Leather Jacket', type: 'accessory', equipped: false, icon: '🧥', description: '+5 armor' },
  { id: 'helmet', name: 'Combat Helmet', type: 'accessory', equipped: false, icon: '⛑️', description: '+10 armor' },
  { id: 'food', name: 'Burger', type: 'consumable', equipped: false, icon: '🍔', description: '+30 hunger' },
  { id: 'water', name: 'Water Bottle', type: 'consumable', equipped: false, icon: '💧', description: '+30 thirst' },
  { id: 'flight', name: 'Flight Power', type: 'ability', equipped: false, icon: '🦅', description: 'Superhuman flight ability' },
  { id: 'speed', name: 'Super Speed', type: 'ability', equipped: false, icon: '⚡', description: 'Move at superhuman speed' },
];

const ERA_COLORS: Record<string, string> = {
  historical: 'text-yellow-600',
  modern: 'text-blue-400',
  futuristic: 'text-purple-400',
};

export default function InventoryUI({ onClose, onEquip, flightEnabled, onToggleFlight }: InventoryUIProps) {
  const [items, setItems] = useState<InventoryItem[]>(DEFAULT_ITEMS);

  const handleEquip = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.type === 'weapon') {
          return { ...item, equipped: item.id === itemId ? !item.equipped : false };
        }
        if (item.id === itemId) return { ...item, equipped: !item.equipped };
        return item;
      })
    );
    onEquip(itemId);
  };

  const weapons = items.filter((i) => i.type === 'weapon');
  const accessories = items.filter((i) => i.type === 'accessory');
  const consumables = items.filter((i) => i.type === 'consumable');
  const abilities = items.filter((i) => i.type === 'ability');

  const ItemGrid = ({ itemList }: { itemList: InventoryItem[] }) => (
    <div className="grid grid-cols-3 gap-2">
      {itemList.map((item) => (
        <button
          key={item.id}
          onClick={() => item.id === 'flight' ? onToggleFlight() : handleEquip(item.id)}
          className={`p-2 rounded border text-center transition-all ${
            item.equipped || (item.id === 'flight' && flightEnabled)
              ? 'border-neon-orange/60 bg-neon-orange/10 neon-glow-orange'
              : 'border-border bg-muted/30 hover:border-neon-orange/30'
          }`}
        >
          <div className="text-2xl mb-1">{item.icon}</div>
          <div className="text-xs font-gaming text-foreground leading-tight">{item.name}</div>
          {item.era && (
            <div className={`text-[9px] ${ERA_COLORS[item.era] || 'text-muted-foreground'} mt-0.5`}>
              {item.era}
            </div>
          )}
          {(item.equipped || (item.id === 'flight' && flightEnabled)) && (
            <Badge className="mt-1 text-[8px] bg-neon-orange/20 text-neon-orange border-neon-orange/40 px-1 py-0">
              EQUIPPED
            </Badge>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="panel-dark rounded-lg w-full max-w-md mx-4 border border-neon-orange/30 animate-slide-in max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-neon-orange" />
            <h2 className="font-gaming text-neon-orange text-lg tracking-wider">INVENTORY</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Tabs defaultValue="weapons" className="p-4 overflow-y-auto scrollbar-gaming flex-1">
          <TabsList className="grid grid-cols-4 mb-4 bg-muted">
            <TabsTrigger value="weapons" className="font-gaming text-[10px]">
              <Sword className="w-3 h-3 mr-1" />WEAPONS
            </TabsTrigger>
            <TabsTrigger value="accessories" className="font-gaming text-[10px]">
              <Shield className="w-3 h-3 mr-1" />GEAR
            </TabsTrigger>
            <TabsTrigger value="consumables" className="font-gaming text-[10px]">ITEMS</TabsTrigger>
            <TabsTrigger value="abilities" className="font-gaming text-[10px]">
              <Zap className="w-3 h-3 mr-1" />POWERS
            </TabsTrigger>
          </TabsList>
          <TabsContent value="weapons"><ItemGrid itemList={weapons} /></TabsContent>
          <TabsContent value="accessories"><ItemGrid itemList={accessories} /></TabsContent>
          <TabsContent value="consumables"><ItemGrid itemList={consumables} /></TabsContent>
          <TabsContent value="abilities"><ItemGrid itemList={abilities} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
