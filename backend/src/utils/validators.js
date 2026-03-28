const Joi = require('joi');

const registerSchema = Joi.object({
  username:  Joi.string().min(3).max(30).required(),
  email:     Joi.string().email().required(),
  password:  Joi.string().min(6).required(),
  firstName: Joi.string().max(50).optional(),
  lastName:  Joi.string().max(50).optional(),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

const blogSchema = Joi.object({
  title:      Joi.string().max(200).required(),
  content:    Joi.string().required(),
  excerpt:    Joi.string().max(500).optional(),
  category:   Joi.string().optional(),
  tags:       Joi.array().items(Joi.string()).optional(),
  published:  Joi.boolean().optional(),
  featured:   Joi.boolean().optional(),
  coverImage: Joi.string().uri().optional().allow(''),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    return res.status(400).json({ success: false, message: messages });
  }
  next();
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateBlog: validate(blogSchema),
};
