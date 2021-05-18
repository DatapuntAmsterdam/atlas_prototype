import { ChevronDown, ChevronUp } from '@amsterdam/asc-assets'
import { Button, Icon, svgFill, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { Children, useState } from 'react'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'

const ShowMoreButton = styled(Button)`
  height: auto;
  padding: 0;
  margin-bottom: ${themeSpacing(2)};
  color: ${themeColor('primary', 'main')};
`

const ShowMoreIcon = styled(Icon)`
  margin-left: ${themeSpacing(1)};
  ${svgFill(themeColor('primary', 'main'))}
`

export interface ShowMoreProps {
  limit: number
}

const ShowMore: FunctionComponent<ShowMoreProps> = ({ children, limit }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpanded = () => setIsExpanded((value) => !value)
  const transformedChildren = Children.toArray(children)

  if (limit > transformedChildren.length) {
    return <>{children}</>
  }

  const visibleChildren = transformedChildren.slice(0, limit)
  const hiddenChildren = transformedChildren.slice(limit)

  return (
    <>
      {visibleChildren}
      {isExpanded && hiddenChildren}
      <ShowMoreButton data-testid="showMoreButton" variant="blank" onClick={toggleExpanded}>
        {isExpanded ? 'Toon minder' : 'Toon meer'}
        <ShowMoreIcon inline size={14}>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </ShowMoreIcon>
      </ShowMoreButton>
    </>
  )
}

export default ShowMore
