export default [
  {
    // homepage
    url: 'http://localhost:8080/',
    rootElement: ''
  },
  {
    // adressenlijst
    url: 'http://localhost:8080/#?dsd=bag&dsp=1&dsv=TABLE&mpb=topografie&mpz=11&mpv=52.3731081:4.8932945',
    actions: [
      'wait for element .qa-data-selection-content to be visible'
    ]
  },
  // TEST DOES NOT WORK IN CI
  // {
  //   // vestigingenlijst
  //   url: 'http://localhost:8080/#?dsd=hr&dsp=1&dsv=TABLE&mpb=topografie&mpz=11&mpv=52.3731081:4.8932945',
  //     actions: [
  //       'wait for element .qa-disabled-message to be visible',
  //       'click element .qa-menu__login',
  //       'wait for element .c-form to be visible',
  //       'click element .c-form-buttons__button[value=employee]',
  //       'wait for element .qa-data-selection-content to be visible'
  //     ]
  // },
  {
    // panorama
    url: 'http://localhost:8080/#?mpb=topografie&mpz=11&mpo=pano::T&mpv=52.3730353:4.8932471&pgn=home&sbf=Cu&' +
      'sbh=aS&sbi=TMX7315120208-000073_pano_0005_000449&sbl=ZRWBl:3JJZP',
    actions: [
      'wait for element .c-map to be visible',
      'wait for element .c-panorama to be visible'
    ]
  },
  // TEST DOES NOT WORK IN CI
  // {
  //   // kaart met 2 kaartlagen: meetbouten en kadastrale perceelgrenzen
  //   url: 'http://localhost:8080/#?mpb=topografie&mpz=12&mpfs=T&mpo=bgem::T:kgem::T:ksec::T:kot::T:mbs::F&mpv=52.3731147:4.8933883&pgn=home&uvm=T',
  //   // actions: [
  //   //   'wait for element .c-map to be visible'
  //   // ]
  // },
  {
    // kaart met geo search
    url: 'http://localhost:8080/#?mpb=topografie&mpz=12&mpo=bgem::T:kgem::T:ksec::T:kot::T:mbs::T&mpv=52.3734' +
      '045:4.8922749&srl=ZRX9J:3JH2b',
    rootElement: '.c-dashboard__body',
    actions: [
      'wait for element .c-map to be visible'
    ]
  },
  {
    // kaart met adressenlijst en getekende ruimte
    url: 'http://localhost:8080/#?dsd=bag&dsgf=ZRcTb::3JDU2:ZRbBw::3JKwW:ZRZF8::3JFFi&dsgd=518,2%2520m%2520en' +
      '%252012.209,9%2520m%25C2%25B2&dsp=1&dsv=LIST&mpb=topografie&mpz=12&mpo=bgem::T:kgem::T:ksec::T:kot::' +
      'T:mbs::T&mpv=52.3734045:4.8922749&srl=ZRX9J:3JH2b',
    actions: [
      'wait for element .c-map to be visible',
      'wait for element .qa-data-selection-content to be visible'
    ]
  },
  {
    // adressenlijst met ingetekende ruimte en 1 filter
    url: 'http://localhost:8080/#?dsd=bag&dsgf=ZRcTb::3JDU2:ZRbBw::3JKwW:ZRZF8::3JFFi&dsgd=518,2%2520m%2520en' +
      '%252012.209,9%2520m%25C2%25B2&dsp=1&dsv=TABLE&dsf=openbare_ruimte::Blaeustraat&mpb=topografie&mpz=12' +
      '&mpo=bgem::T:kgem::T:ksec::T:kot::T:mbs::T&mpv=52.3734045:4.8922749&srl=ZRX9J:3JH2b',
    actions: [
      'wait for element .qa-data-selection-content to be visible'
    ]
  },
  {
    // login page
    url: 'https://acc.api.data.amsterdam.nl/auth/idp/login?callback=https%3A%2F%2Facc.api.data.amsterdam.nl%2' +
      'Foauth2%2Fcallback',
    rootElement: ''
  }
]
