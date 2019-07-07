import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Divider from '../layout/Divider'

export default function ManageDatasetPage() {
  const { t } = useTranslation()

  return (
    <>
      <section className="section">
        <div className="container is-fluid has-text-centered">
          <Link className="button is-info" to="/input-data/create">
            {t('manageDatasetPage.inputNew')}
          </Link>
        </div>
      </section>
      <Divider>{t('manageDatasetPage.or')}</Divider>
      <section className="section">
        <div className="container is-fluid has-text-centered">
          <h4 className="title is-4">{t('manageDatasetPage.managePreviousEntries')}</h4>
          <table className="table is-striped is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>{t('manageDatasetPage.table.title')}</th>
                <th>{t('manageDatasetPage.table.organization')}</th>
                <th>{t('manageDatasetPage.table.licence')}</th>
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
