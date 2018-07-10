const DataTransform = require("node-json-transform").DataTransform

let transform = (input, map) => {
  let result = DataTransform(docs, transformationMap.limitedFieldsMap).transform();

  return result
}

module.exports = {
  transform
}