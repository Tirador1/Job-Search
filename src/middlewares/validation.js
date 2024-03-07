const reqKeys = ["body", "params", "query", "headers"];

export const valdationMiddleware = (schema) => {
  return (req, res, next) => {
    const errors = [];
    reqKeys.forEach((key) => {
      const result = schema[key]?.validate(req[key], { abortEarly: false });
      if (result?.error) {
        errors.push(result.error.details[0].message);
      }
    });
    if (errors.length > 0) {
      return next(new Error(errors.join(","), { cause: 400 }));
    }
    next();
  };
};
