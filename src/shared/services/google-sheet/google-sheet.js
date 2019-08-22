import marked from 'marked'
import { getByUri } from '../api/api'
import { ENVIRONMENTS, getEnvironment } from '../../environment'

export const cache = {} // local cache of parsed sheets

export const GOOGLE_SHEET_CMS = {
  // when to get CMS static data (daily refreshed) or dynamically direct from the sheet
  getStatic: {
    [ENVIRONMENTS.PRODUCTION]: true,
    [ENVIRONMENTS.PRE_PRODUCTION]: true,
    [ENVIRONMENTS.ACCEPTANCE]: false,
    [ENVIRONMENTS.DEVELOPMENT]: false,
  },
  // TODO DP-6908 replace this to files.data.amsterdam.nl/cms when made available
  staticAddress: '/cms_local',
  key: '1ZExuZHhmvBRP-7rhuY43Lv7dWuAsGKXwfKd1_3BZfbI',
  index: {
    news: 1,
    beleid: 2,
    help: 3,
    snelwegwijs: 4,
    apis: 5,
    proclaimer: 6,
    info: 7,
    inloggen: 8,
    statistieken: 9,
    verplaatst: 10,
    nietgevonden: 11,
    // important when change/add index: don't forget to update the
    // jenkins import script: Imports/job/Imports/job/Import_CMS/
  },
}

function getStaticSheet(key, index) {
  // The 'static' version of the sheet is accessed by url
  // The contents is refreshed on a daily basis or on demand by a curl script that is run by Jenkins
  // Like curl https://spreadsheets.google.com/feeds/list/$KEY/$INDEX/public/basic?alt=json > [somefile]
  // No params, no cancel promise, don't send the user token along with the request
  return getByUri(`${GOOGLE_SHEET_CMS.staticAddress}/${key}.${index}.json`)
}

function getDynamicSheet(key, index) {
  // The 'dynamic' version of the sheet is accessed by calling a Google script from the head
  // of the document. The script accepts a callback method to receive the contents in json format
  const promise = new Promise(resolve => {
    const callbackId = key.replace('-', '_')
    const callbackName = `googleScriptCallback_${callbackId}_${index}`

    // istanbul ignore next
    window[callbackName] = contents => resolve(contents)

    // Create the script
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://spreadsheets.google.com/feeds/list/${key}/${index}/public/basic?alt=json-in-script&callback=${callbackName}`
    document.head.appendChild(script)
  })

  return promise
}

function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function camelCase(identifier) {
  return identifier
    .split('-')
    .reduce((whole, part) => whole + (whole ? uppercaseFirst(part) : part), '')
}

export function parseContents(contents) {
  const isDateValue = /(\d{1,2})-(\d{1,2})-(\d{4})/
  const isDateKey = /datum/i
  const isHref = /^(\[link |<a href=)/
  // Set feed properties
  const feed = {
    title: contents.feed.title.$t,
    lastUpdated: contents.feed.updated.$t,
  }

  // Extract entries
  const entries = contents.feed.entry.map((entry, id) =>
    entry.content.$t // 'attr-x: value, attr-y: value, ...'
      .replace(/^attr-/, '') // 'x: value, attr-y: value, ...'
      .split(/, attr-/) // ['x:value', 'y:value', ...]
      .map(keyValue => keyValue.split(/: ([^]*)/)) // [[x, value], [y, value], ...]
      .reduce(
        (item, [key, value]) => {
          // { id: 'item0', x: { value: value, ... }, y: {...}, ...}
          const camelKey = camelCase(key)
          const result = item
          if (typeof value !== 'undefined') {
            result[camelKey] = {
              value,
              html: marked(value),
              isHref: Boolean(value.match(isHref)),
              isDate: Boolean(value.match(isDateValue) && key.match(isDateKey)),
            }
            if (result[camelKey].isDate) {
              const match = isDateValue.exec(value)
              result[camelKey].date = new Date(match[3], match[2] - 1, match[1])
            }
          }
          return result
        },
        {
          id: `item${id}`,
        },
      ),
  )

  return {
    feed,
    entries,
  }
}

export default function getContents(type) {
  const promise = new Promise(async resolve => {
    const { key } = GOOGLE_SHEET_CMS
    const index = GOOGLE_SHEET_CMS.index[type]
    const getSheet = GOOGLE_SHEET_CMS.getStatic[getEnvironment(window.location.host)]
      ? getStaticSheet
      : getDynamicSheet

    if (cache[key] && cache[key][index]) {
      resolve(cache[key][index]) // resolves to the value or the promise
    } else {
      cache[key] = cache[key] || {}
      let result = {
        feed: {
          title: '',
        },
        entries: [],
      }
      const contents = await getSheet(key, index)
      if (contents) {
        result = parseContents(contents)
      }

      cache[key][index] = result
      resolve(cache[key][index])
    }
  })

  return promise
}
