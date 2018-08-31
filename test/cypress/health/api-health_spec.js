import { USER_TOKENS } from '../support/authentication-commands';

describe('CityData api\'s', () => {
  const API_ROOT = Cypress.env('API_ROOT');

  const checkApiHealth = (requestUrl) => {
    cy.request({
      url: requestUrl,
      followRedirect: false, // turn off following redirects
      auth: {
        bearer: USER_TOKENS.EMPLOYEE_PLUS
      }
      // headers: {
      //   'Content-Encoding': 'deflate',
      //   'Content-Type': 'application/json',
      // },
      // gzip: true,

    })
      .then((resp) => {
        // redirect status code is 200
        expect(resp.status).to.eq(200);
      });
  };

  describe('run authenticated', () => {
    before(() => {
      cy.login('EMPLOYEE_PLUS');
    });

    after(() => {
      cy.logout();
    });

    beforeEach(() => {
      cy.server();
    });

    it('ensure dcatd services', () => {
      const requests = [
        `${API_ROOT}/dcatd/openapi`

        // TODO - there is an incorrect header or something
        // `${API_ROOT}/dcatd/datasets?%2Fproperties%2Fdcat:
        //     theme%2Fitems=eq%3Dtheme:energie&limit=100&offset=0`,
      ];
      requests.forEach((requestUrl) => checkApiHealth(requestUrl));
    });

    it('ensure panorama services', () => {
      const requests = [
        `${API_ROOT}/panorama/recente_opnames/alle/TMX7316010203-000719_pano_0000_000950/`,
        `${API_ROOT}/panorama/thumbnail/?lat=52.375764&lon=4.8914344&width=438&radius=180`,
        `${API_ROOT}/panorama/thumbnail/?lat=52.375764&lon=4.8914344&width=240&radius=50`,
        `${API_ROOT}/panorama/thumbnail/TMX7316010203-000227_pano_0000_001568/?width=240&heading=156`
      ];
      requests.forEach((requestUrl) => checkApiHealth(requestUrl));
    });

    it('ensure typeahead services', () => {
      const requests = [
        `${API_ROOT}/typeahead?q=`
      ];
      requests.forEach((requestUrl) => checkApiHealth(requestUrl));
    });

    it('ensure dataselectie services', () => {
      const requests = [
        `${API_ROOT}/dataselectie/bag/?buurt_naam=AMC&dataset=ves&page=1&postcode=1105AZ&shape=%5B%5D`,
        `${API_ROOT}/dataselectie/hr/?bijzondere_rechtstoestand=Faillissement&buurt_naam=Amstel+III+deel+A%2FB+Noord&buurtcombinatie_naam=Amstel+III%2FBullewijk&dataset=ves&page=1&shape=%5B%5D`,
        `${API_ROOT}/dataselectie/brk/?buurt_naam=Amstelveldbuurt&dataset=ves&eigenaar_cat=Woningbouwcorporaties&eigenaar_type=Appartementseigenaar&ggw_naam=Centrum-Oost&page=1&shape=%5B%5D&stadsdeel_naam=Centrum`
      ];
      requests.forEach((requestUrl) => checkApiHealth(requestUrl));
    });

    it('ensure geosearch services', () => {
      const requests = [
        `${API_ROOT}/geosearch/nap/?lat=52.375764&lon=4.8914344&radius=25`,
        `${API_ROOT}/geosearch/atlas/?lat=52.375764&lon=4.8914344`,
        `${API_ROOT}/geosearch/munitie/?lat=52.375764&lon=4.8914344`,
        `${API_ROOT}/geosearch/bominslag/?lat=52.375764&lon=4.8914344&radius=25`,
        `${API_ROOT}/geosearch/monumenten/?lat=52.375764&lon=4.8914344&monumenttype=isnot_pand_bouwblok&radius=25`,
        `${API_ROOT}/geosearch/grondexploitatie/?lat=52.375764&lon=4.8914344`,
        `${API_ROOT}/geosearch/biz/?lat=52.375764&lon=4.8914344`
      ];
      requests.forEach((requestUrl) => checkApiHealth(requestUrl));
    });

    it('ensure grondexploitatie services', () => {
      const requests = [
        `${API_ROOT}/grondexploitatie/stadsdeel/A/`
      ];
      requests.forEach((requestUrl) => checkApiHealth(requestUrl));
    });

    it('ensure bag services', () => {
      const requests = [
        `${API_ROOT}/bag/nummeraanduiding/?pand=0363100012180422`,
        `${API_ROOT}/bag/pand/0363100012180422/`
      ];
      requests.forEach((requestUrl) => checkApiHealth(requestUrl));
    });

    it('ensure handelsregister services', () => {
      const requests = [
        `${API_ROOT}/handelsregister/vestiging/?pand=0363100012180422`
      ];
      requests.forEach((requestUrl) => checkApiHealth(requestUrl));
    });

    it('ensure monumenten services', () => {
      const requests = [
        `${API_ROOT}/monumenten/monumenten/?betreft_pand=0363100012180422`,
        `${API_ROOT}/monumenten/situeringen/?betreft_nummeraanduiding=0363200000268416`
      ];
      requests.forEach((requestUrl) => checkApiHealth(requestUrl));
    });

    it('ensure bbga services', () => {
      const requests = [
        `${API_ROOT}/bbga/cijfers/?gebiedcode15=A&jaar=latest&variabele=BEVHHMKIND_P`,
        `${API_ROOT}/bbga/meta/?variabele=BEVHHMKIND_P`
      ];
      requests.forEach((requestUrl) => checkApiHealth(requestUrl));
    });

    it('ensure gebieden services', () => {
      const requests = [
        `${API_ROOT}/gebieden/stadsdeel/03630000000018/`,
        `${API_ROOT}/gebieden/buurtcombinatie/?stadsdeel=03630000000018`
      ];
      requests.forEach((requestUrl) => checkApiHealth(requestUrl));
    });

    it('ensure brk services', () => {
      const requests = [
        `${API_ROOT}/brk/object-expand/?verblijfsobjecten__id=0363010000809818`,
        `${API_ROOT}/brk/subject/NL.KAD.Persoon.183189110/`,
        `${API_ROOT}/brk/zakelijk-recht/?kadastraal_subject=NL.KAD.Persoon.183189110`
      ];
      requests.forEach((requestUrl) => checkApiHealth(requestUrl));
    });

    it('ensure wkpb services', () => {
      const requests = [
        `${API_ROOT}/wkpb/brondocument/?beperking=3488`,
        `${API_ROOT}/wkpb/beperking/3488/`
      ];
      requests.forEach((requestUrl) => checkApiHealth(requestUrl));
    });
  });
});
