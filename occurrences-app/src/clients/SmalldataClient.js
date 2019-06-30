import { mapOccurrenceToDwca } from './SmalldataConverters'

export async function getDatasets() {
  const response = await fetch('/api/datasets')
    .then(response => response.json())
  return response.map(renameRefToId)
}

export function renameRefToId({ ref, ...rest }) {
  return ({ id: ref, ...rest })
}

export async function getOccurrences({ userRef }) {
  return await fetch(`/api/dwca/user/${userRef}/records?projectFields=dwcRecord.tdwg.scientificName&projectFields=dwcRecord.tdwg.eventDate`)
    .then(response => response.json())
}

export async function getOccurrence({ datasetId, dwcaId, userRef }) {
  return fetch(`/api/dwca/${datasetId}/user/${userRef}/records/${encodeURIComponent(dwcaId)}`)
    .then(response => response.json())
}

export async function updateOccurrence({ datasetId, occurrence, dwcaId, userRef }) {
  const request = mapOccurrenceToDwca(occurrence)
  const url = `/api/dwca/${datasetId}/user/${userRef}/records/${encodeURIComponent(dwcaId)}`
  return await fetch(url, {
    method:  'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body:    JSON.stringify(request)
  }).then(response => response.json())
}

export async function createOccurrence({ occurrence, userRef }) {
  const request = mapOccurrenceToDwca(occurrence)
  const url = `/api/dwca/${occurrence.dataset.id}/user/${userRef}/records`
  return await fetch(url, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:    JSON.stringify(request)
  }).then(response => response.json())
}
