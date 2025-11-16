class BaseRequest {
  constructor(schema) {
    this.schema = schema;
  }

  validate(data) {
    const { error, value } = this.schema.validate(data, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errors = {};
      error.details.forEach(detail => {
        const key = detail.path.join('.');
        errors[key] = detail.message;
      });

      return {
        isValid: false,
        errors,
        data: null
      };
    }

    return {
      isValid: true,
      errors: null,
      data: value
    };
  }

  middleware() {
    return (req, res, next) => {
      const validation = this.validate(req.body);

      if (!validation.isValid) {
        return res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      req.body = validation.data;
      next();
    };
  }
}

module.exports = BaseRequest;