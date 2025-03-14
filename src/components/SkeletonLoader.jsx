export default function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-300 dark:bg-gray-700 h-20 w-full rounded-lg mb-4"
        ></div>
      ))}
    </div>
  );
}
