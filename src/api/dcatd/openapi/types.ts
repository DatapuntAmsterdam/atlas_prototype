export interface Prop {
  uniqueItems?: boolean
  description?: string
  items?: Prop | Prop[]
  format?: string
  enum?: string[]
  enumNames?: string[]
  minLength?: number
  pattern?: string
  readOnly: boolean
  title?: string
  default?: any[] | string
  type: string
  'x-order'?: string[]
}

export interface Properties {
  'ams:license': Prop
  'ams:modifiedby': Prop
  'ams:owner': Prop
  'ams:sort_modified': Prop
  'ams:spatialDescription': Prop
  'ams:spatialUnit': Prop
  'ams:status': Prop
  'ams:temporalUnit': Prop
  'dcat:contactPoint': Prop
  'dcat:distribution': Prop
  'dcat:keyword': Prop
  'dcat:landingPage': Prop
  'dcat:theme': Prop
  'dct:accrualPeriodicity': Prop
  'dct:description': Prop
  'dct:identifier': Prop
  'dct:language': Prop
  'dct:publisher': Prop
  'dct:source': Prop
  'dct:spatial': Prop
  'dct:temporal': Prop
  'dct:title': Prop
  'foaf:isPrimaryTopicOf': Prop
  'overheid:grondslag': Prop
  'overheidds:doel': Prop
}

export interface DcatDatasets {
  items: {
    $ref: string
  }
  type: string
}

export interface Etag {
  pattern?: string
  type?: string
  description?: string
  schema?: Schema
}

export interface Schemas {
  'dcat-dataset': {
    properties: Properties
  }
  'dcat-datasets': DcatDatasets
  etag: Etag
}

export interface Scopes {
  'CAT/R': string
  'CAT/W': string
}

export interface Implicit {
  authorizationUrl: string
  scopes: Scopes
}

export interface Flows {
  implicit: Implicit
}

export interface OAuth2 {
  flows: Flows
  type: string
}

export interface SecuritySchemes {
  OAuth2: OAuth2
}

export interface Components {
  schemas: Schemas
  securitySchemes: SecuritySchemes
}

export interface Info {
  title: string
  version: string
}

export interface OneOf {
  description: string
  type: string
  pattern: string
}

export interface Schema {
  $ref?: string
  type?: string
  oneOf?: OneOf[]
}

export interface Parameter {
  description: string
  in: string
  name: string
  required: boolean
  schema: Schema | string
  explode?: boolean
}

export interface Security {
  OAuth2: string[]
}

export interface Get {
  description: string
  parameters?: Parameter[]
  responses: Response
  security?: Security[]
}

export interface RequestBody {
  content: ApplicationJson
  required: boolean
}

export interface Location {
  description: string
  schema: Schema
}

export interface Headers {
  Etag?: Etag
  Location?: Location
}

export interface Post {
  description: string
  requestBody: RequestBody
  responses: Response
  security?: Security[]
}

export interface Delete {
  description: string
  parameters: Parameter[]
  responses: Response
  security: Security[]
}

export interface Put {
  description: string
  parameters: Parameter[]
  requestBody: RequestBody
  responses: {
    201: SuccessResponse
    204: SuccessResponse
  }
  security: Security[]
}

export interface Distribution {
  format?: string
  type: string
}

export interface MultipartFormData {
  schema: {
    properties: {
      distribution: Distribution
    }
  }
}

export interface ApplicationJson {
  'application/json'?: {
    $ref?: string
  }
}

export interface MultipartFormdata {
  'multipart/form-data': MultipartFormData
}

export interface SuccessResponse {
  content?: ApplicationJson | MultipartFormdata | string
  description: string
  headers?: Headers
}

export interface Response {
  [code: string]: SuccessResponse
}

export interface Methods {
  delete?: Delete
  get?: Get
  put?: Put
  post?: Post
}

export interface Paths {
  '/datasets': Methods
  '/datasets/{id}': Methods
  '/files': Methods
  '/harvest': Methods
  '/openapi': Methods
  '/system/health': Methods
}

export interface Server {
  url: string
}

export interface RootObject {
  components: Components
  info: Info
  openapi: string
  paths: Paths
  servers: Server[]
}
