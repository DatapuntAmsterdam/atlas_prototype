export default {
    STRAATBEELD_ENDPOINT_PREFIX: 'panorama/panoramas',
    STRAATBEELD_ENDPOINT_SUFFIX: 'adjacencies',
    DEFAULT_FOV: 80,
    MAX_FOV: 90,
    MAX_RADIUS: 22,
    LARGE_RADIUS: 100000,
    MAX_RESOLUTION: 12 * 1024,
    SRID: 4326, // For latitude, longitude
    CAMERA_HEIGHT: 1.8,
    LEVEL_PROPERTIES_LIST: [
        {
            tileSize: 256,
            size: 256,
            fallbackOnly: true
        },
        {
            tileSize: 512,
            size: 512
        },
        {
            tileSize: 512,
            size: 1024
        },
        {
            tileSize: 512,
            size: 2048
        }
    ]
};
