"use client";

import {
  HeartIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState, Fragment } from "react";
import { PathName } from "@/routers/types";
import MenuBar from "@/shared/MenuBar";
import isInViewport from "@/utils/isInViewport";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, Transition, Tab } from "@headlessui/react";
import MobileSearchModal from "@/app/(client-components)/(HeroSearchForm2Mobile)/HeroSearchForm2Mobile";

let WIN_PREV_POSITION = 0;
if (typeof window !== "undefined") {
  WIN_PREV_POSITION = window.pageYOffset;
}

interface NavItem {
  name: string;
  link?: PathName;
  icon: any;
}

const NAV: NavItem[] = [
  {
    name: "Wishlists",
    link: "/account-savelists",
    icon: HeartIcon,
  },
  {
    name: "Log in",
    link: "/account",
    icon: UserCircleIcon,
  },
  {
    name: "Menu",
    icon: MenuBar,
  },
];

const FooterNav = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEvent = () => {
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(showHideHeaderMenu);
    }
  };

  const showHideHeaderMenu = () => {
    let currentScrollPos = window.pageYOffset;
    if (!containerRef.current) return;
    if (currentScrollPos > WIN_PREV_POSITION) {
      if (
        isInViewport(containerRef.current) &&
        currentScrollPos - WIN_PREV_POSITION < 80
      ) {
        return;
      }
      containerRef.current.classList.add("FooterNav--hide");
    } else {
      if (
        !isInViewport(containerRef.current) &&
        WIN_PREV_POSITION - currentScrollPos < 80
      ) {
        return;
      }
      containerRef.current.classList.remove("FooterNav--hide");
    }
    WIN_PREV_POSITION = currentScrollPos;
  };

  // Renderiza los iconos de la navbar, con la lupa en el centro
  const renderFooterNav = () => {
    const navItems = NAV;
    const centerIndex = Math.floor(navItems.length / 2);
    const itemsWithLupa: { name: string; icon?: any; link?: PathName }[] = [
      ...navItems.slice(0, centerIndex),
      { name: "Buscador", icon: MagnifyingGlassIcon },
      ...navItems.slice(centerIndex),
    ];
    return itemsWithLupa.map((item, index) => {
      if (item.name === "Buscador") {
        return (
          <button
            key={index}
            className={`flex flex-col items-center justify-between text-neutral-500 dark:text-neutral-300/90`}
            onClick={() => setShowSearch(true)}
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
            <span className="text-[11px] leading-none mt-1">Buscador</span>
          </button>
        );
      }
    const isActive = pathname === item.link;
    return item.link ? (
      <Link
        key={index}
        href={item.link}
        className={`flex flex-col items-center justify-between text-neutral-500 dark:text-neutral-300/90 ${
          isActive ? "text-neutral-900 dark:text-neutral-100" : ""
        }`}
      >
          {item.icon && (
        <item.icon className={`w-6 h-6 ${isActive ? "text-red-600" : ""}`} />
          )}
        <span
          className={`text-[11px] leading-none mt-1 ${
            isActive ? "text-red-600" : ""
          }`}
        >
          {item.name}
        </span>
      </Link>
    ) : (
      <div
        key={index}
        className={`flex flex-col items-center justify-between text-neutral-500 dark:text-neutral-300/90 ${
          isActive ? "text-neutral-900 dark:text-neutral-100" : ""
        }`}
      >
          {item.icon && (
        <item.icon iconClassName="w-6 h-6" className={``} />
          )}
        <span className="text-[11px] leading-none mt-1">{item.name}</span>
      </div>
    );
    });
  };

  return (
    <>
    <div
      ref={containerRef}
        className="FooterNav block lg:!hidden p-2 bg-white dark:bg-neutral-800 fixed top-auto bottom-0 inset-x-0 z-30 border-t border-neutral-300 dark:border-neutral-700 
      transition-transform duration-300 ease-in-out"
    >
      <div className="w-full max-w-lg flex justify-around mx-auto text-sm text-center ">
          {renderFooterNav()}
        </div>
      </div>
      {/* Popup buscador */}
      <MobileSearchModal open={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
};

export default FooterNav;
