import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// How far (in px) each step away from the front card pushes a card
// sideways, and how much it tilts/scales/recedes.
const STEP_X = 90
const STEP_ROTATION = 32
const STEP_SCALE = 0.14
const STEP_Z = 60
const BOUNCE_EASE = 'back.out(1.7)'

export function Slider({ images }) {
  const containerRef = useRef(null)
  const cardRefs = useRef([])
  const [isMobile, setIsMobile] = useState(false)
  const [mobileIndex, setMobileIndex] = useState(0)
  const activePosition = useRef((images.length - 1) / 2)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const applyPositions = (position) => {
    activePosition.current = position
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const offset = i - position
      gsap.to(card, {
        x: offset * STEP_X,
        z: -Math.abs(offset) * STEP_Z,
        rotateY: gsap.utils.clamp(-70, 70, offset * -STEP_ROTATION),
        scale: gsap.utils.clamp(0.55, 1, 1 - Math.abs(offset) * STEP_SCALE),
        zIndex: Math.round(100 - Math.abs(offset) * 10),
        duration: 0.6,
        ease: BOUNCE_EASE,
        overwrite: 'auto',
      })
    })
  }

  useEffect(() => {
    applyPositions(isMobile ? mobileIndex : (images.length - 1) / 2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length])

  useEffect(() => {
    if (isMobile) applyPositions(mobileIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, mobileIndex])

  const handleMouseMove = (e) => {
    if (isMobile) return
    const rect = containerRef.current.getBoundingClientRect()
    const ratio = gsap.utils.clamp(0, 1, (e.clientX - rect.left) / rect.width)
    applyPositions(ratio * (images.length - 1))
  }

  const handleMouseLeave = () => {
    if (isMobile) return
    applyPositions((images.length - 1) / 2)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return

    const deltaX = touchStartX.current - e.changedTouches[0].clientX
    const deltaY = touchStartY.current - e.changedTouches[0].clientY
    const minSwipeDistance = 50

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      const direction = deltaX > 0 ? 1 : -1
      setMobileIndex((current) => (current + direction + images.length) % images.length)
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <section
      ref={containerRef}
      className="relative z-10 mx-auto h-[320px] sm:h-[420px]"
      style={{ perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container relative mx-auto flex h-full w-full items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        {images.map((image, i) => (
          <div
            key={image.url}
            ref={(el) => (cardRefs.current[i] = el)}
            className="card absolute h-[85%] w-[45%] max-w-[280px] sm:w-[30%]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="content h-full w-full overflow-hidden rounded-lg shadow-2xl">
              <img
                src={image.url}
                alt={`Slide ${i + 1}`}
                className="media h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
