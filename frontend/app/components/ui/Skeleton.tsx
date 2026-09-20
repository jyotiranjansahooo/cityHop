import type { HTMLAttributes } from "react";

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Skeleton({
  className,
  ...props
}: SkeletonProps): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className={
        "animate-pulse rounded-xl bg-[#C7D1D8]" +
        (className ? " " + className : "")
      }
      {...props}
    />
  );
}

