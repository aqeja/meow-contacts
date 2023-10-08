import React from "react";

import { useListContacts } from "@/hooks/useContacts";
import ContactTable from "@/components/ContactTable";

const ContactList = () => {
  const hook = useListContacts();

  return <ContactTable totalNode={`通讯录 (${hook?.data?.totalPeople})`} listContacts={hook} />;
};

export default ContactList;
