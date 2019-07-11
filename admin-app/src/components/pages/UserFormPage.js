import React, { useEffect, useState } from 'react'
import OceanExpertNameInput from './OceanExpertNameInput/OceanExpertNameInput'
import InputText from '@smalldata/dwca-lib/src/components/form/InputText'
import Dropdown from '@smalldata/dwca-lib/src/components/form/Dropdown'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { createUser, getDatasets } from '@smalldata/dwca-lib/src/clients/SmalldataClient'

const roles = ['researcher', 'node manager']

export default function UserFormPage() {
  const { t } = useTranslation()
  const [datasets, setDatasets] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(roles[0])
  const [selectedDatasets, setSelectedDatasets] = useState([])
  const addUserButtonEnabled = name && email

  useEffect(() => {
    const fetchDatasets = async() => {
      setDatasets(await getDatasets())
    }
    fetchDatasets()
  }, [])

  function handleDatasetToggle(datasetId) {
    if (selectedDatasets.includes(datasetId)) {
      setSelectedDatasets(selectedDatasets.filter(id => id !== datasetId))
    } else {
      setSelectedDatasets([...selectedDatasets, ...[datasetId]])
    }
  }

  function handleOceanExpertProfileChange({ name }) {
    setName(name)
  }

  function handleAddUserButtonClick() {
    createUser({
      email,
      datasetIds: selectedDatasets
    })
  }

  return (
    <div className="user-form-page section is-fluid">
      <OceanExpertNameInput
        oceanExpertName={name}
        onChange={handleOceanExpertProfileChange}/>
      <InputText
        className="institution-code"
        name="userFormPage.email"
        onChange={setEmail}
        value={email}/>
      <div className={classNames('column field')}>
        <label className="label">
          {t('userFormPage.userRole.label')}
        </label>
        <Dropdown
          onChange={role => setRole(role)}
          options={roles}
          value={role}/>
      </div>
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
              checked={selectedDatasets.includes(dataset.id)}
              key={dataset.id}
              license={dataset.license.title}
              onChange={() => handleDatasetToggle(dataset.id)}
              organization={dataset.metadataProviders[0].organizationName || '—'}
              title={dataset.title.value}/>
          ))}
        </tbody>
      </table>
      <AddUserButton disabled={!addUserButtonEnabled} onClick={handleAddUserButtonClick}/>
    </div>
  )
}

function DatasetRow({ title, organization, license, onChange, checked }) {
  return (
    <tr className="user-row">
      <td><input checked={checked} onChange={(e) => onChange(e.target.value)} type="checkbox"/></td>
      <td className="dataset-title">{title}</td>
      <td className="organization">{organization}</td>
      <td className="license">{license}</td>
    </tr>
  )
}

DatasetRow.propTypes = {
  checked:      PropTypes.bool.isRequired,
  license:      PropTypes.string.isRequired,
  onChange:     PropTypes.func.isRequired,
  organization: PropTypes.string.isRequired,
  title:        PropTypes.string.isRequired
}

function AddUserButton({ onClick, disabled }) {
  const { t } = useTranslation()
  return (
    <div className="add-user-button columns is-mobile is-centered">
      <button className="button is-info is-medium" disabled={disabled} onClick={onClick}>
        {t('userFormPage.addUserButton')}
      </button>
    </div>
  )
}

AddUserButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick:  PropTypes.func.isRequired
}
