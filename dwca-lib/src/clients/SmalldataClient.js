import { mapOccurrenceToDwca } from './SmalldataConverters'

const authorizationValue = 'Basic verysecret'
const headers = {
  'Authorization': authorizationValue,
  'Content-Type':  'application/json'
}

export async function getDatasets() {
  const response = await fetch('/api/datasets', { headers })
    .then(response => response.json())
  return response.map(renameRefToId)
}

export async function createDataset() {
  const request = {
    meta:              {
      type:      'occurrence',
      dwcTables: {
        core:       'occurrence',
        extensions: [
          'emof'
        ]
      }
    },
    title:             {
      language: 'en',
      value:    'Looking for Melibe nudibranches in the Philippines'
    },
    language:          'en',
    abstract:          {
      paragraphs: [
        'This is one paragraph',
        'And this is another one...'
      ]
    },
    license:           {
      url:   'http://creativecommons.org/licenses/by-nc/4.0/legalcode',
      title: 'Creative Commons Attribution Non Commercial (CC-BY-NC) 4.0 License'
    },
    creators:          [{
      individualName: {
        givenName: 'Someone',
        surName:   'VeryImportant'
      }
    }],
    contacts:          [{
      individualName: {
        givenName: 'Also',
        surName:   'VeryImportant'
      }
    }],
    metadataProviders: [{
      individualName:        {
        givenName: 'ProbablySister',
        surName:   'VeryImportant'
      },
      electronicMailAddress: 'mostimportant@melibesearch.org'
    }],
    keywordSets:       [{
      keywords:         [
        'SearchEvent',
        'Nudibranch'
      ],
      keywordThesaurus: 'example keywords'
    }]
  }

  return await fetch('/api/datasets', {
    method: 'POST',
    headers,
    body:   JSON.stringify(request)
  }).then(response => response.json())
}

export function renameRefToId({ ref, ...rest }) {
  return ({ id: ref, ...rest })
}

export async function getOccurrences({ userRef }) {
  const query = 'projectFields=dwcRecord.tdwg.scientificName&projectFields=dwcRecord.tdwg.eventDate'
  return await fetch(`/api/dwca/user/${userRef}/records?${query}`, { headers })
    .then(response => response.json())
}

export async function getOccurrence({ datasetId, dwcaId, userRef }) {
  return fetch(`/api/dwca/${datasetId}/user/${userRef}/records/${encodeURIComponent(dwcaId)}`, { headers })
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
    method: 'PUT',
    headers,
    body:   JSON.stringify(request)
  }).then(response => response.json())
}

export async function createOccurrence({ occurrence, userRef }) {
  const request = mapOccurrenceToDwca(occurrence)
  const url = `/api/dwca/${occurrence.dataset.id}/user/${userRef}/records`
  return await fetch(url, {
    method: 'POST',
    headers,
    body:   JSON.stringify(request)
  }).then(response => response.json())
}

export async function getUsers() {
  return fetch('/api/users', { headers })
    .then(response => response.json())
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
  const url = '/api/users'
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
  const url = '/api/users/' + id
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
