"use client";

import { useEffect, useState } from "react";

export function AnimatedText({ text }: { text: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {text.split(" ").map((word, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-700 ease-out ${
            mounted
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
          style={{
            transitionDelay: `${index * 80}ms`,
          }}
        >
          {word}
          {index < text.split(" ").length - 1 && "\u00A0"}
        </span>
      ))}
    </>
  );
}
