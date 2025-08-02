"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useState, useRef, useCallback } from "react"
import PabloKangaroo from "./components/pablo-kangaroo"
import Doghouse from "./components/doghouse"
import Bone from "./components/bone"
import CoconutTree from "./components/coconut-tree"
import CommandPanel from "./components/command-panel"
import CinematicLighting from "./components/cinematic-lighting"
import CameraController from "./components/camera-controller"
import { Card, CardContent } from "@/components/ui/card"
import * as THREE from "three"

export default function PabloHuskyScene() {
  const [clickCount, setClickCount] = useState(0)
  const [currentCommand, setCurrentCommand] = useState("idle")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const pabloPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const lightRef = useRef<THREE.DirectionalLight>(null)

  const handlePabloClick = () => {
    setClickCount((prev) => prev + 1)
  }

  const handleCommand = (command: string) => {
    setCurrentCommand(command)
    setCommandHistory((prev) => [...prev, command])
  }

  const handleCommandComplete = () => {
    setCurrentCommand("idle")
  }

  // Use callback to avoid recreating function on every render
  const handlePabloPositionUpdate = useCallback((position: THREE.Vector3) => {
    // Only update if position changed significantly (throttle updates)
    const currentPos = pabloPositionRef.current
    const distance = currentPos.distanceTo(position)
    if (distance > 0.1) {
      pabloPositionRef.current.copy(position)
    }
  }, [])

  return (
    <div className="w-full h-screen bg-gradient-to-b from-purple-900 via-blue-800 to-green-300 flex relative overflow-hidden">
      {/* 3D Scene */}
      <div className="flex-1">
        <Canvas
          camera={{ position: [3, 2, 4], fov: 45 }}
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
        >
          {/* CINEMATIC CAMERA CONTROLLER */}
          <CameraController currentCommand={currentCommand} pabloPositionRef={pabloPositionRef} />

          {/* CINEMATIC LIGHTING SETUP */}
          <CinematicLighting currentCommand={currentCommand} />

          {/* Enhanced Ground with better materials */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#228B22" roughness={0.8} metalness={0.1} envMapIntensity={0.5} />
          </mesh>

          {/* Enhanced grass with better materials and more variety */}
          {Array.from({ length: 100 }).map((_, i) => (
            <mesh
              key={i}
              position={[(Math.random() - 0.5) * 18, -0.47, (Math.random() - 0.5) * 18]}
              rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
              receiveShadow
            >
              <planeGeometry args={[0.12 + Math.random() * 0.08, 0.25 + Math.random() * 0.15]} />
              <meshStandardMaterial
                color={new THREE.Color().setHSL(
                  0.25 + Math.random() * 0.1,
                  0.6 + Math.random() * 0.3,
                  0.3 + Math.random() * 0.4,
                )}
                transparent
                opacity={0.8 + Math.random() * 0.2}
                roughness={0.9}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}

          {/* Atmospheric particles for cinematic effect */}
          {Array.from({ length: 40 }).map((_, i) => (
            <mesh
              key={`particle-${i}`}
              position={[(Math.random() - 0.5) * 25, Math.random() * 10 + 1, (Math.random() - 0.5) * 25]}
            >
              <sphereGeometry args={[0.015 + Math.random() * 0.02, 6, 6]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FFFFFF"
                emissiveIntensity={0.2 + Math.random() * 0.3}
                transparent
                opacity={0.4 + Math.random() * 0.4}
                roughness={0.1}
              />
            </mesh>
          ))}

          {/* Floating light orbs for magical atmosphere */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={`orb-${i}`}
              position={[Math.sin(i * 0.8) * 6, 2 + Math.sin(i * 1.2) * 1.5, Math.cos(i * 0.8) * 6]}
            >
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color={new THREE.Color().setHSL(i * 0.15, 0.8, 0.6)}
                emissive={new THREE.Color().setHSL(i * 0.15, 0.8, 0.4)}
                emissiveIntensity={0.5}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}

          {/* Scene objects with enhanced positioning */}
          <PabloKangaroo
            onClick={handlePabloClick}
            currentCommand={currentCommand}
            onCommandComplete={handleCommandComplete}
            onPositionUpdate={handlePabloPositionUpdate}
          />
          <Doghouse />
          <Bone />

          {/* COCONUT TREES with enhanced positioning for cinematic composition */}
          <CoconutTree position={[-3.5, -0.5, -3]} />
          <CoconutTree position={[4, -0.5, -2.5]} />
          <CoconutTree position={[-4.5, -0.5, -0.5]} />
          <CoconutTree position={[4.5, -0.5, -0.5]} />
          <CoconutTree position={[-3, -0.5, 2]} />
          <CoconutTree position={[3, -0.5, 2]} />
          <CoconutTree position={[0, -0.5, -5]} />
          <CoconutTree position={[-1.5, -0.5, 3.5]} />

          {/* Enhanced Environment with dramatic sky */}
          <Environment preset="sunset" background={false} environmentIntensity={0.6} />

          {/* Cinematic fog for atmospheric depth */}
          <fog attach="fog" args={["#4169E1", 12, 30]} />

          {/* Enhanced Camera controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={2.5}
            maxDistance={15}
            autoRotate={currentCommand === "idle"}
            autoRotateSpeed={0.3}
            dampingFactor={0.03}
            enableDamping
            rotateSpeed={0.5}
            zoomSpeed={0.8}
          />
        </Canvas>

        {/* Enhanced Scene Info Overlay with camera shake effect */}
        <div
          className={`absolute top-4 left-4 z-10 transition-transform duration-100 ${
            currentCommand === "sit" ? "animate-pulse" : currentCommand === "jump" ? "animate-bounce" : ""
          }`}
        >
          <Card className="bg-black/80 backdrop-blur-lg border-2 border-gold-400/40 shadow-2xl">
            <CardContent className="p-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-300 via-yellow-400 to-gold-300 bg-clip-text text-transparent mb-2 drop-shadow-2xl">
                🦘 SUPER PABLO THE KANGAROO 🦸‍♂️
              </h1>
              <p className="text-sm text-cyan-200 mb-1 drop-shadow-lg font-medium">
                Status: {currentCommand === "idle" ? "⚡ READY FOR ACTION" : `🎬 ${currentCommand.toUpperCase()} MODE`}
              </p>
              <p className="text-sm text-emerald-300 drop-shadow-lg">Interactions: {clickCount}</p>
              <p className="text-xs text-red-400 mt-2 drop-shadow-lg font-bold animate-pulse">
                🎥 CINEMATIC CAMERA ACTIVE
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cinematic letterbox bars with camera shake effect */}
        <div
          className={`absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black via-black/90 to-transparent z-10 transition-transform duration-100 ${
            currentCommand === "sit" ? "transform translate-y-1" : ""
          }`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black via-black/90 to-transparent z-10 transition-transform duration-100 ${
            currentCommand === "sit" ? "transform -translate-y-1" : ""
          }`}
        ></div>

        {/* Dynamic camera mode indicator */}
        <div className="absolute top-4 right-4 z-10">
          <Card className="bg-black/70 backdrop-blur-md border border-red-500/30">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full animate-pulse ${
                    currentCommand === "sit"
                      ? "bg-green-400"
                      : currentCommand === "jump"
                        ? "bg-yellow-400"
                        : currentCommand === "spin"
                          ? "bg-cyan-400"
                          : currentCommand === "run"
                            ? "bg-lime-400"
                            : "bg-orange-400"
                  }`}
                ></div>
                <span className="text-xs text-white font-mono">
                  {currentCommand === "idle" ? "FREE CAM" : "TRACKING"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Screen flash effects for dramatic moments */}
        {(currentCommand === "sit" || currentCommand === "jump") && (
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse z-5 pointer-events-none"></div>
        )}

        {/* Vignette effect overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 pointer-events-none z-5"></div>
      </div>

      {/* Enhanced Command Panel with camera-responsive styling */}
      <div
        className={`w-80 p-4 bg-gradient-to-b from-black/90 via-gray-900/95 to-black/90 backdrop-blur-xl border-l-2 border-gold-500/30 overflow-y-auto transition-transform duration-200 ${
          currentCommand === "sit" ? "transform translate-x-1" : ""
        }`}
      >
        <div className="mb-4 p-3 bg-gradient-to-r from-red-900/30 to-purple-900/30 rounded-lg border border-red-500/20">
          <h2 className="text-lg font-bold text-gold-300 mb-1">🎬 DIRECTOR'S PANEL</h2>
          <p className="text-xs text-gray-300">Control the cinematic action</p>
        </div>
        <CommandPanel onCommand={handleCommand} currentCommand={currentCommand} commandHistory={commandHistory} />
      </div>
    </div>
  )
}
