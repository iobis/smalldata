import { findTypeAndUnitIdByNames, findUnitsByTypeId } from './measurments'
import { format } from 'date-fns'

const purlUrl = 'http://purl.org/dc/terms/'
const tdwgUrl = 'http://rs.tdwg.org/dwc/terms/'
const iobisUrl = 'http://rs.iobis.org/obis/terms/'

export function datasetTitleOf(dataset) {
  const title = dataset && dataset.title && dataset.title.value
  return title || ''
}

export function mapOccurrenceToDwca(occurrence) {
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
  return {
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
}

function mapOccurrenceDataToTdwg({ basisOfRecord, beginDate, endDate, occurrenceStatus, scientificName, lifeStage, sex }) {
  return {
    basisOfRecord:    basisOfRecord.charAt(0).toUpperCase() + basisOfRecord.slice(1),
    eventDate:        format(beginDate, 'YYYY-MM-DD') + '/' + format(endDate || beginDate, 'YYYY-MM-DD'),
    occurrenceStatus: occurrenceStatus,
    scientificName:   scientificName,
    ...(lifeStage === 'unspecified' ? {} : { lifestage: lifeStage }),
    ...(sex === 'unspecified' ? {} : { sex })
  }
}

function mapDarwinCoreFieldsToRequest(darwinCoreFields) {
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

export function mapDwcaToOccurrenceData(dwca) {
  const tdwg = dwca.dwcRecords.occurrence[0].tdwg
  const [beginDate, endDate] = tdwg.eventDate.split('/')
  return {
    basisOfRecord:    tdwg.basisOfRecord.charAt(0).toLowerCase() + tdwg.basisOfRecord.slice(1),
    beginDate:        new Date(beginDate),
    endDate:          endDate ? new Date(endDate) : null,
    lifestage:        tdwg.lifeStage || 'unspecified',
    occurrenceStatus: tdwg.occurrenceStatus,
    scientificName:   tdwg.scientificName,
    sex:              tdwg.sex || 'unspecified'
  }
}

export function mapDwcaToLocationData(dwca) {
  const tdwg = dwca.dwcRecords.occurrence[0].tdwg
  return {
    decimalLongitude:      tdwg.decimalLongitude,
    decimalLatitude:       tdwg.decimalLatitude,
    coordinateUncertainty: tdwg.coordinateUncertaintyInMeters,
    minimumDepth:          tdwg.minimumDepthInMeters,
    maximumDepth:          tdwg.maximumDepthInMeters,
    verbatimCoordinates:   tdwg.verbatimCoordinates,
    verbatimDepth:         tdwg.verbatimDepth
  }
}

export function mapDwcaToObservationData(dwca) {
  const tdwg = dwca.dwcRecords.occurrence[0].tdwg
  return {
    institutionCode:         tdwg.institutionCode,
    collectionCode:          tdwg.collectionCode,
    fieldNumber:             tdwg.fieldNumber,
    catalogNumber:           tdwg.catalogNumber,
    recordNumber:            tdwg.recordNumber,
    identifiedBy:            tdwg.identifiedBy.split('|'),
    recordedBy:              tdwg.recordedBy.split('|'),
    identificationQualifier: tdwg.identificationQualifier,
    identificationRemarks:   tdwg.identificationRemarks,
    references:              tdwg.associatedReferences.split('|')
  }
}

export function mapDwcaToMeasurements(dwca) {
  const emof = getProperty(() => dwca.dwcRecords.emof, [])
  return emof.map(({ tdwg, iobis }) => ({
    type:  tdwg.measurementType,
    value: tdwg.measurementValue,
    unit:  tdwg.measurementUnit,
    units: findUnitsByTypeId(iobis.measurementTypeID)
  }))
}

function getProperty(selectorFn, defaultValue) {
  try {
    const value = selectorFn()
    return value === null || value === undefined ? defaultValue : value
  } catch (e) {
    return defaultValue
  }
}

const reservedTdwgFields = ['basisOfRecord', 'eventDate', 'occurrenceStatus', 'scientificName', 'sex',
  'decimalLongitude', 'decimalLatitude', 'coordinateUncertaintyInMeters', 'minimumDepthInMeters', 'maximumDepthInMeters',
  'verbatimCoordinates', 'verbatimDepth', 'institutionCode', 'collectionCode', 'fieldNumber', 'catalogNumber',
  'recordNumber', 'identifiedBy', 'recordedBy', 'identificationQualifier', 'identificationRemarks',
  'associatedReferences']

export function mapDwcsToDarwinCoreFields(dwca) {
  const { tdwg, iobis, purl } = dwca.dwcRecords.occurrence[0]
  const iobisFields = Object
    .keys(iobis)
    .map(key => ({
      name:  iobisUrl + key,
      value: iobis[key]
    }))
  const purlFields = Object
    .keys(purl)
    .map(key => ({
      name:  purlUrl + key,
      value: purl[key]
    }))
  const tdwgFields = Object
    .keys(tdwg)
    .filter(key => !reservedTdwgFields.includes(key))
    .map(key => ({
      name:  tdwgUrl + key,
      value: tdwg[key]
    }))
  return [...iobisFields, ...purlFields, ...tdwgFields]
}
