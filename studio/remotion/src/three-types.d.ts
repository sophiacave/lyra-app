/**
 * Three.js JSX element declarations for @react-three/fiber v8.
 * Uses module augmentation on 'react' since jsx: react-jsx resolves
 * JSX types from react/jsx-runtime, not the global namespace.
 */
import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      points: any;
      group: any;
      octahedronGeometry: any;
      icosahedronGeometry: any;
      torusGeometry: any;
      boxGeometry: any;
      sphereGeometry: any;
      planeGeometry: any;
      bufferGeometry: any;
      bufferAttribute: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      meshPhongMaterial: any;
      pointsMaterial: any;
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
      spotLight: any;
      fog: any;
      fogExp2: any;
      color: any;
    }
  }
}
