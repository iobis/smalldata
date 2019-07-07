import { mapOccurrenceToDwca } from './SmalldataConverters'

export async function getDatasets() {
  const response = await fetch('/api/datasets', {
    headers: {
      'Authorization': 'Basic verysecret'
    }
  }).then(response => response.json())
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

export async function findLatestOccurrence({ userRef }) {
  const occurrences = await getOccurrences({ userRef })
  const latest = occurrences
    .filter(dwca => !!dwca.addedAtInstant)
    .sort((left, right) => left.addedAtInstant < right.addedAtInstant ? 1 : -1)[0]
  return await getOccurrence({ userRef, dwcaId: latest.dwcaId, datasetId: latest.dataset })
}

export async function updateOccurrence({ occurrence, userRef, dwcaId }) {
  const request = mapOccurrenceToDwca(occurrence)
  const url = `/api/dwca/${occurrence.dataset.id}/user/${userRef}/records/${encodeURIComponent(dwcaId)}`
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

export async function getUsers() {
  return fetch('/api/users', {
    headers: {
      'Authorization': 'Basic verysecret'
    }
  }).then(response => response.json())
}

export async function getUsersWithDatasets() {
  const [users, datasets] = await Promise.all([getUsers(), getDatasets()])
  const datasetIdToDataset = groupBy(datasets, 'id')
  return users.map(user => {
    const datasets = user['dataset_refs'].map(datasetRef => datasetIdToDataset[datasetRef][0])
    return { ...user, datasets }
  })
}

function groupBy(list, props) {
  return list.reduce((a, b) => {
    (a[b[props]] = a[b[props]] || []).push(b)
    return a
  }, {})
}