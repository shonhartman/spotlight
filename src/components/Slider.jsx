import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Card-shuffle fan, adapted from madewithgsap.com/effects/tutorial003
// without ScrollTrigger. Each `.arm` is a spoke pivoting around its own
// bottom edge, which sits at the container's vertical center — rotating
// it swings the card at its tip through a shallow arc. The deal-in slides
// each card up into its slot once on mount instead of being scrubbed by
// scroll.
const ANGLE_STEP = 15 // degrees between each card's resting rotation
const RADIUS = 230 // px, spoke length — controls horizontal fan spread
const DEAL_STAGGER = 0.09 // seconds between each card's entrance
const DEAL_EASE = 'back.out(1.3)'
const HOVER_EASE = 'power2.out'

export function Slider({ images }) {
  const armRefs = useRef([])
  const cardRefs = useRef([])

  useEffect(() => {
    const n = images.length
    const halfRange = ((n - 1) * ANGLE_STEP) / 2

    const tl = gsap.timeline()
    armRefs.current.forEach((arm, i) => {
      const rot = -halfRange + i * ANGLE_STEP
      const card = cardRefs.current[i]
      tl.fromTo(arm, { rotation: 0 }, { rotation: rot, duration: 0.9, ease: DEAL_EASE }, i * DEAL_STAGGER)
      tl.fromTo(card, { y: 130 }, { y: 0, duration: 0.9, ease: DEAL_EASE }, i * DEAL_STAGGER)
    })

    return () => tl.kill()
  }, [images.length])

  const handleEnter = (i) => {
    gsap.to(cardRefs.current[i], { y: -28, scale: 1.08, duration: 0.35, ease: HOVER_EASE, zIndex: 50, overwrite: 'auto' })
  }

  const handleLeave = (i) => {
    gsap.to(cardRefs.current[i], { y: 0, scale: 1, duration: 0.35, ease: HOVER_EASE, zIndex: 10 + i, overwrite: 'auto' })
  }

  return (
    <section className="relative z-10 h-[300px] w-full overflow-hidden sm:h-[420px]">
      {images.map((image, i) => (
        <div
          key={image.url}
          ref={(el) => (armRefs.current[i] = el)}
          className="absolute left-1/2 origin-bottom"
          style={{ bottom: '18%', width: 1, height: RADIUS }}
        >
          <div
            ref={(el) => (cardRefs.current[i] = el)}
            className="absolute left-1/2 top-0 h-40 w-28 -translate-x-1/2 cursor-pointer overflow-hidden rounded-lg shadow-xl sm:h-56 sm:w-40"
            style={{ zIndex: 10 + i }}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={() => handleLeave(i)}
          >
            <img
              src={image.url}
              alt={`Slide ${i + 1}`}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        </div>
      ))}
    </section>
  )
}
