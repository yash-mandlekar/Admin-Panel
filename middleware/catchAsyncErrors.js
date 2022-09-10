module.exports = (ErrorFunc) => (req, res, next) => {
  Promise.resolve(ErrorFunc(req, res, next)).catch(next);
};
