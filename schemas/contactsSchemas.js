import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(15).required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().min(10).max(15),
  favorite: Joi.boolean(),
}).or("name", "email", "phone", "favorite");

export const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
