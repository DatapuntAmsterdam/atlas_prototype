import PARAMETERS from '../store/parameters'
import { routing, MAIN_PATHS } from './routes'
import { CONTENT_REDIRECT_LINKS } from '../shared/config/config'
import matomoInstance from './matomo'

const { VIEW, VIEW_CENTER, LAYERS, LEGEND, ZOOM, EMBED } = PARAMETERS

// This are the known broken legacy links
const legacyRoutes = [
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
const shortUrls = [
  {
    from: '/themakaart/taxi/',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=themtaxi-bgt%3A1%7Cthemtaxi-tar%3A1%7Cthemtaxi-pvrts%3A1%7Cthemtaxi-mzt%3A1%7Cthemtaxi-oovtig%3A1%7Cthemtaxi-vezips%3A1%7Cthemtaxi-slpnb%3A1%7Cthemtaxi-slpb%3A1%7Cthemtaxi-nlpnb%3A1%7Cthemtaxi-nlpb%3A1&${LEGEND}=true`,
  },
  {
    from: '/themakaart/veiligheid-en-overlast/',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=veilov-oovoalg%3A1%7Cveilov-oovodlrs%3A1%7Cveilov-oovctg%3A1%7Cveilov-oovoalco%3A1%7Cveilov-oovorlv%3A1%7Cveilov-oovtig%3A1%7Cveilov-vwrk%3A1&${LEGEND}=true`,
  },
  {
    from: '/themakaart/logistiek/',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=logistk-rtsvr%3A1%7Clogistk-pvrll%3A1%7Clogistk-mzb%3A1%7Clogistk-mvw%3A1%7Clogistk-mzva%3A1&${LEGEND}=true`,
  },
  {
    from: '/themakaart/ondergrond/',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=vondrgd-aardgasbel%3A1%7Condrgd-aardgas1let%3A1%7Condrgd-aardgas100let%3A1%7Condrgd-aardgaspr106%3A1%7Condrgd-aardgas%3A1%7Condrgd-exuo%3A1%7Condrgd-exgg%3A1%7Condrgd-exvg%3A1%7Condrgd-gbhv%3A1%7Condrgd-gbep%3A1%7Condrgd-gbgg%3A1%7Condrgd-gbgs%3A1%7Condrgd-gbos%3A1%7Condrgd-gboh%3A1%7Condrgd-gbwu%3A1%7Condrgd-gbkw%3A1%7Condrgd-gbvv%3A1%7Condrgd-mvlpgst%3A1%7Condrgd-mvlpgs%3A1%7Condrgd-mvlpgtgrp%3A1%7Condrgd-mvlpgtris%3A1%7Condrgd-mvlpgt%3A1%7Condrgd-mvlpgvgeb%3A1%7Condrgd-mvlpgv106%3A1%7Condrgd-mvlpgv105%3A1%7Condrgd-mvlpgeb%3A1%7Condrgd-mvlpga%3A1%7Condrgd-exin%3A1%7Condrgd-mbgm%3A1%7Condrgd-mbaig%3A1%7Condrgd-mbgwm%3A1%7Condrgd-mbz%3A1%7Condrgd-mbs%3A1%7Condrgd-mbr%3A1%7Condrgd-vezips%3A1&${LEGEND}=true`,
  },
  {
    from: '/datablog/',
    to: 'https://amsterdam.github.io/datablog/',
  },
]

const articleUrls = CONTENT_REDIRECT_LINKS.ARTICLES.map(item => ({
  from: item.from,
  to: routing.articleDetail.path
    .replace(':slug', item.to.slug)
    .replace(':id', item.to.id[process.env.NODE_ENV]),
}))

const overviewPaths = [
  MAIN_PATHS.ARTICLES,
  MAIN_PATHS.PUBLICATIONS,
  MAIN_PATHS.SPECIALS,
  MAIN_PATHS.DATASETS,
]

const overviewUrls = overviewPaths.map(pathName => ({
  from: `/${pathName}/`,
  to: `/${pathName}/zoek/`,
}))

export const REDIRECTS = [...legacyRoutes, ...shortUrls, ...articleUrls, ...overviewUrls]

export default function resolveRedirects() {
  const currentPath = normalizePath(
    `${window.location.pathname}${window.location.search}${window.location.hash}`,
  )
  const matchingRedirect = REDIRECTS.find(({ from }) => normalizePath(from) === currentPath)

  if (!matchingRedirect) {
    return false
  }

  // Track "themakaarten"
  // TODO: As soon as the collections can be found in the search, this must be double checked to prevent duplicate logs in Matomo
  if (shortUrls.includes(matchingRedirect)) {
    // Get the title of the "themakaart" from the currentPath
    const action = currentPath.split('/')[2]

    matomoInstance.trackEvent({ category: 'kaartlaag', action })
  }

  // Tries to prevent cancelling the network request to Matomo, arbitrary number that allows Matomo some time to load
  window.setTimeout(() => window.location.replace(matchingRedirect.to), 1000)

  return true
}

function normalizePath(path) {
  return path.endsWith('/') ? path.slice(0, -1) : path
}
