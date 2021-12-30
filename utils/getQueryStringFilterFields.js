module.exports = (queryStringObject) => {
  const filteredQueryStringObject = {
    ...queryStringObject,
  }
  const excludedFields = ["page", "sort", "limit", "fields", "popOptions"]
  excludedFields.forEach((el) => delete filteredQueryStringObject[el])
  return filteredQueryStringObject
}
