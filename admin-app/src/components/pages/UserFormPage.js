import classNames from 'classnames'
import Dropdown from '@smalldata/dwca-lib/src/components/form/Dropdown'
import InputText from '@smalldata/dwca-lib/src/components/form/InputText'
import OceanExpertNameInput from './OceanExpertNameInput/OceanExpertNameInput'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { createUser, getDatasets, updateUser } from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import { Link } from 'react-router-dom'
import { scrollToRef } from '@smalldata/dwca-lib/src/browser/scroll'
import { useTranslation } from 'react-i18next'

const roles = ['researcher', 'node manager']

export default function UserFormPage({ location }) {
  const initialState = createInitialState(location)
  const { t } = useTranslation()
  const [datasets, setDatasets] = useState([])
  const [action, setAction] = useState(initialState.action)
  const [name, setName] = useState(initialState.name)
  const [email, setEmail] = useState(initialState.email)
  const [role, setRole] = useState(initialState.role)
  const [selectedDatasets, setSelectedDatasets] = useState(initialState.selectedDatasets)
  const addUserButtonEnabled = name && email
  const [successVisible, setSuccessVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const successMessageRef = useRef()
  const errorMessageRef = useRef()

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

  async function handleSubmitUserButtonClick() {
    const user = {
      datasetIds: selectedDatasets,
      email,
      name,
      role
    }
    const response = action === 'update' && !!location.state.id
      ? await updateUser({ id: location.state.id, ...user })
      : await createUser(user)

    if (response.exception) {
      setErrorVisible(true)
      setErrorMessage(response.exception + ': ' + response.exceptionMessage)
      scrollToRef(errorMessageRef)
    } else {
      setSuccessVisible(true)
      scrollToRef(successMessageRef)
    }
  }

  function handleErrorClose() {
    setErrorVisible(false)
    setErrorMessage('')
  }

  function handleCreateAnotherUserClick() {
    const initialState = createInitialState()
    setAction('create')
    setSuccessVisible(false)
    setName(initialState.name)
    setEmail(initialState.email)
    setRole(initialState.role)
    setSelectedDatasets(initialState.selectedDatasets)
  }

  return (
    <div className="user-form-page section is-fluid">
      <OceanExpertNameInput
        oceanExpertName={name}
        onChange={handleOceanExpertProfileChange}/>
      <InputText
        className="email"
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
      {successVisible ? (
        <div className="success-message notification is-success" ref={successMessageRef}>
          <p className="title">{t('userFormPage.successMessage.header.create')}</p>
          <section>
            <button className="create-another-user button is-white" onClick={handleCreateAnotherUserClick}>
              {t('userFormPage.successMessage.createAnotherUser')}
            </button>
          </section>
          <section>
            <Link className="is-size-5" to="/">
              {t('userFormPage.successMessage.doNothing')}
            </Link>
          </section>
        </div>) : null}
      {errorVisible ? (
        <div className="error-message notification is-danger" ref={errorMessageRef}>
          <button className="close delete" onClick={handleErrorClose}/>
          {errorMessage}
        </div>) : null}
      {!successVisible
        ? <SubmitUserButton action={action} disabled={!addUserButtonEnabled} onClick={handleSubmitUserButtonClick}/>
        : null
      }
    </div>
  )
}

UserFormPage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      id:         PropTypes.string.isRequired,
      action:     PropTypes.oneOf(['create', 'update']),
      datasetIds: PropTypes.arrayOf(PropTypes.string).isRequired,
      email:      PropTypes.string.isRequired,
      name:       PropTypes.string.isRequired,
      role:       PropTypes.string.isRequired
    })
  })
}

function DatasetRow({ title, organization, license, onChange, checked }) {
  return (
    <tr className="dataset-row">
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

function SubmitUserButton({ onClick, disabled, action }) {
  const { t } = useTranslation()
  return (
    <div className="submit-user-button columns is-mobile is-centered">
      <button className="button is-info is-medium" disabled={disabled} onClick={onClick}>
        {t('userFormPage.submitUserButton.' + action)}
      </button>
    </div>
  )
}

SubmitUserButton.propTypes = {
  action:   PropTypes.oneOf(['create', 'update']).isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick:  PropTypes.func.isRequired
}

function createInitialState(location) {
  const defaultInitialState = {
    action:           'create',
    name:             '',
    email:            '',
    role:             roles[0],
    selectedDatasets: []
  }
  return !!location && !!location.state
    ? {
      action:           location.state.action || defaultInitialState.action,
      name:             location.state.name || defaultInitialState.name,
      email:            location.state.email || defaultInitialState.email,
      role:             location.state.role || defaultInitialState.role,
      selectedDatasets: location.state.datasetIds || defaultInitialState.selectedDatasets
    }
    : defaultInitialState
}
