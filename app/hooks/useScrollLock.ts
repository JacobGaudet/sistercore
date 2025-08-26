"use client";
import { useEffect, useRef } from "react";

export default function useScrollLock(locked: boolean) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    const body = document.body;
    if (locked) {
      scrollYRef.current = window.scrollY || window.pageYOffset || 0;
      // lock the body in place
      body.style.position = "fixed";
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
    } else {
      // restore
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      if (scrollYRef.current) window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      // cleanup in case component unmounts while locked
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
    };
  }, [locked]);
}
