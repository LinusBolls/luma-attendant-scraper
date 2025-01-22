import { motion, HTMLMotionProps } from "motion/react";

type TextProps = HTMLMotionProps<"h1"> & {
    text: string;
};

export function BouncyText({ text, ...props }: TextProps) {
    // Split the text into characters while preserving spaces
    const characters = Array.from(text);

    // Animation configuration
    const container = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
        },

    };

    const child = (index: number) => ({
        visible: {
            y: [0, -10, 0],
            opacity: [0.05, 1],
            transition: {
                duration: 0.5,
                delay: index * 0.1,
            },
        },
    });

    return (
        <motion.h1
            variants={container}
            initial="hidden"
            animate="visible"
            {...props}
        >
            {characters.map((char, index) => (
                <motion.span
                    key={index}
                    className="inline-block"
                    variants={child(index)}                    
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.h1>
    );
}

export function AppearingText({ text, ...props }: TextProps) {
    const container = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                duration: 0.5,
                delay: 1.6,
            }
        },
    };

    return (
        <motion.h1
            variants={container}
            initial="hidden"
            animate="visible"
            {...props}
        >
            {text}
        </motion.h1>
    );
}
