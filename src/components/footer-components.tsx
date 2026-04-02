export function FooterAdmin() {
  return (
    <div className="bg-gray-50 p-4 text-center">
      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
        BarberFlow System © 2026 - Argentina
      </p>
    </div>
  );
}
export function FooterHome() {
  return (
    <div className="flex items-center justify-center gap-2 text-zinc-400 dark:text-zinc-600">
      <span className="text-xs font-medium">BarberFlow Argentina</span>
      <div className="w-1 h-1 bg-zinc-300 dark:bg-zinc-800 rounded-full"></div>
      <span className="text-xs font-medium">v2.0</span>
    </div>
  );
}
