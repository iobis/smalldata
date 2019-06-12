import React from 'react'
import Divider from '../layout/Divider'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function InputDataPage() {
  const { t } = useTranslation()

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
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
