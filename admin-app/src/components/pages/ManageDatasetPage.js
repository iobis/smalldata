import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Divider from '../layout/Divider'
import { getDatasets } from '@smalldata/dwca-lib/src/clients/SmalldataClient'

export default function ManageDatasetPage() {
  const { t } = useTranslation()
  const [datasets, setDatasets] = useState([])

  useEffect(() => {
    const fetchDatasets = async() => {
      setDatasets(await getDatasets())
    }
    fetchDatasets()
  }, [])

  return (
    <>
      <section className="section">
        <div className="container is-fluid has-text-centered">
          <Link className="button is-info" to="/manage-dataset/create">
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
                <th/>
                <th>{t('manageDatasetPage.table.title')}</th>
                <th>{t('manageDatasetPage.table.organization')}</th>
                <th>{t('manageDatasetPage.table.licence')}</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map(dataset => (
                <DatasetRow
                  key={dataset.id}
                  license={dataset.license.title}
                  organization={dataset.metadataProviders[0].organizationName || '—'}
                  title={dataset.title.value}/>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function DatasetRow({ title, organization, license }) {
  const { t } = useTranslation()

  const toEdit = {
    pathname: '/manage-dataset/update',
    state:    { action: 'update' }
  }

  return (
    <tr className="user-row">
      <td className="edit">
        <Link className="button is-info" to={toEdit}>
          {t('common.edit')}
        </Link>
      </td>
      <td className="dataset-title">{title}</td>
      <td className="organization">{organization}</td>
      <td className="license">{license}</td>
    </tr>
  )
}

DatasetRow.propTypes = {
  license:      PropTypes.string.isRequired,
  organization: PropTypes.string.isRequired,
  title:        PropTypes.string.isRequired
}
