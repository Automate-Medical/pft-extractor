import { Classes, H2, H6, HTMLTable, Position, Tooltip } from "@blueprintjs/core"
import React from "react"
import { PFT, PFTElementType } from "../types"

import styles from "./Spirometry.module.scss"

const SpirometryTable = ({ pft }: { pft: PFT }) => {
  return (
    <section>
      <H2>Spirometry</H2>
      <div className={styles.Header}>
        <H6>Pre-bronchodilator</H6>
        <H6>Post-bronchodilator</H6>
      </div>
      <div className={styles.Table}>
        <HTMLTable condensed={true} striped={true}>
          <thead>
            <tr>
              <th></th>
              <th>
                <Tooltip className={Classes.TOOLTIP_INDICATOR} content="Best known performance by the patient during this test" position={Position.TOP} lazy={true}>
                  Best
                </Tooltip>
              </th>
              <th>
                <Tooltip className={Classes.TOOLTIP_INDICATOR} content="Lower limit of normal - 5th percentile in a standard distribution, or -1.625 standard deviations" position={Position.TOP} lazy={true}>
                  LLN
                </Tooltip>
              </th>
              <th>%Pred</th>
              <th>z-score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Tooltip className={Classes.TOOLTIP_INDICATOR} content="Forced vital capacity" position={Position.TOP} lazy={true}>
                  <strong>FVC (L) </strong>
                </Tooltip>
              </td>
              <td><strong>{ pft.elements?.find((e) => e.meta.type == "FVC_PRE")?.value }</strong></td>
              <td>{ pft.elements?.find((e) => e.meta.type == "FVC_LLN")?.value }</td>
              <td>{ pft.elements?.find((e) => e.meta.type == "FVC_PREREF")?.value }</td>
              <td></td>
            </tr>
            <tr>
              <td>
                <Tooltip className={Classes.TOOLTIP_INDICATOR} content="Forced expiratory volume in one second" position={Position.TOP} lazy={true}>
                  <strong>FEV<sub>1</sub> (L)</strong>
                </Tooltip>
              </td>
              <td><strong>{ pft.elements?.find((e) => e.meta.type == "FEV1_PRE")?.value }</strong></td>
              <td>{ pft.elements?.find((e) => e.meta.type == "FEV1_LLN")?.value }</td>
              <td>{ pft.elements?.find((e) => e.meta.type == "FEV1_PREREF")?.value }</td>
              <td></td>
            </tr>
            <tr>
              <td>
                <Tooltip className={Classes.TOOLTIP_INDICATOR} content="Forced expiratory volume in one second over forced vital capacity" position={Position.TOP} lazy={true}>
                  <strong>FEV<sub>1</sub>/FVC</strong>
                </Tooltip>
              </td>
              <td><strong>{ pft.elements?.find((e) => e.meta.type == "FEV1FVC_PRE")?.value }</strong></td>
              <td>{ pft.elements?.find((e) => e.meta.type == "FEV1FVC_LLN")?.value }</td>
              <td>{ pft.elements?.find((e) => e.meta.type == "FEV1FVC_PREREF")?.value }</td>
              <td></td>
            </tr>
            <tr>
              <td>
                <Tooltip className={Classes.TOOLTIP_INDICATOR} content="Forced expiratory time" position={Position.TOP}>
                  <strong>FET (s)</strong>
                </Tooltip>
              </td>
              <td><strong>{ pft.elements?.find((e) => e.meta.type == "FET_PRE")?.value }</strong></td>
            </tr>
          </tbody>
        </HTMLTable>
        <HTMLTable condensed={true} striped={true}>
          <thead>
            <tr>
              <th>Best</th>
              <th>%Pred</th>
              <th>%Pred Δ</th>
              <th>Absolute Δ</th>
              <th>z-score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>{ pft.elements?.find((e) => e.meta.type == "FVC_POST")?.value }</strong></td>
              <td>{ pft.elements?.find((e) => e.meta.type == "FVC_POSTREF")?.value }</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>{ pft.elements?.find((e) => e.meta.type == "FEV1_POST")?.value }</strong></td>
              <td>{ pft.elements?.find((e) => e.meta.type == "FVC_POSTREF")?.value }</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>{ pft.elements?.find((e) => e.meta.type == "FEV1FVC_POST")?.value }</strong></td>
              <td>{ pft.elements?.find((e) => e.meta.type == "FVC_POSTREF")?.value }</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>{ pft.elements?.find((e) => e.meta.type == "FET_POST")?.value }</strong></td>
            </tr>
          </tbody>
        </HTMLTable>
      </div>
    </section>
  )
}

export default SpirometryTable;