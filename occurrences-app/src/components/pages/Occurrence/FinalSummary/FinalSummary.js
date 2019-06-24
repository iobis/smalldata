import PropTypes from 'prop-types'
import React from 'react'
import { darwinCoreFieldShape } from '../DarwinCoreFields/DarwinCoreFields'
import { datasetShape } from '../Dataset/Dataset'
import { format } from 'date-fns'
import { locationDataShape } from '../LocationData/LocationData'
import { observationDataShape } from '../ObservationData/ObservationData'
import { occurrenceDataShape } from '../OccurrenceData/OccurrenceData'
import { useTranslation } from 'react-i18next'
import { datasetTitleOf } from '../../../../clients/SmalldataClient'
import { Link } from 'react-router-dom'

export default function FinalSummary({
  darwinCoreFields,
  dataset,
  errorMessage,
  errorVisible,
  locationData,
  measurements,
  observationData,
  occurrenceData,
  onChangeClick,
  onErrorClose,
  onSubmitClick,
  successVisible
}) {
  const { t } = useTranslation()

  return (
    <div className="final-summary section is-fluid">
      <div className="columns is-centered">
        <h1 className="final-summary-title title is-3">{t('occurrenceForm.finalSummary.title')}</h1>
      </div>
      <section className="dataset-summary">
        <SectionTitle>1 - {t('occurrenceForm.dataset.step.stepTitle')}</SectionTitle>
        <p>{datasetTitleOf(dataset)}</p>
        <ChangeButton onClick={() => onChangeClick({ index: 0, value: 'dataset' })}/>
      </section>
      <section className="occurrence-data-summary">
        <SectionTitle>2 - {t('occurrenceForm.occurrenceData.step.stepTitle')}</SectionTitle>
        <table className="table is-striped is-fullwidth is-hoverable">
          <NameValueHeader/>
          <tbody>
            <NameValueRow
              name={t('occurrenceForm.occurrenceData.scientificName')}
              value={occurrenceData.scientificName}/>
            <NameValueRow
              name={t('occurrenceForm.occurrenceData.eventBeginDate')}
              value={format(occurrenceData.beginDate, 'D MMMM YYYY')}/>
            <NameValueRow
              name={t('occurrenceForm.occurrenceData.eventEndDate')}
              value={occurrenceData.endDate && format(occurrenceData.endDate, 'D MMMM YYYY')}/>
            <NameValueRow
              name={t('occurrenceForm.occurrenceData.occurrenceStatus.title')}
              value={t('occurrenceForm.occurrenceData.occurrenceStatus.' + occurrenceData.occurrenceStatus)}/>
            <NameValueRow
              name={t('occurrenceForm.occurrenceData.basisOfRecord.title')}
              value={t('occurrenceForm.occurrenceData.basisOfRecord.' + occurrenceData.basisOfRecord)}/>
            <NameValueRow
              name={t('occurrenceForm.occurrenceData.sex.title')}
              value={t('occurrenceForm.occurrenceData.sex.' + occurrenceData.sex)}/>
            <NameValueRow
              name={t('occurrenceForm.occurrenceData.lifestage.title')}
              value={t('occurrenceForm.occurrenceData.lifestage.' + occurrenceData.lifestage)}/>
          </tbody>
        </table>
        <ChangeButton onClick={() => onChangeClick({ index: 1, value: 'occurrenceData' })}/>
      </section>
      <section className="location-data-summary">
        <SectionTitle>3 - {t('occurrenceForm.locationData.step.stepTitle')}</SectionTitle>
        <table className="table is-striped is-fullwidth is-hoverable">
          <NameValueHeader/>
          <tbody>
            <NameValueRow
              name={t('occurrenceForm.locationData.decimalLatitude.label')}
              value={locationData.decimalLatitude}/>
            <NameValueRow
              name={t('occurrenceForm.locationData.decimalLongitude.label')}
              value={locationData.decimalLongitude}/>
            <NameValueRow
              name={t('occurrenceForm.locationData.coordinateUncertainty.label')}
              value={locationData.coordinateUncertainty}/>
            <NameValueRow
              name={t('occurrenceForm.locationData.minimumDepth.label')}
              value={locationData.minimumDepth}/>
            <NameValueRow
              name={t('occurrenceForm.locationData.maximumDepth.label')}
              value={locationData.maximumDepth}/>
          </tbody>
        </table>
        <SectionSubtitle>{t('occurrenceForm.finalSummary.locationData.verbatimDataSubtitle')}</SectionSubtitle>
        <table className="table is-striped is-fullwidth is-hoverable">
          <tbody>
            <NameValueRow
              name={t('occurrenceForm.locationData.verbatimCoordinates.label')}
              value={locationData.verbatimCoordinates}/>
            <NameValueRow
              name={t('occurrenceForm.locationData.verbatimDepth.label')}
              value={locationData.verbatimDepth}/>
          </tbody>
        </table>
        <ChangeButton onClick={() => onChangeClick({ index: 2, value: 'locationData' })}/>
      </section>
      <section className="observation-data-summary">
        <SectionTitle>4 - {t('occurrenceForm.observationData.step.stepTitle')}</SectionTitle>
        <SectionSubtitle>{t('occurrenceForm.finalSummary.observationData.catalogDataSubtitle')}</SectionSubtitle>
        <div className="content">
          <table className="table is-striped is-fullwidth is-hoverable">
            <NameValueHeader/>
            <tbody>
              <NameValueRow
                name={t('occurrenceForm.observationData.institutionCode.label')}
                value={observationData.institutionCode}/>
              <NameValueRow
                name={t('occurrenceForm.observationData.collectionCode.label')}
                value={observationData.collectionCode}/>
              <NameValueRow
                name={t('occurrenceForm.observationData.fieldNumber.label')}
                value={observationData.fieldNumber}/>
              <NameValueRow
                name={t('occurrenceForm.observationData.catalogNumber.label')}
                value={observationData.catalogNumber}/>
              <NameValueRow
                name={t('occurrenceForm.observationData.recordNumber.label')}
                value={observationData.recordNumber}/>
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
          <NameValueHeader/>
          <tbody>
            <NameValueRow
              name={t('occurrenceForm.observationData.references.label')}
              value={observationData.references.join(', ')}/>
            <NameValueRow
              name={t('occurrenceForm.observationData.identificationQualifier.label')}
              value={observationData.identificationQualifier}/>
            <NameValueRow
              name={t('occurrenceForm.observationData.identificationRemarks.label')}
              value={observationData.identificationRemarks}/>
          </tbody>
        </table>
        <ChangeButton onClick={() => onChangeClick({ index: 3, value: 'observationData' })}/>
      </section>
      <section className="measurement-or-fact-summary">
        <SectionTitle>5 - {t('occurrenceForm.measurementOrFact.step.stepTitle')}</SectionTitle>
        <table className="measurements table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th className="type">{t('common.type')}</th>
              <th className="name">{t('common.name')}</th>
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
        <ChangeButton onClick={() => onChangeClick({ index: 4, value: 'measurementOrFact' })}/>
      </section>
      <section className="darwin-core-fields-summary">
        <SectionTitle>6 - {t('occurrenceForm.darwinCoreFields.step.stepTitle')}</SectionTitle>
        <table className="table is-striped is-fullwidth is-hoverable">
          <NameValueHeader/>
          <tbody>
            {darwinCoreFields.map((field, index) =>
              // eslint-disable-next-line react/no-array-index-key
              <NameValueRow key={index} {...field}/>
            )}
          </tbody>
        </table>
        <ChangeButton onClick={() => onChangeClick({ index: 5, value: 'darwinCoreFields' })}/>
      </section>
      {successVisible ? (
        <div className="success-message notification is-success">
          <p className="title">{t('occurrenceForm.finalSummary.successMessage.header')}</p>
          <p className="subtitle">{t('occurrenceForm.finalSummary.successMessage.nextOptions')}</p>
          <div>
            <button className="create-fresh button is-white">
              {t('occurrenceForm.finalSummary.successMessage.createFreshButton')}
            </button>
            <button className="create-from-this button is-white">
              {t('occurrenceForm.finalSummary.successMessage.createFromThis')}
            </button>
          </div>
          <div>
            <Link className="is-size-5" to="/input-data/new">
              nothing, I'm done here for today
            </Link>
          </div>
        </div>) : null}
      {errorVisible ? (
        <div className="error-message notification is-danger">
          <button className="close delete" onClick={onErrorClose}/>
          {errorMessage}
        </div>) : null}
      <SubmitEntryButton onClick={onSubmitClick}/>
    </div>
  )
}

FinalSummary.propTypes = {
  darwinCoreFields: PropTypes.arrayOf(PropTypes.shape(darwinCoreFieldShape)).isRequired,
  dataset:          PropTypes.shape(datasetShape).isRequired,
  errorMessage:     PropTypes.string,
  errorVisible:     PropTypes.bool.isRequired,
  locationData:     PropTypes.shape(locationDataShape).isRequired,
  measurements:     PropTypes.array.isRequired,
  observationData:  PropTypes.shape(observationDataShape).isRequired,
  occurrenceData:   PropTypes.shape(occurrenceDataShape).isRequired,
  onChangeClick:    PropTypes.func.isRequired,
  onErrorClose:     PropTypes.func.isRequired,
  onSubmitClick:    PropTypes.func.isRequired,
  successVisible:   PropTypes.bool.isRequired
}

function NameValueHeader() {
  const { t } = useTranslation()

  return (
    <thead>
      <tr>
        <th className="type">{t('common.name')}</th>
        <th className="value">{t('common.value')}</th>
      </tr>
    </thead>
  )
}

function NameValueRow({ name, value }) {
  return (
    <tr className="name-value-row fieldrow">
      <td className="name">{name}</td>
      <td className="value">{!value ? '—' : value}</td>
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
    <div className="submit-entry-button columns is-mobile is-centered">
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
