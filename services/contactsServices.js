import path from "node:path";
import fs from "node:fs/promises";

const contactsPath = path.join(process.cwd(), "db", "contacts.json");

export async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const allContacts = await listContacts();
  for (const contact of allContacts) {
    if (contact.id === contactId) {
      return contact;
    }
  }
  return null;
}

export async function removeContact(contactId) {
  const allContacts = await listContacts();
  const contactToRemove = allContacts.find(
    (contact) => contact.id === contactId
  );
  if (!contactToRemove) {
    return null;
  }

  const updatedContacts = allContacts.filter(
    (contact) => contact.id !== contactId
  );
  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
  return contactToRemove;
}

export async function addContact(name, email, phone) {
  const allContacts = await listContacts();

  const newContact = {
    id: Date.now().toString(),
    name,
    email,
    phone,
  };

  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));

  return newContact;
}

export async function updateContact(contactId, updatedData) {
  const allContacts = await listContacts();
  const index = allContacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  allContacts[index] = { ...allContacts[index], ...updatedData };
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return allContacts[index];
}
