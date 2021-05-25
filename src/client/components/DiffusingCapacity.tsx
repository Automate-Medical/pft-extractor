import { Classes, H2, HTMLTable, Position, Tooltip } from "@blueprintjs/core"
import React from "react"
import { PFT, PFTElementType } from "../types"

import styles from "./DiffusingCapacity.module.scss"

const DiffusingTable = ({ pft }: { pft: PFT }) => {
  return (
    <section>
      <H2>Diffusing Capacity</H2>
      <HTMLTable condensed={true} striped={true} className={styles.Table}>
        <thead>
          <tr>
            <th></th>
            <th>Result</th>
            <th>LLN</th>
            <th>%Pred</th>
            <th>z-score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Tooltip className={Classes.TOOLTIP_INDICATOR} content="Diffusing capacity of the lung for carbon monoxide" position={Position.TOP}>
                <strong>DL<sub>co</sub> (at standard Pa)</strong>
              </Tooltip>
            </td>
            <td><strong>{ pft.elements?.find((e) => e.meta.type == "DLCOSB_PRE")?.value }</strong></td>
            <td>{ pft.elements?.find((e) => e.meta.type == "DLCOSB_LLN")?.value }</td>
            <td>{ pft.elements?.find((e) => e.meta.type == "DLCOSB_PREREF")?.value }</td>
            <td></td>
          </tr>
          <tr>
            <td>
              <Tooltip className={Classes.TOOLTIP_INDICATOR} content="Alveolar volume" position={Position.TOP}>
                <strong>VA (L)</strong>
              </Tooltip>
            </td>
            <td><strong>{ pft.elements?.find((e) => e.meta.type == "DLVA_PRE")?.value }</strong></td>
            <td>{ pft.elements?.find((e) => e.meta.type == "DLVA_LLN")?.value }</td>
            <td>{ pft.elements?.find((e) => e.meta.type == "DLVA_PREREF")?.value }</td>
            <td></td>
          </tr>

          <tr>
            <td>
              <Tooltip className={Classes.TOOLTIP_INDICATOR} content="Inspired volume over vital capacity" position={Position.TOP} lazy={true}>
                <strong>V<sub>1</sub>/V<sub>c</sub> (%)</strong>
              </Tooltip>
            </td>
            <td><strong></strong></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

        </tbody>
      </HTMLTable>
    </section>
  )
}

export default DiffusingTable;