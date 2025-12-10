"use client";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

import { ReactTyped } from "react-typed";

// resilient import
const TypedComp = ReactTyped || null;

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
  const linkRef = useRef(null);

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

  // بررسی اینکه آیا همه strings لینک دارند یا نه
  const allHaveLinks = strings.length > 0 && strings.every(s => typeof s === "object" && s.href);
  const someHaveLinks = strings.some(s => typeof s === "object" && s.href);
  
  // به‌روزرسانی href لینک وقتی activeIndex تغییر می‌کند
  useEffect(() => {
    if (linkRef.current && (allHaveLinks || someHaveLinks)) {
      const current = strings[activeIndex] || strings[0];
      if (current && typeof current === "object" && current.href) {
        // پیدا کردن لینک درون wrapper
        const linkElement = linkRef.current.querySelector('a');
        if (linkElement) {
          linkElement.setAttribute('href', current.href);
          linkElement.setAttribute('title', current.text);
        }
      }
    }
  }, [activeIndex, allHaveLinks, someHaveLinks, strings]);
  
  // اگر همه لینک دارند، از wrapper استفاده می‌کنیم که لینک را نگه می‌دارد
  if (allHaveLinks && strings.length > 0) {
    const current = strings[activeIndex] || strings[0];
    
    return (
      <Tag className={className} {...props}>
        <span ref={linkRef} style={{ display: 'inline' }}>
          <Link 
            href={current.href} 
            title={current.text} 
            className={className}
            style={{ display: 'inline', textDecoration: 'none' }}
          >
            <TypedComp ref={typedRef} {...typedCommonProps} />
          </Link>
        </span>
      </Tag>
    );
  }

  // اگر بعضی لینک دارند، از wrapper پویا استفاده می‌کنیم
  if (someHaveLinks) {
    const current = strings[activeIndex] || strings[0];
    const hasLink = typeof current === "object" && current.href;
    
    return (
      <Tag className={className} {...props}>
        {hasLink ? (
          <span ref={linkRef} style={{ display: 'inline' }}>
            <Link 
              href={current.href} 
              title={current.text} 
              className={className}
              style={{ display: 'inline', textDecoration: 'none' }}
            >
              <TypedComp ref={typedRef} {...typedCommonProps} />
            </Link>
          </span>
        ) : (
          <TypedComp ref={typedRef} {...typedCommonProps} />
        )}
      </Tag>
    );
  }

  // اگر هیچ لینکی ندارند
  return (
    <Tag className={className} {...props}>
      <TypedComp ref={typedRef} {...typedCommonProps} />
    </Tag>
  );
};

export default AnimatedText;
