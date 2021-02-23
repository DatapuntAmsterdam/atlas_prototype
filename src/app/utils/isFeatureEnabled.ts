export default function isFeatureEnabled(featureName: string) {
  const enabledFeaturesRaw = window.localStorage.getItem('features')
  const enabledFeatures = enabledFeaturesRaw ? (JSON.parse(enabledFeaturesRaw) as string[]) : []

  return enabledFeatures.includes(featureName)
}
