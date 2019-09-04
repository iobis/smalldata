import { mapOccurrenceToDwca, mapUiDatasetToRequest } from './SmalldataConverters'

let apiRoot = '/api/'
let headers = {
  'Content-Type': 'application/json'
}

export function init(props = {}) {
  apiRoot = props.apiRoot || apiRoot
}

export function setSecurityToken(securityToken) {
  headers = { ...{ Authorization: 'Bearer ' + securityToken }, ...headers }
}

export function deleteSecurityToken() {
  const { Authorization, ...rest } = headers
  headers = rest
}

export async function getDatasets() {
  const response = await fetch(apiRoot + 'datasets', { headers })
    .then(response => response.json())
  return response.map(renameRefToId)
}

export async function createDataset(dataset) {
  const request = mapUiDatasetToRequest(dataset)
  return await fetch(apiRoot + 'datasets', {
    method: 'POST',
    headers,
    body:   JSON.stringify(request)
  }).then(response => response.json())
}

export async function updateDataset(dataset, datasetId) {
  const request = mapUiDatasetToRequest(dataset)
  const url = apiRoot + `datasets/${datasetId}`
  return await fetch(url, {
    method: 'PUT',
    headers,
    body:   JSON.stringify(request)
  }).then(response => response.json())
}

export async function getOccurrences({ userRef }) {
  const query = 'projectFields=dwcRecord.tdwg.scientificName&projectFields=dwcRecord.tdwg.eventDate'
  return await fetch(apiRoot + `dwca/user/${userRef}/records?${query}`, { headers })
    .then(response => response.json())
}

export async function getOccurrence({ datasetId, dwcaId, userRef }) {
  return fetch(apiRoot + `dwca/${datasetId}/user/${userRef}/records/${encodeURIComponent(dwcaId)}`, { headers })
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
  const url = apiRoot + `dwca/${occurrence.dataset.id}/user/${userRef}/records/${encodeURIComponent(dwcaId)}`
  return await fetch(url, {
    method: 'PUT',
    headers,
    body:   JSON.stringify(request)
  }).then(response => response.json())
}

export async function createOccurrence({ occurrence, userRef }) {
  const request = mapOccurrenceToDwca(occurrence)
  const url = apiRoot + `dwca/${occurrence.dataset.id}/user/${userRef}/records`
  return await fetch(url, {
    method: 'POST',
    headers,
    body:   JSON.stringify(request)
  }).then(response => response.json())
}

export async function getUsers() {
  const usersResponse = await fetch(apiRoot + 'users', { headers })
    .then(response => response.json())
  return usersResponse.map(({ _ref, ...rest }) => (({ id: _ref, ...rest })))
}

export async function getUsersWithDatasets() {
  const [users, datasets] = await Promise.all([getUsers(), getDatasets()])
  const datasetIdToDataset = groupBy(datasets, 'id')
  return users.map(user => {
    if (!user['dataset_refs']) user['dataset_refs'] = []
    const datasets = user['dataset_refs'].map(datasetRef => datasetIdToDataset[datasetRef][0])
    return { ...user, datasets }
  })
}

export async function createUser({ datasetIds, email, name, role }) {
  const request = {
    'dataset_refs': datasetIds,
    emailAddress:   email,
    name,
    role
  }
  const url = apiRoot + 'users'
  return await fetch(url, {
    method: 'POST',
    headers,
    body:   JSON.stringify(request)
  }).then(response => response.json())
    .catch(error => ({
      exception:        'Some error occurred',
      exceptionMessage: error
    }))
}

export async function updateUser({ id, datasetIds, email, name, role }) {
  const request = {
    'dataset_refs': datasetIds,
    emailAddress:   email,
    name,
    role
  }
  const url = apiRoot + 'users/' + id
  return await fetch(url, {
    method: 'PUT',
    headers,
    body:   JSON.stringify(request)
  }).then(response => response.json())
    .catch(error => ({
      exception:        'Some error occurred',
      exceptionMessage: error
    }))
}

function groupBy(list, props) {
  return list.reduce((a, b) => {
    (a[b[props]] = a[b[props]] || []).push(b)
    return a
  }, {})
}

function renameRefToId({ ref, ...rest }) {
  return ({ id: ref, ...rest })
}
