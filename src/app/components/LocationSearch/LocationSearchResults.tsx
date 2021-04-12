/* eslint-disable react/no-array-index-key */
import { Alert, Heading, Paragraph, themeColor, themeSpacing, Button } from '@amsterdam/asc-ui'
import { Enlarge } from '@amsterdam/asc-assets'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { ViewMode } from '../../../shared/ducks/ui/ui'
import LocationSearchList, { CategoryResult } from './LocationSearchList'
import { getUserScopes } from '../../../shared/ducks/user/user'
import { getNumberOfResults } from '../../../shared/ducks/data-search/selectors'
import { toDetailFromEndpoint } from '../../../store/redux-first-router/actions'
import Spacer from '../Spacer/Spacer'

const StyledAlert = styled(Alert)`
  margin-bottom: ${themeSpacing(5)};
`

const StyledHeading = styled(Heading)`
  color: ${themeColor('secondary')};
  margin: ${themeSpacing(2, 0)};
`

const NestedResult = styled.div`
  margin: ${themeSpacing(2, 0, 5, 0)};
  padding: ${themeSpacing(0, 4)};
  border-left: 2px solid ${themeColor('tint', 'level3')};

  ${Spacer} {
    display: none;
  }
`

export interface LocationSearchResultsProps {
  searchResults: Array<CategoryResult>
}

const LocationSearchResults: FunctionComponent<LocationSearchResultsProps> = ({
  searchResults,
}) => {
  const dispatch = useDispatch()
  const userScopes = useSelector(getUserScopes)
  const numberOfResults = useSelector(getNumberOfResults)

  if (numberOfResults === 0) {
    return (
      <>
        <Paragraph>Geen resultaten van deze soort</Paragraph>
        <Paragraph>Tip: maak de zoekcriteria minder specifiek</Paragraph>
      </>
    )
  }
  return (
    <>
      {searchResults?.map(
        (result) =>
          (result.count >= 1 || result.warning) &&
          (!result.authScope || userScopes.includes(result.authScope)) && (
            <div key={result.singular}>
              <StyledHeading as="h2">
                {result.count > 1 && <span>{`${result.plural} (${result.count})`}</span>}
                {result.count === 1 && <span>{result.singular}</span>}
                {result.count === 0 && <span>{result.plural}</span>}
              </StyledHeading>
              {!!result.warning && (
                <StyledAlert level="info" dismissible>
                  {result.warning}
                </StyledAlert>
              )}
              <LocationSearchList categoryResults={result} limit={10} />
              {result.count > 10 && (
                <div>
                  {result.more && (
                    <Button
                      variant="textButton"
                      iconSize={12}
                      iconLeft={<Enlarge />}
                      type="button"
                      onClick={() =>
                        dispatch(toDetailFromEndpoint(result.more?.endpoint, ViewMode.Split))
                      }
                    >
                      {result.more.label}
                    </Button>
                  )}
                </div>
              )}

              {!!result.subResults && (
                <NestedResult>
                  <LocationSearchResults searchResults={result.subResults} />
                </NestedResult>
              )}
              <Spacer />
            </div>
          ),
      )}
    </>
  )
}

export default LocationSearchResults
