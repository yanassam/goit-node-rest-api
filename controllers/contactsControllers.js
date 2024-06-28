import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact as updateContactService,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(HttpError(500, "Server error"));
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.id);
    if (!contact) {
      return next(HttpError(404, "Not found"));
    }
    res.status(200).json(contact);
  } catch (error) {
    next(HttpError(500, "Server error"));
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await removeContact(req.params.id);
    if (!contact) {
      return next(HttpError(404, "Not found"));
    }
    res.status(200).json(contact);
  } catch (error) {
    next(HttpError(500, "Server error"));
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(HttpError(500, "Server error"));
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const contact = await updateContactService(req.params.id, req.body);
    if (!contact) {
      return next(HttpError(404, "Not found"));
    }
    res.status(200).json(contact);
  } catch (error) {
    next(HttpError(500, "Server error"));
  }
};
