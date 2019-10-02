const hasTouchCapabilities = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0

export default hasTouchCapabilities
