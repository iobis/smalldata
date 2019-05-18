import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'

const basisOfRecordOptions = ['humanObservation', 'machineObservation', 'fossilSpecimen', 'livingSpecimen', 'preservedSpecimen']
const lifestageOptions = ['larva', 'juvenile', 'adult', 'unspecified']
const occurrenceStatusOptions = ['absent', 'present']
const sexOptions = ['male', 'female', 'unspecified']

export default function FinalSummary({
  dataset,
  occurrenceData,
  observationData,
  locationData,
  onChange,
  onSubmit
}) {
  const { t } = useTranslation()

  return (
    <div className="final-summary section is-fluid">
      <h1 className="title is-3">{t('occurrenceForm.finalSummary.title')}</h1>
      <button className="button is-info is-medium">Submit Entry</button>
      <h2 className="title is-5">1 - DATASET</h2>
      <p>{dataset.description}</p>
      <h2 className="title is-5">2 - OCCURRENCE DATA</h2>
      <table className="table is-striped is-fullwidth is-hoverable">
        <tbody>
          <NameValueRow name="scientific name" value={occurrenceData.scientificName}/>
          <NameValueRow name="beginDate" value={format(occurrenceData.beginDate, 'D MMMM YYYY')}/>
          <NameValueRow name="endDate" value={format(occurrenceData.endDate, 'D MMMM YYYY')}/>
          <NameValueRow name="occurrenceStatus" value={occurrenceData.occurrenceStatus}/>
          <NameValueRow name="basisOfRecord" value={occurrenceData.basisOfRecord}/>
          <NameValueRow name="sex" value={occurrenceData.sex}/>
          <NameValueRow name="lifestage" value={occurrenceData.lifestage}/>
        </tbody>
      </table>
      <h2 className="title is-5">3 - LOCATION DATA</h2>
      <table className="table is-striped is-fullwidth is-hoverable">
        <tbody>
          <NameValueRow name="Latitude" value={locationData.decimalLatitude}/>
          <NameValueRow name="Longitude" value={locationData.decimalLongitude}/>
          <NameValueRow name="coordinateUncertainty" value={locationData.coordinateUncertainty}/>
          <NameValueRow name="minimumDepth" value={locationData.minimumDepth}/>
          <NameValueRow name="maximumDepth" value={locationData.maximumDepth}/>
        </tbody>
      </table>
      <h2 className="title is-6">Verbatim data</h2>
      <table className="table is-striped is-fullwidth is-hoverable">
        <tbody>
          <NameValueRow name="verbatimCoordinates" value={locationData.verbatimCoordinates}/>
          <NameValueRow name="verbatimDepth" value={locationData.verbatimDepth}/>
        </tbody>
      </table>
      <h2 className="title is-5">4 - OBSERVATION DATA</h2>
      <h2 className="title is-6">Catalog data</h2>
      <table className="table is-striped is-fullwidth is-hoverable">
        <tbody>
          <NameValueRow name="institutionCode" value={observationData.institutionCode}/>
          <NameValueRow name="collectionCode" value={observationData.collectionCode}/>
          <NameValueRow name="fieldNumber" value={observationData.fieldNumber}/>
          <NameValueRow name="catalogNumber" value={observationData.catalogNumber}/>
          <NameValueRow name="recordNumber" value={observationData.recordNumber}/>
        </tbody>
      </table>
      <h2 className="title is-6">Species data</h2>
      <table className="table is-striped is-fullwidth is-hoverable">
        <tbody>
          <NameValueRow name="references" value={observationData.references.join(', ')}/>
          <NameValueRow name="identificationQualifier" value={observationData.identificationQualifier}/>
          <NameValueRow name="identificationRemarks" value={observationData.identificationRemarks}/>
        </tbody>
      </table>
    </div>
  )
}

FinalSummary.propTypes = {
  dataset:         PropTypes.shape({
    description: PropTypes.string.isRequired,
    id:          PropTypes.number.isRequired
  }).isRequired,
  locationData:    PropTypes.shape({
    decimalLongitude:      PropTypes.number,
    decimalLatitude:       PropTypes.number,
    coordinateUncertainty: PropTypes.number,
    minimumDepth:          PropTypes.number,
    maximumDepth:          PropTypes.number,
    verbatimCoordinates:   PropTypes.string.isRequired,
    verbatimDepth:         PropTypes.string.isRequired
  }).isRequired,
  observationData: PropTypes.shape({
    institutionCode:         PropTypes.string.isRequired,
    collectionCode:          PropTypes.string.isRequired,
    fieldNumber:             PropTypes.string.isRequired,
    catalogNumber:           PropTypes.string.isRequired,
    recordNumber:            PropTypes.string.isRequired,
    identifiedBy:            PropTypes.arrayOf(PropTypes.string).isRequired,
    recordedBy:              PropTypes.arrayOf(PropTypes.string).isRequired,
    identificationQualifier: PropTypes.string.isRequired,
    identificationRemarks:   PropTypes.string.isRequired,
    references:              PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  occurrenceData:  PropTypes.shape({
    basisOfRecord:    PropTypes.oneOf(basisOfRecordOptions).isRequired,
    beginDate:        PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
    endDate:          PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    lifestage:        PropTypes.oneOf(lifestageOptions),
    occurrenceStatus: PropTypes.oneOf(occurrenceStatusOptions).isRequired,
    scientificName:   PropTypes.string.isRequired,
    sex:              PropTypes.oneOf(sexOptions)
  }).isRequired,
  onChange:        PropTypes.func.isRequired,
  onSubmit:        PropTypes.func.isRequired
}

function NameValueRow({ name, value }) {
  return (
    <tr className="name-value-row fieldrow">
      <td className="name">{name}</td>
      <td className="value">{value}</td>
    </tr>
  )
}

NameValueRow.propTypes = {
  name:  PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
