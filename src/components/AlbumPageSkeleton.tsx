import SongListSkeleton from "./SongListSkeleton";

const AlbumPageSkeleton = () => {
  return (
    <div className="min-h-screen">
      <div className="relative p-4 sm:p-6 lg:p-8 bg-dark-800/50 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-end space-y-6 sm:space-y-0 sm:space-x-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-dark-700 rounded-lg shrink-0 mx-auto sm:mx-0" />
          <div className="flex-1 min-w-0 text-center sm:text-left space-y-4">
            <div className="h-8 sm:h-10 lg:h-12 bg-dark-700 rounded w-3/4 mx-auto sm:mx-0" />
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <div className="h-7 w-20 bg-dark-700 rounded-full" />
              <div className="h-7 w-24 bg-dark-700 rounded-full" />
            </div>
            <div className="h-12 w-36 bg-dark-700 rounded-full mx-auto sm:mx-0" />
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-8">
        <SongListSkeleton />
      </div>
    </div>
  );
};

export default AlbumPageSkeleton;
