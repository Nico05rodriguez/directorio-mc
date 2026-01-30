interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className = "" }: GlassCardProps) => {
  return (
    <div
      className={`
        bg-mc-glass 
        backdrop-blur-md 
        border border-white/30 
        shadow-glass 
        rounded-2xl 
        p-6 
        ${className}
      `}
    >
      {children}
    </div>
  );
};