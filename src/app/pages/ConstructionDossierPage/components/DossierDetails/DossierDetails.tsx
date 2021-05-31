import { Heading, Link, List, ListItem, themeSpacing } from '@amsterdam/asc-ui'
import { useMemo, useState } from 'react'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import type { Single as Bouwdossier } from '../../../../../api/iiif-metadata/bouwdossier'
import { toDataDetail } from '../../../../../store/redux-first-router/actions'
import formatAddresses from '../../utils/formatAddresses'
import { useAuthToken } from '../../AuthTokenContext'
import ContentBlock, { SubHeading, DefinitionList, DefinitionListItem } from '../ContentBlock'
import DocumentDetails from '../DocumentDetails'
import LoginLinkRequestModal from '../LoginLinkRequestModal'
import LoginExpiredModal from '../LoginExpiredModal'

const Header = styled.header`
  padding: ${themeSpacing(5)};
`

const PageWrapper = styled.article`
  padding-bottom: ${themeSpacing(18)};
`

export interface DossierDetailsProps {
  dossierId: string
  dossier: Bouwdossier
}

const DossierDetails: FunctionComponent<DossierDetailsProps> = ({
  dossierId,
  dossier,
  ...otherProps
}) => {
  const [showLoginLinkRequestModal, setShowLoginLinkRequestModal] = useState(false)
  const [hideLoginExpiredModal, setHideLoginExpiredModal] = useState(false)
  const { isTokenExpired } = useAuthToken()

  const addresses = useMemo(() => formatAddresses(dossier.adressen), [dossier.adressen])
  const sortedDocuments = useMemo(
    () =>
      dossier.documenten.sort((a, b) =>
        (a.subdossier_titel ?? '').localeCompare(b.subdossier_titel ?? ''),
      ),
    [dossier.documenten],
  )

  return (
    <>
      {isTokenExpired && !hideLoginExpiredModal && (
        <LoginExpiredModal
          data-testid="loginExpiredModal"
          onClose={() => setHideLoginExpiredModal(true)}
        />
      )}
      {showLoginLinkRequestModal && (
        <LoginLinkRequestModal
          data-testid="loginLinkRequestModal"
          onClose={() => setShowLoginLinkRequestModal(false)}
        />
      )}
      <PageWrapper {...otherProps}>
        <Header>
          <Heading>{dossier.titel}</Heading>
          <SubHeading forwardedAs="h2">Bouw- en omgevingsdossiers</SubHeading>
        </Header>

        <DefinitionList data-testid="definitionList">
          <DefinitionListItem term="Titel">{dossier.titel}</DefinitionListItem>
          <DefinitionListItem term="Datering">{dossier.datering}</DefinitionListItem>
          <DefinitionListItem term="Type">{dossier.dossier_type}</DefinitionListItem>
          <DefinitionListItem term="Dossiernummer">{dossier.dossiernr}</DefinitionListItem>
          <DefinitionListItem term="Openbaarheid">{dossier.access}</DefinitionListItem>
          {dossier.olo_liaan_nummer && (
            <DefinitionListItem term="OLO of liaan nummer" data-testid="oloLiaanNumber">
              {dossier.olo_liaan_nummer}
            </DefinitionListItem>
          )}
        </DefinitionList>

        {sortedDocuments.map((document, index) => (
          <DocumentDetails
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            dossierId={dossierId}
            dossier={dossier}
            document={document}
            onRequestLoginLink={() => setShowLoginLinkRequestModal(true)}
          />
        ))}

        {addresses.length && (
          <ContentBlock data-testid="constructionDossierAddresses">
            <SubHeading forwardedAs="h3">Adressen</SubHeading>
            <List>
              {addresses.map((address) => (
                <ListItem key={address.id}>
                  <Link as={RouterLink} inList to={toDataDetail([address.id, 'bag', address.type])}>
                    <span>{address.label}</span>
                  </Link>
                </ListItem>
              ))}
            </List>
          </ContentBlock>
        )}
      </PageWrapper>
    </>
  )
}

export default DossierDetails
