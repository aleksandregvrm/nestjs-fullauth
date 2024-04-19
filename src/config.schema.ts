import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
    NODEMAILER_PASSWORD: Joi.string().required(),
    NODEMAILER_USER: Joi.string().required(),
    NODEMAILER_SERVICE: Joi.number().default(5432).required(),
    JWT_SECRET: Joi.string().required(),
})
