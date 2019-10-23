# client
```
    occurrenceData:   {
      basisOfRecord:    'humanObservation',
      beginDate:        Date.UTC(2019, 3, 29),
      endDate:          Date.UTC(2019, 3, 30),
      lifestage:        'adult',
      occurrenceStatus: 'absent',
      scientificName:   'ala abra',
      sex:              'male'
    },
    locationData:     {
      decimalLongitude:      2.345456,
      decimalLatitude:       51.3354656,
      coordinateUncertainty: null,
      minimumDepth:          null,
      maximumDepth:          null,
      verbatimCoordinates:   '41 05 54S 121 05 34W',
      verbatimDepth:         '100 - 200 m'
    },
    observationData:  {
      institutionCode:         'IBSS',
      collectionCode:          'R/V N. Danilevskiy 1935 Azov Sea benthos data',
      fieldNumber:             '557',
      catalogNumber:           'IBSS_Benthos_1935_1331',
      recordNumber:            '123456',
      identifiedBy:            ['Indiana Jones'],
      recordedBy:              ['Harrison Ford'],
      identificationQualifier: 'some identification qualifier',
      identificationRemarks:   'some identification remarks',
      references:              ['http://www.google.com', 'https://clojure.org/']
    },
    measurements:     [
      { type: 'Pressure', unit: 'Decibars', value: '10' },
      { type: 'Pressure', unit: 'Decibars', value: '50' }
    ],
    darwinCoreFields: [
      { name: 'name-1', value: 'value-1' },
      { name: 'name-2', value: 'value-2' },
      { name: 'name-3', value: 'value-3' }
    ]
  }
```


# api

for additional darwin core fields (`darwinCoreFields` on the client), one must group by the name and extract the right 'namespace' from it. These are the mappings:
* `http://purl.org/dc/terms/` -> `purl`
* `http://rs.tdwg.org/dwc/terms` -> `tdwg`
* `http://rs.iobis.org/obis/terms/` -> `iobis`

```json
{
  "core": "occurrence",
  "occurrence": [
    {
      "tdwg": {
        "basisOfRecord": "HumanObservation",
        "eventDate": "2019-03-29/30",
        "lifeStage": "adult",
        "occurrenceStatus": "present",
        "scientificName": "Ala albra",
        "sex": "male",

        "decimalLongitude": 2.345456,
        "decimalLatitude": 51.3354656,
        "coordinateUncertaintyInMeters": 5,
        "minimumDepthInMeters": 5,
        "maximumDepthInMeters": 10,
        "verbatimCoordinates":  "41 05 54S 121 05 34W",
        "verbatimDepth": "100 - 200 m",

        "institutionCode": "IBSS",
        "collectionCode": "R/V N. Danilevskiy 1935 Azov Sea benthos data",
        "fieldNumber": "557",
        "catalogNumber": "IBSS_Benthos_1935_1331",
        "recordNumber": "123456",
        "identifiedBy": "Indiana Jones",
        "recordedBy": "Harrison Ford, Indiana Jones",
        "identificationQualifier": "some identification qualifier",
        "identificationRemarks": "some identification remarks",
         
      },
      "purl": {
        "references": "http://www.google.com, https://clojure.org/"
      }
    }
  ],
  "emof": [
    {
      "tdwg": {
        "measurementType": "Pressure",
        "measurementUnit": "decibars",
        "measurementValue": "10"
      },
      "iobis": {
        "measurementTypeID": "...",
        "measurementUnitID": "..."
      }
    },
    {
      "tdwg": {
        "measurementType": "Pressure",
        "measurementUnit": "decibars",
        "measurementValue": "50"
      },
      "iobis": {
        "measurementTypeID": "...",
        "measurementUnitID": "..."
      }
    }
  ]
}
```
