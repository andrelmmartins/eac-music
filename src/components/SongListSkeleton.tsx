const SongListSkeleton = () => {
  return (
    <div className="bg-dark-800/50 backdrop-blur-sm rounded-lg border border-dark-700 overflow-hidden">
      <div className="hidden sm:block px-4 lg:px-8 py-4 border-b border-dark-700">
        <div className="grid grid-cols-11 gap-4">
          <div className="col-span-1 flex justify-center">
            <div className="w-4 h-4 bg-dark-700 rounded animate-pulse" />
          </div>
          <div className="col-span-5">
            <div className="h-4 bg-dark-700 rounded animate-pulse w-24" />
          </div>
          <div className="col-span-3">
            <div className="h-4 bg-dark-700 rounded animate-pulse w-12" />
          </div>
          <div className="col-span-2">
            <div className="h-4 bg-dark-700 rounded animate-pulse w-16" />
          </div>
        </div>
      </div>

      <div className="divide-y divide-dark-700">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="px-4 sm:px-8 py-3 sm:py-4">
            <div className="hidden sm:grid grid-cols-11 gap-4 items-center">
              <div className="col-span-1 flex justify-center">
                <div className="w-4 h-4 bg-dark-700 rounded animate-pulse" />
              </div>
              <div className="col-span-5 min-w-0">
                <div className="h-4 bg-dark-700 rounded animate-pulse w-3/4 mb-2" />
                <div className="h-3 bg-dark-700 rounded animate-pulse w-1/2" />
              </div>
              <div className="col-span-3">
                <div className="h-4 bg-dark-700 rounded animate-pulse w-8" />
              </div>
              <div className="col-span-2">
                <div className="h-6 bg-dark-700 rounded-full animate-pulse w-16" />
              </div>
            </div>

            <div className="sm:hidden">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-dark-700 rounded animate-pulse shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 bg-dark-700 rounded animate-pulse w-3/4" />
                  <div className="flex items-center gap-2">
                    <div className="h-3 bg-dark-700 rounded animate-pulse w-10" />
                    <div className="h-5 bg-dark-700 rounded-full animate-pulse w-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongListSkeleton;
