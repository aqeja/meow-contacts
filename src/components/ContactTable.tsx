import React, { useCallback, useMemo } from "react";
import {
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  debounce,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  MdStarBorder,
  MdModeEdit,
  MdMoreVert,
  MdPrint,
  MdOutlineFileUpload,
  MdMenuOpen,
  MdDeleteOutline,
} from "react-icons/md";

import { useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import { scrollStorage } from "@/common/scroll";
import { contactListElementState } from "@/store";
import { contactMenuDataState, deleteContactOpenState } from "@/store/contact";
import { GroupMenuBody } from "@/components/GroupMenu";
import { useListGroups } from "@/hooks/useGroups";
import Loading from "@/components/Loading";
import { UseQueryResult } from "@tanstack/react-query";
import { ListContactsResponse } from "@/types/listContacts";
import { TransformedBatchGetContactsResponse } from "@/types/batchGetContacts";
import { useToast } from "./Toast";

const columns = [
  {
    label: "名称",
    value: "name",
  },
  {
    label: "电子邮件",
    value: "email",
  },
  {
    label: "电话号码",
    value: "phone",
  },
  {
    label: "职位和公司",
    value: "position",
  },
  {
    label: "标签",
    value: "label",
  },
  {
    label: (
      <Box component="div" className="flex items-center justify-end relative">
        <IconButton disabled>
          <MdPrint size={20} />
        </IconButton>

        <IconButton disabled>
          <MdOutlineFileUpload size={20} />
        </IconButton>

        <IconButton disabled>
          <MdMoreVert size={20} />
        </IconButton>

        <Box className="absolute left-full top-1/2 -translate-y-1/2">
          <IconButton disabled>
            <MdMenuOpen size={20} />
          </IconButton>
        </Box>
      </Box>
    ),
    value: "actions",
  },
] as const;
const onScroll = debounce((e: React.UIEvent<HTMLDivElement>) => {
  const scrollTop = (e.target as HTMLDivElement).scrollTop;
  scrollStorage.set({
    path: "/",
    scrollTop,
  });
}, 300);

const ContactListMenu: React.FC<{ refetch: () => any }> = ({ refetch }) => {
  const [contactMenuData, setContactMenuData] = useRecoilState(contactMenuDataState);
  const setDeleteContactListOpen = useSetRecoilState(deleteContactOpenState);
  const resetContactData = useResetRecoilState(contactMenuDataState);

  const setAnchor = useCallback(
    (anchor: HTMLElement | null) => {
      setContactMenuData((p) => ({
        ...p,
        anchor,
      }));
    },
    [setContactMenuData],
  );
  return (
    <GroupMenuBody
      submitWhenClose
      page="contactList"
      contactId={contactMenuData.resource.split("/")[1]}
      setAnchor={setAnchor}
      anchor={contactMenuData.anchor}
      onClose={() => {
        resetContactData();
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      onSuccess={refetch}
      marginThreshold={60}
      activegGroups={contactMenuData.contact?.memberships ?? []}
    >
      <MenuItem
        sx={{
          width: 256,
        }}
        onClick={() => {
          setDeleteContactListOpen(true);
          setAnchor(null);
        }}
      >
        <MdDeleteOutline size={24} className="mr-2" />
        删除
      </MenuItem>
      <Divider />
    </GroupMenuBody>
  );
};

const ContactTable: React.FC<{
  totalNode: React.ReactNode;
  listContacts: UseQueryResult<ListContactsResponse | TransformedBatchGetContactsResponse>;
}> = ({ listContacts, totalNode }) => {
  const { data, error: contactsError, refetch, isLoading: contactListLoading } = listContacts;
  const { data: groupsResponse, isLoading: groupsListLoading, error: groupsError } = useListGroups("", true);
  const groups = useMemo(() => groupsResponse?.contactGroups ?? [], [groupsResponse]);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const notAvaliable = useCallback(() => {
    showToast("功能不可用");
  }, [showToast]);
  const setContactListElement = useSetRecoilState(contactListElementState);

  const setContactMenuData = useSetRecoilState(contactMenuDataState);
  const setAnchor = useCallback(
    (anchor: HTMLElement | null) => {
      setContactMenuData((p) => ({
        ...p,
        anchor,
      }));
    },
    [setContactMenuData],
  );
  const getGroup = useCallback(
    (resourceName: string) => {
      return groups.find((item) => item.resourceName === resourceName)?.name;
    },
    [groups],
  );

  if (contactsError || groupsError) {
    return <Typography>出错了</Typography>;
  }
  if (contactListLoading || groupsListLoading) {
    return <Loading />;
  }
  return (
    <>
      <TableContainer
        component={Paper}
        className="contact_list_table_container"
        variant="outlined"
        onScroll={onScroll}
        ref={setContactListElement}
        sx={{
          border: 0,
          overflowX: "visible",
          overflowY: "auto",
          maxHeight: "calc(100vh - 64px)",
        }}
      >
        <Table className="contact_list_table" stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{
                py: 0,
                height: 50,
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.value}
                  className={`contact_list_${column.value}`}
                  sx={{
                    py: 0,
                    ...(column.value === "actions" ? { pr: 0 } : {}),
                    ...(column.value === "label" ? { width: 200 } : {}),
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{
                pt: 1,
              }}
            >
              <TableCell sx={{ border: 0, pt: 1, pb: 0 }} align="left" colSpan={columns.length}>
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
                  {(data?.connections?.length ?? 0) > 0 ? totalNode : "没有联系人"}
                </Typography>
              </TableCell>
            </TableRow>
            {data?.connections?.map((row) => (
              <TableRow
                key={row.resourceName}
                className="group"
                onClick={() => {
                  navigate(row.resourceName.replace("people", "person"));
                }}
                sx={{
                  border: 0,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  className={`contact_list_${columns[0].value}`}
                  sx={{
                    border: 0,
                    py: 0,
                    height: 56,
                  }}
                >
                  <Box component="div" className="flex items-center">
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                      src={row.photos[0].url}
                    />
                    {row.names[0].displayName}
                  </Box>
                </TableCell>
                <TableCell
                  className={`contact_list_${columns[1].value}`}
                  sx={{
                    border: 0,
                    py: 0,
                    height: 56,
                  }}
                  align="left"
                >
                  {row.emailAddresses?.[0].value}
                </TableCell>
                <TableCell
                  className={`contact_list_${columns[2].value}`}
                  sx={{
                    border: 0,
                    py: 0,
                    height: 56,
                  }}
                  align="left"
                >
                  {row.phoneNumbers?.[0].canonicalForm}
                </TableCell>
                <TableCell
                  className={`contact_list_${columns[3].value}`}
                  sx={{
                    border: 0,
                    py: 0,
                    height: 56,
                  }}
                  align="left"
                >
                  {row.organizations?.[0]?.name}
                  {row.organizations?.[0]?.title}
                </TableCell>
                <TableCell
                  className={`contact_list_${columns[4].value}`}
                  sx={{
                    border: 0,
                    p: 0,
                    height: 56,
                  }}
                  align="left"
                >
                  <Box
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      width: 200,
                    }}
                  >
                    {row.memberships.slice(0, -1).map((item) => (
                      <Chip
                        size="small"
                        sx={{
                          borderRadius: 1,
                          height: 14,
                          fontSize: 12,
                          mr: 1,
                        }}
                        classes={{
                          labelSmall: "!px-1",
                        }}
                        key={item.contactGroupMembership.contactGroupId}
                        label={getGroup(item.contactGroupMembership.contactGroupResourceName)}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell
                  className={`contact_list_${columns[5].value}`}
                  align="right"
                  sx={{
                    border: 0,
                    py: 0,
                    pr: 0,
                    height: 56,
                  }}
                >
                  <Box
                    component="div"
                    className="invisible group-hover:visible"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <IconButton disabled>
                      <MdStarBorder size={20} />
                    </IconButton>

                    <IconButton
                      disabled
                      sx={{
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <MdModeEdit size={18} />
                    </IconButton>

                    <Tooltip title="更多操作">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnchor(e.currentTarget);
                          setContactMenuData((p) => ({
                            ...p,
                            resource: row.resourceName,
                            contact: row,
                          }));
                        }}
                      >
                        <MdMoreVert size={20} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ContactListMenu refetch={refetch} />
    </>
  );
};

export default ContactTable;
