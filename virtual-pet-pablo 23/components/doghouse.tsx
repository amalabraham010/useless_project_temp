"use client"

export default function Doghouse() {
  return (
    <group position={[0, 0, -1.5]}>
      {/* Main house structure */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.8, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 0.9, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.8, 0.4, 4]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Door opening */}
      <mesh position={[0, 0.3, 0.51]}>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
        <meshStandardMaterial color="#2F2F2F" />
      </mesh>

      {/* Wood planks texture simulation */}
      <mesh position={[0, 0.6, 0.51]}>
        <boxGeometry args={[1.1, 0.05, 0.01]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0, 0.4, 0.51]}>
        <boxGeometry args={[1.1, 0.05, 0.01]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0, 0.2, 0.51]}>
        <boxGeometry args={[1.1, 0.05, 0.01]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Name plate */}
      <mesh position={[0, 0.7, 0.52]}>
        <boxGeometry args={[0.4, 0.1, 0.02]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </group>
  )
}
