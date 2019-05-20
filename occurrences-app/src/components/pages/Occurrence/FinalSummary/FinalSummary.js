import PropTypes from 'prop-types'
import React from 'react'
import { datasetShape } from '../SelectDataset/SelectDataset'
import { format } from 'date-fns'
import { locationDataShape } from '../LocationData/LocationData'
import { observationDataShape } from '../ObservationData/ObservationData'
import { occurrenceDataShape } from '../OccurrenceData/OccurrenceData'
import { useTranslation } from 'react-i18next'

export default function FinalSummary({
  dataset,
  occurrenceData,
  observationData,
  locationData,
  measurements,
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
      <div className="content">
        <table className="table is-striped is-fullwidth is-hoverable">
          <tbody>
            <NameValueRow name="institutionCode" value={observationData.institutionCode}/>
            <NameValueRow name="collectionCode" value={observationData.collectionCode}/>
            <NameValueRow name="fieldNumber" value={observationData.fieldNumber}/>
            <NameValueRow name="catalogNumber" value={observationData.catalogNumber}/>
            <NameValueRow name="recordNumber" value={observationData.recordNumber}/>
          </tbody>
        </table>
        <div className="columns">
          <div className="column is-3">
            <p className="title is-6">{t('occurrenceForm.observationData.identifiedBy.label')}</p>
            <ul>
              {observationData.identifiedBy.map((name) => <li key={name}>{name}</li>)}
            </ul>
          </div>
          <div className="column is-3">
            <p className="title is-6">{t('occurrenceForm.observationData.recordedBy.label')}</p>
            <ul>
              {observationData.recordedBy.map((name) => <li key={name}>{name}</li>)}
            </ul>
          </div>
        </div>
      </div>
      <h2 className="title is-6">Species data</h2>
      <table className="table is-striped is-fullwidth is-hoverable">
        <tbody>
          <NameValueRow name="references" value={observationData.references.join(', ')}/>
          <NameValueRow name="identificationQualifier" value={observationData.identificationQualifier}/>
          <NameValueRow name="identificationRemarks" value={observationData.identificationRemarks}/>
        </tbody>
      </table>
      <h2 className="title is-5">5 - MEASUREMENT OR FACT</h2>
      <table className="measurements table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th className="type">{t('common.type')}</th>
            <th className="unit">{t('common.unit')}</th>
            <th className="value">{t('common.value')}</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map(({ type, unit, value }, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr className="fieldrow" key={index}>
              <td>{type}</td>
              <td>{unit}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

FinalSummary.propTypes = {
  dataset:         PropTypes.shape(datasetShape).isRequired,
  locationData:    PropTypes.shape(locationDataShape).isRequired,
  measurements:    PropTypes.array.isRequired,
  observationData: PropTypes.shape(observationDataShape).isRequired,
  occurrenceData:  PropTypes.shape(occurrenceDataShape).isRequired,
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
