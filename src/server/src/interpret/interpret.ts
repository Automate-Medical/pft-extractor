
import { PFT, PFTElementType as PFTType, PFTElement } from '../../../@types'

// DecisionNodes is a list of DecisionRule
type DecisionNodes = DecisionRule[];

interface DecisionRule {
  id: number;
  arguments?: PFTType[];
  predicate?: any;
  next?: [number, number | undefined]; // if predicate returns true, go to next[0], or in case there is no predicte - we are just a hop to next[0]
  label: [string, string | undefined];
}

// Impl https://www.aafp.org/afp/2014/0301/afp20140301p359.pdf
// A Stepwise Approach to the Interpretation of Pulmonary Function Tests
export const stepwiseAlgorithim: DecisionNodes = [
  {
    id: 0,
    arguments: [PFTType.FEV1FVC_PRE, PFTType.FEV1FVC_LLN],
    predicate: (a: PFTElement, b: PFTElement): boolean => {
      return a.value < b.value
    },
    next: [1, 2],
    label: ['FEV1/FVC is less than the lower limit of normal', 'FEV1/FVC is above the lower limit of normal.']
  },
  {
    id: 1,
    arguments: [PFTType.FVC_PRE, PFTType.FVC_LLN],
    predicate: (a: PFTElement, b: PFTElement): boolean => {
      return a.value < b.value
    },
    next: [3, 4],
    label: ['FVC is less than the lower limit of normal.', 'FVC is above the lower limit of normal.']
  },
  {
    id: 2,
    arguments: [PFTType.FVC_PRE, PFTType.FVC_LLN],
    predicate: (a: PFTElement, b: PFTElement): boolean => {
      return a.value < b.value
    },
    next: [5, 6],
    label: ['FVC is less than the lower limit of normal.', 'FVC is above the the lower limit of normal.']
  },
  {
    id: 3,
    next: [7, undefined],
    label: ['Results indicate an obstructive defect.', undefined]
  },
  {
    id: 4,
    next: [8, undefined],
    label: ['Results indicate a mixed pattern.', undefined]
  },
  {
    id: 5,
    next: [9, undefined],
    label: ['Results indicate a restrictive defect.', undefined]
  },
  {
    id: 6,
    label: ['A normal result', undefined]
  },
  {
    id: 7,
    arguments: [PFTType.FEV1_PRE, PFTType.FEV1_POST, PFTType.FVC_PRE, PFTType.FVC_POST],
    predicate: (a: PFTElement, b: PFTElement, c: PFTElement, d: PFTElement): boolean => {
      // @todo not correct/complete
      // @ts-expect-error value could be empty
      return ((b.value - a.value) > 0.2) || ((c.value - d.value) > 0.2);
    },
    next: [10, 11],
    label: ['There was an increase in FEV1 or FVC after bronchodilator therapy', 'There was not an increase in FEV1 or FVC after bronchodilator therapy']
  },
  {
    id: 8,
    arguments: [PFTType.FVC_POST, PFTType.FVC_LLN],
    predicate: (a: PFTElement, b: PFTElement): boolean => {
      return a.value > b.value
    },
    next: [12, 9],
    label: ['There was an increase in FVC after bronchodilator therapy', 'There was not an increase in FVC after bronchodilator therapy']
  },
  {
    id: 9,
    next: [13, undefined],
    label: ['Confirm restrictive defect through full pulmonary function tests with DLCO.', undefined]
  },
  {
    id: 10,
    label: ['Results indicate a reversible obstruction.', undefined]
  },
  {
    id: 11,
    next: [14, undefined],
    label: ['Results indicate an irreversible obstruction.', undefined]
  },
  {
    id: 12,
    next: [14, undefined],
    label: ['Results indicate pure obstruction with air trapping is likely chronic obstructive pulmonary disease', undefined]
  },
  {
    id: 13,
    label: ['Consider differential diagnosis.', undefined]
  },
  {
    id: 14,
    label: ['Consider differential diagnosis.', undefined]
  }
]

export default function interpret(pft: PFT): { path: DecisionRule[], summary: string } {
  function walk(next = 0, path: number[] = []): number[] {
    path.push(next)

    const step = stepwiseAlgorithim[next]

    if (step.predicate && step.arguments && step.next) {
      const args = step.arguments.map((a) => pick(pft, a))
      if (step.predicate(...args)) {
        return walk(step.next[0], path)
      } else {
        return walk(step.next[1], path)
      }
    } else if (step.next) {
      return walk(step.next[0], path)
    } else {
      return path;
    }
  }

  const path = walk().map((e) => stepwiseAlgorithim[e]);
  const summary = path.map((rule, index, path) => {
    if (rule.next) {
      const nextRuleId = path[index + 1].id
      if (rule.next[0] == nextRuleId) {
        return rule.label[0]
      } else {
        return rule.label[1]
      }
    } else {
      return rule.label[0]
    }
  }).join(" ")

  return {
    path,
    summary
  }
}

function pick(pft: PFT, type: PFTType): PFTElement | void {
  return pft.elements.find((element) => element.meta.type == type)
}

// @todo
// function ensure(pft: PFT, types: PFTType[]): Error | void {
//   if (types.filter((type) => pick(pft, type)).length != types.length) {
//     return new Error(`Values missing from PFT, interpretation cannot be completed`)
//   }
// }