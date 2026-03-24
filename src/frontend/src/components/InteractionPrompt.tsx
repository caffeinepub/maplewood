interface InteractionPromptProps {
  text: string;
  visible: boolean;
}

export default function InteractionPrompt({
  text,
  visible,
}: InteractionPromptProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-fade-in">
      <div className="panel-glass rounded-lg px-4 py-2 flex items-center gap-3 border border-neon-orange/40">
        <div className="w-6 h-6 rounded border border-neon-orange/60 bg-neon-orange/10 flex items-center justify-center">
          <span className="font-gaming text-xs text-neon-orange">E</span>
        </div>
        <span className="text-sm text-foreground font-medium">{text}</span>
      </div>
    </div>
  );
}
