export function getByName(scientificName) {
  const url = 'http://www.marinespecies.org/rest/AphiaRecordsByName/' + scientificName.trim() + '?like=true&marine_only=false'
  return fetch(url)
    .then((res) => res.text())
    .then((text) => text.length ? JSON.parse(text) : [])
}

export function getById(scientificNameId) {
  const id = scientificNameId.split(':').pop()
  const url = 'http://www.marinespecies.org/rest/AphiaRecordByAphiaID/' + id
  return fetch(url)
    .then((res) => res.text())
    .then((text) => text.length ? JSON.parse(text) : {})
}

export function isScientificNameId(param) {
  return !!param && param.split(':').length > 0 && /^\d+$/.test(param.split(':').pop())
}
