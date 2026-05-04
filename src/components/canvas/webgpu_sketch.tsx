import { useFrame, useThree, RootState } from '@react-three/fiber'
import { MeshBasicNodeMaterial, Node } from 'three/webgpu'
import { sin, time, uv, vec3 } from 'three/tsl'
import { ReactNode } from 'react'

/**
 * Template implementation for a WebGPU sketch mesh.
 * @param {Object} props
 * @param {NodeRepresentation} [props.colorNode] - Node for color, defaults to vec3(uv, sin(time)).
 * @param {(material: MeshBasicNodeMaterial, state: RootState) => void} [props.onFrame] - Optional frame callback.
 * @returns {JSX.Element}
 */
const TemplateImpl = ({ colorNode, onFrame }) => {
  const s = new MeshBasicNodeMaterial({ transparent: true })
  const _uv = uv()

  const _colorNode = colorNode ? colorNode : vec3(_uv, sin(time))
  s.colorNode = _colorNode

  const inspectorNodes: any[] = []
  const collectInspectorNodes = (node: any, seen = new Set()) => {
    if (!node || seen.has(node)) return
    seen.add(node)
    if (node.isInspectorNode) inspectorNodes.push(node)
    if (node._beforeNodes) for (const n of node._beforeNodes) collectInspectorNodes(n, seen)
    if (node.node) collectInspectorNodes(node.node, seen)
  }
  collectInspectorNodes(_colorNode)

  const { width, height } = useThree((state) => state.viewport)
  const gl = useThree((state) => state.gl) as any

  if (gl && inspectorNodes.length > 0 && !gl.__inspectorNodesPatched) {
    gl.__inspectorNodesPatched = true
    const insp = gl.inspector
    const origBegin = insp.begin.bind(insp)
    insp.begin = function () {
      const r = origBegin()
      if (insp.currentNodes !== null) {
        for (const n of inspectorNodes) insp.inspect(n)
      }
      return r
    }
  }

  useFrame((state) => {
    if (onFrame) {
      onFrame(s, state)
    }
  })

  return (
    <mesh material={s} scale={[width, height, 1]}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}

/**
 * Props for the WebGPUSketch component.
 * @typedef {Object} WebGPUSketchProps
 * @property {NodeRepresentation} [colorNode] - Node for color.
 * @property {(material: MeshBasicNodeMaterial, state: RootState) => void} [onFrame] - Frame callback.
 * @property {ReactNode} [children] - Optional children.
 */
export type WebGPUSketchProps = {
  colorNode?: Node
  onFrame?: (material: MeshBasicNodeMaterial, state: RootState) => void
  children?: ReactNode
}

/**
 * WebGPU sketch component. Renders children or a default template mesh.
 * @param {WebGPUSketchProps} props
 * @returns {JSX.Element}
 */
export const WebGPUSketch = ({ colorNode = undefined, onFrame = undefined, children }: WebGPUSketchProps) => {
  return <>{children ? children : <TemplateImpl colorNode={colorNode} onFrame={onFrame} />}</>
}
