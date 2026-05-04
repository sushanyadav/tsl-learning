import { vec3, uv, time, sin } from 'three/tsl'

const test = () => {
  const _uv = uv()
  return vec3(_uv, sin(time.mul(0.1))).toInspector('color')
}

export default test
