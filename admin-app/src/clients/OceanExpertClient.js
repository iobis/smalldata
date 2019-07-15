export function getByExpertByName(name) {
  const defaultResult = []
  if (!name || !name.trim()) return defaultResult
  const url = 'https://www.oceanexpert.net/api/v1/advanceSearch/search.json?action=browse&type=all&query=' + name.trim()
  return fetch(url)
    .then(response => response.json())
    .then(json => (json.results.data || []).filter(record => !!record.name && record.type === 'experts'))
}
