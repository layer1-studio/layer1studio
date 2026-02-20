import { useEffect, useRef } from 'react';

/**
 * Attach this to any ref and the element gets a `is-visible` class
 * once it enters the viewport — used for fade-in-up scroll animations.
 */
export const useFadeIn = (threshold = 0.15) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('is-visible');
                    observer.unobserve(el); // only animate once
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return ref;
};
