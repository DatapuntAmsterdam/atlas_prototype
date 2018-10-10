export const isStraatbeeldActive = (state) => Boolean(state.straatbeeld);
export const isHomePageActive = (state) => Boolean(state.page && state.page.name === 'home');
export const isMapFullscreen = (state) => Boolean(state.ui.isMapFullscreen);

export const getStraatbeeld = (state) => state.straatbeeld || {};
