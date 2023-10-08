import { deleteContact, getContact, listAllContacts, listAllGroups, listContacts, searchContacts } from "@/api";
import { PersonField } from "@/types/contact";
import { useQuery, useMutation } from "@tanstack/react-query";

export function useListContacts() {
  const personFields: PersonField[] = [
    "names",
    "photos",
    "phoneNumbers",
    "organizations",
    "memberships",
    "emailAddresses",
  ];
  const pageSize = 30;
  const contactParams = {
    personFields,
    pageSize,
    pageToken: "",
    sortOrder: 1,
  };
  return useQuery({
    queryKey: ["listContacts", pageSize],
    queryFn: () => {
      return listAllContacts({
        ...contactParams,
        pageToken: "",
      });
    },
  });
}
export function useGetContact(resource: string) {
  const personFields = [
    "names",
    "emailAddresses",
    "birthdays",
    "memberships",
    "organizations",
    "phoneNumbers",
    "photos",
    "metadata",
  ] as PersonField[];
  return useQuery({
    queryKey: ["getContact", resource, personFields],
    queryFn: () => getContact(resource, personFields),
  });
}

export function useDeleteContact() {
  const { refetch } = useListContacts();
  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      refetch();
    },
  });
}

export function useSearchContacts(keyword: string) {
  return useQuery({
    queryKey: ["searchContact", keyword],
    enabled: !!keyword,

    queryFn: () => {
      return searchContacts({
        query: keyword,
        pageSize: 30,
        readMask: ["names", "photos"],
      });
    },
  });
}
