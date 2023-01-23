import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil';
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'
import { sliderActiveState } from '../state/slider-active';

const GOLDENRATIO = 1.15

export function Slider({ images }) {
  const [active, setSliderState] = useRecoilState(sliderActiveState);

  // I think the dynamic height here is causing a glitch
  // I think I need to recalculate the canvas height & relation to the r3f scaling

  return (
    <Canvas style={{height: active ? '800px' : '500px', margin: '0 auto'}} dpr={[1, 1.5]} background={'transparent'} camera={{ fov: 70, position: [0, 2, 15] }}>
      <fog attach="fog" args={['#191920', 0, 15]} />
      <group position={[0, -0.5, 1]}>
        <Frames images={images} />
      </group>
      <Environment preset="city" />
    </Canvas>
  )
}

function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/item/:id')
  const [location, setLocation] = useLocation()
  useEffect(() => {
    if(location === '/') {
      setSliderState(false)
    } else {
      setSliderState(true)
    }
    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      p.set(0, 0, 5.5)
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
    image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 30) / 2
    easing.damp3(image.current.scale, [0.87 * (!isActive && hovered ? 0.97 : 1), 0.9 * (!isActive && hovered ? 0.97 : 1), 1], 0.1, dt)
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
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
      {/* OPTIONAL PINNED TEXT */}
      {/* <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.65, GOLDENRATIO, 0]} fontSize={0.05}>
        {name.split('-').join(' ')}
      </Text> */}
    </group>
  )
}
