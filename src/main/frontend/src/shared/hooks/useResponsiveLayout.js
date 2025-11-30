import { useEffect, useState } from "react";
import { BREAKPOINTS } from "../constants/breakpoints";

export function useResponsiveLayout() {
  const getWidth = () =>
    typeof window === "undefined" ? 1200 : window.innerWidth;

  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(getWidth());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width < BREAKPOINTS.tablet;
  const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
  const isDesktop = width >= BREAKPOINTS.desktop;

  return { width, isMobile, isTablet, isDesktop };
}
