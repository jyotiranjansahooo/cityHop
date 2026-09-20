"use client";

import Image from "next/image";
import { useState } from "react";
import Skeleton from "./Skeleton";

interface RemoteImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

export default function RemoteImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
}: RemoteImageProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div className={"relative overflow-hidden " + className}>
      {isLoading && (
        <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-none" />
      )}

      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
}
