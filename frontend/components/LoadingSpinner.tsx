export default function LoadingSpinner({ size = 'md', label }: { size?: 'sm' | 'md' | 'lg'; label?: string }) {
  const s = { sm: 'w-4 h-4 border', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-2' }[size];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${s} rounded-full animate-spin`} style={{
        borderColor: 'rgba(124,58,237,0.2)',
        borderTopColor: '#7c3aed',
        borderRightColor: '#06b6d4',
      }} />
      {label && <p className="text-xs text-slate-500 animate-pulse">{label}</p>}
    </div>
  );
}
