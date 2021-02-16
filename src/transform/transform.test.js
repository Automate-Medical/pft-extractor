const transform = require('./dist/transform')
const careFusionMock = require('./mocks/care-fusion-textract-results.json')
const mayoMock = require('./mocks/mayo-textract-results.json')
const nwMock = require('./mocks/nw-textract-results.json')

test('extracting spirometry from CareFusion mock', () => {
  expect(transform.default(careFusionMock).toJson()).toStrictEqual({
    "spirometry": {
      "fev1": {
        "meta": {
          "commonName": "Forced expiratory volume in one second",
          "loinc": "20150-9",
        },
        "lln": 4.28,
        "post": 5.59,
        "pre": 5.41,
        "predicted": 5.33,
        "uln": 6.35,
      },
      "fev1fvc": {
        "meta": {
          "commonName": "FEV1/FVC",
          "loinc": "19926-5",
        },
        "lln": 71.49,
        "post": 86.78,
        "pre": 84.52,
        "predicted": 82.65,
        "uln": 91.88,
      },
      "fvc": {
        "meta": {
          "commonName": "Forced vital capacity",
          "loinc": "19868-9",
        },
        "lln": 5.25,
        "post": 6.45,
        "pre": 6.4,
        "predicted": 6.5,
        "uln": 7.77,
      },
      "fef2575": {
        "meta": {
          "commonName": "Gas flow FEV 25%-75%",
          "loinc": "19927-3",
        },
        "lln": null,
        "post": null,
        "pre": null,
        "predicted": null,
        "uln": null,
      },
      "fet": {
        "meta": {
          "commonName": "Forced expiratory time",
          "loinc": "65819-5",
        },
        "lln": null,
        "post": null,
        "pre": null,
        "predicted": null,
        "uln": null,
      },
    },
    "diffusion": {
      "dlcosb": {
        "meta": {
          "commonName": "Diffusion capacity.carbon monoxide",
          "loinc": "19911-7",
        },
        "lln": null,
        "post": null,
        "pre": null,
        "predicted": null,
        "uln": null,
      },
      "dlcocsb": {
        "meta": {
          "commonName": "Diffusion capacity.carbon monoxide adjusted for hemoglobin",
          "loinc": "19913-3",
        },
        "lln": null,
        "post": null,
        "pre": null,
        "predicted": null,
        "uln": null,
      },
      "ivcsb": {
        "lln": null,
        "meta": {
          "commonName": "Inspiratory vital capacity (single breath)",
        },
        "post": null,
        "pre": null,
        "predicted": null,
        "uln": null,
      },
      "dlva": {
        "meta": {
          "commonName": "Diffusion capacity/Alveolar volume",
          "loinc": "19916-6",
        },
        "lln": null,
        "post": null,
        "pre": null,
        "predicted": null,
        "uln": null,
      }
    }
  });
});

test('extracting spirometry from mayo mock', () => {
  expect(transform.default(mayoMock).toJson()).toStrictEqual({
    "spirometry": {
      "fev1": {
        "meta": {
          "commonName": "Forced expiratory volume in one second",
          "loinc": "20150-9",
        },
        "lln": 2.5,
        "post": 3.18,
        "pre": 2.85,
        "predicted": 3.26,
        "uln": null,
      },
      "fev1fvc": {
        "meta": {
          "commonName": "FEV1/FVC",
          "loinc": "19926-5",
        },
        "lln": 63.6,
        "post": 74.3,
        "pre": 68.2,
        "predicted": 76.6,
        "uln": null,
      },
      "fvc": {
        "meta": {
          "commonName": "Forced vital capacity",
          "loinc": "19868-9",
        },
        "lln": 3.48,
        "post": 4.28,
        "pre": 4.18,
        "predicted": 4.39,
        "uln": null,
      },
      "fef2575": {
        "meta": {
          "commonName": "Gas flow FEV 25%-75%",
          "loinc": "19927-3",
        },
        "lln": 1.03,
        "post": 2.5,
        "pre": 1.69,
        "predicted": 2.57,
        "uln": null,
      },
      "fet": {
        "meta": {
          "commonName": "Forced expiratory time",
          "loinc": "65819-5",
        },
        "lln": null,
        "post": 9.29,
        "pre": 8.95,
        "predicted": null,
        "uln": null,
      },
    },
    "diffusion": {
      "dlcosb": {
        "meta": {
          "commonName": "Diffusion capacity.carbon monoxide",
          "loinc": "19911-7",
        },
        "lln": 18.9,
        "post": null,
        "pre": 32.2,
        "predicted": 25.6,
        "uln": 32.2,
      },
      "dlcocsb": {
        "meta": {
          "commonName": "Diffusion capacity.carbon monoxide adjusted for hemoglobin",
          "loinc": "19913-3",
        },
        "lln": 18.9,
        "post": null,
        "pre": 34.6,
        "predicted": 25.6,
        "uln": 32.2,
      },
      "ivcsb": {
        "lln": 3.32,
        "meta": {
          "commonName": "Inspiratory vital capacity (single breath)",
        },
        "post": null,
        "pre": 3.76,
        "predicted": 4.44,
        "uln": 5.55,
      },
      "dlva": {
        "meta": {
          "commonName": "Diffusion capacity/Alveolar volume",
          "loinc": "19916-6",
        },
        "lln": 3.1,
        "post": null,
        "pre": 5.7,
        "predicted": 4.15,
        "uln": 5.2,
      }
    }
  });
});

test('extracting spirometry from Northwestern mock', () => {
  expect(transform.default(nwMock).toJson()).toStrictEqual({
    "spirometry": {
      "fev1": {
        "meta": {
          "commonName": "Forced expiratory volume in one second",
          "loinc": "20150-9",
        },
        "lln": 2.06,
        "post": null,
        "pre": 2.31,
        "predicted": 2.65,
        "uln": 3.24,
      },
      "fev1fvc": {
        "meta": {
          "commonName": "FEV1/FVC",
          "loinc": "19926-5",
        },
        "lln": 69,
        "post": null,
        "pre": 82,
        "predicted": 79,
        "uln": 88,
      },
      "fvc": {
        "meta": {
          "commonName": "Forced vital capacity",
          "loinc": "19868-9",
        },
        "lln": 2.71,
        "post": null,
        "pre": 2.8,
        "predicted": 3.4,
        "uln": 4.1,
      },
      "fef2575": {
        "meta": {
          "commonName": "Gas flow FEV 25%-75%",
          "loinc": "19927-3",
        },
        "lln": 1.24,
        "post": null,
        "pre": 2.61,
        "predicted": 2.49,
        "uln": 3.73,
      },
      "fet": {
        "meta": {
          "commonName": "Forced expiratory time",
          "loinc": "65819-5",
        },
        "lln": null,
        "post": null,
        "pre": 7.7,
        "predicted": null,
        "uln": null,
      },
    },
    "diffusion": {
      "dlcosb": {
        "meta": {
          "commonName": "Diffusion capacity.carbon monoxide",
          "loinc": "19911-7",
        },
        "lln": 15.52,
        "post": null,
        "pre": 21.84,
        "predicted": 22.02,
        "uln": 28.52,
      },
      "dlcocsb": {
        "meta": {
          "commonName": "Diffusion capacity.carbon monoxide adjusted for hemoglobin",
          "loinc": "19913-3",
        },
        "lln": 15.52,
        "post": null,
        "pre": 21.77,
        "predicted": 22.02,
        "uln": 28.52,
      },
      "ivcsb": {
        "lln": 2.71,
        "meta": {
          "commonName": "Inspiratory vital capacity (single breath)",
        },
        "post": null,
        "pre": 2.77,
        "predicted": 3.4,
        "uln": 4.1,
      },
      "dlva": {
        "meta": {
          "commonName": "Diffusion capacity/Alveolar volume",
          "loinc": "19916-6",
        },
        "lln": 3.17,
        "post": null,
        "pre": 5.8,
        "predicted": 4.48,
        "uln": 5.8,
      }
    }
  })
});