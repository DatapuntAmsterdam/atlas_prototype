
// This are the known broken legacy links
const routesDictionary = [
  // https://www.parool.nl/amsterdam/kaart-met-onontplofte-bommen-in-amsterdam-nu-openbaar~a4539314/
  {
    old: '#?mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    new: '/data/?view=kaart&center=52.3787158140549%2C4.893662070270319&lagen=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&legenda=false&zoom=8'
  },
  {
    old: '#?ate=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    new: '/data/?view=kaart&center=52.3787158140549%2C4.893662070270319&embed=true&lagen=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&legenda=false&zoom=8'
  },
  {
    old: '#?ate=T&lse=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    new: '/data/?view=kaart&center=52.3787158140549%2C4.893662070270319&embed=true&lagen=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&legenda=false&zoom=8'
  },
  // https://www.telegraaf.nl/nieuws/1256075/ligt-er-een-bom-uit-woii-in-je-achtertuin-met-deze-kaart-kom-je-er-achter
  {
    old: '#?mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    new: '/data/?view=kaart&center=52.3787158140549%2C4.893662070270319&lagen=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&legenda=false&zoom=8'
  },
  {
    old: '#?ate=T&mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    new: '/data/?view=kaart&center=52.3787158140549%2C4.893662070270319&embed=true&lagen=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&legenda=false&zoom=8'
  },
  {
    old: '#?ate=T&lse=T&mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    new: '/data/?view=kaart&center=52.3787158140549%2C4.893662070270319&embed=true&lagen=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&legenda=false&zoom=8'
  },
  // https://www.amsterdamsdagblad.nl/gemeente/duizend-bommen-en-granaten-de-bommenkaart
  {
    old: '#?mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    new: '/data/?view=kaart&center=52.3787158140549%2C4.893662070270319&lagen=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&legenda=false&zoom=8'
  },
  {
    old: '#?ate=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    new: '/data/?view=kaart&center=52.3787158140549%2C4.893662070270319&embed=true&lagen=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&legenda=false&zoom=8'
  },
  {
    old: '#?ate=T&lse=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    new: '/data/?view=kaart&center=52.3787158140549%2C4.893662070270319&embed=true&lagen=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&legenda=false&zoom=8'
  },
  // https://intranet.alliander.com/blog/view/5359847/kaart-met-onontplofte-bommen-in-amsterdam
  {
    old: '#?mpb=topografie&mpz=14&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3889979:4.9094038&pgn=home',
    new: '/data/?view=kaart&center=52.3787158140549%2C4.893662070270319&lagen=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&legenda=false&zoom=8'
  },
  {
    old: '?_sp=144b47f5-2817-4a1f-888c-d1d1b69c89cb.1510908859477#?ate=T&mpb=topografie&mpz=14&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3889979:4.9094038&pgn=home',
    new: '/data/?view=kaart&center=52.3787158140549%2C4.893662070270319&embed=true&lagen=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&legenda=false&zoom=8'
  },
  // https://www.amsterdam.nl/ondernemen/biz/
  {
    old: '#?mpb=topografie&mpz=9&mpfs=T&mpo=biz::T&mpv=52.3676245:4.8804992&pgn=home&uvm=T',
    new: 'data?view=kaart&lagen=biz%3A1&legenda=true&zoom=9'
  },
  {
    old: '#?ate=T&mpb=topografie&mpz=9&mpfs=T&mpo=biz::T&mpv=52.3676245:4.8804992&pgn=home&uvm=T',
    new: 'data?view=kaart&embed=true&lagen=biz%3A1&legenda=true&zoom=9'
  },
  // home map
  {
    old: '#?mpb=topografie&mpz=11&mpfs=T&mpv=52.3731081:4.8932945&pgn=home&uvm=T',
    new: '/data/?view=kaart'
  }
];

const resolveLegacyRoutes = () => {
  if (window.location.hash.match(/#\?/g)) {
    const routePath = routesDictionary.filter((r) => r.old === window.location.hash);
    window.location = routePath.length && routePath[0].new ? routePath[0].new : '/verplaatst';
  }
};

export default resolveLegacyRoutes;
