import { useEffect, useState } from 'react';

export function CityParallax() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setOffset(Math.min(window.scrollY, 420)));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
    };
  }, []);

  return (
    <div className="city-scene" aria-hidden="true">
      <div className="city-layer city-sky" style={{ transform: `translateY(${offset * 0.02}px)` }} />
      <div
        className="city-layer city-horizon"
        style={{ transform: `translateY(${offset * 0.045}px)` }}
      />
      <div
        className="city-layer city-mosque"
        style={{ transform: `translateY(${offset * 0.07}px)` }}
      >
        <span className="minaret minaret-left" />
        <span className="dome" />
        <span className="minaret minaret-right" />
      </div>
      <div
        className="city-layer city-front"
        style={{ transform: `translateY(${offset * 0.095}px)` }}
      />
    </div>
  );
}
