import { NormalizedPFT } from './types'

export default class Normalized {
  pft: NormalizedPFT

  constructor(pft?: NormalizedPFT) {
    if (pft) {
      this.pft = pft;
    } else {
      this.pft = {
        spirometry: {
          fvc: {
            meta: {
              loinc: '19868-9',
              commonName: 'Forced vital capacity'
            },
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null
          },
          fev1: {
            meta: {
              loinc: '20150-9',
              commonName: 'Forced expiratory volume in one second'
            },
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null
          },
          fev1fvc: {
            meta: {
              loinc: '19926-5',
              commonName: 'FEV1/FVC'
            }, 
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null
          },
          fef2575: {
            meta: {
              loinc: '19927-3',
              commonName: 'Gas flow FEV 25%-75%'
            },
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null
          },
          fet: {
            meta: {
              loinc: '65819-5',
              commonName: 'Forced expiratory time'
            },
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null
          }
        },
        diffusion: {
          dlcosb: {
            meta: {
              loinc: '19911-7',
              commonName: 'Diffusion capacity.carbon monoxide'
            },
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null
          },
          dlcocsb: {
            meta: {
              loinc: '19913-3',
              commonName: 'Diffusion capacity.carbon monoxide adjusted for hemoglobin'
            },
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null
          },
          ivcsb: {
            meta: {
              commonName: 'Inspiratory vital capacity (single breath)'
            },
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null
          },
          dlva: {
            meta: {
              loinc: '19916-6',
              commonName: 'Diffusion capacity/Alveolar volume'
            },
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null 
          }
        },
        meta: {}
      }
    }
  }

  toJson() {
    return this.pft;
  }
}
  