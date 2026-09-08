export default function Avatar() {
  return (
    <div className="w-36 h-36 flex flex-col overflow-hidden rounded-lg border border-amber bg-surface avatar-glow">
      <div className="flex items-center gap-1.5 border border-amber px-3 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ml-2 font-mono text-[10px] text-text">avatar.png</span>
      </div>
      <img src="/avatar.png" alt="Avatar" className="w-full flex-1 min-h-0 object-cover" style={{ objectPosition: '50% 13%' }}/>
    </div>
  )
}
