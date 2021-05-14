import { createPath } from 'history'
import environment from '../environment'
import { getImageDataById } from '../panorama/services/panorama-api/panorama-api'
import {
  ARTICLE_REDIRECT_FRAGMENTS,
  REDIRECTS_ARTICLES,
  SHORTLINKS,
} from '../shared/config/content-links'
import { Environment } from '../shared/environment'
import { toArticleDetail } from './links'
import matomoInstance from './matomo'
import {
  centerParam,
  isEmbeddedParam,
  legendOpenParam,
  locationParam,
  mapLayersParam,
  panoFovParam,
  panoHeadingParam,
  panoPitchParam,
  viewParam,
  zoomParam,
} from './pages/MapPage/query-params'
import { betaMapDataPath, MAIN_PATHS, routing } from './routes'
import getVerblijfsobjectIdFromAddressQuery from './utils/getVerblijfsobjectIdFromAddressQuery'
import matchRule from './utils/matchRule'

interface Redirect {
  from: string
  to: string
  load?: (location: Location) => Promise<string>
}

// This are the known broken legacy links
export const legacyRoutes: Redirect[] = [
  // https://www.parool.nl/amsterdam/kaart-met-onontplofte-bommen-in-amsterdam-nu-openbaar~a4539314/
  {
    from: '/#?mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${viewParam.name}=kaart&${centerParam.name}=52.3787158140549%2C4.893662070270319&${mapLayersParam.name}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${legendOpenParam.name}=false&${zoomParam.name}=8`,
  },
  {
    from: '/#?ate=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${viewParam.name}=kaart&${centerParam.name}=52.3787158140549%2C4.893662070270319&${isEmbeddedParam.name}=true&${mapLayersParam.name}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${legendOpenParam.name}=false&${zoomParam.name}=8`,
  },
  {
    from: '/#?ate=T&lse=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${viewParam.name}=kaart&${centerParam.name}=52.3787158140549%2C4.893662070270319&${isEmbeddedParam.name}=true&${mapLayersParam.name}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${legendOpenParam.name}=false&${zoomParam.name}=8`,
  },
  // https://www.telegraaf.nl/nieuws/1256075/ligt-er-een-bom-uit-woii-in-je-achtertuin-met-deze-kaart-kom-je-er-achter
  {
    from: '/#?mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    to: `${routing.data.path}?${viewParam.name}=kaart&${centerParam.name}=52.3787158140549%2C4.893662070270319&${mapLayersParam.name}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${legendOpenParam.name}=false&${zoomParam.name}=8`,
  },
  {
    from: '/#?ate=T&mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    to: `${routing.data.path}?${viewParam.name}=kaart&${centerParam.name}=52.3787158140549%2C4.893662070270319&${isEmbeddedParam.name}=true&${mapLayersParam.name}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${legendOpenParam.name}=false&${zoomParam.name}=8`,
  },
  {
    from: '/#?ate=T&lse=T&mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    to: `${routing.data.path}?${viewParam.name}=kaart&${centerParam.name}=52.3787158140549%2C4.893662070270319&${isEmbeddedParam.name}=true&${mapLayersParam.name}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${legendOpenParam.name}=false&${zoomParam.name}=8`,
  },
  // https://www.amsterdamsdagblad.nl/gemeente/duizend-bommen-en-granaten-de-bommenkaart
  {
    from: '/#?mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${viewParam.name}=kaart&${centerParam.name}=52.3787158140549%2C4.893662070270319&${mapLayersParam.name}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${legendOpenParam.name}=false&${zoomParam.name}=8`,
  },
  {
    from: '/#?ate=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${viewParam.name}=kaart&${centerParam.name}=52.3787158140549%2C4.893662070270319&${isEmbeddedParam.name}=true&${mapLayersParam.name}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${legendOpenParam.name}=false&${zoomParam.name}=8`,
  },
  {
    from: '/#?ate=T&lse=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${viewParam.name}=kaart&${centerParam.name}=52.3787158140549%2C4.893662070270319&${isEmbeddedParam.name}=true&${mapLayersParam.name}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${legendOpenParam.name}=false&${zoomParam.name}=8`,
  },
  // https://intranet.alliander.com/blog/${viewParam.name}/5359847/kaart-met-onontplofte-bommen-in-amsterdam
  {
    from: '/#?mpb=topografie&mpz=14&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3889979:4.9094038&pgn=home',
    to: `${routing.data.path}?${viewParam.name}=kaart&${centerParam.name}=52.3787158140549%2C4.893662070270319&${mapLayersParam.name}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${legendOpenParam.name}=false&${zoomParam.name}=8`,
  },
  {
    from: '/?_sp=144b47f5-2817-4a1f-888c-d1d1b69c89cb.1510908859477#?ate=T&mpb=topografie&mpz=14&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3889979:4.9094038&pgn=home',
    to: `${routing.data.path}?${viewParam.name}=kaart&${centerParam.name}=52.3787158140549%2C4.893662070270319&${isEmbeddedParam.name}=true&${mapLayersParam.name}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${legendOpenParam.name}=false&${zoomParam.name}=8`,
  },
  // https://www.amsterdam.nl/ondernemen/biz/
  {
    from: '/#?mpb=topografie&mpz=9&mpfs=T&mpo=biz::T&mpv=52.3676245:4.8804992&pgn=home&uvm=T',
    to: `${routing.data.path}?${viewParam.name}=kaart&${mapLayersParam.name}=biz%3A1&${legendOpenParam.name}=true&${zoomParam.name}=9`,
  },
  {
    from: '/#?ate=T&mpb=topografie&mpz=9&mpfs=T&mpo=biz::T&mpv=52.3676245:4.8804992&pgn=home&uvm=T',
    to: `${routing.data.path}?${viewParam.name}=kaart&${isEmbeddedParam.name}=true&${mapLayersParam.name}=biz%3A1&${legendOpenParam.name}=true&${zoomParam.name}=9`,
  },
  // home map
  {
    from: '/#?mpb=topografie&mpz=11&mpfs=T&mpv=52.3731081:4.8932945&pgn=home&uvm=T',
    to: `${routing.data.path}?${viewParam.name}=kaart`,
  },
  {
    from: `/${betaMapDataPath}/panorama/*/${window.location.search}`,
    to: `/${betaMapDataPath}/geozoek/`,
    load: async (location: Location) => {
      try {
        const panoramaId = location.pathname
          .split('/')
          .filter((part) => part !== '')
          .pop()
        const result = await getImageDataById(panoramaId)
        const currentParams = new URLSearchParams(location.search)
        const query = new URLSearchParams({
          [locationParam.name]: locationParam.encode({
            lat: result.location[0] as number,
            lng: result.location[1] as number,
          }),
          [panoHeadingParam.name]: (panoHeadingParam.initialValue as number).toString(),
          [panoFovParam.name]: (panoFovParam.initialValue as number).toString(),
          [panoPitchParam.name]: (panoPitchParam.initialValue as number).toString(),
        })
        currentParams.forEach((value, key) => {
          query.set(key, value)
        })
        return `?${query.toString()}`
      } catch (e) {
        // Perhaps show alert if Auth- or Forbidden error
        // For now it will just redirect to /kaart/geozoek
        return ''
      }
    },
  },
]

export const shortUrls: Redirect[] = [
  {
    from: '/themakaart/taxi/',
    to: `${routing.data.path}?${viewParam.name}=kaart&${mapLayersParam.name}=themtaxi-bgt%3A1|themtaxi-tar%3A1|themtaxi-pvrts%3A1|themtaxi-mzt%3A1|themtaxi-oovtig%3A1|themtaxi-vezips%3A1|themtaxi-slpnb%3A1|themtaxi-slpb%3A1|themtaxi-nlpnb%3A1|themtaxi-nlpb%3A1&${legendOpenParam.name}=true`,
  },
  {
    from: '/themakaart/veiligheid-en-overlast/',
    to: `${routing.data.path}?${viewParam.name}=kaart&${mapLayersParam.name}=veilov-oovoalg%3A1|veilov-oovodlrs%3A1|veilov-oovctg%3A1|veilov-oovoalco%3A1|veilov-oovorlv%3A1|veilov-oovtig%3A1|veilov-vwrk%3A1&${legendOpenParam.name}=true`,
  },
  {
    from: '/themakaart/logistiek/',
    to: `${routing.data.path}?${viewParam.name}=kaart&${mapLayersParam.name}=logistk-rtsur%3A1%7Clogistk-rtstgs%3A1%7Clogistk-rtsgs%3A1%7Clogistk-rtsvr75%3A1%7Clogistk-pvrll%3A1%7Clogistk-mzb%3A1%7Clogistk-mvw%3A1%7Clogistk-mzva%3A1&${legendOpenParam.name}=true`,
  },
  {
    from: '/themakaart/ondergrond/',
    to: `${routing.data.path}?${viewParam.name}=kaart&${mapLayersParam.name}=ondrgd-aardgasbel%3A1|ondrgd-aardgas1let%3A1|ondrgd-aardgas100let%3A1|ondrgd-aardgaspr106%3A1|ondrgd-aardgas%3A1|ondrgd-exuo%3A1|ondrgd-exgg%3A1|ondrgd-exvg%3A1|ondrgd-gbhv%3A1|ondrgd-gbep%3A1|ondrgd-gbgg%3A1|ondrgd-gbgs%3A1|ondrgd-gbos%3A1|ondrgd-gboh%3A1|ondrgd-gbwu%3A1|ondrgd-gbkw%3A1|ondrgd-gbvv%3A1|ondrgd-mvlpgst%3A1|ondrgd-mvlpgs%3A1|ondrgd-mvlpgtgrp%3A1|ondrgd-mvlpgtris%3A1|ondrgd-mvlpgt%3A1|ondrgd-mvlpgvgeb%3A1|ondrgd-mvlpgv106%3A1|ondrgd-mvlpgv105%3A1|ondrgd-mvlpgeb%3A1|ondrgd-mvlpga%3A1|ondrgd-exin%3A1|ondrgd-mbgm%3A1|ondrgd-mbaig%3A1|ondrgd-mbgwm%3A1|ondrgd-mbz%3A1|ondrgd-mbs%3A1|ondrgd-mbr%3A1|ondrgd-vezips%3A1&${legendOpenParam.name}=true`,
  },
  {
    from: '/themakaart/vergunningen/',
    to: `${routing.data.path}?${viewParam.name}=kaart&${mapLayersParam.name}=adasdas-vergbnb%3A1%7Cvrgngn-vergkvh%3A1%7Cvrgngn-vergbnb%3A1&${legendOpenParam.name}=true`,
  },
  {
    from: '/datablog/',
    to: 'https://amsterdam.github.io/datablog/',
  },
  {
    from: '/dossier/economie/',
    to: `/dossiers/dossier/corona-en-de-economie/${
      SHORTLINKS.COLLECTIONS.ECONOMY.id[environment.DEPLOY_ENV as Environment]
    }`,
  },
  {
    from: '/dossier/toerisme/',
    to: `/dossiers/dossier/toerisme/${
      SHORTLINKS.COLLECTIONS.TOURISM.id[environment.DEPLOY_ENV as Environment]
    }`,
  },
  {
    from: '/dossier/wonen/',
    to: `/dossiers/dossier/wonen/${
      SHORTLINKS.COLLECTIONS.HOUSING.id[environment.DEPLOY_ENV as Environment]
    }`,
  },
  {
    from: '/schoolloopbanen/',
    to: `/specials/dashboard/dashboard-schoolloopbanen/${
      SHORTLINKS.COLLECTIONS.EDUCATION.id[environment.DEPLOY_ENV as Environment]
    }`,
  },
  {
    from: '/coronamonitor/',
    to: `/specials/dashboard/dashboard-corona/${
      SHORTLINKS.COLLECTIONS.CORONA.id[environment.DEPLOY_ENV as Environment]
    }`,
  },
  {
    from: '/veelgestelde-vragen/',
    to: `/artikelen/artikel/veelgestelde-vragen/${
      SHORTLINKS.COLLECTIONS.FAQ.id[environment.DEPLOY_ENV as Environment]
    }`,
  },
]

export const articleRedirectUrls: Redirect[] = [
  {
    from: `/specials/dashboard/${
      ARTICLE_REDIRECT_FRAGMENTS.ECONOMY_DASHBOARD.from.fragment[
        environment.DEPLOY_ENV as Environment
      ]
    }`,
    to: `/specials/dashboard/${
      ARTICLE_REDIRECT_FRAGMENTS.ECONOMY_DASHBOARD.to.fragment[
        environment.DEPLOY_ENV as Environment
      ]
    }`,
  },
]

export const articleUrls: Redirect[] = REDIRECTS_ARTICLES.map((item) => ({
  from: item.from,
  to: createPath(toArticleDetail(item.to.id[environment.DEPLOY_ENV], item.to.slug)),
}))

const overviewPaths = [
  MAIN_PATHS.ARTICLES,
  MAIN_PATHS.PUBLICATIONS,
  MAIN_PATHS.SPECIALS,
  MAIN_PATHS.DATASETS,
  MAIN_PATHS.COLLECTIONS,
  MAIN_PATHS.DATA,
]

export const overviewUrls: Redirect[] = overviewPaths.map((pathName) => ({
  from: `/${pathName}/`,
  to: `/${pathName}/zoek/`,
}))

export const webHooks: Redirect[] = [
  {
    from: `/adres/zoek/${window.location.search}`,
    to: `/data/bag/verblijfsobject/`,
    load: getVerblijfsobjectIdFromAddressQuery,
  },
]

const REDIRECTS = [
  ...legacyRoutes,
  ...shortUrls,
  ...articleUrls,
  ...articleRedirectUrls,
  ...overviewUrls,
  ...webHooks,
]

export default async function resolveRedirects(location: Location) {
  const currentPath = normalizePath(`${location.pathname}${location.search}${location.hash}`)
  const exactMatchingRedirect = REDIRECTS.find(({ from }) => normalizePath(from) === currentPath)
  const wildcardMatchingRedirect = REDIRECTS.find(({ from }) =>
    matchRule(currentPath, normalizePath(from)),
  )

  if (!exactMatchingRedirect && wildcardMatchingRedirect) {
    const urlSuffix = wildcardMatchingRedirect.load
      ? await wildcardMatchingRedirect.load(location)
      : null

    if (urlSuffix !== null) {
      // Tries to prevent cancelling the network request to Matomo, arbitrary number that allows Matomo some time to load
      window.setTimeout(() => location.replace(`${wildcardMatchingRedirect.to}${urlSuffix}`), 1000)
    }

    return !!urlSuffix
  }

  if (!exactMatchingRedirect) {
    return false
  }

  // Retrieve the data needed for the webhook
  // When migrating to a SSR or static application an actual implementation of webhooks can be created
  if (webHooks.includes(exactMatchingRedirect)) {
    const dataId = exactMatchingRedirect.load ? await exactMatchingRedirect.load(location) : null

    if (dataId) {
      const redirectTo = `${exactMatchingRedirect.to}${dataId}/`

      matomoInstance.trackEvent({
        category: 'webhook',
        action: 'adres-postcode',
        name: redirectTo,
      })

      // Tries to prevent cancelling the network request to Matomo, arbitrary number that allows Matomo some time to load
      window.setTimeout(() => location.replace(redirectTo), 0)
    }

    return !!dataId
  }

  // Track "themakaarten"
  // TODO: As soon as the collections can be found in the search, this must be double checked to prevent duplicate logs in Matomo
  if (shortUrls.includes(exactMatchingRedirect)) {
    if (exactMatchingRedirect.from.startsWith('/themakaart')) {
      // Get the title of the "themakaart" from the currentPath
      const action = currentPath.split('/')[2]

      matomoInstance.trackEvent({ category: 'kaartlaag', action })
    }
  }

  // Tries to prevent cancelling the network request to Matomo, arbitrary number that allows Matomo some time to load
  window.setTimeout(() => location.replace(exactMatchingRedirect.to), 1000)

  return true
}

function normalizePath(path: string) {
  return path.endsWith('/') ? path.slice(0, -1) : path
}
