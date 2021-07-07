const STORAGE_KEY = 'features'

/**
 * Get a list of all features currently enabled.
 */
export function getEnabledFeatures() {
  const enabledFeaturesRaw = localStorage.getItem(STORAGE_KEY)
  const enabledFeatures = enabledFeaturesRaw ? parseFeatures(enabledFeaturesRaw) : []

  return enabledFeatures
}

/**
 * Check if a specific feature is enabled.
 * @param featureName The name of the feature.
 */
export function isFeatureEnabled(featureName: string) {
  return getEnabledFeatures().includes(featureName)
}

/**
 * Enable the specified feature.
 * @param featureName The name of the feature to enable.
 */
export function enableFeature(featureName: string) {
  const features = getEnabledFeatures()

  if (!features.includes(featureName)) {
    features.push(featureName)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(features))
}

/**
 * Disable the specified feature.
 * @param featureName The name of the feature to disable.
 */
export function disableFeature(featureName: string) {
  const features = getEnabledFeatures().filter((name) => name !== featureName)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(features))
}

function parseFeatures(rawValue: string) {
  try {
    const parsedValue = JSON.parse(rawValue)

    if (Array.isArray(parsedValue)) {
      return parsedValue
    }
  } catch (error) {
    return []
  }

  return []
}
