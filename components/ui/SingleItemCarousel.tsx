"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
    children: React.ReactNode[];
    title?: string;
    subtitle?: string;
}

export function SingleItemCarousel({ children, title, subtitle }: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        let newIndex = currentIndex + newDirection;
        if (newIndex < 0) newIndex = children.length - 1;
        if (newIndex >= children.length) newIndex = 0;
        setCurrentIndex(newIndex);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    return (
        <div className="w-full space-y-12">
            {(title || subtitle) && (
                <div className="flex flex-col items-center text-center space-y-4">
                    {subtitle && <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">{subtitle}</span>}
                    {title && <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase tracking-tighter italic">{title}</h2>}
                </div>
            )}

            <div className="relative w-full max-w-4xl mx-auto aspect-[4/5] md:aspect-[3/4]">
                {/* Navigation Buttons */}
                <button
                    className="absolute top-1/2 -left-16 transform -translate-y-1/2 z-10 p-3 bg-white border border-border rounded-full hover:bg-black hover:text-white transition-all shadow-lg md:flex hidden"
                    onClick={() => paginate(-1)}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    className="absolute top-1/2 -right-16 transform -translate-y-1/2 z-10 p-3 bg-white border border-border rounded-full hover:bg-black hover:text-white transition-all shadow-lg md:flex hidden"
                    onClick={() => paginate(1)}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                <div className="relative w-full h-full overflow-hidden bg-secondary rounded-sm shadow-2xl">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {children[currentIndex]}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Mobile Navigation */}
                <div className="flex justify-center gap-4 mt-6 md:hidden">
                    <button
                        className="p-3 bg-white border border-border rounded-full hover:bg-black hover:text-white transition-all shadow-md"
                        onClick={() => paginate(-1)}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        className="p-3 bg-white border border-border rounded-full hover:bg-black hover:text-white transition-all shadow-md"
                        onClick={() => paginate(1)}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-4">
                {children.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-black w-6' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
}
