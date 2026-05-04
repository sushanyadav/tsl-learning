import { Fn, floor, float, screenSize } from 'three/tsl'
import type { Node } from 'three/webgpu'

/**
 * Creates a pixellation pattern given the current UV coordinates and screenSize.
 * @param {vec2} _uv - The UV coordinates.
 * @param {number} [size=20.0] - The size of the pixellation.
 * @returns {float} The pixellation pattern value.
 */
export const pixellationPattern = Fn<[Node, Node?]>(([_uv, size = 20.0]) => {
  const _size = float(size as any)

  // The input UVs should be aspect corrected
  const pixelSize = _size.div(screenSize.x)
  return floor(_uv.div(pixelSize)).mul(pixelSize)
})
