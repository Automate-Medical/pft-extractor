const transform = require('./dist/transform')
const careFusionMock = require('./mocks/care-fusion-textract-results.json')
const mayoMock = require('./mocks/mayo-textract-results.json')

test('extracting spirometry from CareFusion mock', () => {
  expect(transform.default(careFusionMock)).toStrictEqual({"data": {"spirometry": {"fev1Post": 5.59, "fev1Pre": 5.41, "fev1fvcPost": 86.78, "fev1fvcPre": 84.52, "fvcPost": 6.45, "fvcPre": 6.4}}});
});

test('extracting spirometry from mayo mock', () => {
  expect(transform.default(mayoMock)).toStrictEqual( {"data": {"spirometry": {"fev1Post": 3.18, "fev1Pre": 2.85, "fev1fvcPost": 74.3, "fev1fvcPre": 68.2, "fvcPost": 4.28, "fvcPre": 4.18}}});
});