import Divider from '../layout/Divider'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { getDatasets, getOccurrences } from '../../clients/SmalldataClient'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function InputDataPage() {
  const { t } = useTranslation()
  const [occurrences, setOccurrences] = useState([])

  useEffect(() => {
    const fetchOccurrences = async() => {
      const [occurrences, datasets] = await Promise.all([
        getOccurrences({ userRef: 'ovZTtaOJZ98xDDY' }),
        getDatasets()
      ])
      const datasetRefToTitle = datasets
        .reduce((acc, dataset) => {
          acc[dataset.id] = dataset.title.value
          return acc
        }, {})
      const occurrencesWithDataset = occurrences
        .map(occurrence => ({
          ...occurrence,
          datasetTitle: datasetRefToTitle[occurrence.dataset]
        }))
      setOccurrences(occurrencesWithDataset)
    }
    fetchOccurrences()
  }, [])

  return (
    <>
      <section className="section">
        <div className="container is-fluid has-text-centered">
          <Link className="button is-info" to="/input-data/new">
            {t('inputDataPage.inputNewOccurrence')}
          </Link>
        </div>
      </section>
      <Divider>{t('inputDataPage.or')}</Divider>
      <section className="previous-occurrences section">
        <div className="container is-fluid has-text-centered">
          <h4 className="title is-4">{t('inputDataPage.copyPreviousHeader')}</h4>
          <table className="table is-striped is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th/>
                <th>{t('inputDataPage.table.dateAdded')}</th>
                <th>{t('inputDataPage.table.scientificName')}</th>
                <th>{t('inputDataPage.table.dataset')}</th>
                <th>{t('inputDataPage.table.occurrenceDate')}</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {occurrences.map(occurrence => (
                <OccurrenceRow
                  key={occurrence.dwcaId}
                  occurrenceDate={occurrence.dwcRecords.occurrence[0].tdwg.eventDate}
                  scientificName={occurrence.dwcRecords.occurrence[0].tdwg.scientificName}
                  {...occurrence}/>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function OccurrenceRow({ addedAtInstant, datasetTitle, occurrenceDate, scientificName }) {
  const { t } = useTranslation()
  const addedAtString = addedAtInstant ? format(addedAtInstant, 'D MMMM YYYY') : '—'

  return (
    <tr className="occurrence-row">
      <td className="edit">
        <div className="button is-info">{t('common.edit')}</div>
      </td>
      <td className="date-added">{addedAtString}</td>
      <td className="scientific-name">{scientificName}</td>
      <td className="dataset-title">{datasetTitle}</td>
      <td className="occurrence-date">{occurrenceDate || '—'}</td>
      <td className="copy">
        <div className="button is-info">{t('common.copy')}</div>
      </td>
    </tr>
  )
}

OccurrenceRow.propTypes = {
  addedAtInstant: PropTypes.string,
  datasetTitle:   PropTypes.string.isRequired,
  occurrenceDate: PropTypes.string,
  scientificName: PropTypes.string.isRequired
}
