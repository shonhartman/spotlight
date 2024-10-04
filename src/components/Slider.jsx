import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, Image } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'
import { sliderActiveState } from '../state/slider-active';

const GOLDENRATIO = 1.15

export function Slider({ images }) {
  const [active, setActive] = useRecoilState(sliderActiveState);
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
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
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        // Swipe left
        navigateToNextImage(1);
      } else {
        // Swipe right
        navigateToNextImage(-1);
      }
    }

    setTouchStartX(null);
  };

  const navigateToNextImage = (direction) => {
    const newIndex = (currentIndex + direction + images.length) % images.length;
    setCurrentIndex(newIndex);
    setLocation(`/item/${getUuid(images[newIndex].url)}`);
    setActive(true);
  };

  function calculateCanvasHeight(isMobile, active) {
    if (isMobile) {
      return active ? '300px' : '200px'
    } else {
      return active ? '800px' : '500px'
    }
  }

  const canvasHeight = calculateCanvasHeight(isMobile, active);

  return (
    <Canvas 
      ref={canvasRef}
      style={{height: canvasHeight, margin: '0 auto'}} 
      dpr={[1, 1.5]} 
      background={'transparent'} 
      camera={{ fov: 70, position: [0, 2, 15] }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* <fog attach="fog" args={['#191920', 0, 15]} /> */}
      <group position={[0, -0.5, 1]}>
        <Frames images={images} />
      </group>
    </Canvas>
  )
}

function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/item/:id')
  const [location, setLocation] = useLocation()

  useEffect(() => {
    // Check the current route and update the slider state accordingly
    if (location === '/') {
      // If we're not viewing a specific image, set the slider to inactive
      setSliderState(false)
    } else {
      // If we're viewing a specific image, set the slider to active
      setSliderState(true)
    }

    // Find the object in our 3D scene that matches the current route parameter
    clicked.current = ref.current.getObjectByName(params?.id)

    if (clicked.current) {
      // If we found a matching object (i.e., we're viewing a specific image)

      // Update the world matrix of the parent object
      // This ensures all world positions and rotations are up to date
      clicked.current.parent.updateWorldMatrix(true, true)

      // Calculate the new camera position
      // We use localToWorld to convert from the object's local space to world space
      // The position is set slightly above and in front of the object (using GOLDENRATIO)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))

      // Set the camera's rotation to match the parent object's rotation
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      // If we didn't find a matching object (i.e., we're on the home view)
      // Reset the camera position to a default value
      // This positions the camera to view all frames
      p.set(0, 0, 5.5)

      // Reset the camera rotation to its default (no rotation)
      q.identity()
    }
  })

  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.3, dt)
    easing.dampQ(state.camera.quaternion, q, 0.3, dt)
  })
  
  // SLIDER STATE
  const [active, setSliderState] = useRecoilState(sliderActiveState);

  return (
    <group
      ref={ref}
      onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name), setSliderState(active ? true : false))}
      onPointerMissed={() => setLocation('/')}
    >
      {images.map((props) => <Frame key={props.url} {...props} /> /* prettier-ignore */)}
    </group>
  )
}

function Frame({ url, c = new THREE.Color(), ...props }) {
  const image = useRef()
  const frame = useRef()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const name = getUuid(url)
  const isActive = params?.id === name

  useCursor(hovered)
  useFrame((state, dt) => {
    // adjusts the zoom of the image material
    image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 30) / 2
    // adjusts the scale of the image mesh
    easing.damp3(image.current.scale, [0.87 * (!isActive && hovered ? 0.97 : 1), 0.9 * (!isActive && hovered ? 0.97 : 1), 1], 0.1, dt)
    // adjusts the color of the frame mesh
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
      {/* OPTIONAL PINNED TEXT */}
      {/* <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.65, GOLDENRATIO, 0]} fontSize={0.05}>
        {name.split('-').join(' ')}
      </Text> */}
    </group>
  )
}
