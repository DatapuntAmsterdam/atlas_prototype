import getContents, { cache, GOOGLE_SHEET_CMS } from './google.sheet';
import * as api from '../api/api';
import * as environments from '../../environment';

const mockedDate = new Date(2017, 11, 10);
const originalDate = Date;
global.Date = jest.fn(() => mockedDate);
global.Date.UTC = originalDate.UTC;

const result = {
  entries: [
    {
      contents: {
        html: '<p>[link link](http://link/)</p>',
        isDate: false,
        isHref: true,
        value: '[link link](http://link/)'
      },
      datum: {
        date: new Date(Date.UTC(2016, 11, 32, -1, 0, 0)),
        html: '<p>1-1-2017</p>',
        isDate: true,
        isHref: false,
        value: '1-1-2017'
      },
      id: 'item0',
      titel: {
        html: '<p>titel1</p>',
        isDate: false,
        isHref: false,
        value: 'titel1'
      }
    },
    {
      datum: {
        date: new Date(Date.UTC(2017, 0, 10, -1, 0, 0)),
        html: '<p>10-1-2017</p>',
        isDate: true,
        isHref: false,
        value: '10-1-2017'
      },
      id: 'item1',
      titel: {
        html: '<p>titel2</p>',
        isDate: false,
        isHref: false,
        value: 'titel2'
      },
      verkorteTitel: {
        html: '<p><a href="http://link/">link</a></p>',
        isDate: false,
        isHref: true,
        value: '<a href="http://link/">link</a>'
      }
    },
    {
      datum: {
        date: new Date(Date.UTC(2017, 10, 31, -1, 0, 0)),
        html: '<p>1-12-2017</p>',
        isDate: true,
        isHref: false,
        value: '1-12-2017'
      },
      id: 'item2',
      titel: {
        html: '<p>titel3</p>',
        isDate: false,
        isHref: false,
        value: 'titel3'
      },
      verkorteTitel: {
        html: '<p>short3</p>',
        isDate: false,
        isHref: false,
        value: 'short3'
      }
    },
    {
      datum: {
        date: new Date(Date.UTC(2017, 11, 12, -1, 0, 0)),
        html: '<p>12-12-2017</p>',
        isDate: true,
        isHref: false,
        value: '12-12-2017'
      },
      id: 'item3',
      verkorteTitel: {
        html: '<p>See [link link](http://link/)</p>',
        isDate: false,
        isHref: false,
        value: 'See [link link](http://link/)'
      }
    }
  ],
  feed: {
    lastUpdated: '2020-01-15T12:30:45.000Z',
    title: 'My title'
  }
};
jest.mock('marked', () => ((val) => `<p>${val}</p>`));

const response = {
  feed: {
    updated: {
      $t: '2020-01-15T12:30:45.000Z'
    },
    title: {
      $t: 'My title'
    },
    entry: [
      {
        title: {
          $t: 'entry1'
        },
        content: {
          $t: 'attr-datum: 1-1-2017, attr-titel: titel1, attr-contents: [link link](http://link/)'
        }
      },
      {
        title: {
          $t: 'entry2'
        },
        content: {
          $t: 'attr-datum: 10-1-2017, attr-titel: titel2, ' +
            'attr-verkorte-titel: <a href="http://link/">link</a>'
        }
      },
      {
        title: {
          $t: 'entry3'
        },
        content: {
          $t: 'attr-datum: 1-12-2017, attr-titel: titel3, attr-verkorte-titel: short3'
        }
      },
      {
        title: {
          $t: 'entry4'
        },
        content: {
          $t: 'attr-datum: 12-12-2017, attr-titel:, ' +
            'attr-verkorte-titel: See [link link](http://link/)'
        }
      }

    ]
  }
};

describe('The google sheet factory', () => {
  describe('The static variant', () => {
    beforeEach(() => {
      environments.getEnvironment = jest.fn().mockReturnValue('PRODUCTION');
    });

    afterEach(() => {
      delete cache[GOOGLE_SHEET_CMS.key];
    });

    it('builds a URL and calls getByUrl with it', () => {
      api.getByUrl = jest.fn(() => Promise.resolve());
      getContents('beleid');
      expect(api.getByUrl).toHaveBeenCalledWith(`https://data.amsterdam.nl/cms/${GOOGLE_SHEET_CMS.key}.${GOOGLE_SHEET_CMS.index.beleid}.json`, null, null, false);
    });

    it('uses the cached value if loaded twice', async () => {
      api.getByUrl = jest.fn(() => Promise.resolve());
      await getContents('beleid');
      await getContents('beleid');
      expect(api.getByUrl).toHaveBeenCalledTimes(1);
    });

    it('returns an empty feed when the get fails', async () => {
      api.getByUrl = jest.fn(() => Promise.reject());

      const contents = await getContents('unknown type');

      expect(contents).toEqual({
        feed: {
          title: ''
        },
        entries: []
      });
    });
  });

  describe('The dynamic variant is the default variant', () => {
    const keyWithUnderscores = GOOGLE_SHEET_CMS.key.replace('-', '_');
    const callbackName = `googleScriptCallback_${keyWithUnderscores}_${GOOGLE_SHEET_CMS.index.beleid}`;

    beforeEach(() => {
      environments.getEnvironment = jest.fn().mockReturnValue('DEVELOPMENT');
    });

    it('puts a scripts in the document header to load the sheet contents', () => {
      getContents('beleid');
      const expectedResult = `<script type="text/javascript" src="https://spreadsheets.google.com/feeds/list/${GOOGLE_SHEET_CMS.key}/${GOOGLE_SHEET_CMS.index.beleid}/public/basic?alt=json-in-script&amp;callback=${callbackName}"></script>`;
      expect(document.head.innerHTML).toContain(expectedResult);
    });
  });

  describe('The contents parser', () => {
    beforeEach(() => {
      environments.getEnvironment = jest.fn().mockReturnValue('PRODUCTION');
    });

    it('processes the global feed properties', async () => {
      api.getByUrl = jest.fn(() => Promise.resolve(response));
      await getContents('beleid');
      expect(cache).toMatchObject({
        [GOOGLE_SHEET_CMS.key]: {
          [GOOGLE_SHEET_CMS.index.beleid]: result
        }
      });
    });
  });
});
