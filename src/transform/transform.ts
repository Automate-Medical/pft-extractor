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
      fvcPre: 0,
      fvcPost: 0,
      fev1Pre: 0,
      fev1Post: 0,
      fev1fvcPre: 0,
      fev1fvcPost: 0
    }
  }

  let spirometryTables = tables.filter((table) => {
    return table.filter((row) => {
      return rowRules.filter((rule) => {
        return row[0].match(rule)
      })
    })
  })

  let spirometryColumnIndices = [null, null]
  spirometryTables.forEach((table) => {
    table.forEach((row) => {
      row.forEach((col, index) => {
        if (col.match(/^(Best)?\s*Pre\s*$/)) {
          spirometryColumnIndices[0] = index
        }
        if (col.match(/^(Best)?\s*Post\s*$/)) {
          spirometryColumnIndices[1] = index
        }
      })
    })
  })

  if (spirometryColumnIndices[0] || spirometryColumnIndices[1]) {
    spirometryTables.forEach((table) => {
      table.forEach((row) => {
        if (row[0].match(FVC_RULE)) {
          // @ts-ignore
          if (spirometryColumnIndices[0]) detected.spirometry.fvcPre = parseFloat(row[spirometryColumnIndices[0]])
          // @ts-ignore

          if (spirometryColumnIndices[1]) detected.spirometry.fvcPost = parseFloat(row[spirometryColumnIndices[1]])
        }

        if (row[0].match(FEV1_RULE)) {    
          // @ts-ignore
          if (spirometryColumnIndices[0]) detected.spirometry.fev1Pre = parseFloat(row[spirometryColumnIndices[0]])
          // @ts-ignore
          if (spirometryColumnIndices[1]) detected.spirometry.fev1Post = parseFloat(row[spirometryColumnIndices[1]])
        }

        if (row[0].match(FEV1_FVC_RULE)) {          
          // @ts-ignore
          if (spirometryColumnIndices[0]) detected.spirometry.fev1fvcPre = parseFloat(row[spirometryColumnIndices[0]])
          // @ts-ignore
          if (spirometryColumnIndices[1]) detected.spirometry.fev1fvcPost = parseFloat(row[spirometryColumnIndices[1]])
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