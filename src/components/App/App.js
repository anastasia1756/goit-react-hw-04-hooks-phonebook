import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import toast, { Toaster } from "react-hot-toast";
import { ContactList } from "../ContactList";
import { Filter } from "../Filter";
import { ContactForm } from "../ContactForm";
import { Container, Title, Contacts } from "./App.styled";

const LS_KEY = "contacts";

export const App = () => {
  const [contacts, setContacts] = useState(() => {
    return JSON.parse(window.localStorage.getItem(LS_KEY)) ?? [];
  });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    window.localStorage.setItem(LS_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const filterInputChange = (evt) => {
    setFilter(evt.currentTarget.value);
  };
  const filterHandleDelete = () => {
    setFilter("");
  };
  const findContact = () => {
    const normilizedFilter = filter.toLowerCase();
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(normilizedFilter)
    );
  };
  const addContact = (submitedName, submitedNumber) => {
    const notify = () =>
      toast.error(`${searchedName.name} is already in contacts`);
    const successAdded = () =>
      toast.success("successfully added!", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    const id = nanoid();
    const newContact = { name: submitedName, id, number: submitedNumber };

    const searchedName = contacts.find(
      ({ name }) => name.toLowerCase() === submitedName.toLowerCase()
    );
    searchedName ? notify() : setContacts((state) => [...state, newContact]);

    !searchedName && successAdded();
  };
  const deleteContact = (contactId) => {
    setContacts((state) => state.filter((contact) => contact.id !== contactId));
  };

  const filteredContacts = findContact();
  return (
    <Container>
      <Title>Phonebook</Title>
      <ContactForm onSubmit={addContact} />
      <Toaster />
      <Contacts>Contacts</Contacts>
      <Filter
        filter={filter}
        contacts={contacts}
        onChange={filterInputChange}
        onClick={filterHandleDelete}
      />
      {contacts.length > 0 ? (
        <ContactList
          contacts={filteredContacts}
          onDeleteClick={deleteContact}
        />
      ) : (
        <p>No contacts yet</p>
      )}
    </Container>
  );
};
