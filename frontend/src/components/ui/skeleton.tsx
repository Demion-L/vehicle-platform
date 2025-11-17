import * as React from "react";
import clsx from "clsx";

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={clsx("animate-pulse rounded-md bg-slate-800/60", className)}
      {...props}
    />
  );
}

export { Skeleton };

