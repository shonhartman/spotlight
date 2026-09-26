import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Adapted from madewithgsap.com/effects/tutorial003 (Spotify-data cards on
// giant rotating circles). Each image sits atop its own huge circle;
// scrolling through the pinned section scrubs each circle's rotation in
// turn, swinging its card up into a fanned resting position. No click/hover
// state to manage — ScrollTrigger's scrub owns the motion entirely, in
// both scroll directions, which is what actually avoids the "card can't
// just teleport to the front" problem instead of hand-tuning z-index
// timing against it.
const PIN_HEIGHT_VH = 250 // total scroll distance the section occupies
const ANGLE_STEP = 4 // degrees between each card's resting rotation — small, because the circle's radius (huge) does the real work of spreading them out
const CARD_WIDTH_VW = 30

export function Slider({ images }) {
  const pinHeightRef = useRef(null)
  const containerRef = useRef(null)
  const circlesRef = useRef(null)
  const circleRefs = useRef([])
  const cardRefs = useRef([])
  const indicatorRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // React 18 StrictMode double-invokes this effect in dev; ctx.revert()
    // below cleans up this component's own tweens on the second pass, but
    // ScrollTrigger's pin DOM mutations from the first pass can leave a
    // stale trigger (and a tween permanently stuck at its start value,
    // fighting the real one every frame) behind regardless. Killing
    // everything up front guarantees a clean slate either way.
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

    const ctx = gsap.context(() => {
      const pinHeight = pinHeightRef.current
      const n = images.length
      const halfRange = ((n - 1) * ANGLE_STEP) / 2
      let rot = -halfRange
      const distPerCard = (pinHeight.offsetHeight - window.innerHeight) / n

      circleRefs.current.forEach((circle, i) => {
        const scrollTrigger = {
          trigger: pinHeight,
          start: `top top-=${distPerCard * i}`,
          end: `+=${distPerCard}`,
          scrub: true,
        }
        gsap.to(circle, { rotation: rot, ease: 'power1.out', scrollTrigger })
        gsap.to(cardRefs.current[i], { rotation: rot, y: '-50%', ease: 'power1.out', scrollTrigger })
        rot += ANGLE_STEP
      })

      gsap.fromTo(
        circlesRef.current,
        { y: '5%' },
        {
          y: '-5%',
          ease: 'none',
          scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            pin: containerRef.current,
            scrub: true,
          },
        },
      )

      // A gentle "scroll for more" hint — bounces in place until the user
      // actually starts scrolling into the pin, then fades out.
      gsap.to(indicatorRef.current, {
        y: 10,
        duration: 0.9,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
      gsap.to(indicatorRef.current, {
        autoAlpha: 0,
        duration: 0.2,
        scrollTrigger: {
          trigger: pinHeight,
          start: 'top top',
          end: 'top top-=1',
          toggleActions: 'play none none reverse',
        },
      })
    })

    return () => ctx.revert()
  }, [images.length])

  return (
    <section className="relative overflow-hidden">
      <div ref={pinHeightRef} style={{ height: `${PIN_HEIGHT_VH}vh` }}>
        <div ref={containerRef} className="relative h-screen">
          <div ref={circlesRef} className="absolute inset-0">
            {images.map((image, i) => (
              <div
                key={image.url}
                ref={(el) => (circleRefs.current[i] = el)}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{ width: '250vw', height: '250vw', transform: 'translate(-50%, 0)', willChange: 'transform' }}
              >
                <img
                  ref={(el) => (cardRefs.current[i] = el)}
                  src={image.url}
                  alt={`Slide ${i + 1}`}
                  className="absolute left-1/2 top-0 rounded-lg object-cover shadow-xl"
                  style={{
                    width: `${CARD_WIDTH_VW}vw`,
                    aspectRatio: 0.75,
                    transform: 'translate(-50%, 55vh)',
                    willChange: 'transform',
                  }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={indicatorRef}
        className="pointer-events-none fixed inset-x-0 bottom-[132px] z-50 flex justify-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white/70">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  )
}
