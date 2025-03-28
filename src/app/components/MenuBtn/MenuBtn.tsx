"use client";
import React, { useRef } from "react";
import "./MenuBtn.css";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MenuBtnProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MenuBtn: React.FC<MenuBtnProps> = ({ isOpen, toggleMenu }) => {
  const container = useRef<HTMLDivElement>(null);
  const menuBtnOpen = useRef<HTMLParagraphElement>(null);
  const menuBtnClose = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (menuBtnOpen.current && menuBtnClose.current) {
        gsap.to(menuBtnOpen.current, {
          y: isOpen ? -24 : 0,
          duration: 1,
          delay: 0.75,
          ease: "power2.out",
        });
        gsap.to(menuBtnClose.current, {
          y: isOpen ? 0 : 24,
          duration: 1,
          delay: 0.75,
          ease: "power2.out",
        });
      }
    },
    [isOpen],
    { scope: container }
  );

  return (
    <div
      ref={container}
      className={`menu-toggle ${isOpen ? "opened" : "closed"}`}
      onClick={toggleMenu}
    >
      <div className="menu-copy">
        <p id="menu-open" ref={menuBtnOpen}>
          SignUp
        </p>
        <p id="menu-text" ref={menuBtnClose}>
          Close
        </p>
      </div>
    </div>
  );
};

export default MenuBtn;