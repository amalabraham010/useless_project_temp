"use client"

import type React from "react"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface CameraControllerProps {
  currentCommand: string
  pabloPositionRef: React.MutableRefObject<THREE.Vector3>
}

export default function CameraController({ currentCommand, pabloPositionRef }: CameraControllerProps) {
  const { camera } = useThree()
  const animationTime = useRef(0)
  const shakeIntensity = useRef(0)
  const originalPosition = useRef(new THREE.Vector3(3, 2, 4))
  const targetPosition = useRef(new THREE.Vector3(3, 2, 4))
  const isTrackingMode = useRef(false)
  const commandStartTime = useRef(0)
  const lastCommand = useRef("")

  // Memoize command settings to prevent recalculation
  const commandSettings = useMemo(() => {
    return {
      sit: { tracking: true, shake: 0.3, position: [0, 8, 8] },
      jump: { tracking: true, shake: 0.15, position: [2, 4, 6] },
      spin: { tracking: true, shake: 0.1, position: null },
      run: { tracking: true, shake: 0.08, position: null },
      play: { tracking: true, shake: 0.12, position: [4, 3, 5] },
      speak: { tracking: true, shake: 0.05, position: [1.5, 2, 2.5] },
      idle: { tracking: false, shake: 0, position: [3, 2, 4] },
    }
  }, [])

  useFrame((state, delta) => {
    animationTime.current += delta
    commandStartTime.current += delta

    // Only update command settings when command actually changes
    if (lastCommand.current !== currentCommand) {
      lastCommand.current = currentCommand
      commandStartTime.current = 0

      const settings = commandSettings[currentCommand as keyof typeof commandSettings] || commandSettings.idle
      isTrackingMode.current = settings.tracking
      shakeIntensity.current = settings.shake

      if (settings.position) {
        targetPosition.current.set(...(settings.position as [number, number, number]))
      }
    }

    // Get current Pablo position from ref (no state updates)
    const pabloPos = pabloPositionRef.current

    // Camera shake effect
    if (shakeIntensity.current > 0) {
      const shakeX = (Math.random() - 0.5) * shakeIntensity.current
      const shakeY = (Math.random() - 0.5) * shakeIntensity.current
      const shakeZ = (Math.random() - 0.5) * shakeIntensity.current

      // Apply shake to camera position
      const basePosition = targetPosition.current.clone()
      camera.position.x = basePosition.x + shakeX
      camera.position.y = basePosition.y + shakeY
      camera.position.z = basePosition.z + shakeZ

      // Gradually reduce shake intensity
      shakeIntensity.current = Math.max(0, shakeIntensity.current - delta * 0.5)
    }

    // Command-specific camera behaviors
    if (isTrackingMode.current) {
      switch (currentCommand) {
        case "sit": // Rocket tracking - follow Pablo up dramatically
          const rocketHeight = Math.min(commandStartTime.current * 5, 12)
          const followHeight = Math.min(rocketHeight + 2, 15)

          // Camera follows Pablo up with dramatic angle
          targetPosition.current.set(pabloPos.x - 4, followHeight * 0.8, pabloPos.z + 6)

          // Look at Pablo's position
          const lookAtTarget = new THREE.Vector3(pabloPos.x, rocketHeight, pabloPos.z)
          camera.lookAt(lookAtTarget)

          // Intense shake during rocket mode
          shakeIntensity.current = 0.2 + Math.sin(animationTime.current * 15) * 0.1
          break

        case "jump": // Jump tracking - anticipate and follow
          const jumpHeight = Math.abs(Math.sin(commandStartTime.current * 4)) * 3.0

          // Camera moves to capture the jump better
          targetPosition.current.set(pabloPos.x + 3, pabloPos.y + jumpHeight + 2, pabloPos.z + 4)

          // Dynamic camera shake based on jump intensity
          shakeIntensity.current = jumpHeight * 0.05
          break

        case "spin": // Spinning camera - rotate around Pablo
          const spinAngle = commandStartTime.current * 2
          const radius = 5

          targetPosition.current.set(
            pabloPos.x + Math.cos(spinAngle) * radius,
            pabloPos.y + 2,
            pabloPos.z + Math.sin(spinAngle) * radius,
          )

          // Look at Pablo while spinning
          camera.lookAt(pabloPos)
          break

        case "run": // Running - side tracking shot
          const runOffset = Math.sin(commandStartTime.current * 3) * 2

          // Camera follows from the side like a tracking shot
          targetPosition.current.set(pabloPos.x + runOffset + 3, pabloPos.y + 1.5, pabloPos.z + 2)

          // Look slightly ahead of Pablo
          const lookAhead = new THREE.Vector3(pabloPos.x + runOffset, pabloPos.y, pabloPos.z)
          camera.lookAt(lookAhead)
          break

        case "play": // Playful - bouncing camera movement
          const playBounce = Math.abs(Math.sin(commandStartTime.current * 7)) * 1.5

          targetPosition.current.set(
            pabloPos.x + Math.sin(animationTime.current * 2) * 2 + 2,
            pabloPos.y + playBounce + 2,
            pabloPos.z + Math.cos(animationTime.current * 1.5) * 2 + 4,
          )

          // Gentle shake for playful energy
          shakeIntensity.current = 0.05 + Math.sin(animationTime.current * 8) * 0.03
          break

        case "speak": // Speaking - close-up shot
          targetPosition.current.set(pabloPos.x + 1.5, pabloPos.y + 1, pabloPos.z + 2.5)

          // Focus on Pablo's head
          const headTarget = new THREE.Vector3(pabloPos.x, pabloPos.y + 1.2, pabloPos.z)
          camera.lookAt(headTarget)
          break
      }

      // Smooth camera position interpolation when not shaking intensely
      if (shakeIntensity.current < 0.1) {
        camera.position.lerp(targetPosition.current, delta * 2)
      }
    } else {
      // Return to idle position smoothly
      camera.position.lerp(originalPosition.current, delta * 1)

      // Reset camera look-at for normal orbit controls
      if (currentCommand === "idle") {
        const idleLookAt = new THREE.Vector3(0, 0, 0)
        camera.lookAt(idleLookAt)
      }
    }

    // Ensure camera doesn't go below ground
    camera.position.y = Math.max(camera.position.y, 0.5)

    // Add subtle breathing effect during idle
    if (currentCommand === "idle" && shakeIntensity.current <= 0) {
      const breathe = Math.sin(animationTime.current * 0.8) * 0.1
      camera.position.y = originalPosition.current.y + breathe
    }

    // FOV effects for dramatic moments
    if (currentCommand === "sit") {
      // Zoom out during rocket mode for epic scale
      const targetFOV = 60 + Math.sin(animationTime.current * 4) * 5
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, delta * 3)
    } else if (currentCommand === "jump") {
      // Slight zoom in during jumps for impact
      camera.fov = THREE.MathUtils.lerp(camera.fov, 40, delta * 4)
    } else {
      // Return to normal FOV
      camera.fov = THREE.MathUtils.lerp(camera.fov, 45, delta * 2)
    }

    camera.updateProjectionMatrix()
  })

  return null
}
