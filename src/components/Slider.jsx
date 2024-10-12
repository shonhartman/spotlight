import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil';
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, Image } from '@react-three/drei'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'
import { sliderActiveState } from '../state/slider-active';

const GOLDENRATIO = 1.15

export function Slider({ images }) {
  const [active, setActive] = useRecoilState(sliderActiveState);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const canvasRef = useRef(null);

  const handleResize = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 375) {
      setIsMobile(true);
    }
  };

  useEffect(() => {
    // Call handleResize on component mount
    handleResize();

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || touchStartY === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = (touchStartX - touchEndX) * 100;
    const deltaY = (touchStartY - touchEndY) * 100;

    // Minimum swipe distance (adjust this value to change sensitivity)
    const minSwipeDistance = 50;

    // Check if the swipe is more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe left
          navigateToNextImage(1);
        } else {
          // Swipe right
          navigateToNextImage(-1);
        }
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  const navigateToNextImage = (direction) => {
    const newIndex = (currentIndex + direction + images.length) % images.length;
    setCurrentIndex(newIndex);
    setActive(true);
  };

  function calculateCanvasHeight(isMobile, active) {
    if (isMobile) {
      return active ? '1200px' : '200px'
    } else {
      return active ? '800px' : '500px'
    }
  }

  const resetSlider = () => {
    setCurrentIndex(-1);
    setActive(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (canvasRef.current && !canvasRef.current.contains(event.target)) {
        resetSlider();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={canvasRef}
      className={`
        ${calculateCanvasHeight(isMobile, active)}
        mx-auto
        relative
        z-10
      `}
    >
      <Canvas 
        style={{
        height: calculateCanvasHeight(isMobile, active),
      }} 
      dpr={[1, 1.5]} 
      camera={{ fov: 70, position: [0, 2, 15] }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <group position={[0, -0.5, 1]}>
        <Frames isMobile={isMobile} images={images} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
      </group>
    </Canvas>
    </div>


  )
}

function Frames({ isMobile, images, currentIndex, setCurrentIndex, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()
  const [, setSliderState] = useRecoilState(sliderActiveState);

  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < images.length) {
      clicked.current = ref.current.getObjectByName(getUuid(images[currentIndex].url))

      console.log({isMobile});
      

      if (clicked.current) {
        console.log({clicked});
        clicked.current.parent.updateWorldMatrix(true, true)
        isMobile ? clicked.current.parent.localToWorld(p.set(0, 0.001, 3.15)) : clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
        clicked.current.parent.getWorldQuaternion(q)
      } else {
        console.log('else');
        
        p.set(0, 0, 5.5)
        q.identity()
      }
    } else {
      // Reset camera position when no image is selected
      p.set(0, 0, 5.5)
      q.identity()
      clicked.current = null
    }
  }, [currentIndex, images])

  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.3, dt)
    easing.dampQ(state.camera.quaternion, q, 0.3, dt)
  })
  
  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        const index = images.findIndex(img => getUuid(img.url) === e.object.name)
        if (index !== -1) {
          setCurrentIndex(index)
          setSliderState(true)
        } else {
          // Reset the slider when clicking on empty space
          setCurrentIndex(-1)
          setSliderState(false)
        }
      }}
      onPointerMissed={() => {
        // Reset the slider when clicking outside the group
        setCurrentIndex(-1)
        setSliderState(false)
      }}
    >
      {images.map((props) => <Frame key={props.url} {...props} /> /* prettier-ignore */)}
    </group>
  )
}

function Frame({ url, c = new THREE.Color(), ...props }) {
  const image = useRef()
  const frame = useRef()
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const name = getUuid(url)

  useCursor(hovered)
  useFrame((state, dt) => {
    image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 30) / 2
    easing.damp3(image.current.scale, [0.87 * (hovered ? 0.97 : 1), 0.9 * (hovered ? 0.97 : 1), 1], 0.1, dt)
    easing.dampC(frame.current.material.color, hovered ? 'hotpink' : '#a855f7', 0.1, dt)
  })

  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1.25, GOLDENRATIO, 0.02]}
        position={[0, GOLDENRATIO / 2, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} alt={`Image ${name}`} />
      </mesh>
    </group>
  )
}