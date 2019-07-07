import React, { useState } from 'react'
import InputText from '@smalldata/dwca-lib/src/components/form/InputText'
import Dropdown from '@smalldata/dwca-lib/src/components/form/Dropdown'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

const roles = ['researcher', 'node manager']

export default function UserFormPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(roles[0])

  return (
    <div className="user-form-page section is-fluid">
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
    </div>
  )
}
