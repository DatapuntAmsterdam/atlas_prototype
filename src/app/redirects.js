import PARAMETERS from '../store/parameters';
import { routing } from './routes';

const { VIEW, VIEW_CENTER, LAYERS, LEGEND, ZOOM, EMBED } = PARAMETERS;

// This are the known broken legacy links
const legacyRoutes = [
  // https://www.parool.nl/amsterdam/kaart-met-onontplofte-bommen-in-amsterdam-nu-openbaar~a4539314/
  {
    from: '#?mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`
  },
  {
    from: '#?ate=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`
  },
  {
    from: '#?ate=T&lse=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`
  },
  // https://www.telegraaf.nl/nieuws/1256075/ligt-er-een-bom-uit-woii-in-je-achtertuin-met-deze-kaart-kom-je-er-achter
  {
    from: '#?mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`
  },
  {
    from: '#?ate=T&mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`
  },
  {
    from: '#?ate=T&lse=T&mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`
  },
  // https://www.amsterdamsdagblad.nl/gemeente/duizend-bommen-en-granaten-de-bommenkaart
  {
    from: '#?mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`
  },
  {
    from: '#?ate=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`
  },
  {
    from: '#?ate=T&lse=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`
  },
  // https://intranet.alliander.com/blog/${VIEW}/5359847/kaart-met-onontplofte-bommen-in-amsterdam
  {
    from: '#?mpb=topografie&mpz=14&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3889979:4.9094038&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`
  },
  {
    from: '?_sp=144b47f5-2817-4a1f-888c-d1d1b69c89cb.1510908859477#?ate=T&mpb=topografie&mpz=14&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3889979:4.9094038&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`
  },
  // https://www.amsterdam.nl/ondernemen/biz/
  {
    from: '#?mpb=topografie&mpz=9&mpfs=T&mpo=biz::T&mpv=52.3676245:4.8804992&pgn=home&uvm=T',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=biz%3A1&${LEGEND}=true&${ZOOM}=9`
  },
  {
    from: '#?ate=T&mpb=topografie&mpz=9&mpfs=T&mpo=biz::T&mpv=52.3676245:4.8804992&pgn=home&uvm=T',
    to: `${routing.data.path}?${VIEW}=kaart&${EMBED}=true&${LAYERS}=biz%3A1&${LEGEND}=true&${ZOOM}=9`
  },
  // home map
  {
    from: '#?mpb=topografie&mpz=11&mpfs=T&mpv=52.3731081:4.8932945&pgn=home&uvm=T',
    to: `${routing.data.path}?${VIEW}=kaart`
  }
];

const shortUrls = [
  {
    from: '/themakaart/taxi',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=mzt%3A0%7Cslpb%3A1%7Cslpnb%3A1%7Cpvrts%3A1%7Cpvrll%3A1%7Cpvrpr%3A0%7Cbgt%3A1%7Ctar%3A1%7Cvrr%3A0%7Cpr%3A1%7Coovtig%3A1&${LEGEND}=true`
  }
];

export const routesDictionary = [
  ...legacyRoutes,
  ...shortUrls
];

const resolveRedirects = () => {
  let routePath = routesDictionary.filter((r) => r.from === window.location.pathname);
  if (window.location.hash.match(/#\?/g)) {
    routePath = routesDictionary.filter((r) => r.from === window.location.hash);
    window.location.replace(routePath.length && routePath[0].to ? routePath[0].to : '/verplaatst/');
    return true;
  } else if (routePath.length) {
    window.location.replace(routePath[0].to);
    return true;
  }

  return false;
};

export default resolveRedirects;
