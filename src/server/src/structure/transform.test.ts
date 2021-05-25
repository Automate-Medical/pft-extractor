import transform from "./transform"

const careFusionMock = require('./mocks/care-fusion-textract-results.json')
const mayoMock = require('./mocks/mayo-textract-results.json')
const nwMock = require('./mocks/nw-textract-results.json')
const uicMock = require('./mocks/uic.json')
const calgaryMock1 = require('./mocks/calgary1.json')
const calgaryMock2 = require('./mocks/calgary2.json')

const util = require('util')
// console.log(util.inspect(transform(careFusionMock), {showHidden: false, depth: null}))
console.log(util.inspect(transform(nwMock), {showHidden: false, depth: null}))
console.log(util.inspect(transform(uicMock), {showHidden: false, depth: null}))

test('extracting spirometry from CareFusion mock', () => {
  const outcome = transform(careFusionMock)

  expect(outcome).toStrictEqual({
      elements: [
        {
          meta: {
            loinc: '19876-2',
            shortName: 'FVC pre BD Vol Respiratory Spirometry',
            units: 'L',
            group: 'Spirometry',
            type: 'FVC_PRE'
          },
          value: 6.4
        },
        {
          meta: {
            loinc: '19874-7',
            shortName: 'FVC p BD Vol Respiratory Spirometry',
            units: 'L',
            group: 'Spirometry',
            type: 'FVC_POST'
          },
          value: 6.45
        },
        {
          meta: {
            loinc: '19869-7',
            shortName: 'FVC Vol Respiratory Predicted',
            units: 'L',
            group: 'Spirometry',
            type: 'FVC_REF'
          },
          value: 6.5
        },
        {
          meta: {
            shortName: 'FVC pre BD Vol Respiratory % Predicted',
            units: '%',
            group: 'Spirometry',
            type: 'FVC_PREREF'
          },
          value: 98.5
        },
        {
          meta: {
            shortName: 'FVC p BD Vol Respiratory % Predicted',
            units: '%',
            group: 'Spirometry',
            type: 'FVC_POSTREF'
          },
          value: 99.2
        },
        {
          meta: {
            shortName: 'FVC Vol Respiratory LLN',
            units: 'L',
            group: 'Spirometry',
            type: 'FVC_LLN'
          },
          value: 5.25
        },
        {
          meta: {
            shortName: 'FVC Vol Respiratory ULN',
            units: 'L',
            group: 'Spirometry',
            type: 'FVC_ULN'
          },
          value: 7.77
        },
        {
          meta: {
            loinc: '20157-4',
            shortName: 'FEV1 pre BD',
            units: 'L',
            group: 'Spirometry',
            type: 'FEV1_PRE'
          },
          value: 5.41
        },
        {
          meta: {
            loinc: '20155-8',
            shortName: 'FEV1 p BD',
            units: 'L',
            group: 'Spirometry',
            type: 'FEV1_POST'
          },
          value: 5.59
        },
        {
          meta: {
            loinc: '20149-1',
            shortName: 'FEV1 Predicted',
            units: 'L',
            group: 'Spirometry',
            type: 'FEV1_REF'
          },
          value: 5.33
        },
        {
          meta: {
            shortName: 'FEV1 pre BD % Predicted',
            units: '%',
            group: 'Spirometry',
            type: 'FEV1_PREREF'
          },
          value: 101.5
        },
        {
          meta: {
            shortName: 'FEV1 p BD % Predicted',
            units: '%',
            group: 'Spirometry',
            type: 'FEV1_POSTREF'
          },
          value: 105
        },
        {
          meta: {
            shortName: 'FEV1 LLN',
            units: 'L',
            group: 'Spirometry',
            type: 'FEV1_LLN'
          },
          value: 4.28
        },
        {
          meta: {
            shortName: 'FEV1 ULN',
            units: 'L',
            group: 'Spirometry',
            type: 'FEV1_ULN'
          },
          value: 6.35
        },
        {
          meta: {
            loinc: '19926-5',
            shortName: 'FEV1/FVC',
            units: '%',
            group: 'Spirometry',
            type: 'FEV1FVC_PRE'
          },
          value: 84.52
        },
        {
          meta: {
            loinc: '69970-2',
            shortName: 'FEV1/FVC p BD',
            units: '%',
            group: 'Spirometry',
            type: 'FEV1FVC_POST'
          },
          value: 86.78
        },
        {
          meta: {
            loinc: '19925-7',
            shortName: 'FEV1/FVC Predicted',
            units: '%',
            group: 'Spirometry',
            type: 'FEV1FVC_REF'
          },
          value: 82.65
        },
        {
          meta: {
            shortName: 'FEV1/FVC % Predicted',
            units: '%',
            group: 'Spirometry',
            type: 'FEV1FVC_PREREF'
          },
          value: 102.3
        },
        {
          meta: {
            shortName: 'FEV1/FVC p BD % Predicted',
            units: '%',
            group: 'Spirometry',
            type: 'FEV1FVC_POSTREF'
          },
          value: 105
        },
        {
          meta: {
            shortName: 'FEV1/FVC LLN',
            units: '%',
            group: 'Spirometry',
            type: 'FEV1FVC_LLN'
          },
          value: 71.49
        },
        {
          meta: {
            shortName: 'FEV1/FVC ULN',
            units: '%',
            group: 'Spirometry',
            type: 'FEV1FVC_ULN'
          },
          value: 91.88
        },
        {
          meta: {
            loinc: '69975-1',
            shortName: 'PEF pre BD Airway',
            units: 'L/s',
            group: 'Spirometry',
            type: 'PEF_PRE'
          },
          value: 10.9
        },
        {
          meta: {
            loinc: '69976-9',
            shortName: 'PEF p BD Airway',
            units: 'L/s',
            group: 'Spirometry',
            type: 'PEF_POST'
          },
          value: 11.79
        },
        {
          meta: {
            loinc: '69974-4',
            shortName: 'PEF Airway Predicted',
            units: 'L/s',
            group: 'Spirometry',
            type: 'PEF_REF'
          },
          value: 11
        },
        {
          meta: {
            shortName: 'PEF pre BD Airway % Predicted',
            units: '%',
            group: 'Spirometry',
            type: 'PEF_PREREF'
          },
          value: 99.1
        },
        {
          meta: {
            shortName: 'PEF p BD Airway % Predicted',
            units: '%',
            group: 'Spirometry',
            type: 'PEF_POSTREF'
          },
          value: 107.1
        },
        {
          meta: {
            shortName: 'PEF Airway LLN',
            units: 'L/s',
            group: 'Spirometry',
            type: 'PEF_LLN'
          },
          value: 7.12
        },
        {
          meta: {
            shortName: 'PEF Airway ULN',
            units: 'L/s',
            group: 'Spirometry',
            type: 'PEF_ULN'
          },
          value: 14.89
        },
        {
          meta: {
            group: 'Commentary',
            type: 'RT_COMMENT',
            shortName: 'Technician Comment'
          },
          value: 'Good pt effort. No home resp meds. BD: Salbutamol 400mcg given via MDI + spacer.'
        }
      ]
    })

  expect(outcome.elements.length).toEqual(22)
});

test('extracting spirometry from Mayo Clinic mock', () => {
  const outcome = transform(mayoMock)

  expect(outcome).toStrictEqual({
    elements: [
      {
        meta: {
          loinc: '19911-7',
          shortName: 'Diff cap.CO',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOSB_PRE'
        },
        value: 32.2
      },
      {
        meta: {
          loinc: '19910-9',
          shortName: 'Diff cap.CO Predicted',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOSB_REF'
        },
        value: 25.6
      },
      {
        meta: {
          shortName: 'Diff cap.CO % Predicted',
          units: '%',
          group: 'Diffusion Capacity',
          type: 'DLCOSB_PREREF'
        },
        value: 126
      },
      {
        meta: {
          group: 'Diffusion Capacity',
          shortName: 'Diff cap.CO LLN',
          units: 'cc/min/mmHg',
          type: 'DLCOSB_LLN'
        },
        value: 18.9
      },
      {
        meta: {
          group: 'Diffusion Capacity',
          shortName: 'Diff cap.CO ULN',
          units: 'cc/min/mmHg',
          type: 'DLCOSB_ULN'
        },
        value: 32.2
      },
      {
        meta: {
          loinc: '19913-3',
          shortName: 'Diff cap.CO Hgb adj',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOCSB_PRE'
        },
        value: 34.6
      },
      {
        meta: {
          shortName: 'Diff cap.CO Hgb adj Predicted',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOCSB_REF'
        },
        value: 25.6
      },
      {
        meta: {
          shortName: 'Diff cap.CO Hgb adj % Predicted',
          units: '%',
          group: 'Diffusion Capacity',
          type: 'DLCOCSB_PREREF'
        },
        value: 135
      },
      {
        meta: {
          shortName: 'Diff cap.CO Hgb adj LLN',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOCSB_LLN'
        },
        value: 18.9
      },
      {
        meta: {
          shortName: 'Diff cap.CO Hgb adj ULN',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOCSB_ULN'
        },
        value: 32.2
      },
      {
        meta: {
          shortName: 'Inspiratory Vital Capacity',
          group: 'Diffusion Capacity',
          units: 'L',
          type: 'IVCSB_PRE'
        },
        value: 3.76
      },
      {
        meta: {
          shortName: 'Inspiratory Cital Capacity Predicted',
          group: 'Diffusion Capacity',
          units: 'L',
          type: 'IVCSB_REF'
        },
        value: 4.44
      },
      {
        meta: {
          shortName: 'Inspiratory Cital Capacity % Predicted',
          group: 'Diffusion Capacity',
          units: 'L',
          type: 'IVCSB_PREREF'
        },
        value: 85
      },
      {
        meta: {
          shortName: 'Inspiratory Cital Capacity LLN',
          group: 'Diffusion Capacity',
          units: 'L',
          type: 'IVCSB_LLN'
        },
        value: 3.32
      },
      {
        meta: {
          shortName: 'Inspiratory Cital Capacity ULN',
          units: 'L',
          group: 'Diffusion Capacity',
          type: 'IVCSB_ULN'
        },
        value: 5.55
      },
      {
        meta: {
          loinc: '19916-6',
          shortName: 'Diff cap/Alv vol',
          group: 'Diffusion Capacity',
          type: 'DLVA_PRE'
        },
        value: 5.7
      },
      {
        meta: {
          loinc: '19915-8',
          shortName: 'Diff cap/Alv vol Predicted',
          group: 'Diffusion Capacity',
          type: 'DLVA_REF'
        },
        value: 4.15
      },
      {
        meta: {
          shortName: 'Diff cap/Alv vol % Predicted',
          group: 'Diffusion Capacity',
          type: 'DLVA_PREREF'
        },
        value: 137
      },
      {
        meta: {
          shortName: 'Diff cap/Alv vol LLN',
          group: 'Diffusion Capacity',
          type: 'DLVA_LLN'
        },
        value: 3.1
      },
      {
        meta: {
          shortName: 'Diff cap/Alv ULN',
          group: 'Diffusion Capacity',
          type: 'DLVA_ULN'
        },
        value: 5.2
      },
      {
        meta: {
          loinc: '19876-2',
          shortName: 'FVC pre BD Vol Respiratory Spirometry',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_PRE'
        },
        value: 4.18
      },
      {
        meta: {
          loinc: '19874-7',
          shortName: 'FVC p BD Vol Respiratory Spirometry',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_POST'
        },
        value: 4.28
      },
      {
        meta: {
          loinc: '19869-7',
          shortName: 'FVC Vol Respiratory Predicted',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_REF'
        },
        value: 4.39
      },
      {
        meta: {
          shortName: 'FVC pre BD Vol Respiratory % Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FVC_PREREF'
        },
        value: 95
      },
      {
        meta: {
          shortName: 'FVC Vol Respiratory LLN',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_LLN'
        },
        value: 3.48
      },
      {
        meta: {
          loinc: '20157-4',
          shortName: 'FEV1 pre BD',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_PRE'
        },
        value: 2.85
      },
      {
        meta: {
          loinc: '20155-8',
          shortName: 'FEV1 p BD',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_POST'
        },
        value: 3.18
      },
      {
        meta: {
          loinc: '20149-1',
          shortName: 'FEV1 Predicted',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_REF'
        },
        value: 3.26
      },
      {
        meta: {
          shortName: 'FEV1 pre BD % Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1_PREREF'
        },
        value: 87
      },
      {
        meta: {
          shortName: 'FEV1 LLN',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_LLN'
        },
        value: 2.5
      },
      {
        meta: {
          loinc: '19926-5',
          shortName: 'FEV1/FVC',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_PRE'
        },
        value: 68.2
      },
      {
        meta: {
          loinc: '69970-2',
          shortName: 'FEV1/FVC p BD',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_POST'
        },
        value: 74.3
      },
      {
        meta: {
          loinc: '19925-7',
          shortName: 'FEV1/FVC Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_REF'
        },
        value: 76.6
      },
      {
        meta: {
          shortName: 'FEV1/FVC % Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_PREREF'
        },
        value: 89
      },
      {
        meta: {
          shortName: 'FEV1/FVC LLN',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_LLN'
        },
        value: 63.6
      },
      {
        meta: {
          loinc: '69972-8',
          shortName: 'FEF 25-75% pre BD',
          units: 'L/s',
          group: 'Spirometry',
          type: 'FEF2575_PRE'
        },
        value: 1.69
      },
      {
        meta: {
          loinc: '69973-6',
          shortName: 'FEF 25-75% p BD',
          units: 'L/s',
          group: 'Spirometry',
          type: 'FEF2575_POST'
        },
        value: 2.5
      },
      {
        meta: {
          loinc: '69971-0',
          shortName: 'FEF 25-75% Predicted',
          units: 'L/s',
          group: 'Spirometry',
          type: 'FEF2575_REF'
        },
        value: 2.57
      },
      {
        meta: {
          shortName: 'FEF 25-75% pre BD % Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FEF2575_PREREF'
        },
        value: 66
      },
      {
        meta: {
          shortName: 'FEF 25-75% LLN',
          units: 'L/s',
          group: 'Spirometry',
          type: 'FEF2575_LLN'
        },
        value: 1.03
      },
      {
        meta: {
          loinc: '65819-5',
          shortName: 'FET',
          units: 's',
          group: 'Spirometry',
          type: 'FET_PRE'
        },
        value: 8.95
      },
      {
        meta: {
          loinc: '65819-5',
          shortName: 'FET',
          units: 's',
          group: 'Spirometry',
          type: 'FET_POST'
        },
        value: 9.29
      }
    ]
  });

  expect(outcome.elements.length).toEqual(42)
});

test('extracting spirometry from Northwestern mock', () => {
  const outcome = transform(nwMock)

  expect(outcome).toStrictEqual({
    elements: [
      {
        meta: {
          loinc: '19876-2',
          shortName: 'FVC pre BD Vol Respiratory Spirometry',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_PRE'
        },
        value: 2.8
      },
      {
        meta: {
          loinc: '19869-7',
          shortName: 'FVC Vol Respiratory Predicted',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_REF'
        },
        value: 3.4
      },
      {
        meta: {
          shortName: 'FVC pre BD Vol Respiratory % Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FVC_PREREF'
        },
        value: 82
      },
      {
        meta: {
          shortName: 'FVC Vol Respiratory LLN',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_LLN'
        },
        value: 2.71
      },
      {
        meta: {
          shortName: 'FVC Vol Respiratory ULN',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_ULN'
        },
        value: 4.1
      },
      {
        meta: {
          loinc: '20157-4',
          shortName: 'FEV1 pre BD',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_PRE'
        },
        value: 2.31
      },
      {
        meta: {
          loinc: '20149-1',
          shortName: 'FEV1 Predicted',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_REF'
        },
        value: 2.65
      },
      {
        meta: {
          shortName: 'FEV1 pre BD % Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1_PREREF'
        },
        value: 87
      },
      {
        meta: {
          shortName: 'FEV1 LLN',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_LLN'
        },
        value: 2.06
      },
      {
        meta: {
          shortName: 'FEV1 ULN',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_ULN'
        },
        value: 3.24
      },
      {
        meta: {
          loinc: '19926-5',
          shortName: 'FEV1/FVC',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_PRE'
        },
        value: 82
      },
      {
        meta: {
          loinc: '19925-7',
          shortName: 'FEV1/FVC Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_REF'
        },
        value: 79
      },
      {
        meta: {
          shortName: 'FEV1/FVC % Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_PREREF'
        },
        value: 105
      },
      {
        meta: {
          shortName: 'FEV1/FVC LLN',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_LLN'
        },
        value: 69
      },
      {
        meta: {
          shortName: 'FEV1/FVC ULN',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_ULN'
        },
        value: 88
      },
      {
        meta: {
          loinc: '69972-8',
          shortName: 'FEF 25-75% pre BD',
          units: 'L/s',
          group: 'Spirometry',
          type: 'FEF2575_PRE'
        },
        value: 2.61
      },
      {
        meta: {
          loinc: '69971-0',
          shortName: 'FEF 25-75% Predicted',
          units: 'L/s',
          group: 'Spirometry',
          type: 'FEF2575_REF'
        },
        value: 2.49
      },
      {
        meta: {
          shortName: 'FEF 25-75% pre BD % Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FEF2575_PREREF'
        },
        value: 105
      },
      {
        meta: {
          shortName: 'FEF 25-75% LLN',
          units: 'L/s',
          group: 'Spirometry',
          type: 'FEF2575_LLN'
        },
        value: 1.24
      },
      {
        meta: {
          shortName: 'FEF 25-75% ULN',
          units: 'L/s',
          group: 'Spirometry',
          type: 'FEF2575_ULN'
        },
        value: 3.73
      },
      {
        meta: {
          loinc: '65819-5',
          shortName: 'FET',
          units: 's',
          group: 'Spirometry',
          type: 'FET_PRE'
        },
        value: 7.7
      },
      {
        meta: {
          loinc: '19911-7',
          shortName: 'Diff cap.CO',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOSB_PRE'
        },
        value: 21.84
      },
      {
        meta: {
          loinc: '19910-9',
          shortName: 'Diff cap.CO Predicted',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOSB_REF'
        },
        value: 22.02
      },
      {
        meta: {
          shortName: 'Diff cap.CO % Predicted',
          units: '%',
          group: 'Diffusion Capacity',
          type: 'DLCOSB_PREREF'
        },
        value: 99
      },
      {
        meta: {
          group: 'Diffusion Capacity',
          shortName: 'Diff cap.CO LLN',
          units: 'cc/min/mmHg',
          type: 'DLCOSB_LLN'
        },
        value: 15.52
      },
      {
        meta: {
          group: 'Diffusion Capacity',
          shortName: 'Diff cap.CO ULN',
          units: 'cc/min/mmHg',
          type: 'DLCOSB_ULN'
        },
        value: 28.52
      },
      {
        meta: {
          loinc: '19913-3',
          shortName: 'Diff cap.CO Hgb adj',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOCSB_PRE'
        },
        value: 21.77
      },
      {
        meta: {
          shortName: 'Diff cap.CO Hgb adj Predicted',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOCSB_REF'
        },
        value: 22.02
      },
      {
        meta: {
          shortName: 'Diff cap.CO Hgb adj % Predicted',
          units: '%',
          group: 'Diffusion Capacity',
          type: 'DLCOCSB_PREREF'
        },
        value: 99
      },
      {
        meta: {
          shortName: 'Diff cap.CO Hgb adj LLN',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOCSB_LLN'
        },
        value: 15.52
      },
      {
        meta: {
          shortName: 'Diff cap.CO Hgb adj ULN',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOCSB_ULN'
        },
        value: 28.52
      },
      {
        meta: {
          loinc: '19916-6',
          shortName: 'Diff cap/Alv vol',
          group: 'Diffusion Capacity',
          type: 'DLVA_PRE'
        },
        value: 5.8
      },
      {
        meta: {
          loinc: '19915-8',
          shortName: 'Diff cap/Alv vol Predicted',
          group: 'Diffusion Capacity',
          type: 'DLVA_REF'
        },
        value: 4.48
      },
      {
        meta: {
          shortName: 'Diff cap/Alv vol % Predicted',
          group: 'Diffusion Capacity',
          type: 'DLVA_PREREF'
        },
        value: 129
      },
      {
        meta: {
          shortName: 'Diff cap/Alv vol LLN',
          group: 'Diffusion Capacity',
          type: 'DLVA_LLN'
        },
        value: 3.17
      },
      {
        meta: {
          shortName: 'Diff cap/Alv ULN',
          group: 'Diffusion Capacity',
          type: 'DLVA_ULN'
        },
        value: 5.8
      },
      {
        meta: {
          shortName: 'Inspiratory Vital Capacity',
          group: 'Diffusion Capacity',
          units: 'L',
          type: 'IVCSB_PRE'
        },
        value: 2.77
      },
      {
        meta: {
          shortName: 'Inspiratory Cital Capacity Predicted',
          group: 'Diffusion Capacity',
          units: 'L',
          type: 'IVCSB_REF'
        },
        value: 3.4
      },
      {
        meta: {
          shortName: 'Inspiratory Cital Capacity % Predicted',
          group: 'Diffusion Capacity',
          units: 'L',
          type: 'IVCSB_PREREF'
        },
        value: 81
      },
      {
        meta: {
          shortName: 'Inspiratory Cital Capacity LLN',
          group: 'Diffusion Capacity',
          units: 'L',
          type: 'IVCSB_LLN'
        },
        value: 2.71
      },
      {
        meta: {
          shortName: 'Inspiratory Cital Capacity ULN',
          units: 'L',
          group: 'Diffusion Capacity',
          type: 'IVCSB_ULN'
        },
        value: 4.1
      },
      {
        meta: {
          group: 'Commentary',
          type: 'RT_COMMENT',
          shortName: 'Technician Comment'
        },
        value: 'Spirometry data is ACCEPTABLE and REPRODUCIBLE.Good pt effort and cooperation.'
      }
    ]
  });

  expect(outcome.elements.length).toEqual(42)
});

test('extracting spirometry from UIC mock', () => {
  const outcome = transform(uicMock)

  expect(transform(uicMock)).toStrictEqual({
    elements: [
      {
        meta: {
          loinc: '19876-2',
          shortName: 'FVC pre BD Vol Respiratory Spirometry',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_PRE'
        },
        value: 1.28
      },
      {
        meta: {
          loinc: '19869-7',
          shortName: 'FVC Vol Respiratory Predicted',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_REF'
        },
        value: 2.48
      },
      {
        meta: {
          shortName: 'FVC pre BD Vol Respiratory % Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FVC_PREREF'
        },
        value: 52
      },
      {
        meta: {
          loinc: '20157-4',
          shortName: 'FEV1 pre BD',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_PRE'
        },
        value: 1.05
      },
      {
        meta: {
          loinc: '20149-1',
          shortName: 'FEV1 Predicted',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_REF'
        },
        value: 1.93
      },
      {
        meta: {
          shortName: 'FEV1 pre BD % Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1_PREREF'
        },
        value: 54
      },
      {
        meta: {
          loinc: '19926-5',
          shortName: 'FEV1/FVC',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_PRE'
        },
        value: 82
      },
      {
        meta: {
          loinc: '19925-7',
          shortName: 'FEV1/FVC Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_REF'
        },
        value: 78
      },
      {
        meta: {
          shortName: 'FEV1/FVC % Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_PREREF'
        },
        value: 105
      },
      {
        meta: {
          loinc: '69972-8',
          shortName: 'FEF 25-75% pre BD',
          units: 'L/s',
          group: 'Spirometry',
          type: 'FEF2575_PRE'
        },
        value: 1.02
      },
      {
        meta: {
          loinc: '69971-0',
          shortName: 'FEF 25-75% Predicted',
          units: 'L/s',
          group: 'Spirometry',
          type: 'FEF2575_REF'
        },
        value: 1.82
      },
      {
        meta: {
          shortName: 'FEF 25-75% pre BD % Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FEF2575_PREREF'
        },
        value: 56
      },
      {
        meta: {
          loinc: '69972-8',
          shortName: 'FEF 25-75% pre BD',
          units: 'L/s',
          group: 'Spirometry',
          type: 'FEF2575_PRE'
        },
        value: 2
      },
      {
        meta: {
          loinc: '69971-0',
          shortName: 'FEF 25-75% Predicted',
          units: 'L/s',
          group: 'Spirometry',
          type: 'FEF2575_REF'
        },
        value: 3.19
      },
      {
        meta: {
          shortName: 'FEF 25-75% pre BD % Predicted',
          units: '%',
          group: 'Spirometry',
          type: 'FEF2575_PREREF'
        },
        value: 63
      }
    ]
  })

  expect(outcome.elements.length).toEqual(15)
})


test('extracting spirometry from Calgary mock 1', () => {
  const outcome = transform(calgaryMock1)

  expect(outcome).toStrictEqual({
    elements: [
      {
        meta: {
          loinc: '19911-7',
          shortName: 'Diff cap.CO',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOSB_PRE'
        },
        value: 18.67
      },
      {
        meta: {
          group: 'Diffusion Capacity',
          shortName: 'Diff cap.CO LLN',
          units: 'cc/min/mmHg',
          type: 'DLCOSB_LLN'
        },
        value: 15.3
      },
      {
        meta: {
          group: 'Diffusion Capacity',
          shortName: 'Diff cap.CO ULN',
          units: 'cc/min/mmHg',
          type: 'DLCOSB_ULN'
        },
        value: 24.9
      },
      {
        meta: {
          loinc: '19913-3',
          shortName: 'Diff cap.CO Hgb adj',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOCSB_PRE'
        },
        value: 18.67
      },
      {
        meta: {
          shortName: 'Diff cap.CO Hgb adj LLN',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOCSB_LLN'
        },
        value: 15.3
      },
      {
        meta: {
          shortName: 'Diff cap.CO Hgb adj ULN',
          units: 'cc/min/mmHg',
          group: 'Diffusion Capacity',
          type: 'DLCOCSB_ULN'
        },
        value: 24.9
      },
      {
        meta: {
          loinc: '19876-2',
          shortName: 'FVC pre BD Vol Respiratory Spirometry',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_PRE'
        },
        value: 2.84
      },
      {
        meta: {
          shortName: 'FVC Vol Respiratory LLN',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_LLN'
        },
        value: 2.22
      },
      {
        meta: {
          loinc: '20157-4',
          shortName: 'FEV1 pre BD',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_PRE'
        },
        value: 2.62
      },
      {
        meta: {
          shortName: 'FEV1 LLN',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_LLN'
        },
        value: 1.9
      },
      {
        meta: {
          loinc: '19926-5',
          shortName: 'FEV1/FVC',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_PRE'
        },
        value: 92.26
      },
      {
        meta: {
          shortName: 'FEV1/FVC LLN',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_LLN'
        },
        value: 78
      },
      {
        meta: {
          group: 'Commentary',
          type: 'RT_COMMENT',
          shortName: 'Technician Comment'
        },
        value: 'Pred. Module: Alberta Set (GLI)'
      },
      {
        meta: {
          group: 'Commentary',
          type: 'INTERPRETATION',
          shortName: 'Interpretation'
        },
        value: 'No evidence of airflow obstruction on spirometry. Lung volume testing was within normal limits with no evidence of restriction or gas trapping.'
      }
    ]
  })

  expect(outcome.elements.length).toEqual(14)
})

test('extracting spirometry from Calgary mock 2', () => {
  const outcome = transform(calgaryMock2)

  expect(outcome).toStrictEqual({
    elements: [
      {
        meta: {
          loinc: '19876-2',
          shortName: 'FVC pre BD Vol Respiratory Spirometry',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_PRE'
        },
        value: 4.99
      },
      {
        meta: {
          loinc: '19874-7',
          shortName: 'FVC p BD Vol Respiratory Spirometry',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_POST'
        },
        value: 4.87
      },
      {
        meta: {
          shortName: 'FVC Vol Respiratory LLN',
          units: 'L',
          group: 'Spirometry',
          type: 'FVC_LLN'
        },
        value: 3.87
      },
      {
        meta: {
          loinc: '20157-4',
          shortName: 'FEV1 pre BD',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_PRE'
        },
        value: 3.61
      },
      {
        meta: {
          loinc: '20155-8',
          shortName: 'FEV1 p BD',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_POST'
        },
        value: 3.93
      },
      {
        meta: {
          shortName: 'FEV1 LLN',
          units: 'L',
          group: 'Spirometry',
          type: 'FEV1_LLN'
        },
        value: 3.3
      },
      {
        meta: {
          loinc: '19926-5',
          shortName: 'FEV1/FVC',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_PRE'
        },
        value: 72.38
      },
      {
        meta: {
          loinc: '69970-2',
          shortName: 'FEV1/FVC p BD',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_POST'
        },
        value: 80.61
      },
      {
        meta: {
          shortName: 'FEV1/FVC LLN',
          units: '%',
          group: 'Spirometry',
          type: 'FEV1FVC_LLN'
        },
        value: 75.04
      },
      {
        meta: {
          group: 'Commentary',
          type: 'RT_COMMENT',
          shortName: 'Technician Comment'
        },
        value: 'Pred. Module: Alberta Set (GLI)'
      },
      {
        meta: {
          group: 'Commentary',
          type: 'INTERPRETATION',
          shortName: 'Interpretation'
        },
        value: 'The flow volume loop appears mildly concave.'
      }
    ]
  })

  expect(outcome.elements.length).toEqual(11)
})