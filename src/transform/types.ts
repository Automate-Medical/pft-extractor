interface PFTMeta {
  comment?: string
}

interface PFTValueMeta {
  loinc?: string,
  commonName: string
}

interface PFTValue {
  meta: PFTValueMeta,
  pre: number | null,
  post: number | null,
  predicted: number | null,
  lln: number | null,
  uln: number | null 
}

export interface NormalizedPFT {
  spirometry: {
    fvc: PFTValue,
    fev1: PFTValue,
    fev1fvc: PFTValue,
    fef2575: PFTValue,
    fet: PFTValue
  },
  diffusion: {
    dlcosb: PFTValue,
    dlcocsb: PFTValue,
    ivcsb: PFTValue,
    dlva: PFTValue
  },
  meta: PFTMeta
}