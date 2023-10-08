import React, { useMemo } from "react";
import dayjs from "dayjs";
import { Typography, IconButton, Box, useTheme } from "@mui/material";
import { MdHelpOutline } from "react-icons/md";

const UpdateTime: React.FC<{ time: string }> = ({ time }) => {
  const theme = useTheme();

  const formated = useMemo(() => {
    const year = dayjs(time).year();
    const thisYear = dayjs().year();
    if (year === thisYear) return dayjs(time).format("MM月DD日");
    return "";
  }, [time]);
  if (formated)
    return (
      <Box
        component="div"
        className="contact-page_modified"
        sx={{
          p: 2,
        }}
      >
        <Typography fontWeight={500} sx={{ mb: 1 }} className="flex items-center">
          历史记录
          <IconButton size="small">
            <MdHelpOutline size={16} />
          </IconButton>
        </Typography>
        <Typography variant="body2">
          上次修改时间
          <span className="px-1">•</span>
          <Box
            component="span"
            sx={{
              color: theme.palette.grey[600],
            }}
          >
            {formated}
          </Box>
        </Typography>
      </Box>
    );
  return null;
};

export default UpdateTime;
