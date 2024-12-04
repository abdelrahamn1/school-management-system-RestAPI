const applyQueryOptions = (req, model) => {
  let queryObj = { ...req.query };
  const excludedQueries = ["page", "sort", "fields", "limit"];

  // Exclude pagination, sorting, and field selection parameters
  excludedQueries.forEach((el) => delete queryObj[el]);

  // Start with the base query
  let query = model.find(queryObj);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("createdAt");
  }

  // Field Selection
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  // Pagination
  // const page = parseInt(req.query.page, 10) || 1;
  // const limit = parseInt(req.query.limit, 10) || 10;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);

  return query;
};

module.exports = applyQueryOptions;
