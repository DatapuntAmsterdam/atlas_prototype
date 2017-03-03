module.exports = {
    'DATA-SELECTION--CARDS': {
        url: '#?mpv=52.3719:4.9012&mpb=topografie&mpz=9&dsv=CARDS&dsd=catalogus&dsp=1',
        validator: require('../validators/data-selection--cards')
    },
    'DATA-SELECTION--TABLE': {
        url: '#?mpv=52.3719:4.9012&mpb=topografie&mpz=9&dsv=TABLE&dsd=bag&dsp=1',
        validator: require('../validators/data-selection--table')
    },
    'DETAIL': {
        url: '#?mpv=52.3719:4.9012&mpb=topografie&mpz=9&' +
             'dte=https:%2F%2Fapi.datapunt.amsterdam.nl%2Fcatalogus%2Fapi%2F3%2Faction%2F' +
             'package_show%3Fid%3D642f15c7-8368-4795-9e3d-1a87fa7e562a&dtfs=T',
        validator: require('../validators/detail')
    },
    'LAYER-SELECTION_MAP': {
        url: '#?mpv=52.3719:4.9012&mpb=topografie&mpz=9&lse=T&pgn=home',
        validator: require('../validators/layer-selection_map')
    },
    'MAP': {
        url: '#?mpv=52.3719:4.9012&mpb=topografie&mpz=9&mpfs=T&pgn=home',
        validator: require('../validators/map')
    },
    'MAP_DATA-SELECTION': {
        url: '#?mpv=52.3719:4.9012&mpb=topografie&mpz=9&dsv=LIST&dsd=hr&dsp=1',
        validator: require('../validators/map_data-selection')
    },
    'MAP_DETAIL--KADASTRAAL-OBJECT': {
        url: '#?dte=https:%2F%2Fapi.datapunt.amsterdam.nl%2Fbrk%2Fobject%2FNL.KAD.OnroerendeZaak.11820015470000%2F&mp' +
            'b=topografie&mpz=13&mpv=52.3530715:5.0008373',
        validator: require('../validators/map_detail--kadastraal-object')
    },
    'MAP_DETAIL--KADASTRAAL-SUBJECT-NATUURLIJK-PERSOON': {
        url: '#?dte=https:%2F%2Fapi.datapunt.amsterdam.nl%2Fbrk%2Fsubject%2FNL.KAD.Persoon.304757725%2F&mpb=topografi' +
        'e&mpz=9&mpv=52.3719:4.9012',
        validator: require('../validators/map_detail--kadastraal-subject')
    },
    'MAP_DETAIL--KADASTRAAL-SUBJECT-NIET-NATUURLIJK-PERSOON': {
        url: '#?dte=https:%2F%2Fapi.datapunt.amsterdam.nl%2Fbrk%2Fsubject%2FNL.KAD.Persoon.172031668%2F&mpb=topografi' +
             'e&mpz=16&mpv=52.3408374:4.9044968',
        validator: require('../validators/map_detail--kadastraal-subject')
    },
    'MAP_DETAIL--NUMMERAANDUIDING': {
        url: '#?mpv=52.353263440372224:5.001382398402873&mpb=topografie&mpz=16&' +
        'dte=https:%2F%2Fapi.datapunt.amsterdam.nl%2Fbag%2Fnummeraanduiding%2F03630000500149%2F',
        validator: require('../validators/map_detail--nummeraanduiding')
    },
    'MAP_DETAIL--VERBLIJFSOBJECT': {
        url: '#?dte=https:%2F%2Fapi.datapunt.amsterdam.nl%2Fbag%2Fverblijfsobject%2F03630001024765%2F&mpb=topografie&' +
            'mpz=16&mpv=52.3532641:5.0013824',
        validator: require('../validators/map_detail--verblijfsobject')
    },
    'MAP_PAGE--HOME': {
        url: '',
        validator: require('../validators/map_page--home')
    },
    'MAP_PAGE--LOGIN': {
        url: '#?mpv=52.3719:4.9012&mpb=topografie&mpz=9&pgn=login',
        validator: require('../validators/map_page--login')
    },
    'MAP_SEARCH-RESULTS--LOCATION': {
        url: '#?mpb=topografie&mpz=9&mpv=52.3729183:4.8931775&srl=ZRVst:3JJOB',
        validator: require('../validators/map_search-results--location')
    },
    'MAP_SEARCH-RESULTS--QUERY': {
        url: '#?srq=Oost&mpv=52.3719:4.9012&mpb=topografie&mpz=9',
        validator: require('../validators/map_search-results--query')
    },
    'MAP_STRAATBEELD--DETAIL': {
        url: '#?dte=https:%2F%2Fapi.datapunt.amsterdam.nl%2Fbag%2Fnummeraanduiding%2F03630000500149%2F&' +
             'mpb=topografie&mpz=16&mpv=52.3532634:5.0013828&sbf=Cu&sbh=4W&' +
             'sbi=TMX7315120208-000068_pano_0002_000405&sbl=ZQgX9:3Nqgu',
        validator: require('../validators/map_straatbeeld--detail')
    },
    'MAP_STRAATBEELD--SEARCH-RESULTS': {
        url: '#?mpb=topografie&mpz=9&mpv=52.3729183:4.8931775&sbf=Cu&sbh=-76&' +
             'sbi=TMX7315120208-000073_pano_0005_000446&sbl=ZRVst:3JJOB',
        validator: require('../validators/map_straatbeeld--search-results')
    },
    'STRAATBEELD--DETAIL': {
        url: '#?dte=https:%2F%2Fapi.datapunt.amsterdam.nl%2Fbag%2Fnummeraanduiding%2F03630000500149%2F&' +
             'mpb=topografie&mpz=16&mpv=52.3531791:5.00131&sbf=Cu&sbfs=T&sbh=4W&' +
             'sbi=TMX7315120208-000068_pano_0002_000405&sbl=ZQgX9:3Nqgu',
        validator: require('../validators/straatbeeld--detail')
    },
    'STRAATBEELD--SEARCH-RESULTS': {
        url: '#?mpb=topografie&mpz=9&mpv=52.3729183:4.8931775&sbf=Cu&sbfs=T&sbh=Ni&' +
             'sbi=TMX7315120208-000073_pano_0005_000446&sbl=ZRVst:3JJOB',
        validator: require('../validators/straatbeeld--search-results')
    }
};
