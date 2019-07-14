import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Divider from '../layout/Divider'
import { getUsersWithDatasets } from '@smalldata/dwca-lib/src/clients/SmalldataClient'

export default function ManageUsersPage() {
  const { t } = useTranslation()
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async() => {
      setUsers(await getUsersWithDatasets())
    }
    fetchUsers()
  }, [])

  return (
    <div className="manage-users-page">
      <section className="section">
        <div className="container is-fluid has-text-centered">
          <Link className="button is-info" to="/manage-users/create">
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
                <th/>
                <th>{t('manageUsersPage.table.email')}</th>
                <th>{t('manageUsersPage.table.accessToDatasets')}</th>
                <th>{t('manageUsersPage.table.role')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <UserRow
                  datasets={user.datasets}
                  email={user.emailAddress}
                  id={user._id}
                  key={user._id}/>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function UserRow({ id, email, datasets }) {
  const { t } = useTranslation()

  const toEdit = {
    pathname: '/manage-users/update/' + id,
    state:    {
      action:     'update',
      datasetIds: datasets.map(dataset => dataset.id),
      email,
      id,
      name:       '',
      role:       'researcher'
    }
  }

  return (
    <tr className="user-row">
      <td className="edit">
        <Link className="button is-info" to={toEdit}>
          {t('common.edit')}
        </Link>
      </td>
      <td className="email">{email}</td>
      <td className="datasets">
        <ul>
          {datasets.map(dataset => <li key={dataset.id}>{dataset.title.value}</li>)}
        </ul>
      </td>
      <td className="role"/>
    </tr>
  )
}

const datasetShape = {
  id:    PropTypes.string.isRequired,
  title: PropTypes.shape({
    value: PropTypes.string.isRequired
  }).isRequired
}

UserRow.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.shape(datasetShape)).isRequired,
  email:    PropTypes.string.isRequired,
  id:       PropTypes.string.isRequired
}
