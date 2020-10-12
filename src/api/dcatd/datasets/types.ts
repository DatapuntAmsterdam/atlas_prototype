export interface DcatDataset {
  'ams:license': string
  'ams:modifiedby'?: string
  'ams:owner': string
  'ams:sort_modified'?: string
  'ams:spatialDescription'?: string
  'ams:spatialUnit'?: string
  'ams:status': string
  'ams:temporalUnit': string
  'dcat:contactPoint': DcatContactPoint
  'dcat:distribution': DcatDistribution[]
  'dcat:keyword': string[]
  'dcat:landingPage'?: string
  'dcat:theme': string[]
  'dct:accrualPeriodicity'?: string
  'dct:description': string
  'dct:identifier'?: string
  'dct:language': string
  'dct:publisher': DcatPublisher
  'dct:source'?: string
  'dct:spatial'?: string
  'dct:temporal'?: DcatTemporal
  'dct:title': string
  'foaf:isPrimaryTopicOf': DcatPrimaryTopic
  'overheid:grondslag'?: string
  'overheidds:doel': string
}

export interface DcatContactPoint {
  'vcard:fn': string
  'vcard:hasEmail'?: string
  'vcard:hasUrl'?: string
}

export interface DcatDistribution {
  'ams:classification'?: string
  'ams:distributionType': string
  'ams:layerIdentifier'?: string
  'ams:purl'?: string
  'ams:resourceType'?: string
  'ams:serviceType': string
  'dc:identifier'?: string
  'dcat:accessUrl': string
  'dcat:byteSize'?: number
  'dcat:mediaType'?: string
  'dcat:description'?: string
  'dcat:modified'?: string
  'dcat:title': string
  'foaf:isPrimaryTopicOf': DcatPrimaryTopic
}

export interface DcatPublisher {
  'foaf:homepage'?: string
  'foaf:mbox'?: string
  'foaf:name': string
}

export interface DcatTemporal {
  'time:hasBeginning'?: string
  'time:hasEnd'?: string
}

export interface DcatPrimaryTopic {
  'dct:issued': string
  'dct:modified': string
}
