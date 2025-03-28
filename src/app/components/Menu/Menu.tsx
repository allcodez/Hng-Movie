"use client";
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
  ReactNode,
} from "react";
import Link from "next/link";
import "./Menu.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";
import MenuBar from "../MenuBar/MenuBar";
import SignUp from "../Signup/SignUp";
import Login from "../Login/Login";

interface MenuLink {
  path: string;
  label: string;
}

interface SocialLink {
  url: string;
  label: string;
}


const Menu = () => {
  const init = useRef<boolean>(false);
  const container = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const toggleAuthForm = useCallback(() => {
    setShowSignUp(prev => !prev);
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
      "hop",
      "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1"
    );
  }, []);

  useGSAP(
    () => {
      if (menuRef.current) {
        const menu = menuRef.current;
        const links = menu.querySelectorAll<HTMLAnchorElement>(".link a");
        const socials = menu.querySelectorAll<HTMLParagraphElement>(".socials .line p");

        links.forEach((link) => {
          link.addEventListener("click", toggleMenu);
        });

        gsap.set(menu, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        });
        gsap.set(links, { y: 60 });
        gsap.set(socials, { y: 30 });

        init.current = true;
      }
    },
    { scope: container }
  );

  const animateMenu = useCallback((open: boolean) => {
    if (!menuRef.current) {
      return;
    }

    const menu = menuRef.current;
    const links = menu.querySelectorAll<HTMLDivElement>(".link .link-wrapper");
    const socialsCols = menu.querySelectorAll<HTMLDivElement>(".socials .sub-col");

    setIsAnimating(true);

    if (open) {
      gsap.to(menu, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "hop",
        duration: 1.5,
        onStart: () => {
          if (menu) menu.style.pointerEvents = "all";
        },
        onComplete: () => {
          setIsAnimating(false);
        },
      });

      gsap.to(links, {
        y: 0,
        stagger: 0.1,
        delay: 0.75,
        duration: 1.5,
        ease: "power4.out",
      });

      socialsCols.forEach((subCol) => {
        const socialCopy = subCol.querySelectorAll<HTMLParagraphElement>(".line p");
        gsap.to(socialCopy, {
          y: 0,
          stagger: 0.1,
          delay: 0.75,
          duration: 1.5,
          ease: "power4.out",
        });
      });
    } else {
      gsap.to(menu, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        ease: "hop",
        duration: 1.5,
        delay: 0.25,
        onComplete: () => {
          if (menu) menu.style.pointerEvents = "none";
          gsap.set(menu, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });

          gsap.set(links, { y: 60 });
          socialsCols.forEach((subCol) => {
            const socialCopy = subCol.querySelectorAll<HTMLParagraphElement>(".line p");
            gsap.set(socialCopy, { y: 30 });
          });

          setIsAnimating(false);
        },
      });
    }
  }, []);

  useEffect(() => {
    if (init.current) {
      animateMenu(isOpen);
    }
  }, [isOpen, animateMenu]);

  const toggleMenu = useCallback(() => {
    if (!isAnimating) {
      setIsOpen((prevIsOpen) => !prevIsOpen);
    }
  }, [isAnimating]);

  const closeMenu = useCallback(() => {
    if (!isAnimating && isOpen) {
      setIsOpen(false);
    }
  }, [isAnimating, isOpen]);

  return (
    <div ref={container}>
      <MenuBar isOpen={isOpen} toggleMenu={toggleMenu} closeMenu={closeMenu} />



      <div className="menu" ref={menuRef}>
        {showSignUp ? (
          <SignUp toggleAuthForm={toggleAuthForm} />
        ) : (
          <Login toggleAuthForm={toggleAuthForm} />
        )}
      </div>
    </div>
  );
};

export default Menu;