import { useEffect, useState } from "react";

export const useElementSize = (elementId: string, dependencies: any[]) => {
  const [rect, setRect] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  // when page is resized / element reloads, set rect
  useEffect(() => {
    const handleResize = () => {
      const size = document.getElementById(elementId)?.getBoundingClientRect();
      if (!size) return;
      setRect({
        width: size.width,
        height: size.height,
        x: size.x,
        y: size.y,
      });
    };

    handleResize(); // call once at first

    const element = document.getElementById(elementId);
    element?.addEventListener("load", handleResize);
    window.addEventListener("resize", handleResize);
    return () => {
      element?.removeEventListener("load", handleResize);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRect, elementId, ...dependencies]);

  return rect;
};
