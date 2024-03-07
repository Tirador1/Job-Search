export const globalResponse = (err, req, res, next) => {
  if (err) {
    return res.status(err["cause"] || 500).json({
      message: "Something went wrong",
      error_msg: err.message || "Something went wrong",
    });
  }
};
