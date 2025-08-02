"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface PabloHuskyProps {
  onClick?: () => void
  currentCommand?: string
  onCommandComplete?: () => void
}

export default function PabloHusky({ onClick, currentCommand, onCommandComplete }: PabloHuskyProps) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Mesh>(null)
  const tailRef = useRef<THREE.Mesh>(null)
  const leftEarRef = useRef<THREE.Mesh>(null)
  const rightEarRef = useRef<THREE.Mesh>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const fireParticlesRef = useRef<THREE.Group>(null)
  const capeRef = useRef<THREE.Mesh>(null)

  const [isInteracting, setIsInteracting] = useState(false)
  const [currentAnimation, setCurrentAnimation] = useState("idle")
  const animationTime = useRef(0)
  const commandStartTime = useRef(0)

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

    // Base breathing animation
    if (groupRef.current && currentAnimation === "idle") {
      groupRef.current.scale.y = 1 + Math.sin(animationTime.current * 2) * 0.02
    }

    // Cape animation - always flowing
    if (capeRef.current) {
      const windEffect = Math.sin(animationTime.current * 3) * 0.3
      const flyingEffect = currentAnimation === "sit" ? 1.5 : 0
      capeRef.current.rotation.x = -0.3 + windEffect + flyingEffect
      capeRef.current.rotation.z = Math.sin(animationTime.current * 2) * 0.2
    }

    // Fire particles animation
    if (fireParticlesRef.current) {
      fireParticlesRef.current.visible = currentAnimation === "sit"

      if (currentAnimation === "sit") {
        // Animate fire particles
        fireParticlesRef.current.children.forEach((particle, index) => {
          if (particle instanceof THREE.Mesh) {
            // Make particles flicker and move
            particle.position.y = -0.8 - index * 0.2 - Math.sin(animationTime.current * 10 + index) * 0.3
            particle.scale.setScalar(0.8 + Math.sin(animationTime.current * 8 + index) * 0.4)

            // Color variation for fire effect
            const material = particle.material as THREE.MeshStandardMaterial
            const intensity = 0.5 + Math.sin(animationTime.current * 12 + index) * 0.5
            material.emissiveIntensity = intensity
          }
        })
      }
    }

    // Command-specific animations
    switch (currentAnimation) {
      case "jump":
        if (groupRef.current) {
          const jumpHeight = Math.abs(Math.sin(commandStartTime.current * 6)) * 1.5
          groupRef.current.position.y = jumpHeight
        }
        break

      case "run":
        if (groupRef.current) {
          groupRef.current.position.x = Math.sin(commandStartTime.current * 4) * 2
          groupRef.current.rotation.y = Math.sin(commandStartTime.current * 4) * 0.3
        }
        break

      case "spin":
        if (groupRef.current) {
          groupRef.current.rotation.y = commandStartTime.current * 4
        }
        break

      case "sit":
        // Pablo flies like a rocket instead of sitting!
        if (groupRef.current) {
          const rocketHeight = Math.min(commandStartTime.current * 3, 8) // Fly up to 8 units high
          groupRef.current.position.y = rocketHeight

          // Add some rocket-like rotation
          groupRef.current.rotation.z = Math.sin(commandStartTime.current * 2) * 0.1

          // Tilt forward like a rocket
          groupRef.current.rotation.x = -0.3
        }

        // Make tail go crazy like rocket exhaust
        if (tailRef.current) {
          tailRef.current.rotation.z = Math.sin(animationTime.current * 15) * 2
        }
        break

      case "stay":
        // Pablo stays perfectly still
        break

      case "rollover":
        if (groupRef.current) {
          groupRef.current.rotation.z = Math.sin(commandStartTime.current * 3) * Math.PI
        }
        break

      case "speak":
        if (headRef.current) {
          headRef.current.rotation.x = Math.sin(commandStartTime.current * 8) * 0.2
        }
        break

      case "play":
        if (groupRef.current) {
          const playBounce = Math.abs(Math.sin(commandStartTime.current * 5)) * 0.5
          groupRef.current.position.y = playBounce
          groupRef.current.rotation.y = Math.sin(commandStartTime.current * 3) * 0.5
        }
        break
    }

    // Tail wagging based on activity
    if (tailRef.current && currentAnimation !== "sit") {
      const wagSpeed = isInteracting ? 8 : 2
      const wagIntensity = isInteracting ? 1.2 : 0.3
      tailRef.current.rotation.z = Math.sin(animationTime.current * wagSpeed) * wagIntensity
    }

    // Ear movements
    if (leftEarRef.current && rightEarRef.current) {
      const earMovement = Math.sin(animationTime.current * 2) * 0.1
      leftEarRef.current.rotation.z = earMovement - 0.2
      rightEarRef.current.rotation.z = -earMovement + 0.2
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
      {/* RED SUPERHERO CAPE! 🦸‍♂️ */}
      <mesh ref={capeRef} position={[0, 0.5, -0.5]} rotation={[-0.3, 0, 0]} castShadow>
        <planeGeometry args={[0.8, 1.2]} />
        <meshStandardMaterial color="#DC143C" side={THREE.DoubleSide} />
      </mesh>

      {/* Cape attachment point */}
      <mesh position={[0, 0.6, 0.1]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* Main Body - Husky proportions */}
      <mesh ref={bodyRef} position={[0, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.4, 0.8, 4, 8]} />
        <meshStandardMaterial color="#E8E8E8" />
      </mesh>

      {/* Chest */}
      <mesh position={[0, 0.4, 0.3]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Gray markings on back */}
      <mesh position={[0, 0.6, -0.1]} scale={[0.35, 0.2, 0.4]} castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      <mesh position={[0, 0.5, -0.3]} scale={[0.3, 0.15, 0.3]} castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#696969" />
      </mesh>

      {/* Head - Husky head shape */}
      <mesh ref={headRef} position={[0, 0.8, 0.4]} rotation={[0.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.3, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Forehead/skull */}
      <mesh position={[0, 1.0, 0.2]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Gray mask markings around eyes - classic husky pattern */}
      <mesh position={[0, 1.0, 0.35]} scale={[0.4, 0.15, 0.25]} castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#696969" />
      </mesh>

      {/* Muzzle */}
      <mesh position={[0, 0.75, 0.65]} castShadow>
        <capsuleGeometry args={[0.12, 0.25, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.8, 0.85]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Nostrils */}
      <mesh position={[-0.015, 0.79, 0.87]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.015, 0.79, 0.87]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Eyes - Bright blue husky eyes */}
      <mesh position={[-0.12, 0.95, 0.55]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#87CEEB" emissive="#1E90FF" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.12, 0.95, 0.55]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#87CEEB" emissive="#1E90FF" emissiveIntensity={0.2} />
      </mesh>

      {/* Eye pupils */}
      <mesh position={[-0.12, 0.95, 0.58]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.12, 0.95, 0.58]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Ears - Pointed husky ears */}
      <mesh ref={leftEarRef} position={[-0.18, 1.15, 0.1]} rotation={[0.2, -0.3, -0.2]} castShadow>
        <coneGeometry args={[0.12, 0.25, 8]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      <mesh ref={rightEarRef} position={[0.18, 1.15, 0.1]} rotation={[0.2, 0.3, 0.2]} castShadow>
        <coneGeometry args={[0.12, 0.25, 8]} />
        <meshStandardMaterial color="#696969" />
      </mesh>

      {/* Inner ears */}
      <mesh position={[-0.18, 1.1, 0.15]} rotation={[0.2, -0.3, -0.2]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>
      <mesh position={[0.18, 1.1, 0.15]} rotation={[0.2, 0.3, 0.2]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.55, 0.25]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.25, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Front Legs */}
      <mesh position={[-0.2, -0.1, 0.25]} rotation={[0.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.2, -0.1, 0.25]} rotation={[0.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Back Legs */}
      <mesh position={[-0.2, -0.1, -0.2]} rotation={[-0.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.2, -0.1, -0.2]} rotation={[-0.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Paws */}
      <mesh position={[-0.2, -0.4, 0.3]} scale={[0.08, 0.06, 0.1]} castShadow>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
      <mesh position={[0.2, -0.4, 0.3]} scale={[0.08, 0.06, 0.1]} castShadow>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
      <mesh position={[-0.2, -0.4, -0.15]} scale={[0.08, 0.06, 0.1]} castShadow>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
      <mesh position={[0.2, -0.4, -0.15]} scale={[0.08, 0.06, 0.1]} castShadow>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>

      {/* Fluffy Husky Tail - curled over back */}
      <mesh ref={tailRef} position={[0, 0.6, -0.4]} rotation={[0.5, 0, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.4, 4, 8]} />
        <meshStandardMaterial color="#696969" />
      </mesh>

      {/* Tail tip - white */}
      <mesh position={[0, 0.8, -0.6]} rotation={[0.5, 0, 0]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* GREEN FIRE PARTICLES FROM BUTT! 🔥 */}
      <group ref={fireParticlesRef} position={[0, 0, -0.7]} visible={false}>
        {/* Main fire blast */}
        <mesh position={[0, -0.5, 0]}>
          <coneGeometry args={[0.15, 0.6, 8]} />
          <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.8} transparent opacity={0.8} />
        </mesh>

        {/* Fire particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 0.3, -0.8 - i * 0.2, (Math.random() - 0.5) * 0.3]}>
            <sphereGeometry args={[0.05 + Math.random() * 0.05, 6, 6]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#00FF00" : "#32CD32"}
              emissive={i % 2 === 0 ? "#00FF00" : "#32CD32"}
              emissiveIntensity={0.6}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}

        {/* Inner core fire */}
        <mesh position={[0, -0.3, 0]}>
          <coneGeometry args={[0.08, 0.4, 6]} />
          <meshStandardMaterial color="#ADFF2F" emissive="#ADFF2F" emissiveIntensity={1.0} transparent opacity={0.9} />
        </mesh>

        {/* Sparkle effects */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh
            key={`spark-${i}`}
            position={[(Math.random() - 0.5) * 0.6, -0.4 - Math.random() * 1.2, (Math.random() - 0.5) * 0.6]}
          >
            <sphereGeometry args={[0.02, 4, 4]} />
            <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={1.2} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
