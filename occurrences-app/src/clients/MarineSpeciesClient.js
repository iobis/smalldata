export function getByName(scientificName) {
  const defaultResult = []
  if (!scientificName || !scientificName.trim()) return defaultResult
  const url = 'http://www.marinespecies.org/rest/AphiaRecordsByName/' + scientificName.trim() + '?like=true&marine_only=false'
  return fetch(url)
    .then((res) => res.text())
    .then((text) => text.length ? JSON.parse(text) : defaultResult)
}

export function getById(scientificNameId) {
  const defaultResult = {}
  if (!scientificNameId) return defaultResult
  const id = scientificNameId.split(':').pop()
  const url = 'http://www.marinespecies.org/rest/AphiaRecordByAphiaID/' + id
  return fetch(url)
    .then((res) => res.text())
    .then((text) => text.length ? JSON.parse(text) : defaultResult)
}

export function isScientificNameId(param) {
  return !!param && param.split(':').length > 0 && /^\d+$/.test(param.split(':').pop())
}
