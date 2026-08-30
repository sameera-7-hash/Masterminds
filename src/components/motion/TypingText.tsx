import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

export function TypingText({
  text,
  className,
  cursorClassName,
  speed = 28,
  startDelay = 0,
}: {
  text: string
  className?: string
  cursorClassName?: string
  speed?: number
  startDelay?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
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
