import { useEffect, useState } from "react";
import { FloatingButton } from "./BackToTopButton.styles";

const SHOW_BUTTON_SCROLL_Y = 320;

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > SHOW_BUTTON_SCROLL_Y);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleScrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!isVisible) {
    return null;
  }

  return (
    <FloatingButton
      type="button"
      aria-label="回到頁面頂部"
      data-testid="back-to-top-button"
      onClick={handleScrollToTop}
    >
      置頂
    </FloatingButton>
  );
}