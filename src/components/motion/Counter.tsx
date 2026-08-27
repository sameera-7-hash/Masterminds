import { animate, motion, useMotionValue, useTransform } from "framer-motion"
import { useEffect } from "react"

export function Counter({
  value,
  format = (n) => Math.round(n).toLocaleString(),
  duration = 1.1,
  delay = 0,
  className,
}: {
  value: number
  format?: (n: number) => string
  duration?: number
  delay?: number
  className?: string
}) {
  const count = useMotionValue(0)
  const display = useTransform(count, format)

  useEffect(() => {
    const controls = animate(count, value, { duration, delay, ease: [0.16, 1, 0.3, 1] })
    return controls.stop
  }, [count, value, duration, delay])

  return <motion.span className={className}>{display}</motion.span>
}
