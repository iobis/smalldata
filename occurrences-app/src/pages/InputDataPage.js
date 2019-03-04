import React from 'react'
import { getOccurrenceMock } from '../clients/server'
import Divider from '../atom/Divider'
import { useTranslation } from 'react-i18next'

export default function InputDataPage() {
  const { t } = useTranslation()
  const occurrences = getOccurrenceMock()

  return (
    <>
      <section className="section">
        <div className="container is-fluid has-text-centered">
          <a className="button is-info">{t('inputData.inputNew')}</a>
        </div>
      </section>
      <Divider>{t('inputData.or')}</Divider>
      <section className="section">
        <div className="container is-fluid has-text-centered">
          <h3>{t('inputData.copyPreviousHeader')}</h3>
          <table className="table is-striped is-hoverable is-fullwidth">
            <thead>
            <tr>
              <th/>
              <th>{t('inputData.table.dateAdded')}</th>
              <th>{t('inputData.table.scientificName')}</th>
              <th>{t('inputData.table.dataset')}</th>
              <th>{t('inputData.table.occurrenceDate')}</th>
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

function OccurrenceRow({ id, addedDate, scientificName, dataset, occurrenceDate }) {
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
