export default function Bio() {
    return (
        <div className="flex flex-col items-center gap-1 text-center">
            <div>
                <h1 className="font-mono text-2xl font-bold tracking-tight">David Jalón</h1>
                <p className="font-mono text-sm text-amber">➜ junior developer</p>
            </div>
            <p className="max-w-xs font-mono text-sm leading-relaxed text-text/70">
                Focused on backend, with some frontend and DevOps knowledge.
             </p>
        </div>
    )
}