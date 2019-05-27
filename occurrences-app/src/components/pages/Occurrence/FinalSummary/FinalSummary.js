import PropTypes from 'prop-types'
import React from 'react'
import { darwinCoreFieldShape } from '../DarwinCoreFields/DarwinCoreFields'
import { datasetShape } from '../SelectDataset/SelectDataset'
import { format } from 'date-fns'
import { locationDataShape } from '../LocationData/LocationData'
import { observationDataShape } from '../ObservationData/ObservationData'
import { occurrenceDataShape } from '../OccurrenceData/OccurrenceData'
import { useTranslation } from 'react-i18next'

export default function FinalSummary({
  dataset,
  darwinCoreFields,
  occurrenceData,
  observationData,
  locationData,
  measurements,
  onChangeClick,
  onSubmitClick
}) {
  const { t } = useTranslation()

  return (
    <div className="final-summary section is-fluid">
      <div className="columns is-centered">
        <h1 className="final-summary-title title is-3">{t('occurrenceForm.finalSummary.title')}</h1>
      </div>
      <SubmitEntryButton onClick={onSubmitClick}/>
      <section className="select-dataset">
        <SectionTitle>1 - {t('occurrenceForm.selectDataset.step.stepTitle')}</SectionTitle>
        <p>{dataset.description}</p>
        <ChangeButton onClick={() => onChangeClick('selectDataset')}/>
      </section>
      <section className="occurrence-data">
        <SectionTitle>2 - {t('occurrenceForm.occurrenceData.step.stepTitle')}</SectionTitle>
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
        <ChangeButton onClick={() => onChangeClick('occurrenceData')}/>
      </section>
      <section className="location-data">
        <SectionTitle>3 - {t('occurrenceForm.locationData.step.stepTitle')}</SectionTitle>
        <table className="table is-striped is-fullwidth is-hoverable">
          <tbody>
            <NameValueRow name="Latitude" value={locationData.decimalLatitude}/>
            <NameValueRow name="Longitude" value={locationData.decimalLongitude}/>
            <NameValueRow name="coordinateUncertainty" value={locationData.coordinateUncertainty}/>
            <NameValueRow name="minimumDepth" value={locationData.minimumDepth}/>
            <NameValueRow name="maximumDepth" value={locationData.maximumDepth}/>
          </tbody>
        </table>
        <SectionSubtitle>{t('occurrenceForm.finalSummary.locationData.verbatimDataSubtitle')}</SectionSubtitle>
        <table className="table is-striped is-fullwidth is-hoverable">
          <tbody>
            <NameValueRow name="verbatimCoordinates" value={locationData.verbatimCoordinates}/>
            <NameValueRow name="verbatimDepth" value={locationData.verbatimDepth}/>
          </tbody>
        </table>
        <ChangeButton onClick={() => onChangeClick('locationData')}/>
      </section>
      <section className="observation-data">
        <SectionTitle>4 - {t('occurrenceForm.observationData.step.stepTitle')}</SectionTitle>
        <SectionSubtitle>{t('occurrenceForm.finalSummary.observationData.catalogDataSubtitle')}</SectionSubtitle>
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
              <p className="title is-5">{t('occurrenceForm.observationData.identifiedBy.label')}</p>
              <ul>
                {observationData.identifiedBy.map((name) => <li key={name}>{name}</li>)}
              </ul>
            </div>
            <div className="column is-3">
              <p className="title is-5">{t('occurrenceForm.observationData.recordedBy.label')}</p>
              <ul>
                {observationData.recordedBy.map((name) => <li key={name}>{name}</li>)}
              </ul>
            </div>
          </div>
        </div>
        <SectionSubtitle>{t('occurrenceForm.finalSummary.observationData.speciesDataSubtitle')}</SectionSubtitle>
        <table className="table is-striped is-fullwidth is-hoverable">
          <tbody>
            <NameValueRow name="references" value={observationData.references.join(', ')}/>
            <NameValueRow name="identificationQualifier" value={observationData.identificationQualifier}/>
            <NameValueRow name="identificationRemarks" value={observationData.identificationRemarks}/>
          </tbody>
        </table>
        <ChangeButton onClick={() => onChangeClick('observationData')}/>
      </section>
      <section className="measurement-or-fact">
        <SectionTitle>5 - {t('occurrenceForm.measurementOrFact.step.stepTitle')}</SectionTitle>
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
        <ChangeButton onClick={() => onChangeClick('measurementOrFact')}/>
      </section>
      <section className="darwin-core-fields">
        <SectionTitle>6 - {t('occurrenceForm.darwinCoreFields.step.stepTitle')}</SectionTitle>
        <table className="table is-striped is-fullwidth is-hoverable">
          <tbody>
            {darwinCoreFields.map((field, index) =>
              // eslint-disable-next-line react/no-array-index-key
              <NameValueRow key={index} {...field}/>
            )}
          </tbody>
        </table>
        <ChangeButton onClick={() => onChangeClick('darwinCoreFields')}/>
      </section>
      <SubmitEntryButton onClick={onSubmitClick}/>
    </div>
  )
}

FinalSummary.propTypes = {
  darwinCoreFields: PropTypes.arrayOf(PropTypes.shape(darwinCoreFieldShape)).isRequired,
  dataset:          PropTypes.shape(datasetShape).isRequired,
  locationData:     PropTypes.shape(locationDataShape).isRequired,
  measurements:     PropTypes.array.isRequired,
  observationData:  PropTypes.shape(observationDataShape).isRequired,
  occurrenceData:   PropTypes.shape(occurrenceDataShape).isRequired,
  onChangeClick:    PropTypes.func.isRequired,
  onSubmitClick:    PropTypes.func.isRequired
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

function SubmitEntryButton({ onClick }) {
  const { t } = useTranslation()
  return (
    <div className="submit-entry-button columns is-centered">
      <button className="button is-info is-medium" onClick={onClick}>
        {t('occurrenceForm.finalSummary.submitEntryButton')}
      </button>
    </div>
  )
}

SubmitEntryButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

function SectionTitle({ children }) {
  return (
    <h2 className="title is-4">{children}</h2>
  )
}

SectionTitle.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}

function ChangeButton({ onClick }) {
  const { t } = useTranslation()
  return (
    <button className="change-button button" onClick={onClick}>
      {t('common.change')}
    </button>
  )
}

ChangeButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

function SectionSubtitle({ children }) {
  return <h2 className="title is-5">{children}</h2>
}

SectionSubtitle.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}
