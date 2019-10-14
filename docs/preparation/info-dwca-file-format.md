![](https://github.com/iobis/smalldata/blob/master/info/dwc.png)

dwca extensions: http://rs.gbif.org/extension/

# meta.xml

https://dwc.tdwg.org/text/

* info about text file format (delimiters etc)
* describe columns
* if extensions to core file are used, add `coreId` to link to the corresponding column of the core file

# eml.xml

https://knb.ecoinformatics.org/external//emlparser/docs/index.html

----

occurence.txt
```
id	basisOfRecord	eventDate	decimalLatitude	decimalLongitude	scientificName
	HumanObservation	2018-01-02	54.1	3.2	Abra alba
```

meta.xml
```
<archive xmlns="http://rs.tdwg.org/dwc/text/" metadata="eml.xml">
  <core encoding="UTF-8" fieldsTerminatedBy="\t" linesTerminatedBy="\n" fieldsEnclosedBy="" ignoreHeaderLines="1" rowType="http://rs.tdwg.org/dwc/terms/Occurrence">
    <files>
      <location>occurrence.txt</location>
    </files>
    <id index="0" />
    <field index="1" term="http://rs.tdwg.org/dwc/terms/basisOfRecord"/>
    <field index="2" term="http://rs.tdwg.org/dwc/terms/eventDate"/>
    <field index="3" term="http://rs.tdwg.org/dwc/terms/decimalLatitude"/>
    <field index="4" term="http://rs.tdwg.org/dwc/terms/decimalLongitude"/>
    <field index="5" term="http://rs.tdwg.org/dwc/terms/scientificName"/>
  </core>
</archive>
```

eml.xml
```
<eml:eml xmlns:eml="eml://ecoinformatics.org/eml-2.1.1"
         xmlns:dc="http://purl.org/dc/terms/"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="eml://ecoinformatics.org/eml-2.1.1 http://rs.gbif.org/schema/eml-gbif-profile/1.1/eml.xsd"
         packageId="http://ipt.iobis.org/training/resource?id=test-kurt2/v1.0" system="http://gbif.org" scope="system"
         xml:lang="eng">

<dataset>
  <alternateIdentifier>http://ipt.iobis.org/training/resource?r=test-kurt2</alternateIdentifier>
  <title xml:lang="eng">test-kurt2</title>
      <creator>
    <individualName>
      <surName>Pieter</surName>
    </individualName>
    <organizationName>UNESCO</organizationName>
    <positionName>data manager</positionName>
      </creator>
      <metadataProvider>
    <individualName>
      <surName>Pieter</surName>
    </individualName>
    <organizationName>UNESCO</organizationName>
    <positionName>data manager</positionName>
      </metadataProvider>
      <associatedParty>
    <individualName>
        <givenName>Pieter</givenName>
      <surName>Provoost</surName>
    </individualName>
    <electronicMailAddress>p.provoost@unesco.org</electronicMailAddress>
    <role>user</role>
      </associatedParty>
  <pubDate>
      2019-02-04
  </pubDate>
  <language>eng</language>
  <abstract>
    <para>This is my test dataset.</para>
  </abstract>
      <keywordSet>
            <keyword>Occurrence</keyword>
        <keywordThesaurus>GBIF Dataset Type Vocabulary: http://rs.gbif.org/vocabulary/gbif/dataset_type.xml</keywordThesaurus>
      </keywordSet>
  <intellectualRights>
    <para>To the extent possible under law, the publisher has waived all rights to these data and has dedicated them to the <ulink url="http://creativecommons.org/publicdomain/zero/1.0/legalcode"><citetitle>Public Domain (CC0 1.0)</citetitle></ulink>. Users may copy, modify, distribute and use the work, including for commercial purposes, without restriction.</para>
  </intellectualRights>
  <maintenance>
    <description>
      <para></para>
    </description>
    <maintenanceUpdateFrequency>unkown</maintenanceUpdateFrequency>
  </maintenance>

      <contact>
    <individualName>
      <surName>Pieter</surName>
    </individualName>
    <organizationName>UNESCO</organizationName>
    <positionName>data manager</positionName>
      </contact>
</dataset>
  <additionalMetadata>
    <metadata>
      <gbif>
          <dateStamp>2019-02-04T09:39:23.108+01:00</dateStamp>
          <hierarchyLevel>dataset</hierarchyLevel>
      </gbif>
    </metadata>
  </additionalMetadata>
</eml:eml>
```

# DWC tables (and extensions)

Record-level | occurence | event | taxon
------------ | --------- | ----- | -----
type | x | x |
modified | x | x | x
language | x | x | x
license | x | x | x
rightsHolder | x | x | x
accessRights | x | x | x
bibliographicCitation | x | x | x
references | x | x | x
institutionID | x | x |
collectionID | x | |
datasetID | x | x | x
institutionCode | x | x |
collectionCode | x | |
datasetName | x | x | x
ownerInstitutionCode | x | x |
basisOfRecord | R | |
informationWithheld | x | x | x
dataGeneralizations | x | x |
dynamicProperties | x | x |

Occurence | occurence | emof
------------ | --------- | -----
occurrenceID | x | x
catalogNumber | x 
recordNumber | x 
recordedBy | x 
individualCount | x 
organismQuantity | x 
organismQuantityType | x 
sex | x 
lifeStage | x 
reproductiveCondition | x 
behavior | x 
establishmentMeans | x
occurrenceStatus | x 
preparations | x 
disposition | x 
associatedMedia | x 
associatedReferences | x 
associatedSequences | x 
associatedTaxa | x 
otherCatalogNumbers | x 
occurrenceRemarks | x 

Organism | occurence 
------------ | ---------
organismID | x
organismName | x 
organismScope | x 
associatedOccurrences | x 
associatedOrganisms | x
previousIdentifications | x
organismRemarks | x

MaterialSample | occurence 
------------ | --------- 
materialSample | 
materialSampleID | x 

Event | occurence | event 
------------ | --------- | ----- 
eventID | x | x 
parentEventID | x | x 
fieldNumber | x | x 
eventDate | x | x 
eventTime | x | x 
startDayOfYear | x | x 
endDayOfYear | x | x 
year | x | x 
month | x | x 
day | x | x 
verbatimEventDate | x | x 
habitat | x | x 
samplingProtocol | x | x 
sampleSizeValue | x | x 
sampleSizeUnit | x | x 
samplingEffort | x | x 
fieldNotes | x | x 
eventRemarks | x | x 

Location | occurence | event 
------------ | --------- | ----- 
locationID | x | x 
higherGeographyID | x | x 
higherGeography | x | x 
continent | x | x 
waterBody | x | x 
islandGroup | x | x 
island | x | x 
country | x | x 
countryCode | x | x 
stateProvince | x | x 
county | x | x 
municipality | x | x 
locality | x | x 
verbatimLocality | x | x 
minimumElevationInMeters | x | x 
maximumElevationInMeters | x | x 
verbatimElevation | x | x 
minimumDepthInMeters | x | x 
maximumDepthInMeters | x | x 
verbatimDepth | x | x 
minimumDistanceAboveSurfaceInMeters | x | x 
maximumDistanceAboveSurfaceInMeters | x | x 
locationAccordingTo | x | x 
locationRemarks | x | x 
decimalLatitude | x | x 
decimalLongitude | x | x 
geodeticDatum | x | x 
coordinateUncertaintyInMeters | x | x 
coordinatePrecision | x | x 
pointRadiusSpatialFit | x | x 
verbatimCoordinates | x | x 
verbatimLatitude | x | x 
verbatimLongitude | x | x 
verbatimCoordinateSystem | x | x 
verbatimSRS | x | x 
footprintWKT | x | x 
footprintSRS | x | x 
footprintSpatialFit | x | x 
georeferencedBy | x | x 
georeferencedDate | x | x 
georeferenceProtocol | x | x 
georeferenceSources | x | x 
georeferenceVerificationStatus | x | x 
georeferenceRemarks | x | x 

GeologicalContext | occurence | event 
------------ | --------- | ----- 
geologicalContextID | x | x 
earliestEonOrLowestEonothem | x | x 
latestEonOrHighestEonothem | x | x 
earliestEraOrLowestErathem | x | x 
latestEraOrHighestErathem | x | x 
earliestPeriodOrLowestSystem | x | x 
latestPeriodOrHighestSystem | x | x 
earliestEpochOrLowestSeries | x | x 
latestEpochOrHighestSeries | x | x 
earliestAgeOrLowestStage | x | x 
latestAgeOrHighestStage | x | x 
lowestBiostratigraphicZone | x | x 
highestBiostratigraphicZone | x | x 
lithostratigraphicTerms | x | x 
group | x | x 
formation | x | x 
member | x | x 
bed | x | x 

Identification | occurence 
------------ | --------- 
identificationID | x 
identificationQualifier | x 
typeStatus | x 
identifiedBy | x 
dateIdentified | x 
identificationReferences | x 
identificationVerificationStatus | x 
identificationRemarks | x 

Taxon | occurence | taxon
------------ | ----- | -----
taxonID | x | x
scientificNameID | x | x
acceptedNameUsageID | x | x
parentNameUsageID | x | x
originalNameUsageID | x | x
nameAccordingToID | x | x
namePublishedInID | x | x
taxonConceptID | x | x
scientificName | x | x
acceptedNameUsage | x | x
parentNameUsage | x | x
originalNameUsage | x | x
nameAccordingTo | x | x
namePublishedIn | x | x
namePublishedInYear | x | x
higherClassification | x | x
kingdom | x | x
phylum | x | x
class | x | x
order | x | x
family | x | x
genus | x | x
subgenus | x | x
specificEpithet | x | x
infraspecificEpithet | x | x
taxonRank | x | x
verbatimTaxonRank | x | x
scientificNameAuthorship | x | x
vernacularName | x | x
nomenclaturalCode | x | x
taxonomicStatus | x | x
nomenclaturalStatus | x | x
taxonRemarks | x | x

MeasurementOrFact | emof
------------ | ----
measurementID | x
measurementType | x
measurementValue | x
measurementAccuracy | x
measurementUnit | x
measurementDeterminedBy | x
measurementDeterminedDate | x
measurementMethod | x
measurementRemarks | x

ResourceRelationship |
------------ |
resourceRelationshipID
resourceID
relatedResourceID
relationshipOfResource
relationshipAccordingTo
relationshipEstablishedDate
relationshipRemarks 

UseWithIRI |
------------ |
inDescribedPlace
identifiedBy
recordedBy
toTaxon
inCollection
georeferencedBy
behavior
dataGeneralizations
disposition
earliestGeochronologicalEra
establishmentMeans
fieldNotes
fieldNumber
footprintSRS
footprintWKT
fromLithostratigraphicUnit
geodeticDatum
georeferenceProtocol
georeferenceSources
georeferenceVerificationStatus
habitat
identificationQualifier
identificationVerificationStatus
inDataset
informationWithheld
latestGeochronologicalEra
lifeStage
locationAccordingTo
measurementDeterminedBy
measurementMethod
measurementType
measurementUnit
occurrenceStatus
organismQuantityType
preparations
recordNumber
reproductiveCondition
sampleSizeUnit
samplingProtocol
sex
typeStatus
verbatimCoordinateSystem
verbatimSRS 

LivingSpecimen |
------------ |
LivingSpecimen

PreservedSpecimen |
------------ | 
PreservedSpecimen

FossilSpecimen |
------------ |
FossilSpecimen

HumanObservation |
------------ |
HumanObservation

MachineObservation |
------------ |
MachineObservation


[ext:] emof | emof 
----------- | -----
measurementTypeID | x
measurementValueID | x
measurementUnitID | x
