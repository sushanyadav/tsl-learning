import { useControls, folder } from 'leva'
import { uniform, vec3, Fn, uv } from 'three/tsl'
import { cosinePalette } from '@/tsl/utils/color/cosine_palette'
import { sdSphere } from '@/tsl/utils/sdf/shapes'
import { WebGPUSketch } from '@/components/canvas/webgpu_sketch'

const t = uniform(0.0)

const c = Fn(() => {
  const a = vec3(0.5, 0.5, 0.5)
  const b = vec3(0.5, 0.5, 0.5)
  const c = vec3(1.0, 1.0, 1.0)
  const d = vec3(0.0, 0.33, 0.67)

  const shape = sdSphere(uv().sub(0.5)).toVar()

  const finalColor = cosinePalette(t, a, b, c, d)
  return shape.mul(finalColor)
})

const Sketch = () => {
  useControls({
    color: folder({
      t: {
        value: 0.0,
        min: 0,
        max: 1,
        onChange: (val: number) => {
          t.value = val
        },
      },
    }),
  })

  return <WebGPUSketch colorNode={c()} />
}

export default Sketch
