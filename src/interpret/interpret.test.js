const interpret = require('./dist/interpret')
const { stepwiseAlgorithim } = require('./dist/interpret')
const nwMock = require('./mocks/nw-egress.json')

test('interpreting NW mock', () => {
  const interpretation = interpret.default(nwMock)
  expect(interpretation.summary).toEqual("FEV1/FVC is above the lower limit of normal. FVC is above the the lower limit of normal. A normal result")
});