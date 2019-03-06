import { getByUrl } from '../api/api';

export default function fetchByUri(uri) {
  return getByUrl(uri)
    .then((result) => ({
      label: result._display,
      category: (result.categorie_naam) ? `${result.categorie_naam} (${result.categorie})` : null,
      geometrie: result.wkb_geometry
    }));
}
