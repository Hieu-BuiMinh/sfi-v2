'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import React, { useRef } from 'react'

export interface FocusBlurResolveProps {
	children: React.ReactNode
	className?: string
	/** Delay before the animation starts, in milliseconds. */
	delay?: number
	/** Animate only once the text scrolls into view. */
	triggerOnView?: boolean
}

const DURATION_S = 0.76
const MS = 1000
// Smooth deceleration — premium focus-pull ease-out.
const EASE = [0.22, 1, 0.36, 1] as const

export default function FocusBlurResolve({
	children,
	className = '',
	delay = 0,
	triggerOnView = false,
}: FocusBlurResolveProps) {
	const ref = useRef<HTMLSpanElement>(null)
	const inView = useInView(ref, { once: true })
	const shouldReduceMotion = useReducedMotion()
	const play = (!triggerOnView || inView) && !shouldReduceMotion
	const ariaLabel = typeof children === 'string' ? children : undefined

	return (
		<span aria-label={ariaLabel} className={className} ref={ref}>
			<motion.span
				animate={play ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 } : undefined}
				aria-hidden="true"
				initial={
					shouldReduceMotion
						? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
						: { opacity: 0, y: 14, filter: 'blur(14px)', scale: 1.01 }
				}
				style={{ display: 'inline-block' }}
				transition={
					shouldReduceMotion
						? { duration: 0 }
						: {
								duration: DURATION_S,
								delay: delay / MS,
								ease: EASE,
							}
				}
			>
				{children}
			</motion.span>
		</span>
	)
}

/**
 * Usage Examples:
 *
 * 1. Basic Text Focus-Blur Effect:
 *    import FocusBlurResolve from '@/components/animations/text/focus-blur-resolve'
 *
 *    <FocusBlurResolve delay={200}>
 *      Smart Risk Control
 *    </FocusBlurResolve>
 *
 * 2. With Rich Children / Styling & View Trigger:
 *    <FocusBlurResolve triggerOnView delay={300} className="text-4xl font-bold">
 *      Smart <span className="text-secondary">Risk Control</span> and
 *    </FocusBlurResolve>
 */
