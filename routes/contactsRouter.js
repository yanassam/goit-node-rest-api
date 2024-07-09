import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", async (req, res, next) => {
  try {
    await getAllContacts(req, res, next);
  } catch (error) {
    next(error);
  }
});

contactsRouter.get("/:id", async (req, res, next) => {
  try {
    await getOneContact(req, res, next);
  } catch (error) {
    next(error);
  }
});

contactsRouter.delete("/:id", async (req, res, next) => {
  try {
    await deleteContact(req, res, next);
  } catch (error) {
    next(error);
  }
});

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  async (req, res, next) => {
    try {
      await createContact(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  async (req, res, next) => {
    try {
      await updateContact(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

contactsRouter.patch(
  "/:contactId/favorite",
  validateBody(updateStatusSchema),
  async (req, res, next) => {
    try {
      await updateStatusContact(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

export default contactsRouter;
