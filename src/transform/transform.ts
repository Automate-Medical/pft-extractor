// @ts-nocheck

import { Block, AnalyzeDocumentResponse } from "@aws-sdk/client-textract";
import Normalized from "./normalized";

const FVC_RULE = /^FVC\s*\(?L?\)?\s*$/
const FEV1_RULE = /^FEV\s*1\s*\(?L?\)?\s*$/
const FEV1_FVC_RULE = /^FEV\s*1\s*\/?%?\s*FVC\s*\(?%?\)?\s*$/
const FEF25_75_RULE = /^FEF25-75%?\s*(\(%\))?\s*$/

const SPIROMETRY_RULES = [FVC_RULE, FEV1_RULE, FEV1_FVC_RULE, FEF25_75_RULE]

const DLCOSB_RULE = /^DLCO(\s*|_)(sb|SB)\s*\(?.*\)?\s*$/
const DLVA_RULE = /^DL\/VA\s*\(?.*\)?\s*$/

const DIFFUSION_RULES = [DLCOSB_RULE, DLVA_RULE]

const PRE_RULE = /^(Best)?\s*Pre\s*$/
const POST_RULE = /^(Best)?\s*Post\s*$/
const PREDICTED_RULE = /^(Pred|Ref)\s*$/
const LLN_RULE = /^LLN\s*$/
const ULN_RULE = /^ULN\s*$/

const COLUMN_RULES = [PRE_RULE, POST_RULE, PREDICTED_RULE, LLN_RULE, ULN_RULE]

export default function transform(data: AnalyzeDocumentResponse) {
  const tables = getTables(data)

  return detectPFTValues(tables)
}

function detectPFTValues(tables: any[][]): Normalized {
  let detected = new Normalized()

  let tablePredictions = tables.map((table) => {
    let spirometry = 0
    let diffusion = 0
    let columns: any[] = new Array(COLUMN_RULES.length)

    table.forEach((row, rowIndex) => {
      SPIROMETRY_RULES.forEach((rule) => {
        if (row[0].match(rule)) spirometry += 1
      })

      DIFFUSION_RULES.forEach((rule) => {
        if (row[0].match(rule)) diffusion += 1
      })

      // @note arbitrary cutoff to look at first three rows
      if (rowIndex <= 3) {
        COLUMN_RULES.forEach((rule, ruleIndex) => {
          row.forEach((column, columnIndex) => {
            if (column.match(rule)) {
              columns[ruleIndex] = columnIndex
            }
          })
        })
      }
    })
    
    if (spirometry > diffusion) {
      return ['spirometry', columns]
    } else if (diffusion) {
      return ['diffusion', columns]
    } else {
      return [null, columns]
    }
  })

  tables.forEach((table, index) => {
    if (tablePredictions[index][0] == null || tablePredictions[index][1] == null) return;
    const columns = tablePredictions[index][1]

    table.forEach((row) => {
      if (row[0].match(FVC_RULE)) {
        if (columns[0]) detected.pft.spirometry.fvc.pre = parseValue(row[columns[0]])
        if (columns[1]) detected.pft.spirometry.fvc.post = parseValue(row[columns[1]])
        if (columns[2]) detected.pft.spirometry.fvc.predicted = parseValue(row[columns[2]])
        if (columns[3]) detected.pft.spirometry.fvc.lln = parseValue(row[columns[3]])
        if (columns[4]) detected.pft.spirometry.fvc.uln = parseValue(row[columns[4]])
      }

      if (row[0].match(FEV1_RULE)) {    
        if (columns[0]) detected.pft.spirometry.fev1.pre = parseValue(row[columns[0]])
        if (columns[1]) detected.pft.spirometry.fev1.post = parseValue(row[columns[1]])
        if (columns[2]) detected.pft.spirometry.fev1.predicted = parseValue(row[columns[2]])
        if (columns[3]) detected.pft.spirometry.fev1.lln = parseValue(row[columns[3]])
        if (columns[4]) detected.pft.spirometry.fev1.uln = parseValue(row[columns[4]])
      }

      if (row[0].match(FEV1_FVC_RULE)) {          
        if (columns[0]) detected.pft.spirometry.fev1fvc.pre = parseValue(row[columns[0]])
        if (columns[1]) detected.pft.spirometry.fev1fvc.post = parseValue(row[columns[1]])
        if (columns[2]) detected.pft.spirometry.fev1fvc.predicted = parseValue(row[columns[2]])
        if (columns[3]) detected.pft.spirometry.fev1fvc.lln = parseValue(row[columns[3]])
        if (columns[4]) detected.pft.spirometry.fev1fvc.uln = parseValue(row[columns[4]])
      }

      if (row[0].match(FEF25_75_RULE)) {          
        if (columns[0]) detected.pft.spirometry.fef2575.pre = parseValue(row[columns[0]])
        if (columns[1]) detected.pft.spirometry.fef2575.post = parseValue(row[columns[1]])
        if (columns[2]) detected.pft.spirometry.fef2575.predicted = parseValue(row[columns[2]])
        if (columns[3]) detected.pft.spirometry.fef2575.lln = parseValue(row[columns[3]])
        if (columns[4]) detected.pft.spirometry.fef2575.uln = parseValue(row[columns[4]])
      }

      if (row[0].match(DLCOSB_RULE)) {          
        if (columns[0]) detected.pft.diffusion.dlcosb.pre = parseValue(row[columns[0]])
        if (columns[1]) detected.pft.diffusion.dlcosb.post = parseValue(row[columns[1]])
        if (columns[2]) detected.pft.diffusion.dlcosb.predicted = parseValue(row[columns[2]])
        if (columns[3]) detected.pft.diffusion.dlcosb.lln = parseValue(row[columns[3]])
        if (columns[4]) detected.pft.diffusion.dlcosb.uln = parseValue(row[columns[4]])
      }

      if (row[0].match(DLVA_RULE)) {          
        if (columns[0]) detected.pft.diffusion.dlva.pre = parseValue(row[columns[0]])
        if (columns[1]) detected.pft.diffusion.dlva.post = parseValue(row[columns[1]])
        if (columns[2]) detected.pft.diffusion.dlva.predicted = parseValue(row[columns[2]])
        if (columns[3]) detected.pft.diffusion.dlva.lln = parseValue(row[columns[3]])
        if (columns[4]) detected.pft.diffusion.dlva.uln = parseValue(row[columns[4]])
      }
    })
  })
  
  return detected;
}

function getTables(data: AnalyzeDocumentResponse) {
  let blocks: { [key: string]: Block} = {}
  let tableBlocks: Block[] = []

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
  let rows = []

  table.Relationships?.forEach((relationship) => {
    if (relationship.Type == "CHILD") {
      relationship.Ids?.forEach((childId) => {
        const cell = blocks[childId];
        if (cell.BlockType == "CELL") {
          const rowIndex = cell.RowIndex
          const colIndex = cell.ColumnIndex
          // @ts-ignore
          if (rowIndex > rows.length) rows.push([])
          // @ts-ignore
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

function parseValue(value): number | null {
  if (isNaN(parseFloat(value))) {
    return null
  } else {
    return parseFloat(value)
  }
}