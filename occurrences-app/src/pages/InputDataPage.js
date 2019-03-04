import React from 'react'
import Divider from '../atom/Divider'
import { useTranslation } from 'react-i18next'

export default function InputDataPage() {
  const { t } = useTranslation()

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
              <th></th>
              <th>{t('inputData.table.dateAdded')}</th>
              <th>{t('inputData.table.scientificName')}</th>
              <th>{t('inputData.table.dataset')}</th>
              <th>{t('inputData.table.occurrenceDate')}</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td><a className="button is-info">{t('common.edit')}</a></td>
              <td>01/12/2011</td>
              <td>Abra Alba</td>
              <td>NPPSD Short-tailed Albatross Sightings</td>
              <td>09/12/2001</td>
              <td><a className="button is-info">{t('common.copy')}</a></td>
            </tr>
            <tr>
              <td><a className="button is-info">{t('common.edit')}</a></td>
              <td>01/12/2011</td>
              <td>Abra Alba</td>
              <td>NPPSD Short-tailed Albatross Sightings</td>
              <td>09/12/2001</td>
              <td><a className="button is-info">{t('common.copy')}</a></td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
