import { Block, AnalyzeDocumentResponse } from "@aws-sdk/client-textract";

export default function transform(data: AnalyzeDocumentResponse) {
  const tables = getTables(data)

  return {
    data: detectPFTValues(tables)
  }
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

function detectPFTValues(tables: any[][]) {
  const FVC_RULE = /^FVC\s*\(?L?\)?\s*$/
  const FEV1_RULE = /^FEV\s*1\s*\(?L?\)?\s*$/
  const FEV1_FVC_RULE = /^FEV\s*1\s*\/?%?\s*FVC\s*\(?%?\)?\s*$/

  const rowRules = [FVC_RULE, FEV1_RULE, FEV1_FVC_RULE]

  let detected = {
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
      }
    }
  }

  let spirometryTables = tables.filter((table) => {
    return table.filter((row) => {
      return rowRules.filter((rule) => {
        return row[0].match(rule)
      })
    })
  })
  // 0 Pre
  // 1 Post
  // 2 Predicted
  // 3 lln
  // 4 uln
  let spirometryColumnIndices = [null, null, null, null, null]
  spirometryTables.forEach((table) => {
    table.forEach((row) => {
      row.forEach((col, index) => {
        if (col.match(/^(Best)?\s*Pre\s*$/)) {
          spirometryColumnIndices[0] = index
        }
        if (col.match(/^(Best)?\s*Post\s*$/)) {
          spirometryColumnIndices[1] = index
        }
        if (col.match(/^(Pred|Ref)\s*$/)) {
          spirometryColumnIndices[2] = index
        }
        if (col.match(/^LLN\s*$/)) {
          spirometryColumnIndices[3] = index
        }
        if (col.match(/^ULN\s*$/)) {
          spirometryColumnIndices[4] = index
        }
      })
    })
  })

  if (spirometryColumnIndices[0] || spirometryColumnIndices[1]) {
    spirometryTables.forEach((table) => {
      table.forEach((row) => {
        if (row[0].match(FVC_RULE)) {
          // @ts-ignore
          if (spirometryColumnIndices[0]) detected.spirometry.fvc.pre = parseFloat(row[spirometryColumnIndices[0]])
          // @ts-ignore
          if (spirometryColumnIndices[1]) detected.spirometry.fvc.post = parseFloat(row[spirometryColumnIndices[1]])
          // @ts-ignore
          if (spirometryColumnIndices[2]) detected.spirometry.fvc.predicted = parseFloat(row[spirometryColumnIndices[2]])
          // @ts-ignore
          if (spirometryColumnIndices[3]) detected.spirometry.fvc.lln = parseFloat(row[spirometryColumnIndices[3]])
          // @ts-ignore
          if (spirometryColumnIndices[4]) detected.spirometry.fvc.uln = parseFloat(row[spirometryColumnIndices[4]])
        }

        if (row[0].match(FEV1_RULE)) {    
          // @ts-ignore
          if (spirometryColumnIndices[0]) detected.spirometry.fev1.pre = parseFloat(row[spirometryColumnIndices[0]])
          // @ts-ignore
          if (spirometryColumnIndices[1]) detected.spirometry.fev1.post = parseFloat(row[spirometryColumnIndices[1]])
          // @ts-ignore
          if (spirometryColumnIndices[2]) detected.spirometry.fev1.predicted = parseFloat(row[spirometryColumnIndices[2]])
          // @ts-ignore
          if (spirometryColumnIndices[3]) detected.spirometry.fev1.lln = parseFloat(row[spirometryColumnIndices[3]])
          // @ts-ignore
          if (spirometryColumnIndices[4]) detected.spirometry.fev1.uln = parseFloat(row[spirometryColumnIndices[4]])
        }

        if (row[0].match(FEV1_FVC_RULE)) {          
          // @ts-ignore
          if (spirometryColumnIndices[0]) detected.spirometry.fev1fvc.pre = parseFloat(row[spirometryColumnIndices[0]])
          // @ts-ignore
          if (spirometryColumnIndices[1]) detected.spirometry.fev1fvc.post = parseFloat(row[spirometryColumnIndices[1]])
          // @ts-ignore
          if (spirometryColumnIndices[2]) detected.spirometry.fev1fvc.predicted = parseFloat(row[spirometryColumnIndices[2]])
          // @ts-ignore
          if (spirometryColumnIndices[3]) detected.spirometry.fev1fvc.lln = parseFloat(row[spirometryColumnIndices[3]])
          // @ts-ignore
          if (spirometryColumnIndices[4]) detected.spirometry.fev1fvc.uln = parseFloat(row[spirometryColumnIndices[4]])
        }
      })
    })
  }
  
  return detected;
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