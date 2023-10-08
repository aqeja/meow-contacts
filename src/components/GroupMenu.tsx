import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  MenuItem,
  Menu,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  MenuProps,
} from "@mui/material";
import { MdAdd, MdCheck, MdLabelOutline } from "react-icons/md";
import { ContactResponse } from "@/types/contact";
import { useListGroups } from "@/hooks/useGroups";
import { compareArrays } from "@/common/tools";
import { bindContacts } from "@/api";
import { useToast } from "@/components/Toast";
import { useGetContact } from "@/hooks/useContacts";
import classNames from "classnames";

export interface GroupMenuBodyProps {
  activegGroups: ContactResponse["memberships"];
  contactId: string;
  anchor: HTMLElement | null;
  setAnchor?: (anchor: GroupMenuBodyProps["anchor"]) => void;
  /**
   * 所在页面，决定是否启用全部功能
   */
  page: "contactList" | "contactDetail";
  children?: React.ReactNode;
  onSuccess?: () => void;
  /**
   * 是否在关闭菜单时提交
   */
  submitWhenClose?: boolean;
}
export const GroupMenuBody: React.FC<GroupMenuBodyProps & Omit<MenuProps, "anchorEl" | "open">> = ({
  contactId,
  activegGroups,
  anchor,
  setAnchor,
  onSuccess,
  page,
  children,
  className,
  onClose,
  submitWhenClose,
  ...rest
}) => {
  const { showToast, hideToast } = useToast();
  const { data: groupsData } = useListGroups("", true);
  const prevSelectedGroupResourceNames = useMemo(() => {
    return activegGroups.map((item) => item.contactGroupMembership.contactGroupResourceName);
  }, [activegGroups]);
  const groups = groupsData?.contactGroups?.filter((item) => item.groupType === "USER_CONTACT_GROUP") ?? [];
  const theme = useTheme();
  const proMode = useMemo(() => page === "contactDetail", [page]);
  const [selectedGroupResourceNames, setSelectedGroupResourceNames] = useState<string[]>([]);
  useEffect(() => {
    setSelectedGroupResourceNames([...prevSelectedGroupResourceNames]);
  }, [prevSelectedGroupResourceNames, anchor]);
  const { isSame, addedValues, removedValues } = useMemo(() => {
    return compareArrays(prevSelectedGroupResourceNames, selectedGroupResourceNames);
  }, [selectedGroupResourceNames, prevSelectedGroupResourceNames]);
  const submit = useCallback(async () => {
    if (addedValues.length + removedValues.length === 0 || !contactId) return;
    const batchAdd = addedValues.map((item) =>
      bindContacts(item, {
        resourceNamesToAdd: [`people/${contactId}`],
      }),
    );
    const batchRemove = removedValues.map((item) =>
      bindContacts(item, {
        resourceNamesToRemove: [`people/${contactId}`],
      }),
    );
    setAnchor?.(null);
    showToast("正在进行...", null);
    await Promise.all([...batchAdd, ...batchRemove]);

    onSuccess?.();
    hideToast();
    showToast("操作成功"); // TODO 文案优化。分1.添加 2.减少 3.混合
  }, [addedValues, removedValues, contactId, showToast, hideToast, setAnchor, onSuccess]);
  return (
    <Menu
      open={!!anchor}
      anchorEl={anchor}
      className={classNames("relative", className)}
      onClose={(...args) => {
        if (submitWhenClose) {
          submit();
        }
        setAnchor?.(null);
        onClose?.(...args);
      }}
      {...rest}
    >
      {children}
      {proMode ? (
        <MenuItem sx={{ p: 0, boxShadow: "0 -8px 0 8px #fff" }} className="!sticky top-2 !bg-white z-10 w-full">
          <Typography sx={{ px: 2, py: 1 }} variant="caption" color="gray">
            管理标签
          </Typography>
        </MenuItem>
      ) : (
        <MenuItem>
          <Typography sx={{ py: 1 }} variant="caption" color="gray">
            更改标签
          </Typography>
        </MenuItem>
      )}
      <Box
        component="div"
        sx={{
          maxHeight: "300px",
          overflow: "auto",
          ...(proMode ? { width: 256 } : {}),
        }}
      >
        {groups.map((group) => (
          <MenuItem
            key={group.resourceName}
            onClick={() => {
              setSelectedGroupResourceNames((p) =>
                p.includes(group.resourceName)
                  ? p.filter((item) => item !== group.resourceName)
                  : [...p, group.resourceName],
              );
            }}
          >
            <ListItemIcon>
              <MdLabelOutline />
            </ListItemIcon>
            <ListItemText
              className="overflow-hidden whitespace-nowrap"
              sx={{
                "& > span": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            >
              {group.formattedName}
            </ListItemText>
            <Typography variant="body2" color={theme.palette.primary.main}>
              <MdCheck
                size={22}
                className={selectedGroupResourceNames.includes(group.resourceName) ? "" : "invisible"}
              />
            </Typography>
          </MenuItem>
        ))}
      </Box>
      {proMode && (
        <Box>
          <Divider sx={{ my: 1 }} />

          <MenuItem
            onClick={() => {
              if (!isSame) {
                submit();
              } else {
                //
              }
            }}
          >
            {isSame ? (
              <>
                <ListItemIcon>
                  <MdAdd size={22} />
                </ListItemIcon>
                <ListItemText>创建标签</ListItemText>
              </>
            ) : (
              <>
                <ListItemIcon></ListItemIcon>

                <ListItemText>应用</ListItemText>
              </>
            )}
          </MenuItem>
        </Box>
      )}
    </Menu>
  );
};
const GroupMenu: React.FC<{
  children: React.ReactNode;
  activegGroups: ContactResponse["memberships"];
  contactId: string;
}> = ({ children, activegGroups, contactId }) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const { refetch } = useGetContact(`people/${contactId}`);

  return (
    <>
      <Box
        component="span"
        onClick={(e) => {
          setAnchor(e.currentTarget);
        }}
      >
        {children}
      </Box>
      <GroupMenuBody
        page="contactDetail"
        onSuccess={refetch}
        anchor={anchor}
        activegGroups={activegGroups}
        contactId={contactId}
        setAnchor={setAnchor}
      />
    </>
  );
};

export default GroupMenu;
