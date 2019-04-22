export default {
  translation: {
    common:         {
      copy: 'Copy',
      edit: 'Edit'
    },
    inputDataPage:  {
      inputNewOccurrence: 'INPUT NEW OCCURRENCE',
      or:                 'OR',
      copyPreviousHeader: 'copy from previous entries',
      table:              {
        dataset:        'Dataset',
        dateAdded:      'Date Added',
        occurrenceDate: 'Occurrence Date',
        scientificName: 'Scientific Name'
      }
    },
    occurrenceForm: {
      selectDataset:   {
        dataDescription: 'Using Data',
        stepDescription: 'Choose the dataset for adding observations',
        stepTitle:       'Selected Dataset'
      },
      basicData:       {
        scientificName:   'Scientific name',
        eventBeginDate:   'Event begin date',
        eventEndDate:     'Event end date',
        eventEndDateHelp: 'optional: only in case of date range',
        occurrenceStatus: {
          title:   'Occurrence status',
          absent:  'absent',
          present: 'present'
        },
        basisOfRecord:    {
          title:             'Basis of record',
          humanObservation:  'human observation',
          fossilSpecimen:    'fossil specimen',
          livingSpecimen:    'living specimen',
          machineSpecimen:   'machine specimen',
          preservedSpecimen: 'preserved specimen'
        },
        sex:              {
          title:         'Sex',
          male:          'male',
          female:        'female',
          hermaphrodite: 'hermaphrodite',
          unspecified:   'unspecified'
        },
        lifestage:        {
          title:       'Lifestage',
          egg:         'egg',
          eft:         'eft',
          juvenile:    'juvenile',
          adult:       'adult',
          unspecified: 'unspecified'
        }
      },
      observationData: {
        institutionCode: {
          label:       'institution code',
          placeholder: 'institution code'
        },
        collectionCode: {
          label:       'collection code',
          placeholder: 'collection code'
        },
        fieldNumber: {
          label:       'field number',
          placeholder: 'field number'
        },
        catalogNumber: {
          label:       'catalog number',
          placeholder: 'catalog number'
        },
        recordNumber: {
          label:       'record number',
          placeholder: 'record number'
        },
      }
    },
    navbar:         {
      help:      'HELP',
      inputData: 'INPUT DATA',
      logout:    'logout'
    }
  }
}
