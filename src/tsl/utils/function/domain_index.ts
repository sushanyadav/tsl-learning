import { Fn, floor } from 'three/tsl'
import type { Node } from 'three/webgpu'

/***
 * Returns a domain index based on a number of repetitions.
 * @param _d - The domain to index.
 * @param _repetitions - The number of repetitions to index.
 * @returns The domain index.
 */
export const domainIndex = Fn<[Node, Node]>(([_d, _repetitions]) => {
  return floor(_d.mul(_repetitions))
})
