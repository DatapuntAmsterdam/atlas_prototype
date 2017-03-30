module.exports = {
    'DATA-SELECTION--CARDS': {
        url: '#?mpv=52.3731081:4.8932945&mpb=topografie&mpz=11&dsv=CARDS&dsd=catalogus&dsp=1',
        validator: require('../validators/data-selection--cards')
    },
    'DATA-SELECTION--TABLE': {
        url: '#?mpv=52.3731081:4.8932945&mpb=topografie&mpz=11&dsv=TABLE&dsd=bag&dsp=1',
        validator: require('../validators/data-selection--table')
    },
    'DETAIL': {
        url: '#?mpv=52.3731081:4.8932945&mpb=topografie&mpz=11&' +
             'dte=https:%2F%2Fapi.datapunt.amsterdam.nl%2Fcatalogus%2Fapi%2F3%2Faction%2F' +
             'package_show%3Fid%3D642f15c7-8368-4795-9e3d-1a87fa7e562a&dtfs=T',
        validator: require('../validators/detail')
    },
    'LAYER-SELECTION_MAP': {
        url: '#?lse=T&mpb=topografie&mpz=11&mpfs=T&mpv=52.3731081:4.8932945&pgn=home',
        validator: require('../validators/layer-selection_map')
    },
    'MAP': {
        url: '#?mpb=topografie&mpz=11&mpfs=T&mpv=52.3731081:4.8932945&pgn=home',
        validator: require('../validators/map')
    },
    'MAP_DATA-SELECTION': {
        url: '#?mpv=52.3731081:4.8932945&mpb=topografie&mpz=11&dsv=LIST&dsd=hr&dsp=1',
        validator: require('../validators/map_data-selection')
    },
    'MAP_DETAIL--NUMMERAANDUIDING': {
        url: '#?mpv=52.353263440372224:5.001382398402873&mpb=topografie&mpz=16&' +
             'dte=https:%2F%2Fapi.datapunt.amsterdam.nl%2Fbag%2Fnummeraanduiding%2F03630000500149%2F',
        validator: require('../validators/map_detail--nummeraanduiding')
    },
    'SEARCH-RESULTS--CATEGORY': {
        url: '#?mpb=topografie&mpz=11&mpv=52.3731081:4.8932945&src=adres&srq=dam&srfs=T',
        validator: require('../validators/search-results--category')
    },
    'MAP_SEARCH-RESULTS--LOCATION': {
        url: '#?mpb=topografie&mpz=11&mpv=52.3729183:4.8931775&srl=ZRVst:3JJOB',
        validator: require('../validators/map_search-results--location')
    },
    'SEARCH-RESULTS--QUERY': {
        url: '#?srq=Oost&srfs=T&mpv=52.3731081:4.8932945&mpb=topografie&mpz=11',
        validator: require('../validators/search-results--query')
    },
    'MAP_STRAATBEELD--DETAIL': {
        url: '#?dte=https:%2F%2Fapi.datapunt.amsterdam.nl%2Fbag%2Fnummeraanduiding%2F03630000500149%2F&' +
             'mpb=topografie&mpz=16&mpv=52.3532634:5.0013828&sbf=Cu&sbh=4W&' +
             'sbi=TMX7315120208-000068_pano_0002_000405&sbl=ZQgX9:3Nqgu',
        validator: require('../validators/map_straatbeeld')
    },
    'MAP_STRAATBEELD--PAGE': {
        url: '#?mpb=topografie&mpz=11&mpv=52.3731081:4.8932945&pgn=home&sbf=5e&sbh=-Lc&sbi=TMX7315120208-000068_pano_' +
             '0002_000405&sbl=ZQgX9:3Nqgu',
        validator: require('../validators/map_straatbeeld')
    },
    'MAP_STRAATBEELD--SEARCH-RESULTS': {
        url: '#?mpb=topografie&mpz=11&mpv=52.3729183:4.8931775&sbf=Cu&sbh=-76&' +
             'sbi=TMX7315120208-000073_pano_0005_000446&sbl=ZRVst:3JJOB',
        validator: require('../validators/map_straatbeeld')
    },
    'PAGE--HOME': {
        url: '',
        validator: require('../validators/page--home')
    },
    'STRAATBEELD--DETAIL': {
        url: '#?dte=https:%2F%2Fapi.datapunt.amsterdam.nl%2Fbag%2Fnummeraanduiding%2F03630000500149%2F&' +
             'mpb=topografie&mpz=16&mpv=52.3531791:5.00131&sbf=Cu&sbfs=T&sbh=4W&' +
             'sbi=TMX7315120208-000068_pano_0002_000405&sbl=ZQgX9:3Nqgu',
        validator: require('../validators/straatbeeld')
    },
    'STRAATBEELD--PAGE': {
        url: '#?mpb=topografie&mpz=11&mpv=52.3731081:4.8932945&pgn=home&sbf=5e&sbfs=T&sbh=-Lc&sbi=TMX7315120208-00006' +
             '8_pano_0002_000405&sbl=ZQgX9:3Nqgu',
        validator: require('../validators/straatbeeld')
    },
    'STRAATBEELD--SEARCH-RESULTS': {
        url: '#?mpb=topografie&mpz=11&mpv=52.3729183:4.8931775&sbf=Cu&sbfs=T&sbh=Ni&' +
             'sbi=TMX7315120208-000073_pano_0005_000446&sbl=ZRVst:3JJOB',
        validator: require('../validators/straatbeeld')
    }
};
