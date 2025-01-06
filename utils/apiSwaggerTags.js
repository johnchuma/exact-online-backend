const usersTag = (req, res, next) => {
  // #swagger.tags = ['Users']
  next();
};

module.exports = {
  usersTag,
};
