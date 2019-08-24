export function getProperty(selectorFn, defaultValue) {
  try {
    const value = selectorFn()
    return value === null || value === undefined ? defaultValue : value
  } catch (e) {
    return defaultValue
  }
}
