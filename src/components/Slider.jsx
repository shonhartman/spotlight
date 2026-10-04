import { useEffect, useRef, useState } from 'react'
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

// Phones get the same effect, calmer. The hero is ~700px tall there, so the
// desktop choreography (cards rising ~600px from below the fold while the
// section is pinned, each in a short slice of scroll) moves cards ~5x faster
// than your finger and nothing shows up until you're deep into the page.
// Instead there's no pin: the section is only a little taller than a card
// and the cards start rising from below as soon as you start scrolling, one
// after another with overlapping timing, each landing on top of the last
// and swinging into the fan. They only rise a short way because the page is
// scrolling them up the screen at the same time. (Starting them piled in
// one spot, or sliding in from the sides, both read as a different effect.)
const MOBILE_ANGLE_STEP = 5 // wider than desktop so the outer cards run partly off-screen
const MOBILE_STAGGER = 0.14 // fraction of the fan's scroll span between one card starting and the next
const MOBILE_RISE_MARGIN_PX = 80 // extra rise so a card that hasn't started yet is still below the bottom of the screen
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

  // The effect below builds the phone or desktop version from the screen size
  // at the moment it runs, so it has to run again when the width changes
  // (device toolbar, resizing the window, rotating a phone). Otherwise the
  // page is left running the wrong version at the new size. Only the width
  // counts: iOS Safari fires resize whenever its toolbar collapses, and
  // setting the same width again is a no-op.
  const [width, setWidth] = useState(() => (typeof window === 'undefined' ? 0 : window.innerWidth))
  useEffect(() => {
    let timer
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setWidth(window.innerWidth), 200)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(timer)
    }
  }, [])

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

      if (mobile) {
        pinHeight.style.height = 'auto' // no pin, so no spacer: just the container's own height
        const vh = window.innerHeight
        const top = pinHeight.getBoundingClientRect().top + window.scrollY

        // The whole fan runs from the top of the page until just before the
        // section's bottom edge reaches the screen, so cards never get sliced
        // off by that edge (the blog starts right below it) while still rising.
        const bottomReachesScreenAt = top + containerRef.current.offsetHeight - vh
        const span = Math.max(vh * 0.5, bottomReachesScreenAt - 20)
        const stagger = span * MOBILE_STAGGER
        const length = span - stagger * (n - 1)

        // A card that hasn't started yet sits `rise` px below its resting
        // spot. Make that enough that it's still under the bottom of the
        // screen when its turn comes, so cards arrive one at a time instead of
        // sitting there as a visible pile.
        const card0 = cardRefs.current[0]
        const restTop = (containerRef.current.offsetHeight - card0.offsetHeight) / 2 // card's top edge within the section, at rest
        const comesIntoViewAt = top + restTop - vh // scroll at which a card at rest would reach the bottom of the screen
        const rise = Math.max(160, stagger * (n - 1) - comesIntoViewAt + MOBILE_RISE_MARGIN_PX)

        circleRefs.current.forEach((circle, i) => {
          const scrollTrigger = {
            trigger: containerRef.current,
            start: `top top+=${Math.round(top - stagger * i)}`, // card i starts at scroll = stagger * i
            end: `+=${Math.round(length)}`,
            scrub: MOBILE_SCRUB,
          }
          // Centered on its resting spot like desktop's end state, `rise`
          // below it until its turn.
          gsap.set(cardRefs.current[i], { xPercent: -50, yPercent: -50, x: 0, y: rise })
          gsap.to(circle, { rotation: rot, ease: 'none', scrollTrigger })
          gsap.to(cardRefs.current[i], { rotation: rot, y: 0, ease: 'none', scrollTrigger })
          rot += angleStep
        })
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

        circleRefs.current.forEach((circle, i) => {
          // How far past the pin start this card's window opens (negative =
          // it opens before the pin engages).
          const delta = distPerCard * i - lead
          const scrollTrigger = {
            trigger: pinHeight,
            start: delta >= 0 ? `top top-=${delta}` : `top top+=${-delta}`,
            end: `+=${distPerCard}`,
            scrub: true,
          }
          gsap.to(circle, { rotation: rot, ease: 'power1.out', scrollTrigger })
          gsap.to(cardRefs.current[i], { rotation: rot, y: '-50%', ease: 'power1.out', scrollTrigger })
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
              scrub: true,
            },
          },
        )
      }
      const pinTop = pinHeight.getBoundingClientRect().top + window.scrollY

      // A gentle "scroll for more" hint — bounces in place until the cards
      // start arriving, then fades out.
      const arrowFadeOffset = Math.round(pinTop * (1 - ARROW_JOURNEY)) // scroll still left to the pin (or, on phones, to the section) when it fades
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

    return () => ctx.revert()
  }, [images.length, width])

  return (
    // On phones the cards can still be mid-rise when the blog below comes on
    // screen, so the section sits above it and only clips sideways (the huge
    // circles would otherwise add horizontal scroll). The circles are
    // transparent but cover the blog's top, so they must not catch taps.
    <section className="relative z-10 overflow-x-clip overflow-y-visible sm:z-auto sm:overflow-hidden">
      <div ref={pinHeightRef} className="sm:h-[250vh]">
        <div ref={containerRef} className="relative h-[135vw] sm:h-screen">
          <div ref={circlesRef} className="pointer-events-none absolute inset-0">
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
