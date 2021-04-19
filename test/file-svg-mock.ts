import { createElement, FunctionComponent, SVGProps } from 'react'

const SvgMock: FunctionComponent<SVGProps<SVGSVGElement>> = (props) => createElement('svg', props)

export default SvgMock
