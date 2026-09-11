/** Clearly marked placeholder for information not found in the resume/links. */
export default function Placeholder({ children, className = '' }) {
  return (
    <div className={`placeholder rounded-xl px-4 py-3 text-sm font-mono ${className}`}>
      <span className="mr-2 rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">placeholder</span>
      {children}
    </div>
  )
}
