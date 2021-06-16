export const FVC = /^FVC\s*\(?L?\)?\s*$/
export const FEV1 = /^FEV\s*1\s*\(?L?\)?\s*$/
export const FEV1_FVC = /^FEV\s*1\s*\/?%?\s*FVC\s*\(?%?\)?\s*$/
export const FEF50 = /^FEF\s*50\s*$/
export const FEF75 = /^FEF\s*75\s*$/
export const FEF25_75 = /^FEF25-?75%?\s*(\(%\))?\s*$/
export const FET = /^FET(100%|\s*\(sec\))?\s*$/
export const PEF = /^PEF\s*$/

export const SPIROMETRY = [FVC, FEV1, FEV1_FVC, FEF50, FEF25_75, FET, PEF]

export const DLCOSB = /^DLCO(\s*|_)(sb|SB)\s*\(?.*\)?\s*$/
export const DLCOCSB = /^DLCOc(sb|SB)\s*\(?.*\)?\s*$/
export const IVCSB = /^IVC(sb|_SB)\s*\(?.*\)?\s*$/
export const DLVA = /^DL\/VA\s*\(?.*\)?\s*$/

export const DIFFUSION = [DLCOSB, DLVA, DLCOCSB, IVCSB]

export const PRE = /^(Best)?\s*(Pre|PRE)\s*$/
export const POST = /^(Best)?\s*(Post|POST)\s*$/
export const REF = /^(Pred|Ref)\s*$/
export const PREREF = /^(%\s*?Pred|Pre%Ref)\s*?$/
export const POSTREF = /^(%PostPred|%\s*?Pred)\s*?$/
export const LLN = /^(Pred)?\s*?LLN\s*$/
export const ULN = /^(Pred)?\s*?ULN\s*$/

export const COLUMNS = [PRE, POST, REF, PREREF, POSTREF, LLN, ULN]

export const COMMENT = /Comments:$/

export const INTERPRETATION = /Interpretation/