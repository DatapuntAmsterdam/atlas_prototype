declare module '*.svg' {
  import { FunctionComponent, SVGProps } from 'react'

  export const Component: FunctionComponent<SVGProps<SVGSVGElement>>

  export default Component
}
