export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 bg-coral rounded-full flex-shrink-0 flex items-center justify-center shadow-soft">
        <span className="text-white text-xs font-bold">知</span>
      </div>
      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-soft">
        <div className="flex gap-1 items-center h-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-coral rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
