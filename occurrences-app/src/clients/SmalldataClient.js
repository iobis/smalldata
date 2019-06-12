import { format } from 'date-fns'

export async function getDatasets() {
  const response = await fetch('/api/datasets')
    .then(response => response.json())
  return response.map(renameRefToId)
}

export function renameRefToId({ ref, ...rest }) {
  return ({ id: ref, ...rest })
}

export function datasetTitleOf(dataset) {
  const title = dataset && dataset.title && dataset.title.value
  return title || ''
}

export function getOccurrenceMock() {
  return [{
    id:             1,
    addedDate:      '2011-12-01',
    scientificName: 'Abra Alba',
    dataset:        'NPPSD Short-tailed Albatross Sightings',
    occurrenceDate: '2011-12-09'
  }, {
    id:             2,
    addedDate:      '2011-12-01',
    scientificName: 'Abra Alba',
    dataset:        'NPPSD Short-tailed Albatross Sightings',
    occurrenceDate: '2011-12-09'
  }]
}

export async function postOccurrence({ occurence }) {
  const userRef = 'ovZTtaOJZ98xDDY'
  const occurrence = {
    core:       'occurrence',
    occurrence: [{
      tdwg: {
        datasetID:   occurence.dataset.id,
        datasetName: occurence.dataset.title.value,

        basisOfRecord:    occurence.occurrenceData.basisOfRecord.charAt(0).toUpperCase() + occurence.occurrenceData.basisOfRecord.slice(1),
        eventDate:        format(occurence.occurrenceData.beginDate, 'YYYY-MM-DD') + '/' + format(occurence.occurrenceData.endDate, 'YYYY-MM-DD'),
        lifestage:        occurence.occurrenceData.lifeStage,
        occurrenceStatus: occurence.occurrenceData.occurrenceStatus,
        scientificName:   occurence.occurrenceData.scientificName,
        sex:              occurence.occurrenceData.sex,

        decimalLongitude:              occurence.locationData.decimalLongitude,
        decimalLatitude:               occurence.locationData.decimalLatitude,
        coordinateUncertaintyInMeters: occurence.locationData.coordinateUncertainty,
        minimumDepthInMeters:          occurence.locationData.minimumDepth,
        maximumDepthInMeters:          occurence.locationData.maximumDepth,
        verbatimCoordinates:           occurence.locationData.verbatimCoordinates,
        verbatimDepth:                 occurence.locationData.verbatimDepth,

        institutionCode:         occurence.observationData.institutionCode,
        collectionCode:          occurence.observationData.collectionCode,
        fieldNumber:             occurence.observationData.fieldNumber,
        catalogNumber:           occurence.observationData.catalogNumber,
        recordNumber:            occurence.observationData.recordNumber,
        identifiedBy:            occurence.observationData.identifiedBy.join(', '),
        recordedBy:              occurence.observationData.recordedBy.join(', '),
        identificationQualifier: occurence.observationData.identificationQualifier,
        identificationRemarks:   occurence.observationData.identificationRemarks
      },
      purl: {
        references: occurence.observationData.references.join(', ')
      }
    }],
    emof:       [{
      purl:  {},
      iobis: {}
    }, {
      iobis: {}
    }]
  }
  const url = `/api/dwca/${occurence.dataset.id}/user/${userRef}/records`
  return await fetch(url, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:    JSON.stringify(occurrence)
  }).then(response => response.json())
}
