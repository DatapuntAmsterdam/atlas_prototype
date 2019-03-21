import { getUserScopes, userIsAuthenticated } from '../../../shared/ducks/user/user';
import { isEmbedded, isEmbedPreview, isPrintMode } from '../../../shared/ducks/ui/ui';

const CONSTANTS = {
  DIMENSION3: {
    ID: 3,
    AUTHENTICATED: true,
    UNAUTHENTICATED: false
  },
  DIMENSION4: {
    ID: 4,
    UNDEFINED: null
  },
  DIMENSION5: {
    ID: 5,
    PRINT: 'print',
    EMBED: 'embed'
  }
};

export const authCustomDimensions = (state) => {
  const authenticated = (userIsAuthenticated(state))
    ? CONSTANTS.DIMENSION3.AUTHENTICATED : CONSTANTS.DIMENSION3.UNAUTHENTICATED;
  const scopes = (authenticated) ? getUserScopes(state) : [];

  let role = CONSTANTS.DIMENSION4.UNDEFINED;
  if (scopes.length > 0) {
    role = scopes.sort().join('|');
  }

  return [
    { id: CONSTANTS.DIMENSION3.ID, value: authenticated }, // customDimension = 'Authenticated'
    { id: CONSTANTS.DIMENSION4.ID, value: role } // customDimension = 'Role'
  ];
};

export const viewCustomDimensions = (query = {}, state) => {
  const embedView = (!!query.embed || isEmbedded(state) || isEmbedPreview(state))
    ? CONSTANTS.DIMENSION5.EMBED : false;
  const printView = (!!query.print || isPrintMode(state)) ? CONSTANTS.DIMENSION5.PRINT : false;

  return [
    { id: CONSTANTS.DIMENSION5.ID, value: embedView || printView } // customDimension = 'Version'
  ];
};
