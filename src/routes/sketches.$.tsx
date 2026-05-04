import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useEffect, useRef, useState } from 'react'
import WebGPUScene from '@/components/canvas/webgpu_scene'
import { WebGPUSketch } from '@/components/canvas/webgpu_sketch'
import { SketchesDropdown } from '@/components/sketches_dropdown'

export const Route = createFileRoute('/sketches/$')({
  component: RouteComponent,
})

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload()
  })
}

function RouteComponent() {
  const { _splat: sketchPath } = Route.useParams()

  const [module, setModule] = useState<any>({})

  // Updated glob pattern to include subfolders
  const sketches: Record<string, { default: any }> = import.meta.glob('../sketches/**/*.{ts,tsx}', { eager: true })

  useEffect(() => {
    const tsPath = `../sketches/${sketchPath}.ts`
    const tsxPath = `../sketches/${sketchPath}.tsx`
    const mod = sketches[tsxPath] || sketches[tsPath]

    if (mod) {
      setModule({ entry: mod.default, isComponent: !!sketches[tsxPath] })
    } else {
      console.error('Sketch not found:', sketchPath)
    }
  }, [sketchPath])

  const ref = useRef<any>(null)

  const { entry, isComponent } = module
  const SketchComponent = isComponent ? entry : null

  return (
    <section className='fragments-boilerplate__main__canvas' ref={ref}>
      <Suspense fallback={null}>
        {entry ? (
          <WebGPUScene
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
            }}
            eventSource={ref}
            eventPrefix='client'
          >
            {isComponent ? <SketchComponent /> : <WebGPUSketch colorNode={entry()} />}
          </WebGPUScene>
        ) : null}
      </Suspense>

      <SketchesDropdown />
    </section>
  )
}
