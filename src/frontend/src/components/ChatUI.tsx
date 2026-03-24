import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Mic, MicOff, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGetCallerUserProfile } from "../hooks/useQueries";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  type: "global" | "system" | "proximity";
}

interface ChatUIProps {
  enabled?: boolean;
}

const SYSTEM_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    sender: "SYSTEM",
    text: "Welcome to Maplewood, Canada! Explore the city, mountains, and forests.",
    timestamp: new Date(),
    type: "system",
  },
  {
    id: "2",
    sender: "SYSTEM",
    text: "Press E to interact with objects and NPCs. Press V to toggle camera.",
    timestamp: new Date(),
    type: "system",
  },
];

export default function ChatUI({ enabled = true }: ChatUIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(SYSTEM_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [micActive, setMicActive] = useState(false);
  const { data: profile } = useGetCallerUserProfile();
  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: messages and isOpen are intentional scroll triggers
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!enabled) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: profile?.name || "Player",
      text: inputText.trim(),
      timestamp: new Date(),
      type: "global",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
    e.stopPropagation();
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {isOpen ? (
        <div className="panel-glass rounded-lg w-72 border border-neon-orange/20 animate-slide-in">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="font-gaming text-xs text-neon-orange tracking-wider">
              CHAT
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${micActive ? "text-neon-orange" : "text-muted-foreground"}`}
                onClick={() => setMicActive(!micActive)}
              >
                {micActive ? (
                  <Mic className="w-3 h-3" />
                ) : (
                  <MicOff className="w-3 h-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <ScrollArea
            className="h-40 px-3 py-2 scrollbar-gaming"
            ref={scrollRef as React.RefObject<HTMLDivElement>}
          >
            <div className="space-y-1">
              {messages.map((msg) => (
                <div key={msg.id} className="text-xs">
                  {msg.type === "system" ? (
                    <span className="text-neon-yellow italic">{msg.text}</span>
                  ) : (
                    <>
                      <span className="text-neon-orange font-medium">
                        {msg.sender}:{" "}
                      </span>
                      <span className="text-foreground">{msg.text}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-1 p-2 border-t border-border">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="h-7 text-xs bg-muted border-border flex-1"
            />
            <Button
              size="icon"
              onClick={handleSend}
              className="h-7 w-7 btn-neon"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="panel-glass border border-neon-orange/30 rounded-full h-10 w-10 p-0 hover:border-neon-orange/60"
          variant="ghost"
        >
          <MessageSquare className="w-5 h-5 text-neon-orange" />
        </Button>
      )}
    </div>
  );
}
