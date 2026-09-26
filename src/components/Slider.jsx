import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// Card-shuffle fan, adapted from madewithgsap.com/effects/tutorial003
// without ScrollTrigger. Each `.arm` is a spoke pivoting around its own
// bottom edge, which sits at the container's vertical center — rotating
// it swings the card at its tip through a shallow arc. The deal-in slides
// each card up into its slot once on mount instead of being scrubbed by
// scroll. Clicking a card straightens its arm to the front and pops it
// into a larger "detail" view; clicking it again (or the backdrop) sends
// it back into the fan.
const ANGLE_STEP = 15 // degrees between each card's resting rotation
const RADIUS = 230 // px, spoke length — controls horizontal fan spread
const DEAL_STAGGER = 0.09 // seconds between each card's entrance
const DEAL_EASE = 'back.out(1.3)'
const HOVER_EASE = 'power2.out'
const DETAIL_EASE = 'back.out(1.5)'
const DETAIL_SCALE = 1.9

export function Slider({ images }) {
  const armRefs = useRef([])
  const cardRefs = useRef([])
  const restRotations = useRef([])
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    const n = images.length
    const halfRange = ((n - 1) * ANGLE_STEP) / 2

    const tl = gsap.timeline()
    armRefs.current.forEach((arm, i) => {
      const rot = -halfRange + i * ANGLE_STEP
      restRotations.current[i] = rot
      const card = cardRefs.current[i]
      tl.fromTo(arm, { rotation: 0 }, { rotation: rot, duration: 0.9, ease: DEAL_EASE }, i * DEAL_STAGGER)
      tl.fromTo(card, { y: 130 }, { y: 0, duration: 0.9, ease: DEAL_EASE }, i * DEAL_STAGGER)
    })

    return () => tl.kill()
  }, [images.length])

  const settleCard = (i) => {
    gsap.to(cardRefs.current[i], {
      scale: 1,
      y: 0,
      opacity: 1,
      zIndex: 10 + i,
      duration: 0.5,
      ease: HOVER_EASE,
      overwrite: 'auto',
    })
    gsap.to(armRefs.current[i], {
      rotation: restRotations.current[i],
      duration: 0.6,
      ease: DETAIL_EASE,
      overwrite: 'auto',
    })
  }

  const bringToFront = (i) => {
    gsap.to(cardRefs.current[i], {
      scale: DETAIL_SCALE,
      y: -20,
      opacity: 1,
      zIndex: 200,
      duration: 0.6,
      ease: DETAIL_EASE,
      overwrite: 'auto',
    })
    gsap.to(armRefs.current[i], {
      rotation: 0,
      duration: 0.6,
      ease: DETAIL_EASE,
      overwrite: 'auto',
    })
    images.forEach((_, j) => {
      if (j === i) return
      gsap.to(cardRefs.current[j], { opacity: 0.45, duration: 0.4, ease: HOVER_EASE, overwrite: 'auto' })
    })
  }

  const closeActive = () => {
    if (activeIndex === null) return
    images.forEach((_, j) => settleCard(j))
    setActiveIndex(null)
  }

  const handleCardClick = (i) => {
    if (activeIndex === i) {
      closeActive()
      return
    }
    if (activeIndex !== null) settleCard(activeIndex)
    bringToFront(i)
    setActiveIndex(i)
  }

  useEffect(() => {
    if (activeIndex === null) return
    const onKeyDown = (e) => e.key === 'Escape' && closeActive()
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  const handleEnter = (i) => {
    if (activeIndex !== null) return
    gsap.to(cardRefs.current[i], { y: -28, scale: 1.08, duration: 0.35, ease: HOVER_EASE, zIndex: 50, overwrite: 'auto' })
  }

  const handleLeave = (i) => {
    if (activeIndex !== null) return
    gsap.to(cardRefs.current[i], { y: 0, scale: 1, duration: 0.35, ease: HOVER_EASE, zIndex: 10 + i, overwrite: 'auto' })
  }

  return (
    <section className="relative z-10 h-[300px] w-full overflow-visible sm:h-[420px]">
      <div
        className="absolute inset-0 z-[150] backdrop-blur-sm transition-opacity duration-300"
        style={{
          opacity: activeIndex === null ? 0 : 1,
          pointerEvents: activeIndex === null ? 'none' : 'auto',
        }}
        onClick={closeActive}
        aria-hidden={activeIndex === null}
      />
      {images.map((image, i) => (
        <div
          key={image.url}
          ref={(el) => (armRefs.current[i] = el)}
          className="absolute left-1/2 origin-bottom"
          style={{ bottom: '18%', width: 1, height: RADIUS, zIndex: activeIndex === i ? 300 : 10 + i }}
        >
          <div
            ref={(el) => (cardRefs.current[i] = el)}
            className="absolute left-1/2 top-0 h-40 w-28 -translate-x-1/2 cursor-pointer overflow-hidden rounded-lg shadow-xl sm:h-56 sm:w-40"
            style={{ zIndex: 10 + i }}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={() => handleLeave(i)}
            onClick={() => handleCardClick(i)}
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
