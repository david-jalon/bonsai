export default function CVButton() {
  return (
    <a
      href="/CV_David-Jalon.pdf"
      download
      className="relative flex items-center justify-center gap-3 w-full max-w-sm px-6 py-4 rounded-2xl bg-amber text-terminal font-mono font-semibold transition-all duration-300 overflow-hidden group hover:brightness-110"
    >
      <span className="relative flex items-center gap-3">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Descargar CV
      </span>
    </a>
  )
}