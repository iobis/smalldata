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
        institutionCode:         {
          label:       'institution code',
          placeholder: 'institution code'
        },
        collectionCode:          {
          label:       'collection code',
          placeholder: 'collection code'
        },
        fieldNumber:             {
          label:       'field number',
          placeholder: 'field number'
        },
        catalogNumber:           {
          label:       'catalog number',
          placeholder: 'catalog number'
        },
        recordNumber:            {
          label:       'record number',
          placeholder: 'record number'
        },
        identifiedBy:            {
          label:       'identified by',
          placeholder: '',
          help:        'hit enter to add person to list'
        },
        recordedBy:              {
          label:       'recorded by',
          placeholder: '',
          help:        'hit enter to add person to list'
        },
        identificationQualifier: {
          label:       'identification qualifier',
          placeholder: '',
          help:        'aff. agrifolia var. oxyadenia (for Quercus aff. agrifolia var. oxyadenia with accompanying values Quercus in genus, agrifolia in specificEpithet, oxyadenia in infraspecificEpithet, and var. in taxonRank. cf. var. oxyadenia for Quercus agrifolia cf. var. oxyadenia with accompanying values Quercus in genus, agrifolia in specificEpithet, oxyadenia in infraspecificEpithet, and var. in taxonRank.'
        },
        identificationRemarks:   {
          label:       'identification remarks',
          placeholder: '',
          help:        'Example: “Distinguished between Anthus correndera and Anthus hellmayri based on the comparative lengths of the uñas.”'
        },
        references:              {
          label:       'references',
          placeholder: '',
          help:        'hit enter to add a reference to list'
        }
      }
    },
    navbar:         {
      help:      'HELP',
      inputData: 'INPUT DATA',
      logout:    'logout'
    }
  }
}
