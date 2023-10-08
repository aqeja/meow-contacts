import React, { useEffect, useState } from "react";
import { Box, Button, Typography, BoxProps, IconButton, useTheme } from "@mui/material";
import {
  MdPersonOutline,
  MdOutlineHistory,
  MdOutlineFileDownload,
  MdAutoFixHigh,
  MdDeleteOutline,
  MdLabel,
  MdModeEdit,
} from "react-icons/md";
import { useListContacts } from "@/hooks/useContacts";
import classNames from "classnames";
import CreateGroup from "./CreateGroup";
import { useListGroups } from "@/hooks/useGroups";
import DeleteGroup from "./DeleteGroup";
import { useSetRecoilState } from "recoil";
import { GroupDialogViewType, groupDialogDataState } from "@/store/group";
import { EditGroup } from "./EditGroup";
import { NavLink } from "react-router-dom";
const links = [
  {
    label: "通讯录",
    value: "phonebook",
    icon: <MdPersonOutline size={20} />,
    url: "/",
  },
  {
    label: "常用联系人",
    value: "frequent",
    icon: <MdOutlineHistory size={20} />,
    url: "frequent",
  },
  {
    label: "其他联系人",
    value: "others",
    icon: <MdOutlineFileDownload size={20} />,
    url: "others",
  },
] as const;

const IconNav: React.FC<
  BoxProps & { icon: React.ReactNode; label: React.ReactNode; url: string; suffix?: React.ReactNode }
> = ({ icon, label, url, suffix, sx, className, children, ...rest }) => {
  return (
    <NavLink
      className="block"
      end
      to={url}
      style={({ isActive }) => {
        return isActive
          ? {
              // color: theme.palette.primary.main,
              borderRadius: "0 25px 25px 0",
              backgroundColor: "rgb(241,243,244)",
            }
          : {};
      }}
    >
      <Box
        component="div"
        className={classNames("flex items-center relative group cursor-pointer", className)}
        sx={{
          height: 40,
          px: "26px",
          "&&:hover": {
            backgroundColor: "rgb(241,243,244)",
            borderRadius: "0 25px 25px 0",
            overflow: "hidden",
          },
          ...sx,
        }}
        {...rest}
      >
        {icon}
        <Box
          sx={{
            ml: 2.5,
          }}
          component="div"
          className="overflow-hidden"
        >
          <Typography
            noWrap
            className="overflow-hidden text-ellipsis"
            sx={{
              fontWeight: 500,
            }}
            variant="body2"
          >
            {label}
          </Typography>
        </Box>

        <Box sx={{ ml: "auto" }}>{suffix}</Box>
        {children}
      </Box>
    </NavLink>
  );
};
const manageActions = [
  {
    label: "合并和修改",
    value: "merge",
    icon: <MdAutoFixHigh size={20} />,
    url: "merge",
  },
  {
    label: "导入",
    value: "import",
    icon: <MdOutlineFileDownload size={20} />,
    url: "import",
  },
  {
    label: "回收站",
    value: "trash",
    icon: <MdDeleteOutline size={20} />,
    url: "trash",
  },
];
const Shadow: React.FC<{ lsitContainer: HTMLElement | null }> = ({ lsitContainer }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = (e: Event) => {
      const scrollTop = (e.target as HTMLElement).scrollTop;
      setVisible(scrollTop > 10);
    };
    lsitContainer?.addEventListener("scroll", onScroll);
  }, [lsitContainer]);
  return (
    <Box
      component="div"
      className={visible ? "" : "hidden"}
      sx={{
        mt: 2,
        height: "1px",
        boxShadow: "0 1px 1px 0.5px rgba(0,0,0,.1)",
      }}
    />
  );
};

const SideBody = () => {
  const contacts = useListContacts();
  const { data: groups } = useListGroups("", true);
  const [el, setEl] = useState<HTMLElement | null>(null);
  const setDeleteGroupData = useSetRecoilState(groupDialogDataState);

  return (
    <Box
      className="absolute left-0 top-0 h-full overflow-auto"
      component="div"
      sx={{
        width: 280,
        pb: 2,
      }}
      ref={setEl}
    >
      <Box
        component="div"
        sx={{
          pt: 2,
          backgroundColor: "#fff",
        }}
        className="sticky top-0 z-10"
      >
        <Button
          className="!justify-between"
          variant="text"
          sx={{
            width: 156,
            height: 48,
            pl: 1.5,
            pr: 3,
            ml: "6px",
            borderRadius: 6,
            boxShadow: "0 1px 2px 0 rgba(60,64,67,.302), 0 1px 3px 1px rgba(60,64,67,.149)",
            transition: "box-shadow 0.5s",
            "&:hover": {
              boxShadow: "0 1px 3px 0 rgba(60,64,67,.302), 0 4px 8px 3px rgba(60,64,67,.149)",
            },
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36">
            <path fill="#34A853" d="M16 16v14h4V20z"></path>
            <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
            <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
            <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
            <path fill="none" d="M0 0h36v36H0z"></path>
          </svg>
          创建联系人
        </Button>
        <Shadow lsitContainer={el} />
      </Box>
      <Box
        component="div"
        sx={{
          flexGrow: 1,
          paddingTop: "22px",
        }}
      >
        {links.map((link) => (
          <IconNav
            key={link.value}
            url={link.url}
            label={link.label}
            icon={link.icon}
            suffix={
              link.value === "phonebook" ? (
                <Typography variant="caption" color="gray">
                  {contacts.data?.totalItems}
                </Typography>
              ) : null
            }
          />
        ))}

        <Typography sx={{ mt: 4, mb: 1.2, fontWeight: 500, px: "26px" }}>更正和管理</Typography>
        {manageActions.map((action) => (
          <IconNav key={action.value} {...action} />
        ))}

        <Typography sx={{ mt: 4, mb: 1.2, fontWeight: 500, px: "26px" }} className="flex items-center justify-between">
          标签
          <CreateGroup />
        </Typography>
        <Box>
          {groups?.contactGroups
            ?.filter((group) => group.groupType === "USER_CONTACT_GROUP")
            .map((group) => (
              <IconNav
                key={group.resourceName}
                icon={<MdLabel size={20} className="flex-shrink-0" />}
                label={group.name}
                url={group.resourceName}
                suffix={
                  <Typography
                    variant="caption"
                    noWrap
                    className="overflow-hidden text-ellipsis"
                    sx={{ pr: 0.5 }}
                    color="gray"
                  >
                    {group.memberCount}
                  </Typography>
                }
              >
                <Box
                  component="div"
                  sx={{
                    background: "rgb(241,243,244)",
                    pr: 2,
                    boxShadow: "-10px 0 10px 0 rgb(241,243,244)",
                  }}
                  className="absolute right-0 top-0 h-full invisible group-hover:visible flex items-center"
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      setDeleteGroupData({
                        openType: GroupDialogViewType.edit,
                        group: group,
                      });
                    }}
                  >
                    <MdModeEdit size={18} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setDeleteGroupData({
                        openType: group.memberCount > 0 ? GroupDialogViewType.delete : GroupDialogViewType.close,
                        group: group,
                      });
                    }}
                  >
                    <MdDeleteOutline size={20} />
                  </IconButton>
                </Box>
              </IconNav>
            ))}
        </Box>
      </Box>
    </Box>
  );
};
const Side = () => {
  return (
    <>
      <SideBody />
      <DeleteGroup />
      <EditGroup />
    </>
  );
};

export default Side;
