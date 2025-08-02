"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import type * as THREE from "three"

interface Pablo3DProps {
  mood: string
  isGoodDog: boolean
  currentAnimation: string
}

export default function Pablo3D({ mood, isGoodDog, currentAnimation }: Pablo3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const tailRef = useRef<THREE.Mesh>(null)
  const headRef = useRef<THREE.Mesh>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const leftEarRef = useRef<THREE.Mesh>(null)
  const rightEarRef = useRef<THREE.Mesh>(null)
  const tongueRef = useRef<THREE.Mesh>(null)

  const animationTime = useRef(0)
  const jumpOffset = useRef(0)
  const spinRotation = useRef(0)

  useFrame((state, delta) => {
    animationTime.current += delta

    if (!groupRef.current) return

    // Reset position and rotation
    groupRef.current.position.y = 0
    groupRef.current.rotation.y = 0

    // Tail wagging (always active)
    if (tailRef.current) {
      const wagSpeed = isGoodDog ? 8 : 4
      const wagIntensity = isGoodDog ? 0.8 : 0.5
      tailRef.current.rotation.z = Math.sin(animationTime.current * wagSpeed) * wagIntensity
    }

    // Head movements based on mood
    if (headRef.current) {
      if (mood === "defiant") {
        headRef.current.rotation.z = Math.sin(animationTime.current * 3) * 0.2
      } else if (mood === "playful") {
        headRef.current.rotation.y = Math.sin(animationTime.current * 2) * 0.3
      } else if (isGoodDog) {
        headRef.current.rotation.x = Math.sin(animationTime.current * 2) * 0.1 - 0.1
      }
    }

    // Ear movements
    if (leftEarRef.current && rightEarRef.current) {
      const earMovement = Math.sin(animationTime.current * 3) * 0.1
      leftEarRef.current.rotation.z = earMovement - 0.3
      rightEarRef.current.rotation.z = -earMovement + 0.3
    }

    // Specific animations based on current action
    switch (currentAnimation) {
      case "jump":
        jumpOffset.current = Math.abs(Math.sin(animationTime.current * 6)) * 1.5
        groupRef.current.position.y = jumpOffset.current
        break

      case "spin":
        spinRotation.current += delta * 4
        groupRef.current.rotation.y = spinRotation.current
        break

      case "hide":
        groupRef.current.scale.setScalar(0.7 + Math.sin(animationTime.current * 4) * 0.1)
        break

      case "run":
        groupRef.current.position.x = Math.sin(animationTime.current * 3) * 2
        groupRef.current.rotation.y = Math.sin(animationTime.current * 3) * 0.5
        break

      case "sit":
        if (bodyRef.current) {
          bodyRef.current.position.y = -0.3
          bodyRef.current.rotation.x = 0.3
        }
        break
    }

    // Tongue visibility for speaking
    if (tongueRef.current) {
      tongueRef.current.visible = currentAnimation === "speak" || Math.random() < 0.1
    }
  })

  // Get body color based on mood (keeping white base)
  const getAccentColor = () => {
    switch (mood) {
      case "obedient":
        return "#8B4513" // Brown
      case "defiant":
        return "#654321" // Darker brown
      case "playful":
        return "#A0522D" // Medium brown
      default:
        return "#8B4513" // Sandy brown
    }
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main Body - More realistic dog proportions */}
      <mesh ref={bodyRef} position={[0, -0.2, -0.3]} rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.6, 1.4, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Chest - Fuller chest area */}
      <mesh position={[0, -0.1, 0.2]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Black patches on back - more realistic placement */}
      <mesh position={[-0.1, 0.1, -0.4]} scale={[0.3, 0.2, 0.4]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#2F2F2F" />
      </mesh>
      <mesh position={[0.15, 0.0, -0.6]} scale={[0.25, 0.15, 0.3]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#2F2F2F" />
      </mesh>

      {/* Head - More realistic dog head shape */}
      <mesh ref={headRef} position={[0, 0.4, 0.7]} rotation={[0.1, 0, 0]}>
        <capsuleGeometry args={[0.35, 0.4, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Forehead/skull area */}
      <mesh position={[0, 0.6, 0.5]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Brown patches around eyes - more realistic */}
      <mesh position={[-0.2, 0.65, 0.7]} scale={[0.15, 0.12, 0.18]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={getAccentColor()} />
      </mesh>
      <mesh position={[0.2, 0.65, 0.7]} scale={[0.15, 0.12, 0.18]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={getAccentColor()} />
      </mesh>

      {/* Muzzle - Proper dog snout */}
      <mesh position={[0, 0.35, 1.0]}>
        <capsuleGeometry args={[0.18, 0.35, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Nose - More prominent */}
      <mesh position={[0, 0.45, 1.25]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Nostrils */}
      <mesh position={[-0.02, 0.44, 1.27]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.02, 0.44, 1.27]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Eyes - More realistic positioning */}
      <mesh position={[-0.18, 0.65, 0.85]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.18, 0.65, 0.85]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Eye whites - more realistic */}
      <mesh position={[-0.18, 0.65, 0.88]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.18, 0.65, 0.88]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Ears - More realistic Jack Russell ears */}
      <mesh ref={leftEarRef} position={[-0.25, 0.8, 0.3]} rotation={[0.3, -0.2, -0.4]}>
        <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
        <meshStandardMaterial color={getAccentColor()} />
      </mesh>
      <mesh ref={rightEarRef} position={[0.25, 0.8, 0.3]} rotation={[0.3, 0.2, 0.4]}>
        <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
        <meshStandardMaterial color={getAccentColor()} />
      </mesh>

      {/* Inner ears */}
      <mesh position={[-0.25, 0.75, 0.35]} rotation={[0.3, -0.2, -0.4]}>
        <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>
      <mesh position={[0.25, 0.75, 0.35]} rotation={[0.3, 0.2, 0.4]}>
        <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>

      {/* Mouth area */}
      <mesh position={[0, 0.25, 1.1]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>

      {/* Tongue */}
      <mesh ref={tongueRef} position={[0, 0.2, 1.15]} rotation={[0.3, 0, 0]} visible={false}>
        <capsuleGeometry args={[0.03, 0.2, 4, 8]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>

      {/* Neck - connecting head to body */}
      <mesh position={[0, 0.1, 0.4]}>
        <cylinderGeometry args={[0.25, 0.3, 0.3, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Front Legs - More realistic dog legs */}
      <mesh position={[-0.25, -0.6, 0.4]} rotation={[0.1, 0, 0]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.25, -0.6, 0.4]} rotation={[0.1, 0, 0]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Back Legs */}
      <mesh position={[-0.25, -0.6, -0.4]} rotation={[-0.1, 0, 0]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.25, -0.6, -0.4]} rotation={[-0.1, 0, 0]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Paws - More realistic */}
      <mesh position={[-0.25, -0.95, 0.45]} scale={[0.12, 0.08, 0.15]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
      <mesh position={[0.25, -0.95, 0.45]} scale={[0.12, 0.08, 0.15]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
      <mesh position={[-0.25, -0.95, -0.35]} scale={[0.12, 0.08, 0.15]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
      <mesh position={[0.25, -0.95, -0.35]} scale={[0.12, 0.08, 0.15]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>

      {/* Paw pads */}
      <mesh position={[-0.25, -1.0, 0.5]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.25, -1.0, 0.5]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.25, -1.0, -0.3]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.25, -1.0, -0.3]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Tail - More realistic dog tail */}
      <mesh ref={tailRef} position={[0, 0.0, -0.9]} rotation={[0.8, 0, 0]}>
        <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Brown patch on tail */}
      <mesh position={[0, 0.2, -1.1]} rotation={[0.8, 0, 0]} scale={[0.08, 0.06, 0.12]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color={getAccentColor()} />
      </mesh>

      {/* Red Collar - Better positioned */}
      <mesh position={[0, 0.15, 0.4]} rotation={[0.1, 0, 0]}>
        <torusGeometry args={[0.32, 0.04, 8, 16]} />
        <meshStandardMaterial color="#DC143C" />
      </mesh>

      {/* Collar buckle */}
      <mesh position={[0, 0.2, 0.65]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.08, 0.06, 0.02]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      {/* Collar tag */}
      <mesh position={[0.1, 0.05, 0.6]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.01, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* Mood indicator text */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.25}
        color={isGoodDog ? "#00FF00" : "#FF4500"}
        anchorX="center"
        anchorY="middle"
      >
        {isGoodDog
          ? "😇 Good Boy!"
          : mood === "defiant"
            ? "😤 Nope!"
            : mood === "playful"
              ? "😜 Hehe!"
              : "😈 Mischief!"}
      </Text>
    </group>
  )
}
