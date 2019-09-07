import 'react-table/react-table.css'
import Divider from '../layout/Divider'
import React, { useContext, useEffect, useState } from 'react'
import ReactTable from 'react-table'
import { AuthContext } from '@smalldata/dwca-lib'
import { format } from 'date-fns'
import { getDatasets, getOccurrences } from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function InputDataPage() {
  const { t } = useTranslation()
  const { userRef } = useContext(AuthContext)
  const [occurrences, setOccurrences] = useState([])

  useEffect(() => {
    const fetchOccurrences = async() => {
      const [occurrences, datasets] = await Promise.all([
        getOccurrences({ userRef }),
        getDatasets()
      ])
      const datasetRefToTitle = datasets
        .reduce((acc, dataset) => {
          acc[dataset.id] = dataset.title.value
          return acc
        }, {})
      const occurrencesWithDataset = occurrences
        .map(occurrence => ({
          ...occurrence,
          datasetTitle: datasetRefToTitle[occurrence.dataset]
        }))
      setOccurrences(occurrencesWithDataset)
    }
    fetchOccurrences()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [{
    id:       'editButton',
    width:    100,
    sortable: false,
    Cell:     props => (
      <Link
        className="button is-info"
        to={{
          pathname: '/input-data/update',
          // eslint-disable-next-line react/prop-types
          state:    { action: 'update', dwcaId: props.value.dwcaId, datasetId: props.value.datasetId }
        }}>
        {t('common.edit')}
      </Link>
    ),
    accessor: occurrence => ({ dwcaId: occurrence.dwcaId, datasetId: occurrence.dataset })
  }, {
    width:     150,
    className: 'added-at',
    id:        'addedAt',
    Header:    t('inputDataPage.table.addedAt'),
    accessor:  occurrence => occurrence.addedAtInstant ? format(occurrence.addedAtInstant, 'D MMMM YYYY') : '—'
  }, {
    width:    250,
    id:       'scientificName',
    Header:   t('inputDataPage.table.scientificName'),
    accessor: occurrence => occurrence.dwcRecords.occurrence[0].tdwg.scientificName
  }, {
    Header:   t('inputDataPage.table.datasetTitle'),
    accessor: 'datasetTitle'
  }, {
    width:    150,
    id:       'occurrenceDate',
    Header:   t('inputDataPage.table.occurrenceDate'),
    accessor: occurrence => occurrence.dwcRecords.occurrence[0].tdwg.eventDate
  }, {
    id:       'copyButton',
    sortable: false,
    width:    100,
    Cell:     props => (
      <Link
        className="button is-info copy-previous-entry"
        to={{
          pathname: '/input-data/create',
          // eslint-disable-next-line react/prop-types
          state:    { action: 'update', dwcaId: props.value.dwcaId, datasetId: props.value.datasetId }
        }}>
        {t('common.copy')}
      </Link>
    ),
    accessor: occurrence => ({ dwcaId: occurrence.dwcaId, datasetId: occurrence.dataset })
  }]
  return (
    <>
      <section className="section">
        <div className="container is-fluid has-text-centered">
          <Link className="button is-info new" to="/input-data/create">
            {t('inputDataPage.inputNewOccurrence')}
          </Link>
        </div>
      </section>
      <Divider>{t('inputDataPage.or')}</Divider>
      <section className="previous-occurrences section">
        <div className="container is-fluid has-text-centered">
          <h4 className="title is-4">{t('inputDataPage.copyPreviousHeader')}</h4>
          <ReactTable
            className="occurrences-table table is-striped is-hoverable is-fullwidth"
            columns={columns}
            data={occurrences}
            defaultPageSize={10}/>
        </div>
      </section>
    </>
  )
}
