export const varenLigplaatsPath = 'v1/varen/ligplaats'
export const varenOpafstapplaatsPath = 'v1/varen/opafstapplaats'

export interface Ligplaats {
  id: string
  naamVaartuig: string | null
  naamKlantKvk: string | null
  ligplaatsSegment: string | null
  idLigplaats: string | null
}

export interface OpAfstapplaats {
  id: string
  volgnr: string | null
  opEnAfstap: string | null
  laadLos: string | null
  eLaadpunt: string | null
  tekstOnMouseover: string | null
  kleurOpKaart: string | null
}
