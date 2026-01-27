"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderProps {
    children: React.ReactNode[];
    title?: string;
    subtitle?: string;
}

export function ShowcaseSlider({ children, title, subtitle }: SliderProps) {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll);
            checkScroll();
            // Also check on resize
            window.addEventListener('resize', checkScroll);
            return () => {
                el.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, [children]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-8 w-full">
            {(title || subtitle) && (
                <div className="flex justify-between items-end px-4 md:px-0">
                    <div className="space-y-2">
                        {subtitle && <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">{subtitle}</span>}
                        {title && <h2 className="text-3xl md:text-5xl font-bold font-heading uppercase tracking-tighter italic">{title}</h2>}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className={`p-3 border border-border rounded-full transition-all ${canScrollLeft ? 'opacity-100 hover:bg-black hover:text-white' : 'opacity-30 cursor-not-allowed'}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className={`p-3 border border-border rounded-full transition-all ${canScrollRight ? 'opacity-100 hover:bg-black hover:text-white' : 'opacity-30 cursor-not-allowed'}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <div className="relative group">
                <div
                    ref={scrollRef}
                    className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 px-6 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {children.map((child, index) => (
                        <div key={index} className="flex-none snap-start first:pl-0 last:pr-6 md:last:pr-0">
                            {child}
                        </div>
                    ))}
                </div>

                {/* Scroll Indication Gradients for Mobile */}
                <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent md:hidden pointer-events-none opacity-50" />
                <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white to-transparent md:hidden pointer-events-none opacity-50" />
            </div>
        </div>
    );
}
