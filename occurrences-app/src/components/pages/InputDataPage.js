import React from 'react'
import { getOccurrenceMock } from '../../clients/server'
import Divider from '../layout/Divider'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function InputDataPage() {
  const { t } = useTranslation()
  const occurrences = getOccurrenceMock()

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
              {occurrences.map(occurrence => <OccurrenceRow key={occurrence.id} {...occurrence}/>)}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function OccurrenceRow({ addedDate, dataset, id, occurrenceDate, scientificName }) {
  const { t } = useTranslation()

  return (
    <tr>
      <td>
        <div className="button is-info">{t('common.edit')}</div>
      </td>
      <td>{addedDate}</td>
      <td>{scientificName}</td>
      <td>{dataset}</td>
      <td>{occurrenceDate}</td>
      <td>
        <div className="button is-info">{t('common.copy')}</div>
      </td>
    </tr>
  )
}

OccurrenceRow.propTypes = {
  addedDate:      PropTypes.string.isRequired,
  dataset:        PropTypes.string.isRequired,
  id:             PropTypes.number.isRequired,
  occurrenceDate: PropTypes.string.isRequired,
  scientificName: PropTypes.string.isRequired
}
