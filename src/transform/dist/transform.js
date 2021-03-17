"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Rules = __importStar(require("./rules"));
const types_1 = require("./types");
function transform(data) {
    return extract(data);
}
exports.default = transform;
function extract(data) {
    const tables = getTables(data);
    let pft = {
        elements: []
    };
    let tablePredictions = predictTables(tables);
    tables.forEach((table, index) => {
        if (tablePredictions[index][0] == false || tablePredictions[index][1] == null)
            return;
        const columns = tablePredictions[index][1];
        table.forEach((row) => {
            if (row[0].match(Rules.FVC)) {
                // ordering is sensitive, must match columns expectations
                [types_1.PFTElementType.FVC_PRE, types_1.PFTElementType.FVC_POST, types_1.PFTElementType.FVC_REF, types_1.PFTElementType.FVC_PREREF, types_1.PFTElementType.FVC_POSTREF, types_1.PFTElementType.FVC_LLN, types_1.PFTElementType.FVC_ULN].forEach((block, index) => {
                    if (columns[index])
                        preparePFTElement(pft, block, row[columns[index]]);
                });
            }
            else if (row[0].match(Rules.FEV1)) {
                [types_1.PFTElementType.FEV1_PRE, types_1.PFTElementType.FEV1_POST, types_1.PFTElementType.FEV1_REF, types_1.PFTElementType.FEV1_PREREF, types_1.PFTElementType.FEV1_POSTREF, types_1.PFTElementType.FEV1_LLN, types_1.PFTElementType.FEV1_ULN].forEach((block, index) => {
                    if (columns[index])
                        preparePFTElement(pft, block, row[columns[index]]);
                });
            }
            else if (row[0].match(Rules.FEV1_FVC)) {
                [types_1.PFTElementType.FEV1FVC_PRE, types_1.PFTElementType.FEV1FVC_POST, types_1.PFTElementType.FEV1FVC_REF, types_1.PFTElementType.FEV1FVC_PREREF, types_1.PFTElementType.FEV1FVC_POSTREF, types_1.PFTElementType.FEV1FVC_LLN, types_1.PFTElementType.FEV1FVC_ULN].forEach((block, index) => {
                    if (columns[index])
                        preparePFTElement(pft, block, row[columns[index]]);
                });
            }
            else if (row[0].match(Rules.FEF25_75)) {
                [types_1.PFTElementType.FEF2575_PRE, types_1.PFTElementType.FEF2575_POST, types_1.PFTElementType.FEF2575_REF, types_1.PFTElementType.FEF2575_PREREF, types_1.PFTElementType.FEF2575_POSTREF, types_1.PFTElementType.FEF2575_LLN, types_1.PFTElementType.FEF2575_ULN].forEach((block, index) => {
                    if (columns[index])
                        preparePFTElement(pft, block, row[columns[index]]);
                });
            }
            else if (row[0].match(Rules.FET)) {
                [types_1.PFTElementType.FET_PRE, types_1.PFTElementType.FET_POST].forEach((block, index) => {
                    if (columns[index])
                        preparePFTElement(pft, block, row[columns[index]]);
                });
            }
            else if (row[0].match(Rules.DLCOSB)) {
                [types_1.PFTElementType.DLCOSB_PRE, types_1.PFTElementType.DLCOSB_POST, types_1.PFTElementType.DLCOSB_REF, types_1.PFTElementType.DLCOSB_PREREF, types_1.PFTElementType.DLCOSB_POSTREF, types_1.PFTElementType.DLCOSB_LLN, types_1.PFTElementType.DLCOSB_ULN].forEach((block, index) => {
                    if (columns[index])
                        preparePFTElement(pft, block, row[columns[index]]);
                });
            }
            else if (row[0].match(Rules.DLCOCSB)) {
                [types_1.PFTElementType.DLCOCSB_PRE, types_1.PFTElementType.DLCOCSB_POST, types_1.PFTElementType.DLCOCSB_REF, types_1.PFTElementType.DLCOCSB_PREREF, types_1.PFTElementType.DLCOCSB_POSTREF, types_1.PFTElementType.DLCOCSB_LLN, types_1.PFTElementType.DLCOCSB_ULN].forEach((block, index) => {
                    if (columns[index])
                        preparePFTElement(pft, block, row[columns[index]]);
                });
            }
            else if (row[0].match(Rules.IVCSB)) {
                [types_1.PFTElementType.IVCSB_PRE, types_1.PFTElementType.IVCSB_POST, types_1.PFTElementType.IVCSB_REF, types_1.PFTElementType.IVCSB_PREREF, types_1.PFTElementType.IVCSB_POSTREF, types_1.PFTElementType.IVCSB_LLN, types_1.PFTElementType.IVCSB_ULN].forEach((block, index) => {
                    if (columns[index])
                        preparePFTElement(pft, block, row[columns[index]]);
                });
            }
            else if (row[0].match(Rules.DLVA)) {
                [types_1.PFTElementType.DLVA_PRE, types_1.PFTElementType.DLVA_POST, types_1.PFTElementType.DLVA_REF, types_1.PFTElementType.DLVA_PREREF, types_1.PFTElementType.DLVA_POSTREF, types_1.PFTElementType.DLVA_LLN, types_1.PFTElementType.DLVA_ULN].forEach((block, index) => {
                    if (columns[index])
                        preparePFTElement(pft, block, row[columns[index]]);
                });
            }
        });
    });
    const comment = detectComment(data);
    if (comment)
        preparePFTElement(pft, types_1.PFTElementType.RT_COMMENT, comment, true);
    return pft;
}
function detectComment(data) {
    if (!data.Blocks)
        return;
    const commentLine = data.Blocks?.findIndex((block) => {
        return block.BlockType == "LINE" && block.Text?.match(Rules.COMMENT);
    });
    if (commentLine && commentLine > -1) {
        return data.Blocks[commentLine + 1].Text;
    }
}
function preparePFTElement(pft, type, value, useLiteralValue = false) {
    if (!useLiteralValue) {
        value = parseValue(value);
    }
    if (value != null) {
        pft.elements.push(createPFTElement(type, value));
    }
}
function createPFTElement(type, value) {
    switch (type) {
        case types_1.PFTElementType.FVC_PRE:
            return {
                meta: {
                    loinc: "19876-2",
                    shortName: "FVC pre BD Vol Respiratory Spirometry",
                    units: "L",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FVC_PRE
                },
                value
            };
        case types_1.PFTElementType.FVC_POST:
            return {
                meta: {
                    loinc: "19874-7",
                    shortName: "FVC p BD Vol Respiratory Spirometry",
                    units: "L",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FVC_POST
                },
                value
            };
        case types_1.PFTElementType.FVC_REF:
            return {
                meta: {
                    loinc: "19869-7",
                    shortName: "FVC Vol Respiratory Predicted",
                    units: "L",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FVC_REF
                },
                value
            };
        case types_1.PFTElementType.FVC_PREREF:
            return {
                meta: {
                    shortName: "FVC pre BD Vol Respiratory % Predicted",
                    units: "%",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FVC_PREREF
                },
                value
            };
        case types_1.PFTElementType.FVC_POSTREF:
            return {
                meta: {
                    shortName: "FVC p BD Vol Respiratory % Predicted",
                    units: "%",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FVC_POSTREF
                },
                value
            };
        case types_1.PFTElementType.FVC_LLN:
            return {
                meta: {
                    shortName: "FVC Vol Respiratory LLN",
                    units: "L",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FVC_LLN
                },
                value
            };
        case types_1.PFTElementType.FVC_ULN:
            return {
                meta: {
                    shortName: "FVC Vol Respiratory ULN",
                    units: "L",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FVC_ULN
                },
                value
            };
        case types_1.PFTElementType.FEV1_PRE:
            return {
                meta: {
                    loinc: "20157-4",
                    shortName: "FEV1 pre BD",
                    units: "L",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1_PRE
                },
                value
            };
        case types_1.PFTElementType.FEV1_POST:
            return {
                meta: {
                    loinc: "20155-8",
                    shortName: "FEV1 p BD",
                    units: "L",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1_POST
                },
                value
            };
        case types_1.PFTElementType.FEV1_REF:
            return {
                meta: {
                    loinc: "20149-1",
                    shortName: "FEV1 Predicted",
                    units: "L",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1_REF
                },
                value
            };
        case types_1.PFTElementType.FEV1_PREREF:
            return {
                meta: {
                    shortName: "FEV1 pre BD % Predicted",
                    units: "%",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1_PREREF
                },
                value
            };
        case types_1.PFTElementType.FEV1_POSTREF:
            return {
                meta: {
                    shortName: "FEV1 p BD % Predicted",
                    units: "%",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1_POSTREF
                },
                value
            };
        case types_1.PFTElementType.FEV1_POST:
            return {
                meta: {
                    loinc: "20155-8",
                    shortName: "FEV1 p BD",
                    units: "L",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1_POST
                },
                value
            };
        case types_1.PFTElementType.FEV1_LLN:
            return {
                meta: {
                    shortName: "FEV1 LLN",
                    units: "L",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1_LLN
                },
                value
            };
        case types_1.PFTElementType.FEV1_ULN:
            return {
                meta: {
                    shortName: "FEV1 ULN",
                    units: "L",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1_ULN
                },
                value
            };
        case types_1.PFTElementType.FEV1FVC_PRE:
            return {
                meta: {
                    loinc: "19926-5",
                    shortName: "FEV1/FVC",
                    units: "%",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1FVC_PRE
                },
                value
            };
        case types_1.PFTElementType.FEV1FVC_POST:
            return {
                meta: {
                    loinc: "69970-2",
                    shortName: "FEV1/FVC p BD",
                    units: "%",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1FVC_POST
                },
                value
            };
        case types_1.PFTElementType.FEV1FVC_REF:
            return {
                meta: {
                    loinc: "19925-7",
                    shortName: "FEV1/FVC Predicted",
                    units: "%",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1FVC_REF
                },
                value
            };
        case types_1.PFTElementType.FEV1FVC_PREREF:
            return {
                meta: {
                    shortName: "FEV1/FVC % Predicted",
                    units: "%",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1FVC_PREREF
                },
                value
            };
        case types_1.PFTElementType.FEV1FVC_POSTREF:
            return {
                meta: {
                    shortName: "FEV1/FVC p BD % Predicted",
                    units: "%",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1FVC_POSTREF
                },
                value
            };
        case types_1.PFTElementType.FEV1FVC_LLN:
            return {
                meta: {
                    shortName: "FEV1/FVC LLN",
                    units: "%",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1FVC_LLN
                },
                value
            };
        case types_1.PFTElementType.FEV1FVC_ULN:
            return {
                meta: {
                    shortName: "FEV1/FVC ULN",
                    units: "%",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEV1FVC_ULN
                },
                value
            };
        case types_1.PFTElementType.FEF2575_PRE:
            return {
                meta: {
                    loinc: "69972-8",
                    shortName: "FEF 25-75% pre BD",
                    units: "L/s",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEF2575_PRE
                },
                value
            };
        case types_1.PFTElementType.FEF2575_POST:
            return {
                meta: {
                    loinc: "69973-6",
                    shortName: "FEF 25-75% p BD",
                    units: "L/s",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEF2575_POST
                },
                value
            };
        case types_1.PFTElementType.FEF2575_REF:
            return {
                meta: {
                    loinc: "69971-0",
                    shortName: "FEF 25-75% Predicted",
                    units: "L/s",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEF2575_REF
                },
                value
            };
        case types_1.PFTElementType.FEF2575_PREREF:
            return {
                meta: {
                    shortName: "FEF 25-75% pre BD % Predicted",
                    units: "%",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEF2575_PREREF
                },
                value
            };
        case types_1.PFTElementType.FEF2575_POSTREF:
            return {
                meta: {
                    shortName: "FEF 25-75% p BD % Predicted",
                    units: "%",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEF2575_POSTREF
                },
                value
            };
        case types_1.PFTElementType.FEF2575_LLN:
            return {
                meta: {
                    shortName: "FEF 25-75% LLN",
                    units: "L/s",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEF2575_LLN
                },
                value
            };
        case types_1.PFTElementType.FEF2575_ULN:
            return {
                meta: {
                    shortName: "FEF 25-75% ULN",
                    units: "L/s",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FEF2575_ULN
                },
                value
            };
        case types_1.PFTElementType.FET_PRE:
            return {
                meta: {
                    loinc: "65819-5",
                    shortName: "FET",
                    units: "s",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FET_PRE
                },
                value
            };
        case types_1.PFTElementType.FET_POST:
            return {
                meta: {
                    loinc: "65819-5",
                    shortName: "FET",
                    units: "s",
                    group: "Spirometry",
                    type: types_1.PFTElementType.FET_POST
                },
                value
            };
        case types_1.PFTElementType.DLCOSB_PRE:
            return {
                meta: {
                    loinc: "19911-7",
                    shortName: "Diff cap.CO",
                    units: "cc/min/mmHg",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLCOSB_PRE
                },
                value
            };
        case types_1.PFTElementType.DLCOSB_POST:
            return {
                meta: {
                    loinc: "19911-7",
                    shortName: "Diff cap.CO",
                    units: "cc/min/mmHg",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLCOSB_POST
                },
                value
            };
        case types_1.PFTElementType.DLCOSB_REF:
            return {
                meta: {
                    loinc: "19910-9",
                    shortName: "Diff cap.CO Predicted",
                    units: "cc/min/mmHg",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLCOSB_REF
                },
                value
            };
        case types_1.PFTElementType.DLCOSB_PREREF:
            return {
                meta: {
                    shortName: "Diff cap.CO % Predicted",
                    units: "%",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLCOSB_PREREF
                },
                value
            };
        case types_1.PFTElementType.DLCOSB_POSTREF:
            return {
                meta: {
                    shortName: "Diff cap.CO % Predicted",
                    units: "%",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLCOSB_POSTREF
                },
                value
            };
        case types_1.PFTElementType.DLCOSB_LLN:
            return {
                meta: {
                    group: "Diffusion Capacity",
                    shortName: "Diff cap.CO LLN",
                    units: "cc/min/mmHg",
                    type: types_1.PFTElementType.DLCOSB_LLN
                },
                value
            };
        case types_1.PFTElementType.DLCOSB_ULN:
            return {
                meta: {
                    group: "Diffusion Capacity",
                    shortName: "Diff cap.CO ULN",
                    units: "cc/min/mmHg",
                    type: types_1.PFTElementType.DLCOSB_ULN
                },
                value
            };
        case types_1.PFTElementType.DLCOCSB_PRE:
            return {
                meta: {
                    loinc: "19913-3",
                    shortName: "Diff cap.CO Hgb adj",
                    units: "cc/min/mmHg",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLCOCSB_PRE
                },
                value
            };
        case types_1.PFTElementType.DLCOCSB_POST:
            return {
                meta: {
                    loinc: "19913-3",
                    shortName: "Diff cap.CO Hgb adj",
                    units: "cc/min/mmHg",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLCOCSB_POST
                },
                value
            };
        case types_1.PFTElementType.DLCOCSB_REF:
            return {
                meta: {
                    shortName: "Diff cap.CO Hgb adj Predicted",
                    units: "cc/min/mmHg",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLCOCSB_REF
                },
                value
            };
        case types_1.PFTElementType.DLCOCSB_PREREF:
            return {
                meta: {
                    shortName: "Diff cap.CO Hgb adj % Predicted",
                    units: "%",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLCOCSB_PREREF
                },
                value
            };
        case types_1.PFTElementType.DLCOCSB_POSTREF:
            return {
                meta: {
                    shortName: "Diff cap.CO Hgb adj % Predicted",
                    units: "%",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLCOCSB_POSTREF
                },
                value
            };
        case types_1.PFTElementType.DLCOCSB_LLN:
            return {
                meta: {
                    shortName: "Diff cap.CO Hgb adj LLN",
                    units: "cc/min/mmHg",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLCOCSB_LLN
                },
                value
            };
        case types_1.PFTElementType.DLCOCSB_ULN:
            return {
                meta: {
                    shortName: "Diff cap.CO Hgb adj ULN",
                    units: "cc/min/mmHg",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLCOCSB_ULN
                },
                value
            };
        case types_1.PFTElementType.IVCSB_PRE:
            return {
                meta: {
                    shortName: "Inspiratory Vital Capacity",
                    group: "Diffusion Capacity",
                    units: "L",
                    type: types_1.PFTElementType.IVCSB_PRE
                },
                value
            };
        case types_1.PFTElementType.IVCSB_POST:
            return {
                meta: {
                    shortName: "Inspiratory Vital Capacity",
                    group: "Diffusion Capacity",
                    units: "L",
                    type: types_1.PFTElementType.IVCSB_POST
                },
                value
            };
        case types_1.PFTElementType.IVCSB_REF:
            return {
                meta: {
                    shortName: "Inspiratory Cital Capacity Predicted",
                    group: "Diffusion Capacity",
                    units: "L",
                    type: types_1.PFTElementType.IVCSB_REF
                },
                value
            };
        case types_1.PFTElementType.IVCSB_PREREF:
            return {
                meta: {
                    shortName: "Inspiratory Cital Capacity % Predicted",
                    group: "Diffusion Capacity",
                    units: "L",
                    type: types_1.PFTElementType.IVCSB_PREREF
                },
                value
            };
        case types_1.PFTElementType.IVCSB_POSTREF:
            return {
                meta: {
                    shortName: "Inspiratory Cital Capacity % Predicted",
                    group: "Diffusion Capacity",
                    units: "L",
                    type: types_1.PFTElementType.IVCSB_POSTREF
                },
                value
            };
        case types_1.PFTElementType.IVCSB_LLN:
            return {
                meta: {
                    shortName: "Inspiratory Cital Capacity LLN",
                    group: "Diffusion Capacity",
                    units: "L",
                    type: types_1.PFTElementType.IVCSB_LLN
                },
                value
            };
        case types_1.PFTElementType.IVCSB_ULN:
            return {
                meta: {
                    shortName: "Inspiratory Cital Capacity ULN",
                    units: "L",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.IVCSB_ULN
                },
                value
            };
        case types_1.PFTElementType.DLVA_PRE:
            return {
                meta: {
                    loinc: "19916-6",
                    shortName: "Diff cap/Alv vol",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLVA_PRE
                },
                value
            };
        case types_1.PFTElementType.DLVA_POST:
            return {
                meta: {
                    loinc: "19916-6",
                    shortName: "Diff cap/Alv vol",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLVA_POST
                },
                value
            };
        case types_1.PFTElementType.DLVA_REF:
            return {
                meta: {
                    loinc: "19915-8",
                    shortName: "Diff cap/Alv vol Predicted",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLVA_REF
                },
                value
            };
        case types_1.PFTElementType.DLVA_PREREF:
            return {
                meta: {
                    shortName: "Diff cap/Alv vol % Predicted",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLVA_PREREF
                },
                value
            };
        case types_1.PFTElementType.DLVA_POSTREF:
            return {
                meta: {
                    shortName: "Diff cap/Alv vol % Predicted",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLVA_POSTREF
                },
                value
            };
        case types_1.PFTElementType.DLVA_LLN:
            return {
                meta: {
                    shortName: "Diff cap/Alv vol LLN",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLVA_LLN
                },
                value
            };
        case types_1.PFTElementType.DLVA_ULN:
            return {
                meta: {
                    shortName: "Diff cap/Alv ULN",
                    group: "Diffusion Capacity",
                    type: types_1.PFTElementType.DLVA_ULN
                },
                value
            };
        case types_1.PFTElementType.RT_COMMENT:
            return {
                meta: {
                    group: "Quality",
                    type: types_1.PFTElementType.RT_COMMENT,
                    shortName: "Technician Comment"
                },
                value
            };
    }
}
function predictTables(tables) {
    return tables.map((table) => {
        let columns = new Array(Rules.COLUMNS.length);
        let score = 0;
        table.forEach((row, rowIndex) => {
            [...Rules.SPIROMETRY, ...Rules.DIFFUSION].forEach((rule) => {
                if (row[0].match(rule))
                    score += 1;
            });
            // @note arbitrary cutoff to look at first three rows
            if (rowIndex <= 3) {
                Rules.COLUMNS.forEach((rule, ruleIndex) => {
                    row.forEach((column, columnIndex) => {
                        // If the rule matches
                        // AND there is no previous match for the rule
                        // AND there is no previous match for the columnIndex...
                        if (column.match(rule) && !columns[ruleIndex] && !columns.includes(columnIndex))
                            columns[ruleIndex] = columnIndex;
                    });
                });
            }
        });
        if (score) {
            return [true, columns];
        }
        else {
            return [false, columns];
        }
    });
}
function getTables(data) {
    let blocks = {};
    let tableBlocks = [];
    data.Blocks?.forEach((block) => {
        if (block.Id)
            blocks[block.Id] = block;
        if (block.BlockType == "TABLE")
            tableBlocks.push(block);
    });
    return buildTables(tableBlocks, blocks);
}
function buildTables(tableBlocks, blocks) {
    return tableBlocks.map((table) => {
        return findRowsColumns(table, blocks);
    });
}
function findRowsColumns(table, blocks) {
    let rows = [];
    table.Relationships?.forEach((relationship) => {
        if (relationship.Type == "CHILD") {
            relationship.Ids?.forEach((childId) => {
                const cell = blocks[childId];
                if (cell.BlockType == "CELL") {
                    const rowIndex = cell.RowIndex;
                    const colIndex = cell.ColumnIndex;
                    // @note no-op if absent
                    if (rowIndex == undefined || colIndex == undefined)
                        return;
                    if (rowIndex > rows.length)
                        rows.push([]);
                    rows[rowIndex - 1][colIndex - 1] = findText(cell, blocks);
                }
            });
        }
    });
    return rows;
}
function findText(cell, blocks) {
    let text = "";
    if (cell.Relationships) {
        cell.Relationships.forEach((relationship) => {
            if (relationship.Type == "CHILD") {
                relationship.Ids?.forEach((childId) => {
                    const word = blocks[childId];
                    if (word.BlockType == "WORD") {
                        text = text.concat(word.Text || "", " ");
                    }
                    if (word.BlockType == "SELECTION_ELEMENT") {
                        if (word.SelectionStatus == "SELECTED") {
                            text = text.concat("X ");
                        }
                    }
                });
            }
        });
    }
    return text;
}
function parseValue(value) {
    if (isNaN(parseFloat(value))) {
        return null;
    }
    else {
        return parseFloat(value);
    }
}
