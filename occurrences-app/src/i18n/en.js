export default {
  translation: {
    common:         {
      add:          'Add',
      cancel:       'Cancel',
      change:       'Change',
      confirm:      'Confirm',
      continueTo:   'Continue to',
      copy:         'Copy',
      edit:         'Edit',
      latitude:     'Latitude',
      longitude:    'Longitude',
      name:         'Name',
      notAvailable: 'Not Available',
      remove:       'Remove',
      submit:       'Submit',
      type:         'Type',
      unit:         'Unit',
      value:        'Value'
    },
    helpPage:       {
      contactEmail: 'mailto:pieter@obis.be'
    },
    inputDataPage:  {
      inputNewOccurrence: 'INPUT NEW OCCURRENCE',
      or:                 'OR',
      copyPreviousHeader: 'copy from previous entries',
      table:              {
        datasetTitle:   'Dataset',
        addedAt:        'Date Added',
        occurrenceDate: 'Occurrence Date',
        scientificName: 'Scientific Name'
      }
    },
    occurrenceForm: {
      occurrenceNotSupported: {
        exceptionMessage: '{{message}} of dwca object',
        hideDetails:      'Hide details',
        linkMessage:      'Return to occurrences page.',
        message:          'Not able to process occurrence. Most likely it was created by external system.',
        showDetails:      'Show details'
      },
      copyPreviousStep:       'copy data from previous entry',
      reviewAndSubmitButton:  'Review & Submit',
      dataset:                {
        step: {
          dataDescription: 'Dataset',
          stepDescription: 'Choose the dataset for adding observations',
          stepTitle:       'Selected Dataset'
        }
      },
      occurrenceData:         {
        step:                {
          dataDescription: 'Given Values',
          stepDescription: 'Identification related properties',
          stepTitle:       'Identification'
        },
        scientificNameInput: {
          wormsInfo: 'scientific names are retrieved from the WoRMS database by using the webservices available at '
        },
        scientificName:      'Scientific name',
        scientificNameId:    'Scientific name ID',
        occurrenceStatus:    {
          title:   'Occurrence status',
          absent:  'absent',
          present: 'present'
        },
        basisOfRecord:       {
          title:              'Basis of record',
          humanObservation:   'human observation',
          fossilSpecimen:     'fossil specimen',
          livingSpecimen:     'living specimen',
          machineObservation: 'machine observation',
          preservedSpecimen:  'preserved specimen'
        },
        sex:                 {
          title:       'Sex',
          male:        'male',
          female:      'female',
          unspecified: 'unspecified'
        },
        lifeStage:           {
          title:       'Life stage',
          larva:       'larva',
          juvenile:    'juvenile',
          adult:       'adult',
          unspecified: 'unspecified'
        },
        identificationQualifier: {
          label:       'Identification qualifier',
          placeholder: '',
          help:        'aff. agrifolia var. oxyadenia (for Quercus aff. agrifolia var. oxyadenia with accompanying values Quercus in genus, agrifolia in specificEpithet, oxyadenia in infraspecificEpithet, and var. in taxonRank. cf. var. oxyadenia for Quercus agrifolia cf. var. oxyadenia with accompanying values Quercus in genus, agrifolia in specificEpithet, oxyadenia in infraspecificEpithet, and var. in taxonRank.'
        },
        identificationRemarks:   {
          label:       'Identification remarks',
          placeholder: '',
          help:        'Example: “Distinguished between Anthus correndera and Anthus hellmayri based on the comparative lengths of the uñas.”'
        }
      },
      locationData:           {
        enterCoordinates:      {
          title:    'Location'
        },
        verbatimData:          {
          title:    'Verbatim location',
          subtitle: 'optionally supply verbatim data as it appeared originally in the source'
        },
        timeData:          {
          title:    'Time'
        },
        decimalLongitude:      {
          label:       'Decimal longitude',
          placeholder: '5.12334'
        },
        decimalLatitude:       {
          label:       'Decimal latitude',
          placeholder: '53.2345'
        },
        coordinateUncertainty: {
          label:       'Coordinate uncertainty',
          placeholder: '',
          help:        'meters'
        },
        minimumDepth:          {
          label:       'Minimum depth',
          placeholder: '',
          help:        'meters'
        },
        maximumDepth:          {
          label:       'Maximum depth',
          placeholder: '',
          help:        'meters'
        },
        verbatimCoordinates:   {
          label:       'Verbatim coordinates',
          placeholder: '',
          help:        'Example: "41 05 54S 121 05 34W", "17T 630000 4833400"'
        },
        verbatimDepth:         {
          label:       'Verbatim depth',
          placeholder: '',
          help:        'Example: "100-200 m"'
        },
        eventBeginDate:      'Event start date',
        eventEndDate:        'Event end date',
        eventEndDateHelp:    'optional: only in case of date range',
        step:                  {
          stepDescription: 'Select the time and location for data collected',
          stepTitle:       'Time and location',
          dataDescription: 'Main location',
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
      observationData:        {
        step:                    {
          dataDescription: 'Main info',
          stepDescription: 'Enter further specifics',
          stepTitle:       'Identifiers and references'
        },
        institutionCode:         {
          label:       'Institution code',
          placeholder: 'institution code'
        },
        collectionCode:          {
          label:       'Collection code',
          placeholder: 'collection code'
        },
        fieldNumber:             {
          label:       'Field number',
          placeholder: 'field number'
        },
        catalogNumber:           {
          label:       'Catalog number',
          placeholder: 'catalog number'
        },
        recordNumber:            {
          label:       'Record number',
          placeholder: 'record number'
        },
        identifiedBy:            {
          label:       'Identified by',
          placeholder: '',
          help:        'hit enter to add person to list'
        },
        recordedBy:              {
          label:       'Recorded by',
          placeholder: '',
          help:        'hit enter to add person to list'
        },
        references:              {
          label:       'References',
          placeholder: '',
          help:        'hit enter to add a reference to list'
        }
      },
      measurementOrFact:      {
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
      darwinCoreFields:       {
        step:      {
          stepDescription: 'Add other Darwin core fields',
          stepTitle:       'Other Darwin Core fields'
        },
        title:     '',
        subtitle:  'This form allows you to add any additional Darwin Core fields that were not previously included in the form.',
        tip:       '',
        fieldName: {
          label:       'Darwin core field name',
          placeholder: '',
          help:        ''
        },
        value:     {
          label:       'Value',
          placeholder: '',
          help:        ''
        }
      },
      finalSummary:           {
        title:           'Final Summary',
        locationData:    {
          verbatimDataSubtitle: 'Verbatim data'
        },
        observationData: {
          catalogDataSubtitle: 'Catalog data',
          speciesDataSubtitle: 'Species data'
        },
        successMessage:  {
          header:            {
            create: 'Your entry has been added to the OBIS dataset.',
            update: 'Your entry has been updated.'
          },
          nextOptions:       'What would you like to do next?',
          createFreshButton: 'Create fresh occurrence',
          createFromThis:    'Create new based on this',
          doNothing:         'nothing, I\'m done here for today'
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
