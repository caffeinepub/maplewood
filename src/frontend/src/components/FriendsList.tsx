import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, UserMinus, UserPlus, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddFriend,
  useGetCallerUserProfile,
  useGetFriendsList,
  useRemoveFriend,
  useSearchProfiles,
} from "../hooks/useQueries";

interface FriendsListProps {
  onClose: () => void;
}

export default function FriendsList({ onClose }: FriendsListProps) {
  const { identity } = useInternetIdentity();
  useGetCallerUserProfile();
  const playerId = identity?.getPrincipal().toString() || "";
  const { data: friendIds = [], isLoading } = useGetFriendsList(playerId);
  const { mutate: addFriend, isPending: isAdding } = useAddFriend();
  const { mutate: removeFriend, isPending: isRemoving } = useRemoveFriend();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: searchResults = [], isLoading: isSearching } =
    useSearchProfiles(searchTerm);

  const handleAddFriend = (friendId: string) => {
    addFriend(friendId, {
      onSuccess: (result) => {
        if (result) toast.success("Friend added!");
        else toast.error("Could not add friend");
      },
      onError: () => toast.error("Failed to add friend"),
    });
  };

  const handleRemoveFriend = (friendId: string) => {
    removeFriend(friendId, {
      onSuccess: () => toast.success("Friend removed"),
      onError: () => toast.error("Failed to remove friend"),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="panel-dark rounded-lg w-full max-w-md mx-4 border border-neon-orange/30 animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-neon-orange" />
            <h2 className="font-gaming text-neon-orange text-lg tracking-wider">
              FRIENDS
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Tabs defaultValue="friends" className="p-4">
          <TabsList className="grid grid-cols-2 mb-4 bg-muted">
            <TabsTrigger value="friends" className="font-gaming text-xs">
              MY FRIENDS ({friendIds.length})
            </TabsTrigger>
            <TabsTrigger value="search" className="font-gaming text-xs">
              FIND PLAYERS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-neon-orange" />
              </div>
            ) : friendIds.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  No friends yet. Search for players to add!
                </p>
              </div>
            ) : (
              <ScrollArea className="h-64 scrollbar-gaming">
                <div className="space-y-2">
                  {friendIds.map((fid) => (
                    <div
                      key={fid}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 border border-neon-orange/30">
                          <AvatarFallback className="bg-muted text-neon-orange text-xs font-gaming">
                            {fid.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground font-medium truncate max-w-[140px]">
                          {fid.slice(0, 12)}...
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFriend(fid)}
                        disabled={isRemoving}
                        className="text-neon-red hover:text-neon-red/80 h-7 w-7"
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="search">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="pl-9 bg-muted border-border"
              />
            </div>
            <ScrollArea className="h-56 scrollbar-gaming">
              {isSearching ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-neon-orange" />
                </div>
              ) : searchTerm.length < 2 ? (
                <p className="text-center text-xs text-muted-foreground py-6">
                  Type at least 2 characters to search
                </p>
              ) : searchResults.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground py-6">
                  No players found
                </p>
              ) : (
                <div className="space-y-2">
                  {searchResults
                    .filter((p) => p.id !== playerId)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 bg-muted/30 rounded"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 border border-neon-orange/30">
                            <AvatarFallback className="bg-muted text-neon-orange text-xs font-gaming">
                              {p.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {p.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {p.currentJob}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddFriend(p.id)}
                          disabled={isAdding || friendIds.includes(p.id)}
                          className="btn-neon h-7 text-xs font-gaming"
                        >
                          {friendIds.includes(p.id) ? (
                            "ADDED"
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3 mr-1" /> ADD
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
