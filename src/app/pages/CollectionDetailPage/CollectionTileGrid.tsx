import {
  CompactThemeProvider,
  Heading,
  Paragraph,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui'
import React from 'react'
import styled from 'styled-components'
import { Tile, TileLabel } from '../../components/Tile'
import TileGrid from '../../components/TileGrid/TileGrid'
import { SizeOnBreakpoint, TileGridItem } from '../../components/TileGrid/TileGridStyle'
import { CMSResultItem } from '../../utils/useFromCMS'

const FullColumnTileGridItem = styled(TileGridItem)`
  flex-basis: 100% !important; // IE11
`

const StyledHeading = styled(Heading)`
  color: ${themeColor('tint', 'level1')};
  margin-bottom: ${themeSpacing(4)};
`

type Props = {
  results: CMSResultItem[]
  loading: boolean
  title?: string
  description?: string
}

type Template = {
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

const CollectionTileGrid: React.FC<Props> = ({ results, loading, title, description }) => (
  <TileGrid grid={GRID_TEMPLATE}>
    <FullColumnTileGridItem span={{ mobileL: [2, 2] }}>
      <Tile as="div" isLoading={loading}>
        <Heading forwardedAs="strong" styleAs="h1">
          Dossier
        </Heading>
        {/*
        // @ts-ignore */}
        <StyledHeading forwardedAs="h3" styleAs="h1">
          {title}
        </StyledHeading>
        {description && <Paragraph strong dangerouslySetInnerHTML={{ __html: description }} />}
      </Tile>
    </FullColumnTileGridItem>
    {results.map(({ id, linkProps, teaserImage, shortTitle, title: tileTitle }, i) => {
      // Only with 3 items, the first tile (the biggest) shouldn't have the compact style
      const Provider = results.length === 3 && i === 0 ? React.Fragment : CompactThemeProvider
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
