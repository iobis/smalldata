export default {
  translation: {
    common:         {
      add:       'Add',
      cancel:    'Cancel',
      change:    'Change',
      confirm:   'Confirm',
      copy:      'Copy',
      edit:      'Edit',
      latitude:  'Latitude',
      longitude: 'Longitude',
      name:      'Name',
      remove:    'Remove',
      type:      'Type',
      unit:      'Unit',
      value:     'Value'
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
      selectDataset:     {
        step: {
          dataDescription: 'Using Data',
          stepDescription: 'Choose the dataset for adding observations',
          stepTitle:       'Selected Dataset'
        }
      },
      occurrenceData:    {
        step:             {
          dataDescription: 'Given Values',
          stepDescription: 'Mandatory observation information',
          stepTitle:       'Occurrence Data'
        },
        scientificName:   'Scientific Name',
        eventBeginDate:   'Event Begin Date',
        eventEndDate:     'Event End Date',
        eventEndDateHelp: 'optional: only in case of date range',
        occurrenceStatus: {
          title:   'Occurrence Status',
          absent:  'absent',
          present: 'present'
        },
        basisOfRecord:    {
          title:              'Basis of Record',
          humanObservation:   'human observation',
          fossilSpecimen:     'fossil specimen',
          livingSpecimen:     'living specimen',
          machineObservation: 'machine observation',
          preservedSpecimen:  'preserved specimen'
        },
        sex:              {
          title:       'Sex',
          male:        'male',
          female:      'female',
          unspecified: 'unspecified'
        },
        lifestage:        {
          title:       'Lifestage',
          larva:       'larva',
          juvenile:    'juvenile',
          adult:       'adult',
          unspecified: 'unspecified'
        }
      },
      locationData:      {
        enterCoordinates:      {
          title:    'Enter coordinates',
          subtitle: 'bold fields are mandatory'
        },
        verbatimData:          {
          title:    'Verbatim Data',
          subtitle: 'optionally supply verbatim data as it appeared originally in the notes'
        },
        decimalLongitude:      {
          label:       'decimal longitude',
          placeholder: '5.12334'
        },
        decimalLatitude:       {
          label:       'decimal latitude',
          placeholder: '53.2345'
        },
        coordinateUncertainty: {
          label:       'coordinate uncertainty',
          placeholder: '',
          help:        'meters'
        },
        minimumDepth:          {
          label:       'minimum depth',
          placeholder: '',
          help:        'meters'
        },
        maximumDepth:          {
          label:       'maximum depth',
          placeholder: '',
          help:        'meters'
        },
        verbatimCoordinates:   {
          label:       'verbatim coordinates',
          placeholder: '',
          help:        'Example: "41 05 54S 121 05 34W", "17T 630000 4833400"'
        },
        verbatimDepth:         {
          label:       'verbatim depth',
          placeholder: '',
          help:        'Examples: "100-200 m"'
        },
        step:                  {
          stepDescription: 'Select the location for data collected',
          stepTitle:       'Location Data',
          dataDescription: 'Main Location',
          selectedData:    {
            latitude:  'Latitude',
            longitude: 'Longitude'
          }
        },
        locationPicker:        {
          emptyResult:    'No search results yet',
          emptyResultTip: 'Have you tried entering an address in the geocoding box?',
          resultsTitle:   'Results',
          searchTip:      'Find location by name',
          title:          'Don\'t know the exact coordinates?'
        }
      },
      observationData:   {
        step:                    {
          dataDescription: 'Main Info',
          stepDescription: 'Enter further specifics',
          stepTitle:       'Observation Data'
        },
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
      },
      measurementOrFact: {
        step:     {
          dataDescription: 'Given values',
          stepDescription: 'Enter further specifics',
          stepTitle:       'Measurement or Fact',
          title:           'You have submitted {{number}} extra fields'
        },
        general:  {
          title:    'STEP 1: General sample information',
          subtitle: 'Supply any information you may have on the sample, setting, environment, ...'
        },
        specific: {
          title:    'STEP 2: Specific measurements or facts',
          subtitle: 'Enter the exact measurements or facts consecutively'
        },
        supplied: {
          title: 'Supplied measurements or facts'
        }
      },
      darwinCoreFields:  {
        step:      {
          stepDescription: 'Supply specific Darwin core fields',
          stepTitle:       'Darwin Core Fields'
        },
        title:     'Darwin Core Custom Selection',
        subtitle:  'This form enables you to add any additional fields you may need to specify, that were not previously included in this form.',
        tip:       'Please be advised to use the Darwin Core Archive names',
        fieldName: {
          label:       'Darwin core fieldname',
          placeholder: '',
          help:        ''
        },
        value:     {
          label:       'Value',
          placeholder: '',
          help:        ''
        }
      },
      finalSummary:      {
        submitEntryButton: 'Submit Entry',
        title:             'Final Summary',
        locationData:      {
          verbatimDataSubtitle: 'Verbatim data'
        },
        observationData:   {
          catalogDataSubtitle: 'Catalog data',
          speciesDataSubtitle: 'Species data'
        }
      }
    },
    navbar:         {
      help:      'HELP',
      inputData: 'INPUT DATA',
      logout:    'logout',
      login:     'login'
    }
  }
}
