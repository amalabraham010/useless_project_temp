"use client"

export default function Bone() {
  return (
    <group position={[0.4, -0.3, 0.3]} rotation={[0, 0, Math.PI / 4]}>
      {/* Main bone shaft */}
      <mesh castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#FFFACD" />
      </mesh>

      {/* Bone ends */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#FFFACD" />
      </mesh>
      <mesh position={[0, -0.2, 0]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#FFFACD" />
      </mesh>

      {/* Bone knobs */}
      <mesh position={[0.04, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#FFFACD" />
      </mesh>
      <mesh position={[-0.04, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#FFFACD" />
      </mesh>
      <mesh position={[0.04, -0.2, 0]} castShadow>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#FFFACD" />
      </mesh>
      <mesh position={[-0.04, -0.2, 0]} castShadow>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#FFFACD" />
      </mesh>
    </group>
  )
}
