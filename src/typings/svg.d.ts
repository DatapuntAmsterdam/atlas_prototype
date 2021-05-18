declare module '*.svg' {
  import type { FunctionComponent, SVGProps } from 'react'

  export const Component: FunctionComponent<SVGProps<SVGSVGElement>>

  export default Component
}
