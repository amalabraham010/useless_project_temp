"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface PabloKangarooProps {
  onClick?: () => void
  currentCommand?: string
  onCommandComplete?: () => void
  onPositionUpdate?: (position: THREE.Vector3) => void
}

export default function PabloKangaroo({
  onClick,
  currentCommand,
  onCommandComplete,
  onPositionUpdate,
}: PabloKangarooProps) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Mesh>(null)
  const tailRef = useRef<THREE.Mesh>(null)
  const leftEarRef = useRef<THREE.Mesh>(null)
  const rightEarRef = useRef<THREE.Mesh>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const fireParticlesRef = useRef<THREE.Group>(null)
  const capeRef = useRef<THREE.Mesh>(null)
  const pouchRef = useRef<THREE.Mesh>(null)

  const [isInteracting, setIsInteracting] = useState(false)
  const [currentAnimation, setCurrentAnimation] = useState("idle")
  const animationTime = useRef(0)
  const commandStartTime = useRef(0)
  const lastPositionUpdate = useRef(0)

  // Handle command changes
  useEffect(() => {
    if (currentCommand && currentCommand !== "idle") {
      setCurrentAnimation(currentCommand)
      commandStartTime.current = 0
      setIsInteracting(true)

      // Auto-complete command after duration
      const duration = getCommandDuration(currentCommand)
      setTimeout(() => {
        setCurrentAnimation("idle")
        setIsInteracting(false)
        onCommandComplete?.()
      }, duration)
    }
  }, [currentCommand, onCommandComplete])

  const getCommandDuration = (command: string) => {
    switch (command) {
      case "jump":
        return 2000
      case "run":
        return 3000
      case "spin":
        return 2500
      case "sit":
        return 4000
      case "stay":
        return 3000
      case "rollover":
        return 3000
      case "speak":
        return 2000
      case "play":
        return 4000
      default:
        return 2000
    }
  }

  useFrame((state, delta) => {
    animationTime.current += delta
    commandStartTime.current += delta

    if (!groupRef.current) return

    // Reset transformations
    if (groupRef.current) {
      groupRef.current.position.y = 0
      groupRef.current.rotation.y = 0
      groupRef.current.scale.setScalar(1)
    }

    // Base breathing animation and kangaroo idle hopping
    if (groupRef.current && currentAnimation === "idle") {
      const idleHop = Math.abs(Math.sin(animationTime.current * 1.5)) * 0.1
      groupRef.current.position.y = idleHop
      groupRef.current.scale.y = 1 + Math.sin(animationTime.current * 2) * 0.02
    }

    // Cape animation - always flowing with enhanced physics
    if (capeRef.current) {
      const windEffect = Math.sin(animationTime.current * 3) * 0.3
      const flyingEffect = currentAnimation === "sit" ? 1.8 : 0
      const dramaticFlow = currentAnimation === "jump" ? 0.5 : 0

      capeRef.current.rotation.x = -0.3 + windEffect + flyingEffect + dramaticFlow
      capeRef.current.rotation.z = Math.sin(animationTime.current * 2) * 0.2

      // Enhanced cape material properties for cinematic look
      const capeMaterial = capeRef.current.material as THREE.MeshStandardMaterial
      capeMaterial.roughness = 0.3
      capeMaterial.metalness = 0.1
      capeMaterial.envMapIntensity = 0.8
    }

    // Pouch animation - slight movement
    if (pouchRef.current) {
      pouchRef.current.scale.y = 1 + Math.sin(animationTime.current * 1.5) * 0.05
    }

    // Enhanced fire particles animation with more dramatic effects
    if (fireParticlesRef.current) {
      fireParticlesRef.current.visible = currentAnimation === "sit"

      if (currentAnimation === "sit") {
        // Animate fire particles with more intensity
        fireParticlesRef.current.children.forEach((particle, index) => {
          if (particle instanceof THREE.Mesh) {
            // More dramatic particle movement
            particle.position.y = -1.2 - index * 0.3 - Math.sin(animationTime.current * 15 + index) * 0.5
            particle.scale.setScalar(1.2 + Math.sin(animationTime.current * 12 + index) * 0.6)

            // Enhanced fire material with emissive properties
            const material = particle.material as THREE.MeshStandardMaterial
            const intensity = 0.8 + Math.sin(animationTime.current * 18 + index) * 0.7
            material.emissiveIntensity = intensity
            material.roughness = 0.1
            material.metalness = 0.0
          }
        })
      }
    }

    // Command-specific animations with enhanced effects
    switch (currentAnimation) {
      case "jump":
        if (groupRef.current) {
          const jumpHeight = Math.abs(Math.sin(commandStartTime.current * 4)) * 3.0 // Even higher jumps
          groupRef.current.position.y = jumpHeight
          // Add dramatic rotation during jump
          groupRef.current.rotation.z = Math.sin(commandStartTime.current * 6) * 0.2
        }
        break

      case "run":
        if (groupRef.current) {
          // Enhanced kangaroo hopping motion while moving
          const hopHeight = Math.abs(Math.sin(commandStartTime.current * 6)) * 1.5
          groupRef.current.position.y = hopHeight
          groupRef.current.position.x = Math.sin(commandStartTime.current * 3) * 2.5
          groupRef.current.rotation.y = Math.sin(commandStartTime.current * 3) * 0.4
        }
        break

      case "spin":
        if (groupRef.current) {
          groupRef.current.rotation.y = commandStartTime.current * 5
          // Add dramatic hopping while spinning
          const spinHop = Math.abs(Math.sin(commandStartTime.current * 10)) * 1.2
          groupRef.current.position.y = spinHop
        }
        break

      case "sit":
        // EPIC rocket kangaroo with enhanced effects!
        if (groupRef.current) {
          const rocketHeight = Math.min(commandStartTime.current * 5, 12) // Even higher rocket flight
          groupRef.current.position.y = rocketHeight

          // More dramatic rocket effects
          groupRef.current.rotation.z = Math.sin(commandStartTime.current * 3) * 0.15
          groupRef.current.rotation.x = -0.2 + Math.sin(commandStartTime.current * 8) * 0.1
        }

        // Enhanced tail rocket exhaust effect
        if (tailRef.current) {
          tailRef.current.rotation.x = Math.sin(animationTime.current * 20) * 2.0
          tailRef.current.rotation.z = Math.sin(animationTime.current * 18) * 0.5
        }
        break

      case "stay":
        // Kangaroo stays but with cinematic subtle bouncing
        if (groupRef.current) {
          const stayBounce = Math.sin(animationTime.current * 4) * 0.08
          groupRef.current.position.y = stayBounce
        }
        break

      case "rollover":
        if (groupRef.current) {
          groupRef.current.rotation.z = Math.sin(commandStartTime.current * 3) * Math.PI
          // Enhanced hopping during rollover
          const rollHop = Math.abs(Math.sin(commandStartTime.current * 8)) * 0.8
          groupRef.current.position.y = rollHop
        }
        break

      case "speak":
        if (headRef.current) {
          headRef.current.rotation.x = Math.sin(commandStartTime.current * 10) * 0.3
        }
        // Enhanced kangaroo bounces while speaking
        if (groupRef.current) {
          const speakBounce = Math.abs(Math.sin(commandStartTime.current * 8)) * 0.5
          groupRef.current.position.y = speakBounce
        }
        break

      case "play":
        if (groupRef.current) {
          const playBounce = Math.abs(Math.sin(commandStartTime.current * 9)) * 1.5 // More dramatic play bounces
          groupRef.current.position.y = playBounce
          groupRef.current.rotation.y = Math.sin(commandStartTime.current * 5) * 0.6
        }
        break
    }

    // Enhanced tail swaying for balance (kangaroo style)
    if (tailRef.current && currentAnimation !== "sit") {
      const swaySpeed = isInteracting ? 5 : 1.5
      const swayIntensity = isInteracting ? 1.0 : 0.4
      tailRef.current.rotation.x = Math.sin(animationTime.current * swaySpeed) * swayIntensity
    }

    // Enhanced ear movements
    if (leftEarRef.current && rightEarRef.current) {
      const earMovement = Math.sin(animationTime.current * 3) * 0.25
      leftEarRef.current.rotation.z = earMovement - 0.1
      rightEarRef.current.rotation.z = -earMovement + 0.1
    }

    // Throttled position updates for camera tracking (only every 100ms)
    if (groupRef.current && onPositionUpdate && animationTime.current - lastPositionUpdate.current > 0.1) {
      const worldPosition = new THREE.Vector3()
      groupRef.current.getWorldPosition(worldPosition)
      onPositionUpdate(worldPosition)
      lastPositionUpdate.current = animationTime.current
    }
  })

  const handleClick = () => {
    setIsInteracting(true)
    onClick?.()
    setTimeout(() => setIsInteracting(false), 2000)
  }

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      position={[0, 0, 0]}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {/* ENHANCED RED SUPERHERO CAPE with cinematic materials! 🦸‍♂️ */}
      <mesh ref={capeRef} position={[0, 0.8, -0.6]} rotation={[-0.3, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[1.0, 1.5]} />
        <meshStandardMaterial
          color="#DC143C"
          side={THREE.DoubleSide}
          roughness={0.3}
          metalness={0.1}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Enhanced cape attachment with metallic finish */}
      <mesh position={[0, 1.0, 0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
        <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.8} envMapIntensity={1.0} />
      </mesh>

      {/* Main Body - Enhanced materials */}
      <mesh ref={bodyRef} position={[0, 0.6, 0]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.35, 1.0, 4, 8]} />
        <meshStandardMaterial color="#D2691E" roughness={0.7} metalness={0.0} envMapIntensity={0.3} />
      </mesh>

      {/* Enhanced chest/belly */}
      <mesh position={[0, 0.4, 0.3]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#F4A460" roughness={0.8} metalness={0.0} />
      </mesh>

      {/* ENHANCED KANGAROO POUCH with better materials! */}
      <mesh ref={pouchRef} position={[0, 0.2, 0.45]} rotation={[0.3, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#CD853F" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Enhanced pouch opening */}
      <mesh position={[0, 0.3, 0.5]} rotation={[0.3, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={1.0} metalness={0.0} />
      </mesh>

      {/* Enhanced head */}
      <mesh ref={headRef} position={[0, 1.2, 0.2]} rotation={[0.1, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.2, 0.4, 4, 8]} />
        <meshStandardMaterial color="#D2691E" roughness={0.7} metalness={0.0} />
      </mesh>

      {/* Enhanced snout */}
      <mesh position={[0, 1.1, 0.5]} castShadow receiveShadow>
        <capsuleGeometry args={[0.08, 0.25, 4, 8]} />
        <meshStandardMaterial color="#F4A460" roughness={0.8} metalness={0.0} />
      </mesh>

      {/* Enhanced nose with glossy finish */}
      <mesh position={[0, 1.15, 0.7]} castShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.0} />
      </mesh>

      {/* Nostrils */}
      <mesh position={[-0.01, 1.14, 0.72]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.01, 1.14, 0.72]}>
        <sphereGeometry args={[0.008, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Enhanced eyes with reflective properties */}
      <mesh position={[-0.1, 1.25, 0.35]} castShadow receiveShadow>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#000000" roughness={0.0} metalness={0.1} envMapIntensity={1.0} />
      </mesh>
      <mesh position={[0.1, 1.25, 0.35]} castShadow receiveShadow>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#000000" roughness={0.0} metalness={0.1} envMapIntensity={1.0} />
      </mesh>

      {/* Enhanced eye highlights */}
      <mesh position={[-0.09, 1.26, 0.38]} castShadow>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.11, 1.26, 0.38]} castShadow>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
      </mesh>

      {/* Enhanced Large Kangaroo Ears */}
      <mesh ref={leftEarRef} position={[-0.15, 1.45, -0.1]} rotation={[0.1, -0.3, -0.1]} castShadow receiveShadow>
        <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
        <meshStandardMaterial color="#D2691E" roughness={0.7} metalness={0.0} />
      </mesh>
      <mesh ref={rightEarRef} position={[0.15, 1.45, -0.1]} rotation={[0.1, 0.3, 0.1]} castShadow receiveShadow>
        <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
        <meshStandardMaterial color="#D2691E" roughness={0.7} metalness={0.0} />
      </mesh>

      {/* Inner ears */}
      <mesh position={[-0.15, 1.4, -0.05]} rotation={[0.1, -0.3, -0.1]} receiveShadow>
        <capsuleGeometry args={[0.04, 0.25, 4, 8]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>
      <mesh position={[0.15, 1.4, -0.05]} rotation={[0.1, 0.3, 0.1]} receiveShadow>
        <capsuleGeometry args={[0.04, 0.25, 4, 8]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>

      {/* Small Front Arms/Paws */}
      <mesh position={[-0.25, 0.7, 0.2]} rotation={[0.3, 0, -0.2]} castShadow receiveShadow>
        <capsuleGeometry args={[0.04, 0.3, 4, 8]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>
      <mesh position={[0.25, 0.7, 0.2]} rotation={[0.3, 0, 0.2]} castShadow receiveShadow>
        <capsuleGeometry args={[0.04, 0.3, 4, 8]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>

      {/* Small front paws */}
      <mesh position={[-0.28, 0.5, 0.35]} scale={[0.06, 0.04, 0.08]} castShadow>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.28, 0.5, 0.35]} scale={[0.06, 0.04, 0.08]} castShadow>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* POWERFUL HIND LEGS */}
      <mesh position={[-0.2, -0.2, -0.1]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.12, 0.8, 4, 8]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>
      <mesh position={[0.2, -0.2, -0.1]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.12, 0.8, 4, 8]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>

      {/* Large hind feet */}
      <mesh position={[-0.2, -0.7, 0.2]} scale={[0.15, 0.08, 0.25]} castShadow receiveShadow>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.2, -0.7, 0.2]} scale={[0.15, 0.08, 0.25]} castShadow receiveShadow>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Foot pads */}
      <mesh position={[-0.2, -0.75, 0.3]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.2, -0.75, 0.3]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* LONG THICK KANGAROO TAIL */}
      <mesh ref={tailRef} position={[0, 0.2, -0.8]} rotation={[0.8, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.08, 1.2, 4, 8]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>

      {/* Tail tip */}
      <mesh position={[0, -0.3, -1.6]} rotation={[0.8, 0, 0]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* ENHANCED GREEN FIRE PARTICLES! 🔥🚀 */}
      <group ref={fireParticlesRef} position={[0, 0, -1.0]} visible={false}>
        {/* Main fire blast with enhanced materials */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <coneGeometry args={[0.2, 0.8, 8]} />
          <meshStandardMaterial
            color="#00FF00"
            emissive="#00FF00"
            emissiveIntensity={1.2}
            transparent
            opacity={0.9}
            roughness={0.1}
            metalness={0.0}
          />
        </mesh>

        {/* Enhanced fire particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 0.4, -1.0 - i * 0.2, (Math.random() - 0.5) * 0.4]}>
            <sphereGeometry args={[0.06 + Math.random() * 0.06, 6, 6]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#00FF00" : "#32CD32"}
              emissive={i % 2 === 0 ? "#00FF00" : "#32CD32"}
              emissiveIntensity={0.8}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}

        {/* Enhanced inner core fire */}
        <mesh position={[0, -0.3, 0]}>
          <coneGeometry args={[0.1, 0.5, 6]} />
          <meshStandardMaterial color="#ADFF2F" emissive="#ADFF2F" emissiveIntensity={1.5} transparent opacity={0.95} />
        </mesh>

        {/* Enhanced sparkle effects */}
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh
            key={`spark-${i}`}
            position={[(Math.random() - 0.5) * 0.8, -0.5 - Math.random() * 1.5, (Math.random() - 0.5) * 0.8]}
          >
            <sphereGeometry args={[0.025, 4, 4]} />
            <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={1.8} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
