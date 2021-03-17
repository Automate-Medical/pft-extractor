"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stepwiseAlgorithim = void 0;
const types_1 = require("./types");
// Impl https://www.aafp.org/afp/2014/0301/afp20140301p359.pdf
// A Stepwise Approach to the Interpretation
// of Pulmonary Function Tests
exports.stepwiseAlgorithim = [
    {
        id: 0,
        arguments: [types_1.PFTElementType.FEV1FVC_PRE, types_1.PFTElementType.FEV1FVC_LLN],
        predicate: (a, b) => {
            return a.value < b.value;
        },
        next: [1, 2],
        label: 'FEV1/FVC < LLN'
    },
    {
        id: 1,
        arguments: [types_1.PFTElementType.FVC_PRE, types_1.PFTElementType.FVC_LLN],
        predicate: (a, b) => {
            return a.value < b.value;
        },
        next: [3, 4],
        label: 'FVC < LLN'
    },
    {
        id: 2,
        arguments: [types_1.PFTElementType.FVC_PRE, types_1.PFTElementType.FVC_LLN],
        predicate: (a, b) => {
            return a.value < b.value;
        },
        next: [5, 6],
        label: 'FVC < LLN'
    },
    {
        id: 3,
        next: [7, undefined],
        label: 'Obstructive defect'
    },
    {
        id: 4,
        next: [8, undefined],
        label: 'Mixed pattern'
    },
    {
        id: 5,
        next: [9, undefined],
        label: 'Restrictive pattern'
    },
    {
        id: 6,
        label: 'Normal'
    },
    {
        id: 7,
        arguments: [types_1.PFTElementType.FEV1_PRE, types_1.PFTElementType.FEV1_POST, types_1.PFTElementType.FVC_PRE, types_1.PFTElementType.FVC_POST],
        predicate: (a, b, c, d) => {
            // @todo not correct/complete
            // @ts-expect-error
            return ((b.value - a.value) > 0.2) || ((c.value - d.value) > 0.2);
        },
        next: [10, 11],
        label: 'Increase in FEV1 or FVC after bronchodilator therapy'
    },
    {
        id: 8,
        arguments: [types_1.PFTElementType.FVC_POST, types_1.PFTElementType.FVC_LLN],
        predicate: (a, b) => {
            return a.value > b.value;
        },
        next: [12, 9],
        label: 'Increase in FVC after bronchodilator therapy'
    },
    {
        id: 9,
        next: [13, undefined],
        label: 'Confirm restrictive defect through full pulmonary function tests with DLCO'
    },
    {
        id: 10,
        label: 'Reversible obstruction (asthma)'
    },
    {
        id: 11,
        next: [14, undefined],
        label: 'Irreversible obstruction'
    },
    {
        id: 12,
        label: 'Pure obstruction with air trapping is likely chronic obstructive pulmonary disease',
        next: [14, undefined]
    },
    {
        id: 13,
        label: 'Consider differential diagnosis (Tables 4 and 5)'
    },
    {
        id: 14,
        label: 'Consider differential diagnosis (Table 4)'
    }
];
function interpret(pft) {
    function walk(next = 0, path = []) {
        path.push(next);
        const step = exports.stepwiseAlgorithim[next];
        if (step.predicate && step.arguments && step.next) {
            const args = step.arguments.map((a) => pick(pft, a));
            if (step.predicate(...args)) {
                return walk(step.next[0], path);
            }
            else {
                return walk(step.next[1], path);
            }
        }
        else if (step.next) {
            return walk(step.next[0], path);
        }
        else {
            return path.map((e) => exports.stepwiseAlgorithim[e]);
        }
    }
    return walk();
}
exports.default = interpret;
function pick(pft, type) {
    return pft.elements.find((element) => element.meta.type == type);
}
// @todo
function ensure(pft, types) {
    if (types.filter((type) => pick(pft, type)).length != types.length) {
        return new Error(`Values missing from PFT, interpretation cannot be completed`);
    }
}
