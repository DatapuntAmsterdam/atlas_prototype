import apiUrl from '../../shared/services/api';
import { getByUrl } from '../../shared/services/api/api';

export default function fetchFilters() {
  return getByUrl(`${apiUrl}dcatd/openapi`);
}
