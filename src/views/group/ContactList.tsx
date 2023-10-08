import React from "react";
import { Typography } from "@mui/material";
import ContactTable from "@/components/ContactTable";
import { useParams } from "react-router-dom";
import { useBatchGetContacts } from "@/hooks/useContacts";
import { useListGroupContacts } from "@/hooks/useGroups";

const GroupContacts = () => {
  const { id } = useParams() as { id: string };
  const { data, isLoading } = useListGroupContacts(`contactGroups/${id}`);
  const hook = useBatchGetContacts(data?.data?.memberResourceNames ?? []);

  if (!data?.data.memberResourceNames && !isLoading) {
    return (
      <Typography
        variant="caption"
        fontWeight={500}
        className="flex items-center"
        sx={{
          height: 36,
          color: "#606368",
          pt: 1,
        }}
      >
        没有联系人
      </Typography>
    );
  }
  return (
    <ContactTable
      totalNode={`${data?.data.formattedName}(${hook.data?.connections?.length ?? 0})`}
      listContacts={hook}
    />
  );
};

export default GroupContacts;
