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
const MOBILE_MAX_WIDTH = 640 // matches Tailwind's `sm`

// Phones get a calmer variant. The hero is ~700px tall there, so the
// desktop choreography (cards rise ~600px from far below the fold, each in
// its own short slice of scroll) ends up moving cards ~5x faster than your
// finger, which reads as frantic and jerky. Instead the cards start already
// in place as a stack, so they show up with the page itself as you scroll
// toward them (native, smooth scrolling), then fan open over overlapping,
// longer windows with smoothed scrubbing.
const MOBILE_ANGLE_STEP = 5 // wider than desktop so the outer cards run partly off-screen
const MOBILE_PIN_DURATION = 0.5 // of the viewport height: scroll spent pinned while the fan opens
const MOBILE_FAN_LEAD = 0.15 // of the viewport height: the fan starts opening this far before the pin
const MOBILE_STAGGER = 0.14 // fraction of the fan's scroll span between one card starting and the next
const MOBILE_SCRUB = 0.8 // seconds the scrubbed motion takes to catch up to the scroll position, which smooths out iOS's uneven scroll events
const ARROW_JOURNEY = 0.25 // fraction of the original scroll-to-pin distance the arrow stays up for
const ARROW_SIZE_PX = 48
const ARROW_GAP_PX = 40 // breathing room between the hero content and the arrow
const ARROW_BOTTOM_PX = 132 // where the arrow sits when the hero leaves plenty of room (desktop)

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
      const mobile = window.innerWidth < MOBILE_MAX_WIDTH
      const angleStep = mobile ? MOBILE_ANGLE_STEP : ANGLE_STEP
      const halfRange = ((n - 1) * angleStep) / 2
      let rot = -halfRange

      // Per-card scroll windows, as { offset, length } in scroll px, where
      // offset is relative to the point the pin engages (negative = before).
      let windows
      if (mobile) {
        const vh = window.innerHeight
        const pinDuration = Math.round(vh * MOBILE_PIN_DURATION)
        pinHeight.style.height = `${pinDuration + vh}px`
        const fanStart = -Math.round(vh * MOBILE_FAN_LEAD)
        const span = pinDuration - fanStart
        const stagger = span * MOBILE_STAGGER
        const length = span - stagger * (n - 1)
        windows = images.map((_, i) => ({ offset: fanStart + stagger * i, length }))
        // Already at their resting height, so cards ride in with the page
        // instead of flying up from below the fold.
        cardRefs.current.forEach((card) => gsap.set(card, { xPercent: -50, yPercent: -50, x: 0, y: 0 }))
      } else {
        // Between the top of the page and the pin there's a stretch of dead
        // scroll before anything happens. Rather than make people scroll
        // through it, start the card entrance at the top of the page and
        // shorten the pin by the same amount, so each card's pacing is
        // unchanged but the fan starts arriving much sooner.
        pinHeight.style.height = `${PIN_HEIGHT_VH}vh` // reset, in case a previous run shortened it
        const top = pinHeight.getBoundingClientRect().top + window.scrollY
        const fullScroll = pinHeight.offsetHeight - window.innerHeight
        const lead = Math.min(top, fullScroll * 0.5)
        pinHeight.style.height = `calc(${PIN_HEIGHT_VH}vh - ${lead}px)`
        const distPerCard = fullScroll / n
        windows = images.map((_, i) => ({ offset: distPerCard * i - lead, length: distPerCard }))
      }
      const pinTop = pinHeight.getBoundingClientRect().top + window.scrollY

      circleRefs.current.forEach((circle, i) => {
        const { offset, length } = windows[i]
        const scrollTrigger = {
          trigger: pinHeight,
          start: offset >= 0 ? `top top-=${offset}` : `top top+=${-offset}`,
          end: `+=${length}`,
          scrub: mobile ? MOBILE_SCRUB : true,
        }
        const ease = mobile ? 'none' : 'power1.out'
        gsap.to(circle, { rotation: rot, ease, scrollTrigger })
        gsap.to(cardRefs.current[i], mobile ? { rotation: rot, ease, scrollTrigger } : { rotation: rot, y: '-50%', ease, scrollTrigger })
        rot += angleStep
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
            scrub: mobile ? MOBILE_SCRUB : true,
            anticipatePin: mobile ? 1 : 0,
          },
        },
      )

      // A gentle "scroll for more" hint — bounces in place until the cards
      // start arriving, then fades out.
      const arrowFadeOffset = Math.round(pinTop * (1 - ARROW_JOURNEY)) // scroll still left to the pin when it fades
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
          start: `top top+=${arrowFadeOffset}`,
          end: `top top+=${arrowFadeOffset - 1}`,
          toggleActions: 'play none none reverse',
        },
      })
    })

    // The arrow is fixed to the viewport so it's visible at load, but on a
    // phone the hero text wraps much taller, so a fixed offset lands it on
    // top of the hero. Keep it clear of the hero, up to its normal spot.
    const placeIndicator = () => {
      const heroBottom = pinHeightRef.current.getBoundingClientRect().top + window.scrollY
      const room = window.innerHeight - heroBottom - ARROW_SIZE_PX - ARROW_GAP_PX
      indicatorRef.current.style.bottom = `${Math.min(ARROW_BOTTOM_PX, Math.max(16, room))}px`
    }
    placeIndicator()

    // Width only: iOS Safari fires resize whenever its toolbar collapses,
    // which would make the arrow jump around as you scroll.
    let lastWidth = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      placeIndicator()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
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
                  className="absolute left-1/2 top-0 w-[72vw] rounded-lg object-cover shadow-xl sm:w-[max(30vw,220px)]"
                  style={{
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
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-900/25 text-zinc-700 dark:border-white/25 dark:text-white/70">
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
