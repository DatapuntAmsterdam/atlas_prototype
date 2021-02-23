export default function isFeatureEnabled(featureName: string) {
  const enabledFeaturesRaw = window.localStorage.getItem('features')
  const enabledFeatures = enabledFeaturesRaw ? parseFeatures(enabledFeaturesRaw) : []

  return enabledFeatures.includes(featureName)
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
