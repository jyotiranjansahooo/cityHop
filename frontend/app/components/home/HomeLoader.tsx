"use client";

import { useEffect, useState } from "react";
import Loading from "../../loading";

interface HomeLoaderProps {
  children: React.ReactNode;
}

export default function HomeLoader({
  children,
}: HomeLoaderProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}