"use client";
import Link from "next/link";
import { useRef, useState } from "react";

import * as RT from "react-typed";

// resilient import
const TypedComp = RT.ReactTyped || RT.default || RT.Typed || null;

const AnimatedText = ({
  strings = [],
  typeSpeed = 50,
  backSpeed = 30,
  loop = true,
  className = "",
  backDelay = 1000,
  startDelay = 0,
  showCursor = true,
  hideCursorOnEnd = false,
  attr = undefined,
  children = null,
  as: Tag = "span",
  typedProps = {},
  ...props
}) => {
  const typedRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!TypedComp) {
    return (
      <Tag className={className} {...props}>
        {strings.map((s) => (typeof s === "string" ? s : s.text)).join(" ")}
      </Tag>
    );
  }

  // فقط متن‌ها رو می‌فرستیم برای react-typed
  const onlyStrings = strings.map((s) =>
    typeof s === "string" ? s : s.text
  );

  const handleComplete = () => {
    if (hideCursorOnEnd && !loop) {
      const cursorEl = document.querySelector(".typed-cursor");
      if (cursorEl) cursorEl.style.display = "none";
    }
    if (typedProps.onComplete) typedProps.onComplete();
  };

  const handleStringTyped = (arrayPos) => {
    setActiveIndex(arrayPos); // نگه داشتن index فعلی
    if (typedProps.onStringTyped) typedProps.onStringTyped(arrayPos);
  };

  const typedCommonProps = {
    strings: onlyStrings,
    typeSpeed,
    backSpeed,
    loop,
    backDelay,
    startDelay,
    showCursor,
    onComplete: handleComplete,
    onStringTyped: handleStringTyped,
    ...typedProps,
  };

  // متن جاری
  const current = strings[activeIndex];
  const hasLink = typeof current === "object" && current.href;

  return (
    <Tag className={className} {...props}>
      {hasLink ? (
        <Link href={current.href} title={current.text} className={className}>
          <TypedComp ref={typedRef} {...typedCommonProps} />
        </Link>
      ) : (
        <TypedComp ref={typedRef} {...typedCommonProps} />
      )}
    </Tag>
  );
};

export default AnimatedText;
