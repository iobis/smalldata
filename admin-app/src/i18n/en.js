export default {
  translation: {
    common:              {
      add:        'Add',
      cancel:     'Cancel',
      change:     'Change',
      confirm:    'Confirm',
      continueTo: 'Continue to',
      copy:       'Copy',
      edit:       'Edit',
      latitude:   'Latitude',
      longitude:  'Longitude',
      name:       'Name',
      remove:     'Remove',
      type:       'Type',
      unit:       'Unit',
      value:      'Value'
    },
    navbar:              {
      manageDataset: 'MANAGE DATASET',
      manageUsers:   'MANAGE USERS',
      inputData:     'INPUT DATA',
      logout:        'logout',
      login:         'login'
    },
    manageDatasetPage:   {
      inputNew:              'Input New Dataset',
      managePreviousEntries: 'Manage Previous Entries',
      or:                    'OR',
      table:                 {
        title:        'Title',
        organization: 'Organization',
        licence:      'Licence'
      }
    },
    datasetPageFormPage: {
      basicInformation:      {
        step:                   {
          dataDescription: 'Basic Data',
          stepDescription: 'Supply the mandatory information for the dataset',
          stepTitle:       'Basic Information'
        },
        title:                  {
          label: 'Title'
        },
        publishingOrganisation: {
          label: 'Publishing Organisation'
        },
        licence:                {
          label: 'Licence'
        },
        language:               {
          label: 'Language'
        },
        abstract:               {
          label: 'Abstract'
        }
      },
      resourceContacts:      {
        step:                {
          dataDescription: '',
          stepDescription: 'Resource contact details',
          stepTitle:       'Resource Contacts',
          selectedData:    '{{nrOfContacts}} people coupled as resource contact'
        },
        contactsTableHeader: 'Resource creators attached to dataset'
      },
      resourceCreators:      {
        step:                {
          dataDescription: '',
          stepDescription: 'Resource creators details',
          stepTitle:       'Resource Creators',
          selectedData:    '{{nrOfContacts}} people coupled as resource creator'
        },
        contactsTableHeader: 'Resource creators attached to dataset'
      },
      metadataProviders:     {
        step:                {
          dataDescription: '',
          stepDescription: 'Metadata provider details',
          stepTitle:       'Metadata Providers',
          selectedData:    '{{nrOfContacts}} people coupled as metadata provider'
        },
        contactsTableHeader: 'Metadata providers attached to dataset'
      },
      keywords:              {
        step:     {
          dataDescription: 'Couplings',
          stepDescription: 'Specify keywords associated with dataset',
          stepTitle:       'Keywords'
        },
        keywords: {
          help:        'hit enter to add keyword to list',
          label:       'Keywords',
          placeholder: ''
        }
      },
      contactsForm:          {
        name:         {
          label: 'Name'
        },
        email:        {
          label: 'Email'
        },
        organisation: {
          label: 'Organisation'
        },
        position:     {
          label: 'Position'
        }
      },
      reviewAndSubmitButton: 'Review and Submit'
    },
    manageUsersPage:     {
      inputNew:              'Input New User',
      managePreviousEntries: 'Manage Existing Users',
      or:                    'OR',
      table:                 {
        email:            'Email',
        accessToDatasets: 'Access to datasets',
        role:             'Role'
      }
    },
    userFormPage:        {
      submitUserButton: {
        create: 'Create User',
        update: 'Update User'
      },
      email:            {
        label: 'Email'
      },
      userRole:         {
        label: 'User Role'
      },
      name:             {
        label: 'Name'
      },
      successMessage:   {
        header:            {
          create: 'The user has been successfully added',
          update: 'The user has been successfully updated'
        },
        createAnotherUser: 'create another user',
        doNothing:         'no thanks, I am done for today'
      }
    }
  }
}
