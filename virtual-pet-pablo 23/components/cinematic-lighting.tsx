"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

interface CinematicLightingProps {
  currentCommand: string
}

export default function CinematicLighting({ currentCommand }: CinematicLightingProps) {
  const keyLightRef = useRef<THREE.DirectionalLight>(null)
  const rimLightRef = useRef<THREE.DirectionalLight>(null)
  const fillLightRef = useRef<THREE.DirectionalLight>(null)
  const dramaticSpotRef = useRef<THREE.SpotLight>(null)
  const accentLight1Ref = useRef<THREE.PointLight>(null)
  const accentLight2Ref = useRef<THREE.PointLight>(null)
  const animationTime = useRef(0)

  useFrame((state, delta) => {
    animationTime.current += delta

    // Dynamic key lighting based on current command
    if (keyLightRef.current) {
      switch (currentCommand) {
        case "sit": // Rocket mode - intense dramatic lighting
          keyLightRef.current.intensity = 2.5 + Math.sin(animationTime.current * 12) * 0.8
          keyLightRef.current.color.setHex(0xff4500) // Orange-red for rocket
          keyLightRef.current.position.y = 15 + Math.sin(animationTime.current * 8) * 2
          break

        case "jump": // High energy golden lighting
          keyLightRef.current.intensity = 2.2 + Math.sin(animationTime.current * 10) * 0.5
          keyLightRef.current.color.setHex(0xffd700) // Golden
          keyLightRef.current.position.y = 12 + Math.abs(Math.sin(animationTime.current * 6)) * 3
          break

        case "spin": // Swirling light effect
          const spinAngle = animationTime.current * 4
          keyLightRef.current.position.x = Math.cos(spinAngle) * 10
          keyLightRef.current.position.z = Math.sin(spinAngle) * 10
          keyLightRef.current.intensity = 1.8 + Math.sin(animationTime.current * 8) * 0.4
          keyLightRef.current.color.setHex(0x00ced1) // Turquoise
          break

        case "run": // Moving light following action
          keyLightRef.current.position.x = 8 + Math.sin(animationTime.current * 5) * 4
          keyLightRef.current.position.z = 6 + Math.cos(animationTime.current * 3) * 2
          keyLightRef.current.intensity = 1.6 + Math.sin(animationTime.current * 6) * 0.3
          keyLightRef.current.color.setHex(0x32cd32) // Lime green
          break

        case "speak": // Pulsing communication light
          keyLightRef.current.intensity = 1.4 + Math.sin(animationTime.current * 15) * 0.6
          keyLightRef.current.color.setHex(0xff69b4) // Hot pink
          break

        case "play": // Playful multicolor cycling
          const playHue = (animationTime.current * 0.5) % 1
          keyLightRef.current.color.setHSL(playHue, 0.8, 0.6)
          keyLightRef.current.intensity = 1.5 + Math.sin(animationTime.current * 7) * 0.4
          break

        default: // Idle - gentle cinematic lighting
          keyLightRef.current.intensity = 1.4 + Math.sin(animationTime.current * 2) * 0.3
          keyLightRef.current.color.setHex(0xffe4b5) // Warm white
          keyLightRef.current.position.x = 8 + Math.sin(animationTime.current * 0.5) * 1
          keyLightRef.current.position.z = 6 + Math.cos(animationTime.current * 0.3) * 1
          keyLightRef.current.position.y = 12
          break
      }
    }

    // Enhanced rim light animation
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 1.0 + Math.sin(animationTime.current * 2.5) * 0.4

      if (currentCommand === "sit") {
        rimLightRef.current.color.setHex(0x00ff00) // Green for rocket fire
        rimLightRef.current.intensity = 2.0 + Math.sin(animationTime.current * 18) * 0.8
      } else if (currentCommand === "jump") {
        rimLightRef.current.color.setHex(0xffff00) // Yellow for energy
        rimLightRef.current.intensity = 1.5 + Math.sin(animationTime.current * 12) * 0.5
      } else {
        rimLightRef.current.color.setHex(0xff6347) // Tomato red
      }
    }

    // Fill light subtle animation
    if (fillLightRef.current) {
      fillLightRef.current.intensity = 0.5 + Math.sin(animationTime.current * 1.2) * 0.2
      if (currentCommand === "sit") {
        fillLightRef.current.color.setHex(0x87ceeb) // Sky blue contrast
      } else {
        fillLightRef.current.color.setHex(0x87ceeb) // Sky blue
      }
    }

    // Dramatic spotlight for special effects
    if (dramaticSpotRef.current) {
      if (currentCommand === "sit") {
        dramaticSpotRef.current.intensity = 3.0 + Math.sin(animationTime.current * 20) * 1.5
        dramaticSpotRef.current.color.setHex(0x00ff00)
        dramaticSpotRef.current.angle = 0.6 + Math.sin(animationTime.current * 8) * 0.2
        dramaticSpotRef.current.penumbra = 0.3
      } else if (currentCommand === "jump") {
        dramaticSpotRef.current.intensity = 2.0 + Math.sin(animationTime.current * 10) * 0.8
        dramaticSpotRef.current.color.setHex(0xffd700)
        dramaticSpotRef.current.angle = 0.4
        dramaticSpotRef.current.penumbra = 0.4
      } else if (currentCommand === "spin") {
        dramaticSpotRef.current.intensity = 1.5
        dramaticSpotRef.current.color.setHex(0x00ced1)
        dramaticSpotRef.current.angle = 0.8
        dramaticSpotRef.current.penumbra = 0.6
      } else {
        dramaticSpotRef.current.intensity = 0.8 + Math.sin(animationTime.current * 3) * 0.3
        dramaticSpotRef.current.color.setHex(0xffffff)
        dramaticSpotRef.current.angle = 0.3
        dramaticSpotRef.current.penumbra = 0.5
      }
    }

    // Accent lights for atmosphere
    if (accentLight1Ref.current) {
      accentLight1Ref.current.intensity = 0.4 + Math.sin(animationTime.current * 3 + 1) * 0.2
      const hue1 = (animationTime.current * 0.1) % 1
      accentLight1Ref.current.color.setHSL(hue1, 0.7, 0.6)
    }

    if (accentLight2Ref.current) {
      accentLight2Ref.current.intensity = 0.3 + Math.sin(animationTime.current * 2.5 + 2) * 0.2
      const hue2 = (animationTime.current * 0.1 + 0.5) % 1
      accentLight2Ref.current.color.setHSL(hue2, 0.8, 0.5)
    }
  })

  return (
    <>
      {/* Key Light - Main cinematic light */}
      <directionalLight
        ref={keyLightRef}
        position={[8, 12, 6]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />

      {/* Rim Light - Dramatic backlighting */}
      <directionalLight
        ref={rimLightRef}
        position={[-4, 8, -10]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill Light - Softer secondary light */}
      <directionalLight ref={fillLightRef} position={[-6, 10, 4]} intensity={0.5} color="#87CEEB" />

      {/* Dramatic Spotlight */}
      <spotLight
        ref={dramaticSpotRef}
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        target-position={[0, 0, 0]}
        distance={25}
        decay={1.5}
      />

      {/* Atmospheric accent lights */}
      <pointLight ref={accentLight1Ref} position={[6, 5, 6]} intensity={0.4} distance={15} decay={2} />
      <pointLight ref={accentLight2Ref} position={[-6, 4, -6]} intensity={0.3} distance={12} decay={2} />
      <pointLight position={[0, 12, -4]} intensity={0.5} color="#DDA0DD" distance={18} decay={1.5} />

      {/* Additional atmospheric lighting */}
      <hemisphereLight skyColor="#4169E1" groundColor="#228B22" intensity={0.4} />

      {/* Ambient lighting with subtle color temperature */}
      <ambientLight intensity={0.2} color="#6495ED" />
    </>
  )
}
