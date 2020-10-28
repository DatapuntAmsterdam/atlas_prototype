/* eslint-disable camelcase */
import { Position } from 'geojson'
import { LocationDescriptor } from 'history'
import { ReactNode } from 'react'
import NotificationLevel from '../../app/models/notification'
import { InfoBoxProps } from '../../app/pages/MapPage/detail/DetailInfoBox'
import AuthScope from '../../shared/services/api/authScope'

// TODO: Revisit the type information here once the map services have been made type safe (also come up with shorter names).
export interface DetailResult {
  title: string
  subTitle?: string | null
  noPanorama?: boolean
  items: DetailResultItem[]
  notifications?: DetailResultNotification[]
  infoBox?: InfoBoxProps
}

export interface DetailResultNotification {
  value: string | ReactNode
  id: string | number
  level: NotificationLevel
  canClose?: boolean
}

export enum DetailResultItemType {
  BulletList = 'bullet-list',
  DefinitionList = 'definition-list',
  Table = 'table',
  LinkList = 'link-list',
  PaginatedData = 'paginated-data',
  GroupedItems = 'grouped-items',
  Image = 'image',
}

export interface DetailAuthentication {
  authScopes?: AuthScope[]
  authScopeRequired?: boolean
  specialAuthLevel?: boolean
  /**
   * A string explaining which info is hidden from the unauthorized user
   */
  authExcludedInfo?: string
}

export type DetailResultItem =
  | DetailResultItemDefinitionList
  | DetailResultItemLinkList
  | DetailResultItemTable
  | DetailResultItemPaginatedData
  | DetailResultItemGroupedItems
  | DetailResultItemBulletList
  | DetailResultItemImage
  | undefined
  | null

export interface ExternalLink {
  title: string
  url: string
}

// Todo: probably remove optionals when redux-first-router is removed
export interface DetailInfo {
  id?: string
  subType?: string
  type?: string
}

export interface InternalLink {
  title?: string | null
  // TODO: when types are fixed in @types/react-router-dom, use Pick<LinkProps> instead
  to: LocationDescriptor
}

export type Link = ExternalLink | InternalLink

export interface PaginatedData<T> {
  data: T
  count: number
  next: string | null
  previous: string | null
}

export interface DefaultDetailResultItem extends DetailAuthentication {
  infoBox?: InfoBoxProps
  // Todo: remove gridArea when legacy map is removed
  gridArea?: string
  title?: string
}

export interface DetailResultItemDefinitionList extends DefaultDetailResultItem {
  type: DetailResultItemType.DefinitionList
  entries?: DetailResultItemDefinitionListEntry[]
}

export interface DetailResultItemGroupedItems extends DefaultDetailResultItem {
  type: DetailResultItemType.GroupedItems
  entries: DetailResultItem[]
}

export interface DetailResultItemPaginatedData extends DefaultDetailResultItem {
  type: DetailResultItemType.PaginatedData
  getData: (url?: string, pageSize?: number) => Promise<PaginatedData<any> | null>
  pageSize: number
  toView: (data?: any[]) => DetailResultItem
}

export interface DetailResultItemLinkList extends DefaultDetailResultItem {
  type: DetailResultItemType.LinkList
  links?: Link[]
}

export interface DetailResultItemBulletList extends DefaultDetailResultItem {
  type: DetailResultItemType.BulletList
  entries?: string[]
}

export interface DetailResultItemImage extends DefaultDetailResultItem {
  type: DetailResultItemType.Image
  src?: string
}

export interface DetailResultItemDefinitionListEntry {
  term: string
  description?: string | null
  href?: LocationDescriptor | null
  to?: string | { pathname: string; search?: string }
  alert?: string
}

export interface DetailResultItemTable extends DefaultDetailResultItem {
  type: DetailResultItemType.Table
  headings: DetailResultItemTableHeading[]
  values?: DetailResultItemTableValue[]
}

export interface DetailResultItemTableHeading extends DefaultDetailResultItem {
  key: string
}

export type DetailResultItemTableValue = { [key: string]: any }

interface ApiDescription {
  omschrijving?: string
}

interface ApiLink {
  href: string | null
}

interface ApiDisplay {
  _display?: string
}

interface ApiAddress {
  volledig_adres?: string
  correctie?: string
  query_string?: string
  openbareruimte_naam?: string
  postbus_nummer?: string
  huisnummer?: string
  huisletter?: string
  toevoeging?: string
  buitenland_adres?: string
  postcode?: string
  woonplaats?: string
  postbus_woonplaats?: string
  postbus_postcode?: string
  buitenland_woonplaats?: string
  buitenland_naam?: string
  buitenland_land?: ApiDescription
  geometrie?: {
    coordinates?: Position
  }
}

export interface PotentialApiResult extends ApiDescription, ApiLink, ApiDisplay {
  _links?: {
    self?: ApiLink
  } | null
  buurt?: string | null
  _buurt?: string | null
  buurtcombinatie?: string | null
  _buurtcombinatie?: string | null
  _stadsdeel?: string | null
  gebiedsgerichtwerken?: ApiLink | null
  _gebiedsgerichtwerken?: string | null
  _bouwblok?: string | null
  tijd?: string | null
  geldigheid?: string | null
  gebruiksdoel_woonfunctie?: string | null
  gebruiksdoel_gezondheidszorgfunctie?: string | null
  aantal_eenheden_complex?: string | null
  gebruik?: string | null
  aantal_kamers?: string | null
  verdieping_toegang?: string | null
  toegang?: string | null
  reden_opvoer?: string | null
  eigendomsverhouding?: string | null
  verblijfsobject?: {
    statusLevel?: string
    status?: string
  } | null
  isNevenadres?: string | null
  naam_24_posities?: string | null
  woonplaats?: {
    _links?: {
      self?: ApiLink
    }
  } & ApiDisplay
  statusLevel?: string | null
  oorspronkelijk_bouwjaar?: string | null
  pandnaam?: string | null
  type_woonobject?: string | null
  ligging?: string | null
  bouwlagen?: string | null
  hoogste_bouwlaag?: string | null
  laagste_bouwlaag?: string | null
  pandidentificatie?: string | null
  indicatie_geconstateerd?: string | null
  aanduiding_in_onderzoek?: string | null
  hoofdadres?: {
    landelijk_id?: string | null
  }
  landelijk_id?: string | null
  biz_type?: string | null
  heffingsgrondslag?: string | null
  heffing_display?: string | null
  bijdrageplichtigen?: string | null
  verordening?: string | null
  onderwerp?: string | null
  beschrijving?: string | null
  bouwstroompuntId?: string | null
  capaciteit?: string | null
  beschikbareAansluitingen?: string[] | null
  organisatie?: string | null
  email?: string | null
  vergunningsplichtig?: string | null
  straat?: string | null
  huisnummer?: string | null
  plaats?: string | null
  date?: string | null
  datum_inslag?: string | null
  bron?: string | null
  intekening?: string | null
  nouwkeurig?: string | null
  onderzoeksgebied?: string | null
  opdrachtnemer?: string | null
  opdrachtgever?: string | null
  verdacht_gebied?: string | null
  datum?: string | null
  subtype?: string | null
  kaliber?: string | null
  aantal?: string | null
  verschijning?: string | null
  afbakening?: string | null
  horizontaal?: string | null
  cartografie?: string | null
  opmerkingen?: string | null
  pdf?: string | null
  count?: string | null
  noodzaak?: string[] | null
  uiterlijk?: string[] | null
  soortPaaltje?: string[] | null
  ruimte?: string[] | null
  markering?: string[] | null
  soortWeg?: string[] | null
  paaltjesWeg?: string[] | null
  zichtInDonker?: string[] | null
  titel?: string | null
  startDate?: string | null
  startTime?: string | null
  endDate?: string | null
  endTime?: string | null
  url?: string | null
  localeDate?: string | null
  website?: string | null
  tarieven?: string | null
  volledige_code?: string | null
  gemeente?: ApiDisplay | null
  code?: string | null
  plannaam?: string | null
  planstatusFormatted?: string | null
  startdatum?: string | null
  oppervlakteFormatted?: string | null
  objectnummer?: string | null
  koopsom?: string | null
  koopjaar?: string | null
  cultuurcode_bebouwd?: ApiDescription | null
  cultuurcode_onbebouwd?: ApiDescription | null
  meetboutidentificatie?: string | null
  adres?: string | null
  locatie?: string | null
  geometrie?: {
    coordinates?: Position
  } | null
  bouwblok?: string | null
  bouwblok_link?: string | null
  bouwblokzijde?: string | null
  blokeenheid?: string | null
  stadsdeel_link?: string | null
  beveiligd?: string | null
  ligt_in_complex?: {
    _links?: {
      self?: ApiLink
    }
  } | null
  heeft_als_grondslag_beperking?: {
    _links?: {
      self?: ApiLink
    }
  } | null
  betreft_pand?: string | null
  heeft_situeringen?: ApiLink | null
  monumentnummer_complex?: string | null
  complexnaam?: string | null
  beschrijving_complex?: string | null
  monumenten?: ApiLink | null
  peilmerkidentificatie?: string | null
  hoogte_nap?: string | null
  windrichting?: string | null
  x_muurvlak?: string | null
  y_muurvlak?: string | null
  merk?: string | null
  rws_nummer?: string | null
  address?: string | null
  quantity?: string | null
  type?: string | string[] | null
  charging_capability?: string | null
  connector_type?: string | null
  currentStatus?: string | null
  id?: string | null
  straatnaam?: string | null
  regimes?: string | null
  gebied_omschrijving?: string | null
  construction_year?: string | null
  monumental_status?: string | null
  status?: string | null
  bijzondereRechtstoestand?: {
    title?: string
  } | null
  vestigingsnummer?: string | null
  hoofdvestiging?: string | null
  activiteiten?: Array<{ sbi_code?: string; sbi_omschrijving?: string }> | null
  maatschappelijke_activiteit?: string | null
  categorie_naam?: string | null
  beperkingcode?:
    | ({
        code?: string
      } & ApiDescription)
    | null
  kadastrale_objecten?: ApiLink | null
  verblijfsobjecten?: ApiDisplay[] | { count?: number | null } | null
  kadastrale_gemeente?: ({ gemeente: { _display?: string }; naam?: string } & ApiDisplay) | null
  sectie?: {
    sectie?: string
  } | null
  perceelnummer?: string | null
  indexletter?: string | null
  indexnummer?: string | null
  grootte?: string | null
  toestandsdatum?: string | null
  beperkingen?: Array<{
    inschrijfnummer?: string
    beperkingcode?: {
      code?: string
    } & ApiDescription
    datum_in_werking?: string
  }> | null
  statutaire_zetel?: string | null
  rechtsvorm?: ApiDescription | null
  rsin?: string | null
  kvknummer?: string | null
  is_natuurlijk_persoon?: string | null
  voornamen?: string | null
  voorvoegsels?: string | null
  geslacht?: ApiDescription | null
  geboortedatum?: string | null
  geboorteplaats?: string | null
  geboorteland?: ApiDescription | null
  overlijdensdatum?: string | null
  woonadres?: ApiAddress | null
  rechten?: ApiLink | null
  onderneming?: {
    handelsnamen?: Array<{ handelsnaam?: string }>
  } | null
  naam?: string | null
  kvk_nummer?: string | null
  postadres?: ApiAddress | null
  bezoekadres?: ApiAddress | null
  datum_aanvang?: string | null
  _bijzondere_rechts_toestand?: {
    status?: string
    faillissement?: boolean
  } | null
  functieVervullingUrl?: string | null
  vestigingen?: ApiLink | null
  openbare_ruimtes?: ApiLink | null
  tariefPerJaarPerM2?: string | null
  categorie?: string | null
  jaar?: string | null
  stadsdeel?: string | null
  gebied?: string | null
  _monumenten?: ApiLink | null
  adressen?: ApiLink | null
  tariefOverdektTerrasPerJaarPerM2?: string | null
  tariefOnoverdektTerrasPerZomerseizoenPerM2?: string | null
  tariefOnoverdektTerrasPerWinterseizoenPerM2?: string | null
  title?: string | null
  standplaats?: string | null
  ligplaats?: string | null
  _adressen?: ApiLink | null
  panden?: ApiLink | null
  bouwblokken?: ApiLink | null
  documenten?: ApiLink | null
  buurten?: ApiLink | null
  buurtcombinaties?: ApiLink | null
  meetbouten?: string | null
  monumentnummer?: string | null
  monumentnaam?: string | null
  monumentstatus?: string | null
  metingen?: ApiLink | null
  monumenttype?: string | null
  architect_ontwerp_monument?: string | null
  opdrachtgever_bouw_monument?: string | null
  bouwjaar_start_bouwperiode_monument?: string | null
  oorspronkelijke_functie_monument?: string | null
  in_onderzoek?: string | null
  beschrijving_monument?: string | null
  redengevende_omschrijving_monument?: string | null
  aantekeningen?: Array<{ opgelegd_door: null | { _display: string }; _display: string }>
  ontstaan_uit?: string | null
  betrokken_bij?: string | null
  verblijfsobjectidentificatie?: string | null
}

export type ExtraApiResults = {
  nummeraanduidingData?: PotentialApiResult
  brkData?: PotentialApiResult
  verblijfsobjectData?: PotentialApiResult
  rollaagImage?: string
}
