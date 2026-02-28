import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { GameJob } from '../backend';
import { Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveProfile(
      {
        name: name.trim(),
        currentJob: GameJob.unemployed,
        avatarUrl: undefined,
        homeOwnership: undefined,
        relationships: [],
      },
      {
        onSuccess: () => toast.success('Welcome to Maplewood!'),
        onError: () => toast.error('Failed to create profile. Please try again.'),
      }
    );
  };

  return (
    <Dialog open={true}>
      <DialogContent className="panel-dark border-neon-orange/40 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-gaming text-neon-orange text-xl">
            CREATE YOUR CHARACTER
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your player name to start your adventure in Maplewood, Canada.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-neon-orange/50">
              <User className="w-10 h-10 text-neon-orange" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-foreground font-medium">
              Player Name
            </Label>
            <Input
              id="playerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="bg-muted border-border focus:border-neon-orange/60"
              maxLength={24}
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={!name.trim() || isPending}
            className="w-full btn-neon font-gaming text-sm tracking-wider"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> CREATING...</>
            ) : (
              'ENTER MAPLEWOOD'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
