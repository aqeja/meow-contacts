import { useEffect, useRef } from "react";
import { useLocation, Location } from "react-router-dom";
import { scrollStorage } from "@/common/scroll";
import { useRecoilValue } from "recoil";
import { contactListElementState } from "@/store";

export function useRestoreScroll() {
  const location = useLocation();
  const prevLocation = useRef<Location | null>(null);
  const contactListElement = useRecoilValue(contactListElementState);
  useEffect(() => {
    if (!contactListElement) return;
    if (prevLocation.current && prevLocation.current.pathname !== location.pathname) {
      const prevPath = prevLocation.current.pathname;
      if (prevPath.startsWith("/person/") && location.pathname === "/") {
        contactListElement.scrollTop = scrollStorage.getPahScrollTop("/");
      }
    }
    prevLocation.current = location;
  }, [location, contactListElement]);
}
