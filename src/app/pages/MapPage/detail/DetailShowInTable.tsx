import styled from 'styled-components'
import { Heading, Link, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { DetailResultItemShowInTable } from '../../../../map/types/details'
import config, { DataSelectionType } from '../config'
import PARAMETERS from '../../../../store/parameters'

const StyledHeading = styled(Heading)`
  color: ${themeColor('secondary')};
  margin: 0;
`

const StyledLink = styled(Link)`
  margin-bottom: ${themeSpacing(2)};
`

const DetailShowInTable: React.FC<{ item: DetailResultItemShowInTable }> = ({ item }) => (
  <>
    <StyledHeading forwardedAs="h4">{config[DataSelectionType.BAG].title}</StyledHeading>
    {/*
    // @ts-ignore */}
    <StyledLink
      inList
      to={{
        pathname: config[DataSelectionType.BAG].path,
        search: `${PARAMETERS.VIEW}=volledig&${PARAMETERS.FILTERS}={"${item.filters.key}":"${item.filters.value}"}`,
      }}
      forwardedAs={RouterLink}
    >
      In tabel weergeven
    </StyledLink>
    <StyledHeading forwardedAs="h4">{config[DataSelectionType.HR].title}</StyledHeading>
    {/*
    // @ts-ignore */}
    <StyledLink
      inList
      to={{
        pathname: config[DataSelectionType.HR].path,
        search: `${PARAMETERS.VIEW}=volledig&${PARAMETERS.FILTERS}={"${item.filters.key}":"${item.filters.value}"}`,
      }}
      forwardedAs={RouterLink}
    >
      In tabel weergeven
    </StyledLink>
    <StyledHeading forwardedAs="h4">{config[DataSelectionType.BRK].title}</StyledHeading>
    {/*
    // @ts-ignore */}
    <Link
      inList
      to={{
        pathname: config[DataSelectionType.BRK].path,
        search: `${PARAMETERS.VIEW}=volledig&${PARAMETERS.FILTERS}={"${item.filters.key}":"${item.filters.value}"}`,
      }}
      as={RouterLink}
    >
      In tabel weergeven
    </Link>
  </>
)

export default DetailShowInTable
