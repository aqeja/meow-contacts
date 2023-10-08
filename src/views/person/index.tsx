import React, { useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdOutlineEdit,
  MdMoreVert,
  MdStarOutline,
  MdCalendarToday,
  MdMailOutline,
  MdOutlineChatBubbleOutline,
  MdOutlineVideocam,
  MdAdd,
  MdDeleteOutline,
} from "react-icons/md";
import { Box, IconButton, Avatar, Typography, Chip, useTheme, Button, Divider, Tooltip } from "@mui/material";
import { useGetContact } from "@/hooks/useContacts";
import { useListGroups } from "@/hooks/useGroups";
import UpdateTime from "./UpdateTime";
import Info from "./Info";
import { contactMenuDataState, deleteContactOpenState } from "@/store/contact";
import { useSetRecoilState } from "recoil";
import GroupMenu from "../../components/GroupMenu";

import { isNotFoundError } from "@/common/tools";
import { LinearLoading } from "@/components/Loading";
import "./contact-page.scss";
const FallbackDisplay: React.FC<{
  data: unknown[] | null | undefined;
  children: React.ReactNode;
  fallback: React.ReactNode;
}> = ({ data, children, fallback }) => {
  if (!data || data.length === 0) return <>{fallback}</>;
  return <>{children}</>;
};

const Person = () => {
  const { id } = useParams() as { id: string };
  const { data, isLoading, error } = useGetContact(`people/${id}`);
  const theme = useTheme();
  const navigate = useNavigate();
  const goContactPages = useCallback(() => {
    navigate("/");
  }, [navigate]);
  const { data: groups } = useListGroups("", true);
  const setContactData = useSetRecoilState(contactMenuDataState);
  const setDeleteContactOpen = useSetRecoilState(deleteContactOpenState);
  const getGroup = useCallback(
    (resource: string) => {
      return groups?.contactGroups?.find((item) => item.resourceName === resource);
    },
    [groups],
  );

  const fallback = useMemo(() => {
    return (
      <GroupMenu activegGroups={data?.data?.memberships ?? []} contactId={id}>
        <Button
          className="!justify-start"
          variant="outlined"
          size="small"
          sx={{
            my: 0.5,
            fontSize: 12,
            width: 76,
            height: 28,
            px: 0,
            pl: 0.5,

            borderRadius: 2,
            color: "inherit",
            borderColor: (theme) => theme.palette.divider,
            "&:hover": {
              borderColor: (theme) => theme.palette.divider,
              backgroundColor: (theme) => theme.palette.grey[200],
            },
          }}
        >
          <MdAdd size={22} className="mr-2" color={theme.palette.primary.main} />
          标签
        </Button>
      </GroupMenu>
    );
  }, [data, id, theme.palette.primary.main]);
  if (error) {
    if (isNotFoundError(error)) {
      return (
        <Typography sx={{ p: 3 }} variant="body2">
          未找到此联系人
        </Typography>
      );
    }
    return <>ops</>;
  }
  if (isLoading && !error) return <LinearLoading />;
  return (
    <Box component="div" className="contact-page">
      <Box
        sx={{
          pt: 3,
          maxWidth: "954px",
        }}
      >
        <Box
          component="div"
          className="flex items-center"
          sx={{
            gap: "36px",
          }}
        >
          <Box
            component="div"
            className="text-left contact-page_back"
            sx={{
              alignSelf: "flex-start",
            }}
          >
            <Tooltip title="返回">
              <IconButton
                sx={{
                  alignSelf: "flex-start",
                }}
                onClick={goContactPages}
              >
                <MdArrowBack size={18} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box
            component="div"
            className="contact-page_profile flex-grow"
            sx={{
              gap: "36px",
            }}
          >
            <Avatar
              src={data?.data?.photos?.[0]?.url}
              className="contact-page_profile_avatar"
              sx={{
                width: 162,
                height: 162,
              }}
            />
            <Box className="contact-page_profile_name" sx={{ mt: 0.5 }}>
              <Typography variant="h5" fontSize={28}>
                {data?.data.names?.[0]?.displayName}
              </Typography>

              <FallbackDisplay data={data?.data?.organizations} fallback={null}>
                <Typography fontSize={18}>
                  {data?.data?.organizations?.[0]?.title}•{data?.data?.organizations?.[0]?.department}•
                  {data?.data?.organizations?.[0]?.name}
                </Typography>
              </FallbackDisplay>

              <FallbackDisplay data={data?.data?.memberships?.slice(0, -1)} fallback={fallback}>
                {data?.data?.memberships?.slice(0, -1)?.map((item) => (
                  <Chip
                    key={item.contactGroupMembership.contactGroupId}
                    variant="outlined"
                    size="small"
                    sx={{
                      mr: 1,
                      my: 0.5,
                      mt: "2px",
                      borderRadius: 2,
                      height: 28,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                    classes={{
                      label: "h-[28px] flex items-center !px-4",
                    }}
                    label={getGroup(item.contactGroupMembership.contactGroupResourceName)?.name}
                  />
                ))}

                <GroupMenu activegGroups={data?.data?.memberships ?? []} contactId={id}>
                  <IconButton
                    size="small"
                    sx={{
                      width: 28,
                      height: 28,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <MdOutlineEdit color={theme.palette.primary.main} />
                  </IconButton>
                </GroupMenu>
              </FallbackDisplay>
            </Box>
          </Box>
          <Box
            component="div"
            className="flex items-center justify-end contact-page_actions"
            sx={{
              alignSelf: "flex-start",
            }}
          >
            <IconButton>
              <MdStarOutline size={18} />
            </IconButton>
            <Button
              variant="contained"
              disableElevation
              sx={{
                mx: 1,
                borderRadius: 20,
              }}
            >
              修改
            </Button>
            <IconButton
              onClick={() => {
                setDeleteContactOpen(true);
                setContactData((p) => ({
                  ...p,
                  resource: `people/${id}`,
                }));
              }}
            >
              <MdDeleteOutline size={18} />
            </IconButton>
            <IconButton>
              <MdMoreVert size={18} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box component="div" className="contact-page_divider relative" sx={{ mt: 2 }}>
        <Divider className="absolute left-0 w-full top-1/2" />
        <Box component="div" className="inline-flex relative z-10 bg-white contact-page_divider_actions">
          <IconButton
            className="flex-shrink-0"
            sx={{
              mr: 2,
              width: 40,
              height: 40,
              backgroundColor: (theme) => theme.palette.grey[200],
            }}
          >
            <MdMailOutline size={18} />
          </IconButton>
          <IconButton
            className="flex-shrink-0"
            sx={{
              mr: 2,
              width: 40,
              height: 40,
              backgroundColor: (theme) => theme.palette.grey[200],
            }}
          >
            <MdCalendarToday size={16} />
          </IconButton>
          <IconButton
            className="flex-shrink-0"
            sx={{
              mr: 2,
              width: 40,
              height: 40,
              backgroundColor: (theme) => theme.palette.grey[200],
            }}
          >
            <MdOutlineChatBubbleOutline size={18} />
          </IconButton>
          <IconButton
            className="flex-shrink-0"
            sx={{
              width: 40,
              height: 40,
              backgroundColor: (theme) => theme.palette.grey[200],
            }}
          >
            <MdOutlineVideocam size={22} />
          </IconButton>
        </Box>
      </Box>
      <Box component="div" className="flex contact-page_cards" sx={{ mt: 4 }}>
        <Info data={data?.data} />
        <UpdateTime time={data?.data?.metadata?.sources?.[0]?.updateTime || ""} />
      </Box>
    </Box>
  );
};

export default Person;
