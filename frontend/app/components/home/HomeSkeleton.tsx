import Skeleton from "../ui/Skeleton";

interface HomeSkeletonProps {
  className?: string;
}

export default function HomeSkeleton({
  className = "",
}: HomeSkeletonProps): React.ReactElement {
  return (
    <main
      className={
        "min-h-screen bg-[#E8ECF3] px-5 py-5 sm:px-8 lg:px-12 " + className
      }
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-center justify-between rounded-[28px] bg-[#D6DADB] px-6 py-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-28" />
          </div>

          <div className="hidden gap-8 lg:flex">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-14" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-10 w-20 rounded-full" />
            <Skeleton className="hidden h-10 w-28 rounded-full sm:block" />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[38px] bg-[#D6DADB] p-7 sm:p-10 lg:p-14">
          <div className="grid min-h-[560px] items-center gap-10 lg:grid-cols-2">
            <div>
              <Skeleton className="h-6 w-52 rounded-full" />

              <Skeleton className="mt-6 h-20 w-full max-w-xl rounded-2xl" />
              <Skeleton className="mt-3 h-20 w-4/5 max-w-xl rounded-2xl" />

              <Skeleton className="mt-6 h-5 w-full max-w-lg" />
              <Skeleton className="mt-2 h-5 w-4/5 max-w-lg" />

              <div className="mt-8 flex gap-3">
                <Skeleton className="h-12 w-36 rounded-full" />
                <Skeleton className="h-12 w-36 rounded-full" />
              </div>
            </div>

            <Skeleton className="h-[380px] w-full rounded-[40px] lg:h-[470px]" />
          </div>

          <div className="mt-8 rounded-[26px] bg-[#CBD3D6] p-4">
            <Skeleton className="h-8 w-72" />

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-[28px] bg-[#D3D9DA] md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-6">
              <Skeleton className="h-7 w-7 rounded-lg" />
              <Skeleton className="mt-4 h-8 w-20" />
              <Skeleton className="mt-2 h-4 w-24" />
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="mt-3 h-12 w-96 max-w-full" />

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-[28px] bg-[#D6DADB] p-6">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <Skeleton className="mt-10 h-6 w-36" />
                <Skeleton className="mt-3 h-12 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="mt-3 h-12 w-80 max-w-full" />

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[30px] bg-[#D4D9D9]"
              >
                <Skeleton className="h-64 w-full rounded-none" />

                <div className="p-5">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="mt-2 h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
