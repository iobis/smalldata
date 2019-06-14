import { format } from 'date-fns'
import { findTypeAndUnitIdByNames } from './measurments'

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

export async function postOccurrence({ occurrence }) {
  const userRef = 'ovZTtaOJZ98xDDY'
  const emof = occurrence.measurements.map(measurment => {
    const { typeId, unitId } = findTypeAndUnitIdByNames(measurment.type, measurment.unit)
    return {
      tdwg:  {
        measurementType:  measurment.type,
        measurementUnit:  measurment.unit,
        measurementValue: measurment.value
      },
      iobis: {
        measurementTypeID: typeId,
        measurementUnitID: unitId
      }
    }
  })
  const darwinCoreFields = mapDarwinCoreFieldsToRequest(occurrence.darwinCoreFields)
  const requestBody = {
    core:       'occurrence',
    occurrence: [{
      tdwg:  {
        ...mapOccurrenceDataToTdwg(occurrence.occurrenceData),

        decimalLongitude:              occurrence.locationData.decimalLongitude,
        decimalLatitude:               occurrence.locationData.decimalLatitude,
        coordinateUncertaintyInMeters: occurrence.locationData.coordinateUncertainty,
        minimumDepthInMeters:          occurrence.locationData.minimumDepth,
        maximumDepthInMeters:          occurrence.locationData.maximumDepth,
        verbatimCoordinates:           occurrence.locationData.verbatimCoordinates,
        verbatimDepth:                 occurrence.locationData.verbatimDepth,

        institutionCode:         occurrence.observationData.institutionCode,
        collectionCode:          occurrence.observationData.collectionCode,
        fieldNumber:             occurrence.observationData.fieldNumber,
        catalogNumber:           occurrence.observationData.catalogNumber,
        recordNumber:            occurrence.observationData.recordNumber,
        identifiedBy:            occurrence.observationData.identifiedBy.join('|'),
        recordedBy:              occurrence.observationData.recordedBy.join('|'),
        identificationQualifier: occurrence.observationData.identificationQualifier,
        identificationRemarks:   occurrence.observationData.identificationRemarks,
        associatedReferences:    occurrence.observationData.references.join('|'),

        ...darwinCoreFields.tdwg
      },
      purl:  {
        ...darwinCoreFields.purl
      },
      iobis: darwinCoreFields.iobis
    }],
    emof
  }
  const url = `/api/dwca/${occurrence.dataset.id}/user/${userRef}/records`
  return await fetch(url, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:    JSON.stringify(requestBody)
  }).then(response => response.json())
}

function mapOccurrenceDataToTdwg(occurrenceData) {
  return {
    basisOfRecord:    occurrenceData.basisOfRecord.charAt(0).toUpperCase() + occurrenceData.basisOfRecord.slice(1),
    eventDate:        format(occurrenceData.beginDate, 'YYYY-MM-DD') + '/' + format(occurrenceData.endDate, 'YYYY-MM-DD'),
    lifestage:        occurrenceData.lifeStage,
    occurrenceStatus: occurrenceData.occurrenceStatus,
    scientificName:   occurrenceData.scientificName,
    sex:              occurrenceData.sex
  }
}

function mapDarwinCoreFieldsToRequest(darwinCoreFields) {
  const purlUrl = 'http://purl.org/dc/terms/'
  const tdwgUrl = 'http://rs.tdwg.org/dwc/terms/'
  const iobisUrl = 'http://rs.iobis.org/obis/terms/'

  return darwinCoreFields.reduce((acc, { name, value }) => {
    if (name.startsWith(purlUrl)) {
      acc.purl[name.substring(purlUrl.length)] = value
    } else if (name.startsWith(tdwgUrl)) {
      acc.tdwg[name.substring(tdwgUrl.length)] = value
    } else if (name.startsWith(iobisUrl)) {
      acc.iobis[name.substring(iobisUrl.length)] = value
    }
    return acc
  }, {
    purl:  {},
    tdwg:  {},
    iobis: {}
  })
}
