import {
  CompactThemeProvider,
  Heading,
  Paragraph,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { Fragment } from 'react'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import { Tile, TileLabel } from '../../components/Tile'
import TileGrid from '../../components/TileGrid/TileGrid'
import type { SizeOnBreakpoint } from '../../components/TileGrid/TileGridStyle'
import { TileGridItem } from '../../components/TileGrid/TileGridStyle'
import type { NormalizedFieldItems } from '../../../normalizations/cms/types'

const StyledHeading = styled(Heading)`
  color: ${themeColor('tint', 'level1')};
  margin-bottom: ${themeSpacing(4)};
`

export interface CollectionTileGridProps {
  results?: NormalizedFieldItems[]
  loading: boolean
  title?: string
  description?: string
}

interface Template {
  3: [SizeOnBreakpoint, SizeOnBreakpoint, SizeOnBreakpoint]
  4: [SizeOnBreakpoint, SizeOnBreakpoint, SizeOnBreakpoint, SizeOnBreakpoint]
  5: [SizeOnBreakpoint, SizeOnBreakpoint, SizeOnBreakpoint, SizeOnBreakpoint, SizeOnBreakpoint]
  6: [
    SizeOnBreakpoint,
    SizeOnBreakpoint,
    SizeOnBreakpoint,
    SizeOnBreakpoint,
    SizeOnBreakpoint,
    SizeOnBreakpoint,
  ]
  [key: number]: SizeOnBreakpoint[]
}

const GRID_ITEM_TEMPLATE: Template = {
  3: [
    { mobileL: [2, 2], tabletM: [2, 2], laptop: [2, 2] },
    { mobileL: [2, 2], tabletM: [1, 2], laptop: [1, 1] },
    { mobileL: [2, 2], tabletM: [1, 2], laptop: [1, 1] },
  ],
  4: [
    { mobileL: [1, 2], tabletM: [1, 2], laptop: [1, 2] },
    { mobileL: [1, 2], tabletM: [1, 2], laptop: [1, 1] },
    { mobileL: [1, 2], tabletM: [1, 2], laptop: [1, 1] },
    { mobileL: [1, 2], tabletM: [1, 2], laptop: [1, 2] },
  ],
  5: [
    { mobileL: [2, 2], tabletS: [1, 2], laptop: [1, 2] },
    { mobileL: [2, 2], tabletS: [1, 2], laptop: [1, 1] },
    { mobileL: [2, 2], tabletS: [1, 2], laptop: [1, 1] },
    { mobileL: [2, 2], tabletS: [1, 2], laptop: [1, 1] },
    { mobileL: [2, 2], tabletS: [1, 2], laptop: [1, 1] },
  ],
  6: [
    { mobileL: [1, 2], tabletM: [1, 2], laptop: [1, 1] },
    { mobileL: [1, 2], tabletM: [1, 2], laptop: [1, 1] },
    { mobileL: [2, 2], tabletM: [1, 2], laptop: [1, 1] },
    { mobileL: [2, 2], tabletM: [1, 2], laptop: [1, 1] },
    { mobileL: [2, 2], tabletM: [1, 2], laptop: [1, 1] },
    { mobileL: [2, 2], tabletM: [1, 2], laptop: [1, 1] },
  ],
}

const GRID_TEMPLATE: SizeOnBreakpoint = { mobileL: [1, 1], tabletM: [1, 4], laptop: [1, 5] }

const CollectionTileGrid: FunctionComponent<CollectionTileGridProps> = ({
  results,
  loading,
  title,
  description,
}) => (
  <TileGrid grid={GRID_TEMPLATE}>
    <TileGridItem span={{ mobileL: [2, 2] }}>
      <Tile as="div" isLoading={loading}>
        <Heading forwardedAs="strong" styleAs="h1">
          Dossier
        </Heading>
        <StyledHeading forwardedAs="h1">{title}</StyledHeading>
        {description && <Paragraph strong dangerouslySetInnerHTML={{ __html: description }} />}
      </Tile>
    </TileGridItem>
    {results &&
      results.map(({ id, linkProps, teaserImage, shortTitle, title: tileTitle }, i) => {
        // Only with 3 items, the first tile (the biggest) shouldn't have the compact style
        const Provider = results.length === 3 && i === 0 ? Fragment : CompactThemeProvider
        const span = GRID_ITEM_TEMPLATE[results.length][i]

        return (
          <TileGridItem key={id} span={span}>
            {/*
                    // @ts-ignore */}
            <Tile
              {...{
                ...linkProps,
                isLoading: loading,
                span,
                backgroundImage: teaserImage,
              }}
            >
              <TileLabel>
                <Provider>
                  <Paragraph strong gutterBottom={0}>
                    {shortTitle || tileTitle}
                  </Paragraph>
                </Provider>
              </TileLabel>
            </Tile>
          </TileGridItem>
        )
      })}
  </TileGrid>
)

export default CollectionTileGrid
