
import { Block, AnalyzeDocumentResponse } from "aws-sdk/clients/textract";
import * as Rules from "./rules";
import { PFT, PFTElementType as PFTType, PFTElement } from '../../../@types'

export default function transform(data: AnalyzeDocumentResponse): PFT {
  return extract(data)
}

function extract(data: AnalyzeDocumentResponse): PFT {
  const tables: string[][][] = getTables(data)

  const pft = <PFT> {
    elements: []
  }

  const tablePredictions = predictTables(tables)

  tables.forEach((table, index) => {
    if (tablePredictions[index][0] == false || tablePredictions[index][1] == null) return

    const columns = tablePredictions[index][1]

    table.forEach((row) => {
      if (row[0].match(Rules.FVC)) {
        // ordering is sensitive, must match columns expectations
        [PFTType.FVC_PRE, PFTType.FVC_POST, PFTType.FVC_REF, PFTType.FVC_PREREF, PFTType.FVC_POSTREF, PFTType.FVC_LLN, PFTType.FVC_ULN].forEach((block: PFTType, index) => {
          if (columns[index]) preparePFTElement(pft, block, row[columns[index]])
        })
      } else if (row[0].match(Rules.FEV1)) {
        [PFTType.FEV1_PRE, PFTType.FEV1_POST, PFTType.FEV1_REF, PFTType.FEV1_PREREF, PFTType.FEV1_POSTREF, PFTType.FEV1_LLN, PFTType.FEV1_ULN].forEach((block: PFTType, index) => {
          if (columns[index]) preparePFTElement(pft, block, row[columns[index]])
        })
      } else if (row[0].match(Rules.FEV1_FVC)) {
        [PFTType.FEV1FVC_PRE, PFTType.FEV1FVC_POST, PFTType.FEV1FVC_REF, PFTType.FEV1FVC_PREREF, PFTType.FEV1FVC_POSTREF, PFTType.FEV1FVC_LLN, PFTType.FEV1FVC_ULN].forEach((block: PFTType, index) => {
          if (columns[index]) preparePFTElement(pft, block, row[columns[index]])
        })
      } else if (row[0].match(Rules.FEF25_75)) {
        [PFTType.FEF2575_PRE, PFTType.FEF2575_POST, PFTType.FEF2575_REF, PFTType.FEF2575_PREREF, PFTType.FEF2575_POSTREF, PFTType.FEF2575_LLN, PFTType.FEF2575_ULN].forEach((block: PFTType, index) => {
          if (columns[index]) preparePFTElement(pft, block, row[columns[index]])
        })
      } else if (row[0].match(Rules.FEF50)) {
        [PFTType.FEF50_PRE, PFTType.FEF50_POST, PFTType.FEF50_REF, PFTType.FEF50_PREREF, PFTType.FEF50_POSTREF, PFTType.FEF50_LLN, PFTType.FEF50_ULN].forEach((block: PFTType, index) => {
          if (columns[index]) preparePFTElement(pft, block, row[columns[index]])
        })
      } else if (row[0].match(Rules.PEF)) {
        [PFTType.PEF_PRE, PFTType.PEF_POST, PFTType.PEF_REF, PFTType.PEF_PREREF, PFTType.PEF_POSTREF, PFTType.PEF_LLN, PFTType.PEF_ULN].forEach((block: PFTType, index) => {
          if (columns[index]) preparePFTElement(pft, block, row[columns[index]])
        })
      } else if (row[0].match(Rules.FET)) {
        [PFTType.FET_PRE, PFTType.FET_POST].forEach((block: PFTType, index) => {
          if (columns[index]) preparePFTElement(pft, block, row[columns[index]])
        })
      } else if (row[0].match(Rules.DLCOSB)) {
        [PFTType.DLCOSB_PRE, PFTType.DLCOSB_POST, PFTType.DLCOSB_REF, PFTType.DLCOSB_PREREF, PFTType.DLCOSB_POSTREF, PFTType.DLCOSB_LLN, PFTType.DLCOSB_ULN].forEach((block: PFTType, index) => {
          if (columns[index]) preparePFTElement(pft, block, row[columns[index]])
        })
      } else if (row[0].match(Rules.DLCOCSB)) {
        [PFTType.DLCOCSB_PRE, PFTType.DLCOCSB_POST, PFTType.DLCOCSB_REF, PFTType.DLCOCSB_PREREF, PFTType.DLCOCSB_POSTREF, PFTType.DLCOCSB_LLN, PFTType.DLCOCSB_ULN].forEach((block: PFTType, index) => {
          if (columns[index]) preparePFTElement(pft, block, row[columns[index]])
        })
      } else if (row[0].match(Rules.IVCSB)) {
        [PFTType.IVCSB_PRE, PFTType.IVCSB_POST, PFTType.IVCSB_REF, PFTType.IVCSB_PREREF, PFTType.IVCSB_POSTREF, PFTType.IVCSB_LLN, PFTType.IVCSB_ULN].forEach((block: PFTType, index) => {
          if (columns[index]) preparePFTElement(pft, block, row[columns[index]])
        })
      } else if (row[0].match(Rules.DLVA)) {
        [PFTType.DLVA_PRE, PFTType.DLVA_POST, PFTType.DLVA_REF, PFTType.DLVA_PREREF, PFTType.DLVA_POSTREF, PFTType.DLVA_LLN, PFTType.DLVA_ULN].forEach((block: PFTType, index) => {
          if (columns[index]) preparePFTElement(pft, block, row[columns[index]])
        })
      }
    })
  })

  const comment = detectComment(data)
  const interpretation = detectInterpretation(data)

  if (comment) preparePFTElement(pft, PFTType.RT_COMMENT, comment, true)
  if (comment) preparePFTElement(pft, PFTType.INTERPRETATION, interpretation, true)

  return pft;
}

function detectComment(data: AnalyzeDocumentResponse): void | string {
  if (!data.Blocks) return;

  const commentLine = data.Blocks?.findIndex((block: Block) => {
    return block.BlockType == "LINE" && block.Text?.match(Rules.COMMENT)
  })

  if (commentLine && commentLine > -1) {
    return data.Blocks[commentLine + 1].Text
  }
}

// @todo these need to walk through a few lines to figure out what belongs to
// the interpretation and what doesn't
function detectInterpretation(data: AnalyzeDocumentResponse): void | string {
  if (!data.Blocks) return;

  const interpretationLine = data.Blocks?.findIndex((block: Block) => {
    return block.BlockType == "LINE" && block.Text?.match(Rules.INTERPRETATION)
  })

  if (interpretationLine && interpretationLine > -1) {
    const text = data.Blocks[interpretationLine + 1].Text

    // @note chuck short reads, probably wrong
    if (text && text.length > 3) {
      return text;
    }
  }
}

function preparePFTElement(pft: PFT, type: PFTType, value: any, useLiteralValue = false) {
  if (!useLiteralValue) {
    value = parseValue(value);
  }

  if (value != null) {
    pft.elements.push(createPFTElement(type, value))
  }
}

function createPFTElement(type: PFTType, value: number | string): PFTElement {
  switch (type) {
    case PFTType.FVC_PRE:
      return {
        meta: {
          loinc: "19876-2",
          shortName: "FVC pre BD Vol Respiratory Spirometry",
          units: "L",
          group: "Spirometry",
          type: PFTType.FVC_PRE
        },
        value
      }
    case PFTType.FVC_POST:
      return {
        meta: {
          loinc: "19874-7",
          shortName: "FVC p BD Vol Respiratory Spirometry",
          units: "L",
          group: "Spirometry",
          type: PFTType.FVC_POST
        },
        value
      }
    case PFTType.FVC_REF:
      return {
        meta: {
          loinc: "19869-7",
          shortName: "FVC Vol Respiratory Predicted",
          units: "L",
          group: "Spirometry",
          type: PFTType.FVC_REF
        },
        value
      }
    case PFTType.FVC_PREREF:
      return {
        meta: {
          shortName: "FVC pre BD Vol Respiratory % Predicted",
          units: "%",
          group: "Spirometry",
          type: PFTType.FVC_PREREF
        },
        value
      }
    case PFTType.FVC_POSTREF:
      return {
        meta: {
          shortName: "FVC p BD Vol Respiratory % Predicted",
          units: "%",
          group: "Spirometry",
          type: PFTType.FVC_POSTREF
        },
        value
      }
    case PFTType.FVC_LLN:
      return {
        meta: {
          shortName: "FVC Vol Respiratory LLN",
          units: "L",
          group: "Spirometry",
          type: PFTType.FVC_LLN
        },
        value
      }
    case PFTType.FVC_ULN:
      return {
        meta: {
          shortName: "FVC Vol Respiratory ULN",
          units: "L",
          group: "Spirometry",
          type: PFTType.FVC_ULN
        },
        value
      }
    case PFTType.FEV1_PRE:
      return {
        meta: {
          loinc: "20157-4",
          shortName: "FEV1 pre BD",
          units: "L",
          group: "Spirometry",
          type: PFTType.FEV1_PRE
        },
        value
      }
    case PFTType.FEV1_POST:
      return {
        meta: {
          loinc: "20155-8",
          shortName: "FEV1 p BD",
          units: "L",
          group: "Spirometry",
          type: PFTType.FEV1_POST
        },
        value
      }
    case PFTType.FEV1_REF:
      return {
        meta: {
          loinc: "20149-1",
          shortName: "FEV1 Predicted",
          units: "L",
          group: "Spirometry",
          type: PFTType.FEV1_REF
        },
        value
      }
    case PFTType.FEV1_PREREF:
      return {
        meta: {
          shortName: "FEV1 pre BD % Predicted",
          units: "%",
          group: "Spirometry",
          type: PFTType.FEV1_PREREF
        },
        value
      }
    case PFTType.FEV1_POSTREF:
      return {
        meta: {
          shortName: "FEV1 p BD % Predicted",
          units: "%",
          group: "Spirometry",
          type: PFTType.FEV1_POSTREF
        },
        value
      }
    case PFTType.FEV1_LLN:
      return {
        meta: {
          shortName: "FEV1 LLN",
          units: "L",
          group: "Spirometry",
          type: PFTType.FEV1_LLN
        },
        value
      }
    case PFTType.FEV1_ULN:
      return {
        meta: {
          shortName: "FEV1 ULN",
          units: "L",
          group: "Spirometry",
          type: PFTType.FEV1_ULN
        },
        value
      }
    case PFTType.FEV1FVC_PRE:
        return {
          meta: {
            loinc: "19926-5",
            shortName: "FEV1/FVC",
            units: "%",
            group: "Spirometry",
            type: PFTType.FEV1FVC_PRE
          },
          value
        }
    case PFTType.FEV1FVC_POST:
      return {
        meta: {
          loinc: "69970-2",
          shortName: "FEV1/FVC p BD",
          units: "%",
          group: "Spirometry",
          type: PFTType.FEV1FVC_POST
        },
        value
      }
    case PFTType.FEV1FVC_REF:
      return {
        meta: {
          loinc: "19925-7",
          shortName: "FEV1/FVC Predicted",
          units: "%",
          group: "Spirometry",
          type: PFTType.FEV1FVC_REF
        },
        value
      }
    case PFTType.FEV1FVC_PREREF:
      return {
        meta: {
          shortName: "FEV1/FVC % Predicted",
          units: "%",
          group: "Spirometry",
          type: PFTType.FEV1FVC_PREREF
        },
        value
      }
    case PFTType.FEV1FVC_POSTREF:
      return {
        meta: {
          shortName: "FEV1/FVC p BD % Predicted",
          units: "%",
          group: "Spirometry",
          type: PFTType.FEV1FVC_POSTREF
        },
        value
      }
    case PFTType.FEV1FVC_LLN:
      return {
        meta: {
          shortName: "FEV1/FVC LLN",
          units: "%",
          group: "Spirometry",
          type: PFTType.FEV1FVC_LLN
        },
        value
      }
    case PFTType.FEV1FVC_ULN:
      return {
        meta: {
          shortName: "FEV1/FVC ULN",
          units: "%",
          group: "Spirometry",
          type: PFTType.FEV1FVC_ULN
        },
        value
      }
    case PFTType.FEF2575_PRE:
      return {
        meta: {
          loinc: "69972-8",
          shortName: "FEF 25-75% pre BD",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.FEF2575_PRE
        },
        value
      }
    case PFTType.FEF2575_POST:
      return {
        meta: {
          loinc: "69973-6",
          shortName: "FEF 25-75% p BD",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.FEF2575_POST
        },
        value
      }
    case PFTType.FEF2575_REF:
      return {
        meta: {
          loinc: "69971-0",
          shortName: "FEF 25-75% Predicted",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.FEF2575_REF
        },
        value
      }
    case PFTType.FEF2575_PREREF:
      return {
        meta: {
          shortName: "FEF 25-75% pre BD % Predicted",
          units: "%",
          group: "Spirometry",
          type: PFTType.FEF2575_PREREF
        },
        value
      }
    case PFTType.FEF2575_POSTREF:
      return {
        meta: {
          shortName: "FEF 25-75% p BD % Predicted",
          units: "%",
          group: "Spirometry",
          type: PFTType.FEF2575_POSTREF
        },
        value
      }
    case PFTType.FEF2575_LLN:
      return {
        meta: {
          shortName: "FEF 25-75% LLN",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.FEF2575_LLN
        },
        value
      }
    case PFTType.FEF2575_ULN:
      return {
        meta: {
          shortName: "FEF 25-75% ULN",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.FEF2575_ULN
        },
        value
      }
    case PFTType.FEF50_PRE:
      return {
        meta: {
          shortName: "FEF 50% pre BD",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.FEF50_PRE
        },
        value
      }
    case PFTType.FEF50_POST:
      return {
        meta: {
          shortName: "FEF 50% p BD",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.FEF50_POST
        },
        value
      }
    case PFTType.FEF50_REF:
      return {
        meta: {
          shortName: "FEF 50% Predicted",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.FEF50_REF
        },
        value
      }
    case PFTType.FEF50_PREREF:
      return {
        meta: {
          shortName: "FEF 50% pre BD % Predicted",
          units: "%",
          group: "Spirometry",
          type: PFTType.FEF50_PREREF
        },
        value
      }
    case PFTType.FEF50_POSTREF:
      return {
        meta: {
          shortName: "FEF 25-75% p BD % Predicted",
          units: "%",
          group: "Spirometry",
          type: PFTType.FEF50_POSTREF
        },
        value
      }
    case PFTType.FEF50_LLN:
      return {
        meta: {
          shortName: "FEF 50% LLN",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.FEF50_LLN
        },
        value
      }
    case PFTType.FEF50_ULN:
      return {
        meta: {
          shortName: "FEF 50% ULN",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.FEF50_ULN
        },
        value
      }
    case PFTType.PEF_PRE:
      return {
        meta: {
          loinc: "69975-1",
          shortName: "PEF pre BD Airway",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.PEF_PRE
        },
        value
      }
    case PFTType.PEF_POST:
      return {
        meta: {
          loinc: "69976-9",
          shortName: "PEF p BD Airway",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.PEF_POST
        },
        value
      }
    case PFTType.PEF_REF:
      return {
        meta: {
          loinc: "69974-4",
          shortName: "PEF Airway Predicted",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.PEF_REF
        },
        value
      }
    case PFTType.PEF_PREREF:
      return {
        meta: {
          shortName: "PEF pre BD Airway % Predicted",
          units: "%",
          group: "Spirometry",
          type: PFTType.PEF_PREREF
        },
        value
      }
    case PFTType.PEF_POSTREF:
      return {
        meta: {
          shortName: "PEF p BD Airway % Predicted",
          units: "%",
          group: "Spirometry",
          type: PFTType.PEF_POSTREF
        },
        value
      }
    case PFTType.PEF_LLN:
      return {
        meta: {
          shortName: "PEF Airway LLN",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.PEF_LLN
        },
        value
      }
    case PFTType.PEF_ULN:
      return {
        meta: {
          shortName: "PEF Airway ULN",
          units: "L/s",
          group: "Spirometry",
          type: PFTType.PEF_ULN
        },
        value
      }
    case PFTType.FET_PRE:
      return {
        meta: {
          loinc: "65819-5",
          shortName: "FET",
          units: "s",
          group: "Spirometry",
          type: PFTType.FET_PRE
        },
        value
      }
    case PFTType.FET_POST:
      return {
        meta: {
          loinc: "65819-5",
          shortName: "FET",
          units: "s",
          group: "Spirometry",
          type: PFTType.FET_POST
        },
        value
      }
    case PFTType.DLCOSB_PRE:
      return {
        meta: {
          loinc: "19911-7",
          shortName: "Diff cap.CO",
          units: "cc/min/mmHg",
          group: "Diffusion Capacity",
          type: PFTType.DLCOSB_PRE
        },
        value
      }
    case PFTType.DLCOSB_POST:
      return {
        meta: {
          loinc: "19911-7",
          shortName: "Diff cap.CO",
          units: "cc/min/mmHg",
          group: "Diffusion Capacity",
          type: PFTType.DLCOSB_POST
        },
        value
      }
    case PFTType.DLCOSB_REF:
      return {
        meta: {
          loinc: "19910-9",
          shortName: "Diff cap.CO Predicted",
          units: "cc/min/mmHg",
          group: "Diffusion Capacity",
          type: PFTType.DLCOSB_REF
        },
        value
      }
    case PFTType.DLCOSB_PREREF:
      return {
        meta: {
          shortName: "Diff cap.CO % Predicted",
          units: "%",
          group: "Diffusion Capacity",
          type: PFTType.DLCOSB_PREREF
        },
        value
      }
    case PFTType.DLCOSB_POSTREF:
      return {
        meta: {
          shortName: "Diff cap.CO % Predicted",
          units: "%",
          group: "Diffusion Capacity",
          type: PFTType.DLCOSB_POSTREF
        },
        value
      }
    case PFTType.DLCOSB_LLN:
      return {
        meta: {
          group: "Diffusion Capacity",
          shortName: "Diff cap.CO LLN",
          units: "cc/min/mmHg",
          type: PFTType.DLCOSB_LLN
        },
        value
      }
    case PFTType.DLCOSB_ULN:
      return {
        meta: {
          group: "Diffusion Capacity",
          shortName: "Diff cap.CO ULN",
          units: "cc/min/mmHg",
          type: PFTType.DLCOSB_ULN
        },
        value
      }
    case PFTType.DLCOCSB_PRE:
      return {
        meta: {
          loinc: "19913-3",
          shortName: "Diff cap.CO Hgb adj",
          units: "cc/min/mmHg",
          group: "Diffusion Capacity",
          type: PFTType.DLCOCSB_PRE
        },
        value
      }
    case PFTType.DLCOCSB_POST:
      return {
        meta: {
          loinc: "19913-3",
          shortName: "Diff cap.CO Hgb adj",
          units: "cc/min/mmHg",
          group: "Diffusion Capacity",
          type: PFTType.DLCOCSB_POST
        },
        value
      }
    case PFTType.DLCOCSB_REF:
      return {
        meta: {
          shortName: "Diff cap.CO Hgb adj Predicted",
          units: "cc/min/mmHg",
          group: "Diffusion Capacity",
          type: PFTType.DLCOCSB_REF
        },
        value
      }
    case PFTType.DLCOCSB_PREREF:
      return {
        meta: {
          shortName: "Diff cap.CO Hgb adj % Predicted",
          units: "%",
          group: "Diffusion Capacity",
          type: PFTType.DLCOCSB_PREREF
        },
        value
      }
    case PFTType.DLCOCSB_POSTREF:
      return {
        meta: {
          shortName: "Diff cap.CO Hgb adj % Predicted",
          units: "%",
          group: "Diffusion Capacity",
          type: PFTType.DLCOCSB_POSTREF
        },
        value
      }
    case PFTType.DLCOCSB_LLN:
      return {
        meta: {
          shortName: "Diff cap.CO Hgb adj LLN",
          units: "cc/min/mmHg",
          group: "Diffusion Capacity",
          type: PFTType.DLCOCSB_LLN
        },
        value
      }
    case PFTType.DLCOCSB_ULN:
      return {
        meta: {
          shortName: "Diff cap.CO Hgb adj ULN",
          units: "cc/min/mmHg",
          group: "Diffusion Capacity",
          type: PFTType.DLCOCSB_ULN
        },
        value
      }
    case PFTType.IVCSB_PRE:
      return {
        meta: {
          shortName: "Inspiratory Vital Capacity",
          group: "Diffusion Capacity",
          units: "L",
          type: PFTType.IVCSB_PRE
        },
        value
      }
    case PFTType.IVCSB_POST:
      return {
        meta: {
          shortName: "Inspiratory Vital Capacity",
          group: "Diffusion Capacity",
          units: "L",
          type: PFTType.IVCSB_POST
        },
        value
      }
    case PFTType.IVCSB_REF:
      return {
        meta: {
          shortName: "Inspiratory Cital Capacity Predicted",
          group: "Diffusion Capacity",
          units: "L",
          type: PFTType.IVCSB_REF
        },
        value
      }
    case PFTType.IVCSB_PREREF:
      return {
        meta: {
          shortName: "Inspiratory Cital Capacity % Predicted",
          group: "Diffusion Capacity",
          units: "L",
          type: PFTType.IVCSB_PREREF
        },
        value
      }
    case PFTType.IVCSB_POSTREF:
      return {
        meta: {
          shortName: "Inspiratory Cital Capacity % Predicted",
          group: "Diffusion Capacity",
          units: "L",
          type: PFTType.IVCSB_POSTREF
        },
        value
      }
    case PFTType.IVCSB_LLN:
      return {
        meta: {
          shortName: "Inspiratory Cital Capacity LLN",
          group: "Diffusion Capacity",
          units: "L",
          type: PFTType.IVCSB_LLN
        },
        value
      }
    case PFTType.IVCSB_ULN:
      return {
        meta: {
          shortName: "Inspiratory Cital Capacity ULN",
          units: "L",
          group: "Diffusion Capacity",
          type: PFTType.IVCSB_ULN
        },
        value
      }
    case PFTType.DLVA_PRE:
      return {
        meta: {
          loinc: "19916-6",
          shortName: "Diff cap/Alv vol",
          group: "Diffusion Capacity",
          type: PFTType.DLVA_PRE
        },
        value
      }
    case PFTType.DLVA_POST:
      return {
        meta: {
          loinc: "19916-6",
          shortName: "Diff cap/Alv vol",
          group: "Diffusion Capacity",
          type: PFTType.DLVA_POST
        },
        value
      }
    case PFTType.DLVA_REF:
      return {
        meta: {
          loinc: "19915-8",
          shortName: "Diff cap/Alv vol Predicted",
          group: "Diffusion Capacity",
          type: PFTType.DLVA_REF
        },
        value
      }
    case PFTType.DLVA_PREREF:
      return {
        meta: {
          shortName: "Diff cap/Alv vol % Predicted",
          group: "Diffusion Capacity",
          type: PFTType.DLVA_PREREF
        },
        value
      }
    case PFTType.DLVA_POSTREF:
      return {
        meta: {
          shortName: "Diff cap/Alv vol % Predicted",
          group: "Diffusion Capacity",
          type: PFTType.DLVA_POSTREF
        },
        value
      }
    case PFTType.DLVA_LLN:
      return {
        meta: {
          shortName: "Diff cap/Alv vol LLN",
          group: "Diffusion Capacity",
          type: PFTType.DLVA_LLN
        },
        value
      }
    case PFTType.DLVA_ULN:
      return {
        meta: {
          shortName: "Diff cap/Alv ULN",
          group: "Diffusion Capacity",
          type: PFTType.DLVA_ULN
        },
        value
      }
    case PFTType.RT_COMMENT:
      return {
        meta: {
          group: "Commentary",
          type: PFTType.RT_COMMENT,
          shortName: "Technician Comment"
        },
        value
      }
    case PFTType.INTERPRETATION:
      return {
        meta: {
          group: "Commentary",
          type: PFTType.INTERPRETATION,
          shortName: "Interpretation"
        },
        value
      }
  }
}

function predictTables(tables: string[][][]): [boolean, number[]][] {
  return tables.map((table) => {
    const columns: number[] = new Array(Rules.COLUMNS.length)
    let score = 0

    table.forEach((row, rowIndex) => {
      [...Rules.SPIROMETRY, ...Rules.DIFFUSION].forEach((rule) => {
        if (row[0].match(rule)) score += 1
      })

      // @note arbitrary cutoff to look at first three rows
      if (rowIndex <= 3) {
        Rules.COLUMNS.forEach((rule, ruleIndex) => {
          row.forEach((column, columnIndex) => {
            // If the rule matches
            // AND there is no previous match for the rule
            // AND there is no previous match for the columnIndex...
            if (column.match(rule) && !columns[ruleIndex] && !columns.includes(columnIndex)) columns[ruleIndex] = columnIndex
          })
        })
      }
    })

    if (score) {
      return [true, columns]
    } else {
      return [false, columns]
    }
  })
}

function getTables(data: AnalyzeDocumentResponse) {
  const blocks: { [key: string]: Block} = {}
  const tableBlocks: Block[] = []

  data.Blocks?.forEach((block: Block) => {
    if (block.Id) blocks[block.Id] = block;
    if (block.BlockType == "TABLE") tableBlocks.push(block)
  })

  return buildTables(tableBlocks, blocks);
}

function buildTables(tableBlocks: Block[], blocks: { [key: string]: Block}) {
  return tableBlocks.map((table) => {
    return findRowsColumns(table, blocks)
  })
}

function findRowsColumns(table: Block, blocks: { [key: string]: Block}) {
  const rows: string[][] = []

  table.Relationships?.forEach((relationship) => {
    if (relationship.Type == "CHILD") {
      relationship.Ids?.forEach((childId) => {
        const cell = blocks[childId];
        if (cell.BlockType == "CELL") {
          const rowIndex = cell.RowIndex
          const colIndex = cell.ColumnIndex

          // @note no-op if absent
          if (rowIndex == undefined || colIndex == undefined) return

          if (rowIndex > rows.length) rows.push([])
          rows[rowIndex - 1][colIndex - 1] = findText(cell, blocks)
        }
      })
    }

  })

  return rows;
}

function findText(cell: Block, blocks: { [key: string]: Block}): string {
  let text = ""
  if (cell.Relationships) {
    cell.Relationships.forEach((relationship) => {
      if (relationship.Type == "CHILD") {
        relationship.Ids?.forEach((childId) => {
          const word = blocks[childId]
          if (word.BlockType == "WORD") {
            text = text.concat(word.Text || "", " ")
          }
          if (word.BlockType == "SELECTION_ELEMENT") {
            if (word.SelectionStatus == "SELECTED") {
              text = text.concat("X ")
            }
          }
        })
      }
    })
  }

  return text;
}

function parseValue(value: string): number | null {
  if (isNaN(parseFloat(value))) {
    return null
  } else {
    return parseFloat(value)
  }
}