const interpret = require('./dist/interpret')
const { stepwiseAlgorithim } = require('./dist/interpret')
const nwMock = require('./mocks/nw-egress.json')

test('interpreting NW mock', () => {
  const interpretation = interpret.default(nwMock)
  expect(interpretation).toStrictEqual([0, 2, 6])
});