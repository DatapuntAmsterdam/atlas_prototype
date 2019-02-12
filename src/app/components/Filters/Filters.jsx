import { dateToString } from '../../../shared/services/date-formatter/date-formatter';

export const aggregateFilter = (input) => {
  const result = input.reduce((aggregation, value) => {
    const counter = aggregation.find((item) => item.name === value);

    if (counter) {
      counter.count += 1;
    } else {
      aggregation.push({
        name: value,
        count: 1
      });
    }

    return aggregation;
  }, []);

  return result.sort((a, b) => {
    if (a.count === b.count) {
      return a.name && b.name ? a.name.localeCompare(b.name) : -1;
    }
    return b.count - a.count;
  });
};

export const alignRightFilter = (input) => `<div class='u-align--right'>${input}</div>`;

export const bagAddressFilter = (input) => {
  const nummer = input.huisnummer + input.huisletter;
  const fullNummer = nummer + (input.huisnummer_toevoeging ? `-${input.huisnummer_toevoeging}` : '');

  // eslint-disable-next-line no-underscore-dangle
  return `${input._openbare_ruimte_naam} ${fullNummer}`;
};

export const dateFilter = (input) => {
  if (!input) return '';
  const date = new Date(input);
  return date && dateToString(date);
};

// Only return the address to form the label. The `non_mailing`
// indicatie will be used in the template as a condition however.
export const hrBezoekAdresFilter = (input) => input.bezoekadres_volledig_adres;

export const kebapCaseFilter = (input) => (
  (input) ? input.toLowerCase().replace(/[: ][ ]*/g, '-') : ''
);

export const ucFirst = (input) => input.substring(0, 1).toUpperCase() + input.substring(1);

export const modificationDateFilter = (input) => {
  if (typeof input === 'string') {
    const last = new Date(input);
    const now = new Date(Date.now());

    let ago = now - last;
    const daysToMiliseconds = 1000 * 60 * 60 * 24;

    if (ago >= 2 * length) {
      ago = Math.floor(ago / daysToMiliseconds);
      ago = (ago === 0) ? 'vandaag' : (ago === 1) ? 'gisteren' : `${ago} dagen geleden`;
    } else {
      ago = 'in de toekomst';
    }

    return `${ago} gewijzigd`;
  }
  return input;
};

export const nevenadresFilter = (hoofdadres) => {
  const isNevenadres = String(hoofdadres).toLowerCase() === 'false';

  return isNevenadres ? '(nevenadres)' : '';
};

export const nummerAanduidingTypeFilter = (input) => {
  let type;

  if (input.ligplaats_id) {
    type = 'ligplaats';
  } else if (input.standplaats_id) {
    type = 'standplaats';
  }

  return type ? `(${type})` : '';
};

export const truncateHtmlAsTextFilter = (input, maxLength = 250) => {
  const ELLIPSES = '...';
  const TRAILING_WHITESPACE = /\s+$/;

  if (typeof input === 'string') {
    // Remove HTML code
    let truncated = input.replace(/<[^>]+>/gm, '');
    // Remove trailing white space
    truncated = truncated.replace(TRAILING_WHITESPACE, '');
    if (truncated.length > maxLength) {
      // truncate srting but leave space for ellipses
      truncated = truncated.substr(0, maxLength - ELLIPSES.length);
      // truncate on last space(s)
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace >= 0) {
        truncated = truncated
          .substr(0, lastSpace)
          .replace(TRAILING_WHITESPACE, '');
      }
      truncated += ELLIPSES;
    }
    return truncated;
  }

  return input;
};

export const verblijfsObjectGevormdFilter = (statusId) => {
  const VERBLIJFSOBJECT_GEVORMD = 18;
  const isVerblijfsobjectGevormd = Number(statusId) === VERBLIJFSOBJECT_GEVORMD;

  return isVerblijfsobjectGevormd ? '(verblijfsobject gevormd)' : '';
};

export const zipCodeFilter = (input) => {
  // Only touch valid Dutch zip codes, leave all other input unchanged
  if (input && input.match(/^[1-9][0-9]{3}[a-zA-Z]{2}$/)) {
    return `${input.substr(0, 4)} ${input.substr(4, 2).toUpperCase()}`;
  }
  return input;
};
