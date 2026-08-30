import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

export function TypingText({
  text,
  className,
  cursorClassName,
  speed = 55,
  startDelay = 0,
  startImmediately = false,
}: {
  text: string
  className?: string
  cursorClassName?: string
  speed?: number
  startDelay?: number
  /** Skip the scroll-into-view gate and start on mount — use for above-the-fold text, since
   * IntersectionObserver-based triggers can be unreliable on mobile while the viewport height
   * is still settling (address bar show/hide, dynamic svh) right after page load. */
  startImmediately?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inViewResult = useInView(ref, { once: true, margin: "0px", amount: 0 })
  const inView = startImmediately || inViewResult
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let frame = 0
    let interval: ReturnType<typeof setInterval> | undefined
    const startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        frame += 1
        setCount(frame)
        if (frame >= text.length && interval) clearInterval(interval)
      }, speed)
    }, startDelay)
    return () => {
      clearTimeout(startTimeout)
      if (interval) clearInterval(interval)
    }
  }, [inView, text, speed, startDelay])

  const done = count >= text.length

  return (
    <span ref={ref} className={className}>
      {text.slice(0, count)}
      <motion.span
        aria-hidden
        className={cursorClassName ?? "ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.08em] bg-current align-middle"}
        animate={done ? { opacity: [1, 0] } : { opacity: 1 }}
        transition={done ? { duration: 0.8, repeat: Infinity, repeatType: "reverse" } : { duration: 0 }}
      />
    </span>
  )
}
