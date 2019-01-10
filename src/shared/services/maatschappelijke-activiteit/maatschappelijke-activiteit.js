import { getByUrl } from '../api/api';

export default function fetchByUri(uri) {
  return getByUrl(uri);
}
