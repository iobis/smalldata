import Divider from '../layout/Divider'
import PropTypes from 'prop-types'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@smalldata/dwca-lib'
import { format } from 'date-fns'
import { getDatasets, getOccurrences } from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function InputDataPage() {
  const { t } = useTranslation()
  const { userRef } = useContext(AuthContext)
  const [occurrences, setOccurrences] = useState([])

  useEffect(() => {
    const fetchOccurrences = async() => {
      const [occurrences, datasets] = await Promise.all([
        getOccurrences({ userRef }),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <section className="section">
        <div className="container is-fluid has-text-centered">
          <Link className="button is-info new" to="/input-data/create">
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
                <th>{t('inputDataPage.table.addedAt')}</th>
                <th>{t('inputDataPage.table.scientificName')}</th>
                <th>{t('inputDataPage.table.datasetTitle')}</th>
                <th>{t('inputDataPage.table.occurrenceDate')}</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {occurrences.map(occurrence => (
                <OccurrenceRow
                  datasetId={occurrence.dataset}
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

function OccurrenceRow({ addedAtInstant, datasetId, dwcaId, datasetTitle, occurrenceDate, scientificName }) {
  const { t } = useTranslation()
  const addedAtString = addedAtInstant ? format(addedAtInstant, 'D MMMM YYYY') : '—'
  const toCreate = {
    pathname: '/input-data/create',
    state:    { action: 'create', dwcaId, datasetId }
  }
  const toEdit = {
    pathname: '/input-data/update',
    state:    { action: 'update', dwcaId, datasetId }
  }

  return (
    <tr className="occurrence-row">
      <td className="edit">
        <Link className="button is-info" to={toEdit}>
          {t('common.edit')}
        </Link>
      </td>
      <td className="added-at">{addedAtString}</td>
      <td className="scientific-name">{scientificName}</td>
      <td className="dataset-title">{datasetTitle}</td>
      <td className="occurrence-date">{occurrenceDate || '—'}</td>
      <td className="copy">
        <Link className="button is-info copy-previous-entry" to={toCreate}>
          {t('common.copy')}
        </Link>
      </td>
    </tr>
  )
}

OccurrenceRow.propTypes = {
  addedAtInstant: PropTypes.string,
  datasetId:      PropTypes.string.isRequired,
  datasetTitle:   PropTypes.string.isRequired,
  dwcaId:         PropTypes.string.isRequired,
  occurrenceDate: PropTypes.string,
  scientificName: PropTypes.string.isRequired
}
