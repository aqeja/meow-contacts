import React, { useMemo } from "react";
import { Card, Typography, Box, Tooltip, Link, useTheme } from "@mui/material";
import { MdMailOutline, MdOutlinePhone, MdOutlineCake } from "react-icons/md";
import { ContactResponse } from "@/types/contact";
const FallbackAction: React.FC<{
  data: unknown[] | null | undefined;
  children: React.ReactNode;
  fallback: React.ReactNode;
}> = ({ data, children, fallback }) => {
  if (!data || data.length === 0)
    return (
      <Typography
        className="cursor-pointer"
        sx={{
          fontWeight: 400,
          fontSize: 14,
          color: (theme) => theme.palette.primary.main,
        }}
      >
        {fallback}
      </Typography>
    );
  return <>{children}</>;
};
const Info: React.FC<{ data?: ContactResponse }> = ({ data }) => {
  const emails = useMemo(() => data?.emailAddresses ?? [], [data]);
  const birthdays = useMemo(() => data?.birthdays ?? [], [data]);
  const phones = useMemo(() => data?.phoneNumbers ?? [], [data]);
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: "#f1f4f9",
        p: 2,
        border: 0,
        width: "520px",
        maxWidth: "100%",
        borderRadius: 4,
      }}
    >
      <Typography fontWeight={500} sx={{ mb: 1 }}>
        详细联系信息
      </Typography>
      <Box component="div" className="flex">
        <Box
          component="div"
          className="flex items-center justify-center"
          sx={{
            mr: 1,
            width: 20,
            height: 20,
          }}
        >
          <MdMailOutline color="#80868b" size={16} />
        </Box>
        <Box>
          <FallbackAction data={emails} fallback="添加电子邮件地址">
            {emails.map((email) => (
              <Typography
                key={email.value}
                sx={{
                  color: "inherit",
                  "&:not(:last-child)": {
                    mb: 1,
                  },
                }}
                fontSize={14}
              >
                <Tooltip title="发送电子邮件">
                  <Link
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover": {
                        color: (theme) => theme.palette.primary.main,
                      },
                    }}
                    href={`mailto:${email.value}`}
                  >
                    {email.value}
                  </Link>
                </Tooltip>
                <span className="px-1">•</span>
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.grey[600],
                  }}
                >
                  {email.formattedType}
                </Box>
              </Typography>
            ))}
          </FallbackAction>
        </Box>
      </Box>
      <Box sx={{ my: 1 }} component="div" className="flex items-center">
        <Box
          component="div"
          className="flex items-center justify-center"
          sx={{
            mr: 1,
            width: 20,
            height: 20,
          }}
        >
          <MdOutlinePhone color="#80868b" size={16} />
        </Box>
        <FallbackAction data={phones} fallback="添加电话号码">
          {phones?.map((phone) => (
            <Typography
              key={phone.value}
              sx={{
                "&:not(:last-child)": {
                  mb: 1,
                },
                color: "inherit",
              }}
              fontSize={14}
            >
              <Tooltip title={`拨打电话(${phone.canonicalForm})`}>
                <Link
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": {
                      color: (theme) => theme.palette.primary.main,
                    },
                  }}
                  href={`tel:${phone.value}`}
                  key={phone.canonicalForm}
                >
                  {phone.value}
                </Link>
              </Tooltip>
              <span className="px-1">•</span>
              <Box
                component="span"
                sx={{
                  color: theme.palette.grey[600],
                }}
              >
                {phone.formattedType}
              </Box>
            </Typography>
          ))}
        </FallbackAction>
      </Box>
      <Box component="div" className="flex items-center">
        <Box
          component="div"
          className="flex items-center justify-center"
          sx={{
            mr: 1,
            width: 20,
            height: 20,
          }}
        >
          <MdOutlineCake color="#80868b" size={18} />
        </Box>
        <FallbackAction data={birthdays} fallback="添加生日信息">
          {birthdays?.map((item) => (
            <Typography
              key={item.text}
              className="cursor-pointer"
              sx={{
                fontWeight: 400,
                fontSize: 14,
              }}
            >
              {item.text}
            </Typography>
          ))}
        </FallbackAction>
      </Box>
    </Card>
  );
};

export default Info;
