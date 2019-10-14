Full list of occurrence terms: http://rs.gbif.org/core/dwc_occurrence_2015-07-02.xml

* Required terms:
  * occurrenceID (globally unique)
  * eventDate (ISO8601) ranges: https://obis.org/manual/darwincore/#time
  * decimalLongitude (numeric, decimal degrees)
  * decimalLatitude (numeric, decimal degrees) http://marineregions.org/ -> map component https://github.com/iobis/map 
  * scientificName (name as originally provided)
  * scientificNameID (WoRMS LSID)
  * occurrenceStatus (absent, present)
  * basisOfRecord (PreservedSpecimen, FossilSpecimen, LivingSpecimen, HumanObservation, MachineObservation)
* Other important terms:
  * references
  * coordinateUncertaintyInMeters (numeric)
  * locality
  * institutionCode
  * collectionCode
  * catalogNumber
  * fieldNumber
  * minimumDepthInMeters (numeric)
  * maximumDepthInMeters (numeric)
  * identificationQualifier
  * identificationRemarks
  * recordedBy
  * identifiedBy
  * occurrenceRemarks
  * footprintWKT (WKT)
  * verbatimEventDate
  * verbatimCoordinates
  * verbatimDepth
* Interesting terms, but probably to be encoded as MeasurementOrFact:
  * organismQuantity
  * organismQuantityType
  * sex
  * lifeStage

replacement list on http://rs.gbif.org/extension/obis/extended_measurement_or_fact.xml
