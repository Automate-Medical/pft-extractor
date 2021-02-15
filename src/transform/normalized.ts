interface NormalizedPFT {
  spirometry: {
    fvc: {
      pre: number | null,
      post: number | null,
      predicted: number | null,
      lln: number | null,
      uln: number | null
    },
    fev1: {
      pre: number | null,
      post: number | null,
      predicted: number | null,
      lln: number | null,
      uln: number | null
    },
    fev1fvc: {
      pre: number | null,
      post: number | null,
      predicted: number | null,
      lln: number | null,
      uln: number | null
    },
    fef2575: {
      pre: number | null,
      post: number | null,
      predicted: number | null,
      lln: number | null,
      uln: number | null 
    }
  },
  diffusion: {
    dlcosb: {
      pre: number | null,
      post: number | null,
      predicted: number | null,
      lln: number | null,
      uln: number | null
    },
    dlva: {
      pre: number | null,
      post: number | null,
      predicted: number | null,
      lln: number | null,
      uln: number | null
    }
  }
}

export default class Normalized {
  pft: NormalizedPFT

  constructor(pft?: NormalizedPFT) {
    if (pft) {
      this.pft = pft;
    } else {
      this.pft = {
        spirometry: {
          fvc: {
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null
          },
          fev1: {
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null
          },
          fev1fvc: {
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null
          },
          fef2575: {
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null
          }
        },
        diffusion: {
          dlcosb: {
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null
          },
          dlva: {
            pre: null,
            post: null,
            predicted: null,
            lln: null,
            uln: null 
          }
        }
      }
    }
  }

  toJson() {
    return this.pft;
  }
}
  