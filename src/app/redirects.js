import PARAMETERS from '../store/parameters'
import { routing, MAIN_PATHS } from './routes'
import { CONTENT_REDIRECT_LINKS, SHORTLINKS } from '../shared/config/config'
import matomoInstance from './matomo'
import redirectToAddress from './utils/redirectToAddress'
import environment from '../environment'

const { VIEW, VIEW_CENTER, LAYERS, LEGEND, ZOOM, EMBED } = PARAMETERS

// This are the known broken legacy links
export const legacyRoutes = [
  // https://www.parool.nl/amsterdam/kaart-met-onontplofte-bommen-in-amsterdam-nu-openbaar~a4539314/
  {
    from:
      '/#?mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '/#?ate=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '/#?ate=T&lse=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  // https://www.telegraaf.nl/nieuws/1256075/ligt-er-een-bom-uit-woii-in-je-achtertuin-met-deze-kaart-kom-je-er-achter
  {
    from:
      '/#?mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '/#?ate=T&mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '/#?ate=T&lse=T&mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  // https://www.amsterdamsdagblad.nl/gemeente/duizend-bommen-en-granaten-de-bommenkaart
  {
    from:
      '/#?mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '/#?ate=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '/#?ate=T&lse=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  // https://intranet.alliander.com/blog/${VIEW}/5359847/kaart-met-onontplofte-bommen-in-amsterdam
  {
    from:
      '/#?mpb=topografie&mpz=14&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3889979:4.9094038&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '/?_sp=144b47f5-2817-4a1f-888c-d1d1b69c89cb.1510908859477#?ate=T&mpb=topografie&mpz=14&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3889979:4.9094038&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  // https://www.amsterdam.nl/ondernemen/biz/
  {
    from: '/#?mpb=topografie&mpz=9&mpfs=T&mpo=biz::T&mpv=52.3676245:4.8804992&pgn=home&uvm=T',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=biz%3A1&${LEGEND}=true&${ZOOM}=9`,
  },
  {
    from: '/#?ate=T&mpb=topografie&mpz=9&mpfs=T&mpo=biz::T&mpv=52.3676245:4.8804992&pgn=home&uvm=T',
    to: `${routing.data.path}?${VIEW}=kaart&${EMBED}=true&${LAYERS}=biz%3A1&${LEGEND}=true&${ZOOM}=9`,
  },
  // home map
  {
    from: '/#?mpb=topografie&mpz=11&mpfs=T&mpv=52.3731081:4.8932945&pgn=home&uvm=T',
    to: `${routing.data.path}?${VIEW}=kaart`,
  },
]
export const shortUrls = [
  {
    from: '/themakaart/taxi/',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=themtaxi-bgt%3A1|themtaxi-tar%3A1|themtaxi-pvrts%3A1|themtaxi-mzt%3A1|themtaxi-oovtig%3A1|themtaxi-vezips%3A1|themtaxi-slpnb%3A1|themtaxi-slpb%3A1|themtaxi-nlpnb%3A1|themtaxi-nlpb%3A1&${LEGEND}=true`,
  },
  {
    from: '/themakaart/veiligheid-en-overlast/',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=veilov-oovoalg%3A1|veilov-oovodlrs%3A1|veilov-oovctg%3A1|veilov-oovoalco%3A1|veilov-oovorlv%3A1|veilov-oovtig%3A1|veilov-vwrk%3A1&${LEGEND}=true`,
  },
  {
    from: '/themakaart/logistiek/',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=logistk-rtsur%3A1%7Clogistk-rtstgs%3A1%7Clogistk-rtsgs%3A1%7Clogistk-rtsvr75%3A1%7Clogistk-pvrll%3A1%7Clogistk-mzb%3A1%7Clogistk-mvw%3A1%7Clogistk-mzva%3A1&${LEGEND}=true`,
  },
  {
    from: '/themakaart/ondergrond/',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=ondrgd-aardgasbel%3A1|ondrgd-aardgas1let%3A1|ondrgd-aardgas100let%3A1|ondrgd-aardgaspr106%3A1|ondrgd-aardgas%3A1|ondrgd-exuo%3A1|ondrgd-exgg%3A1|ondrgd-exvg%3A1|ondrgd-gbhv%3A1|ondrgd-gbep%3A1|ondrgd-gbgg%3A1|ondrgd-gbgs%3A1|ondrgd-gbos%3A1|ondrgd-gboh%3A1|ondrgd-gbwu%3A1|ondrgd-gbkw%3A1|ondrgd-gbvv%3A1|ondrgd-mvlpgst%3A1|ondrgd-mvlpgs%3A1|ondrgd-mvlpgtgrp%3A1|ondrgd-mvlpgtris%3A1|ondrgd-mvlpgt%3A1|ondrgd-mvlpgvgeb%3A1|ondrgd-mvlpgv106%3A1|ondrgd-mvlpgv105%3A1|ondrgd-mvlpgeb%3A1|ondrgd-mvlpga%3A1|ondrgd-exin%3A1|ondrgd-mbgm%3A1|ondrgd-mbaig%3A1|ondrgd-mbgwm%3A1|ondrgd-mbz%3A1|ondrgd-mbs%3A1|ondrgd-mbr%3A1|ondrgd-vezips%3A1&${LEGEND}=true`,
  },
  {
    from: '/themakaart/vergunningen/',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=adasdas-vergbnb%3A1%7Cvrgngn-vergkvh%3A1%7Cvrgngn-vergbnb%3A1&${LEGEND}=true`,
  },
  {
    from: '/datablog/',
    to: 'https://amsterdam.github.io/datablog/',
  },
  {
    from: '/dossier/economie/',
    to: `/dossiers/dossier/corona-en-de-economie/${
      SHORTLINKS.COLLECTIONS.ECONOMY.id[environment.DEPLOY_ENV]
    }`,
  },
  {
    from: '/dossier/toerisme/',
    to: `/dossiers/dossier/toerisme/${SHORTLINKS.COLLECTIONS.TOURISM.id[environment.DEPLOY_ENV]}`,
  },
  {
    from: '/dossier/wonen/',
    to: `/dossiers/dossier/wonen/${SHORTLINKS.COLLECTIONS.HOUSING.id[environment.DEPLOY_ENV]}`,
  },
]

export const articleUrls = CONTENT_REDIRECT_LINKS.ARTICLES.map((item) => ({
  from: item.from,
  to: routing.articleDetail.path
    .replace(':slug', item.to.slug)
    .replace(':id', item.to.id[environment.DEPLOY_ENV]),
}))

const overviewPaths = [
  MAIN_PATHS.ARTICLES,
  MAIN_PATHS.PUBLICATIONS,
  MAIN_PATHS.SPECIALS,
  MAIN_PATHS.DATASETS,
  MAIN_PATHS.COLLECTIONS,
  MAIN_PATHS.DATA,
]

export const overviewUrls = overviewPaths.map((pathName) => ({
  from: `/${pathName}/`,
  to: `/${pathName}/zoek/`,
}))

export const webHooks = [
  {
    from: `/adres/zoek${window.location.search}`,
    to: `/data/bag/verblijfsobject/`,
    load: redirectToAddress,
  },
]

const REDIRECTS = [...legacyRoutes, ...shortUrls, ...articleUrls, ...overviewUrls, ...webHooks]

export default async function resolveRedirects() {
  const currentPath = normalizePath(
    `${window.location.pathname}${window.location.search}${window.location.hash}`,
  )
  const matchingRedirect = REDIRECTS.find(({ from }) => normalizePath(from) === currentPath)

  if (!matchingRedirect) {
    return false
  }

  // Retrieve the data needed for the webhook
  // When migrating to a SSR or static application an actual implementation of webhooks can be created
  if (webHooks.includes(matchingRedirect)) {
    const dataId = await matchingRedirect.load(window.location.search)

    if (dataId) {
      const redirectTo = `${matchingRedirect.to}${dataId}/`

      matomoInstance.trackEvent({
        category: 'webhook',
        action: 'adres-postcode',
        name: redirectTo,
      })

      // Tries to prevent cancelling the network request to Matomo, arbitrary number that allows Matomo some time to load
      window.setTimeout(() => window.location.replace(redirectTo), 1000)
    }

    return !!dataId
  }

  // Track "themakaarten"
  // TODO: As soon as the collections can be found in the search, this must be double checked to prevent duplicate logs in Matomo
  if (shortUrls.includes(matchingRedirect)) {
    if (matchingRedirect.from.startsWith('/themakaart')) {
      // Get the title of the "themakaart" from the currentPath
      const action = currentPath.split('/')[2]

      matomoInstance.trackEvent({ category: 'kaartlaag', action })
    }
  }

  // Tries to prevent cancelling the network request to Matomo, arbitrary number that allows Matomo some time to load
  window.setTimeout(() => window.location.replace(matchingRedirect.to), 1000)

  return true
}

function normalizePath(path) {
  return path.endsWith('/') ? path.slice(0, -1) : path
}
