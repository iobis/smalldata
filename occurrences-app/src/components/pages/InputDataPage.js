import Divider from '../layout/Divider'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { getOccurrences } from '../../clients/SmalldataClient'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function InputDataPage() {
  const { t } = useTranslation()
  const [occurrences, setOccurrences] = useState([])

  useEffect(() => {
    const fetchOccurrences = async() => {
      const occurrences = await getOccurrences({ userRef: 'ovZTtaOJZ98xDDY' })
      setOccurrences(occurrences)
    }
    fetchOccurrences()
  })

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
      <section className="section">
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
                  addedDate={occurrence.dateAdded}
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

function OccurrenceRow({ addedDate, dataset, occurrenceDate, scientificName }) {
  const { t } = useTranslation()

  return (
    <tr>
      <td>
        <div className="button is-info">{t('common.edit')}</div>
      </td>
      <td>{addedDate || '—'}</td>
      <td>{scientificName}</td>
      <td>{dataset}</td>
      <td>{occurrenceDate || '—'}</td>
      <td>
        <div className="button is-info">{t('common.copy')}</div>
      </td>
    </tr>
  )
}

OccurrenceRow.propTypes = {
  addedDate:      PropTypes.string,
  dataset:        PropTypes.string.isRequired,
  occurrenceDate: PropTypes.string,
  scientificName: PropTypes.string.isRequired
}
