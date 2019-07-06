import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Divider from '../layout/Divider'

export default function ManageUsersPage() {
  const { t } = useTranslation()

  return (
    <>
      <section className="section">
        <div className="container is-fluid has-text-centered">
          <Link className="button is-info" to="/input-data/create">
            {t('manageUsersPage.inputNew')}
          </Link>
        </div>
      </section>
      <Divider>{t('manageUsersPage.or')}</Divider>
      <section className="section">
        <div className="container is-fluid has-text-centered">
          <h4 className="title is-4">{t('manageUsersPage.managePreviousEntries')}</h4>
          <table className="table is-striped is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th></th>
                <th>{t('manageUsersPage.table.email')}</th>
                <th>{t('manageUsersPage.table.accessToDatasets')}</th>
                <th>{t('manageUsersPage.table.role')}</th>
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
