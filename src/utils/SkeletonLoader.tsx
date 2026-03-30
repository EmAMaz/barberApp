function SkeletonLoader() {
  return (
    <div className="grid grid-cols-3 gap-3 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-14 bg-gray-200 rounded-2xl"></div>
      ))}
    </div>
  );
}

export default SkeletonLoader;