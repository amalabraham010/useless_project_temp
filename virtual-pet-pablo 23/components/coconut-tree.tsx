"use client"

export default function CoconutTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tree trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 2, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Trunk texture rings */}
      <mesh position={[0, 1.5, 0]}>
        <torusGeometry args={[0.18, 0.02, 8, 16]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <torusGeometry args={[0.17, 0.02, 8, 16]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <torusGeometry args={[0.19, 0.02, 8, 16]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Palm fronds */}
      <mesh position={[-0.8, 2.2, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.05, 1.2, 4, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0.8, 2.2, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.05, 1.2, 4, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, 2.2, -0.8]} rotation={[0.3, 0, 0]} castShadow>
        <capsuleGeometry args={[0.05, 1.2, 4, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, 2.2, 0.8]} rotation={[-0.3, 0, 0]} castShadow>
        <capsuleGeometry args={[0.05, 1.2, 4, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[-0.6, 2.2, -0.6]} rotation={[0.2, 0, -0.2]} castShadow>
        <capsuleGeometry args={[0.05, 1.1, 4, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0.6, 2.2, 0.6]} rotation={[-0.2, 0, 0.2]} castShadow>
        <capsuleGeometry args={[0.05, 1.1, 4, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* Coconuts */}
      <mesh position={[-0.3, 2.0, 0.2]} castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.2, 1.9, -0.3]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.1, 2.1, 0.3]} castShadow>
        <sphereGeometry args={[0.11, 8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Coconut fiber texture */}
      <mesh position={[-0.3, 2.0, 0.2]}>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial color="#DEB887" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.2, 1.9, -0.3]}>
        <sphereGeometry args={[0.11, 8, 8]} />
        <meshStandardMaterial color="#DEB887" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.1, 2.1, 0.3]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#DEB887" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}
