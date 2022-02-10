import Joi from 'joi';

const createCategory = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    image: Joi.string(),
});

export default {createCategory};
