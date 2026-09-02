"use client";

import React, { ElementType } from "react";
import { motion, MotionProps, Variants } from "motion/react";
import { cn } from "@/lib/utils";

type AnimationType =
  | "fadeIn"
  | "blurIn"
  | "blurInUp"
  | "blurInDown"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "scaleDown";

type AnimationBy = "text" | "word" | "character" | "line";

export interface TextAnimateProps extends Omit<MotionProps, "children"> {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  variants?: Variants;
  as?: ElementType;
  by?: AnimationBy;
  startOnView?: boolean;
  once?: boolean;
  animation?: AnimationType;
  stagger?: number;
}

const defaultItemVariants: Record<AnimationType, { hidden: any; show: any }> = {
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  blurIn: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    show: { opacity: 1, filter: "blur(0px)" },
  },
  blurInUp: {
    hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
    show: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
  blurInDown: {
    hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
    show: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
  slideUp: {
    hidden: { y: "100%", opacity: 0 },
    show: { y: 0, opacity: 1 },
  },
  slideDown: {
    hidden: { y: "-100%", opacity: 0 },
    show: { y: 0, opacity: 1 },
  },
  slideLeft: {
    hidden: { x: "100%", opacity: 0 },
    show: { x: 0, opacity: 1 },
  },
  slideRight: {
    hidden: { x: "-100%", opacity: 0 },
    show: { x: 0, opacity: 1 },
  },
  scaleUp: {
    hidden: { scale: 0.5, opacity: 0 },
    show: { scale: 1, opacity: 1 },
  },
  scaleDown: {
    hidden: { scale: 1.5, opacity: 0 },
    show: { scale: 1, opacity: 1 },
  },
};

const motionTagMap: Record<string, any> = {
  span: motion.span,
  div: motion.div,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
};

export function TextAnimate({
  children,
  className,
  delay = 0,
  duration = 0.5,
  variants,
  as: Component = "span",
  by = "word",
  startOnView = true,
  once = false,
  animation = "slideUp",
  stagger = 0.1,
  ...props
}: TextAnimateProps) {
  const MotionComponent =
    typeof Component === "string" && motionTagMap[Component]
      ? motionTagMap[Component]
      : motion.span;

  const selectedItemVariants = variants || {
    hidden: defaultItemVariants[animation].hidden,
    show: {
      ...defaultItemVariants[animation].show,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  // Split tokens based on `by` prop
  const rawText = typeof children === "string" ? children : String(children || "");
  let elements: string[] = [];
  if (by === "word") {
    elements = rawText.split(" ");
  } else if (by === "character") {
    elements = rawText.split("");
  } else if (by === "line") {
    elements = rawText.split("\n");
  } else {
    elements = [rawText];
  }

  return (
    <MotionComponent
      initial="hidden"
      whileInView={startOnView ? "show" : undefined}
      animate={startOnView ? undefined : "show"}
      viewport={{ once }}
      variants={containerVariants}
      className={cn("inline-flex flex-wrap items-baseline", className)}
      {...props}
    >
      {elements.map((element, i) => {
        if (by === "word") {
          return (
            <span key={i} className="inline-flex overflow-hidden py-0.5 [font-family:inherit] [font-style:inherit] [font-weight:inherit]">
              <motion.span
                variants={selectedItemVariants}
                className="inline-block [font-family:inherit] [font-style:inherit] [font-weight:inherit] tracking-[inherit]"
              >
                {element}
              </motion.span>
              {i < elements.length - 1 && <span className="inline-block [font-family:inherit]">&nbsp;</span>}
            </span>
          );
        }

        if (by === "character") {
          return (
            <span key={i} className="inline-flex overflow-hidden py-0.5 [font-family:inherit] [font-style:inherit] [font-weight:inherit]">
              <motion.span
                variants={selectedItemVariants}
                className="inline-block [font-family:inherit] [font-style:inherit] [font-weight:inherit] tracking-[inherit]"
              >
                {element === " " ? "\u00A0" : element}
              </motion.span>
            </span>
          );
        }

        return (
          <span key={i} className="inline-block overflow-hidden py-0.5 w-full [font-family:inherit] [font-style:inherit] [font-weight:inherit]">
            <motion.span
              variants={selectedItemVariants}
              className="inline-block [font-family:inherit] [font-style:inherit] [font-weight:inherit] tracking-[inherit]"
            >
              {element}
            </motion.span>
          </span>
        );
      })}
    </MotionComponent>
  );
}

export default TextAnimate;
