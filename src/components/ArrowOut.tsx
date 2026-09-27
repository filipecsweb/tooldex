// Outbound-link mark, drawn to match Franklin's stroke weight.
export default function ArrowOut({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="0.8em" height="0.8em" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M3 9 9 3M4.2 3H9v4.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
    </svg>
  );
}
