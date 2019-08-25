import ChangeButton from '@smalldata/dwca-lib/src/components/FinalSummary/ChangeButton'
import NameValueHeader from '@smalldata/dwca-lib/src/components/FinalSummary/NameValueHeader'
import NameValueRow from '@smalldata/dwca-lib/src/components/FinalSummary/NameValueRow'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import SectionSubtitle from '@smalldata/dwca-lib/src/components/FinalSummary/SectionSubtitle'
import SectionTitle from '@smalldata/dwca-lib/src/components/FinalSummary/SectionTitle'
import SubmitEntryButton from '@smalldata/dwca-lib/src/components/FinalSummary/SubmitEntryButton'
import { darwinCoreFieldShape } from '../DarwinCoreFields/DarwinCoreFields'
import { datasetShape } from '../Dataset/Dataset'
import { datasetTitleOf } from '@smalldata/dwca-lib/src/clients/SmalldataConverters'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { locationDataShape } from '../LocationData/LocationData'
import { observationDataShape } from '../ObservationData/ObservationData'
import { occurrenceDataShape } from '../OccurrenceData/OccurrenceData'
import { scrollToRef } from '@smalldata/dwca-lib/src/browser/scroll'
import { useTranslation } from 'react-i18next'

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
  onCreateFreshClick,
  onCreateFromThisClick,
  onErrorClose,
  onSubmitClick,
  successMessageType,
  successVisible
}) {
  const { t } = useTranslation()
  const successMessageRef = useRef()
  const errorMessageRef = useRef()

  useEffect(() => {
    if (successVisible) scrollToRef(successMessageRef)
  }, [successVisible])

  useEffect(() => {
    if (errorVisible) scrollToRef(errorMessageRef)
  }, [errorVisible])

  const submitButton = !successVisible
    ? <SubmitEntryButton onClick={onSubmitClick}/>
    : null

  return (
    <div className="final-summary section is-fluid">
      <div className="columns is-centered">
        <h1 className="final-summary-title title is-3">{t('occurrenceForm.finalSummary.title')}</h1>
      </div>
      {successVisible ? (
        <div className="success-message notification is-success" ref={successMessageRef}>
          <p className="title">{t('occurrenceForm.finalSummary.successMessage.header.' + successMessageType)}</p>
          <p className="subtitle">{t('occurrenceForm.finalSummary.successMessage.nextOptions')}</p>
          <section>
            <button className="create-fresh button is-white" onClick={onCreateFreshClick}>
              {t('occurrenceForm.finalSummary.successMessage.createFreshButton')}
            </button>
            <button className="create-from-this button is-white" onClick={onCreateFromThisClick}>
              {t('occurrenceForm.finalSummary.successMessage.createFromThis')}
            </button>
          </section>
          <section>
            <Link className="is-size-5" to="/input-data/">
              {t('occurrenceForm.finalSummary.successMessage.doNothing')}
            </Link>
          </section>
        </div>) : null}
      {errorVisible ? (
        <div className="error-message notification is-danger" ref={errorMessageRef}>
          <button className="close delete" onClick={onErrorClose}/>
          {errorMessage}
        </div>) : null}
      {submitButton}
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
              name={t('occurrenceForm.occurrenceData.lifeStage.title')}
              value={t('occurrenceForm.occurrenceData.lifeStage.' + occurrenceData.lifeStage)}/>
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
      {submitButton}
    </div>
  )
}

FinalSummary.propTypes = {
  darwinCoreFields:      PropTypes.arrayOf(PropTypes.shape(darwinCoreFieldShape)).isRequired,
  dataset:               PropTypes.shape(datasetShape).isRequired,
  errorMessage:          PropTypes.string,
  errorVisible:          PropTypes.bool.isRequired,
  locationData:          PropTypes.shape(locationDataShape).isRequired,
  measurements:          PropTypes.array.isRequired,
  observationData:       PropTypes.shape(observationDataShape).isRequired,
  occurrenceData:        PropTypes.shape(occurrenceDataShape).isRequired,
  onChangeClick:         PropTypes.func.isRequired,
  onCreateFreshClick:    PropTypes.func.isRequired,
  onCreateFromThisClick: PropTypes.func.isRequired,
  onErrorClose:          PropTypes.func.isRequired,
  onSubmitClick:         PropTypes.func.isRequired,
  successMessageType:    PropTypes.oneOf(['create', 'update']).isRequired,
  successVisible:        PropTypes.bool.isRequired
}
