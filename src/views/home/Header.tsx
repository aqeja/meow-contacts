import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Avatar,
  Typography,
  InputBase,
  Tooltip,
  Paper,
  Popper,
  List,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  ClickAwayListener,
} from "@mui/material";
import { MdMenu, MdSearch, MdClose, MdOutlineHelpOutline, MdSettings, MdApps } from "react-icons/md";

import { SearchContactsResponse } from "@/types/searchContacts";
import { searchContacts } from "@/api";
import { useNavigate } from "react-router-dom";
import { useGetContact } from "@/hooks/useContacts";

const Selector: React.FC<{
  keyword: string;
  anchor: HTMLElement | null;
  containerWidth: number;
  setKeyword: (value: string) => void;
  setAnchor: (anchor: HTMLElement | null) => void;
  setFocus: (value: boolean) => void;
}> = ({ keyword, anchor, containerWidth, setKeyword, setAnchor, setFocus }) => {
  const navigate = useNavigate();
  const controller = useRef<AbortController | null>(null);
  const taskId = useRef<number | null>(null);
  const [results, setResults] = useState<SearchContactsResponse["results"]>([]);

  useEffect(() => {
    controller.current?.abort();
    if (taskId.current) {
      window.clearTimeout(taskId.current);
    }

    taskId.current = window.setTimeout(() => {
      const _controller = new AbortController();
      controller.current = _controller;

      if (keyword.trim().length === 0) {
        setResults([]);
        return;
      }

      searchContacts(
        {
          query: keyword,
          pageSize: 30,
          readMask: ["names", "photos"],
        },
        {
          signal: _controller.signal,
        },
      ).then((res) => {
        setResults(Array.isArray(res.data.results) ? res.data.results : []);
      });
    }, 300);
  }, [keyword]);
  const abortTask = useCallback(() => {
    controller.current?.abort();
    if (taskId.current) {
      window.clearTimeout(taskId.current);
    }
    setResults([]);
  }, []);
  useEffect(() => {
    if (!anchor) {
      abortTask();
    }
  }, [anchor, abortTask]);
  const gotoContactPage = useCallback(
    (id: string) => {
      setAnchor(null);
      navigate(`/person/${id}`);
      setKeyword("");
      setFocus(false);
    },
    [navigate, setKeyword, setAnchor, setFocus],
  );
  return (
    <ClickAwayListener onClickAway={abortTask}>
      <Popper
        open={results.length > 0}
        anchorEl={anchor}
        placement="bottom"
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1,
          width: containerWidth,
        }}
      >
        <Paper>
          <List>
            {results?.map((contact) => {
              return (
                <ListItemButton
                  key={contact.person.etag}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    gotoContactPage(contact.person.resourceName.split("/")[1]);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={contact?.person?.photos?.[0]?.url}
                      sx={{
                        width: 28,
                        height: 28,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText>{contact.person?.names?.[0]?.displayName}</ListItemText>
                </ListItemButton>
              );
            })}
          </List>
        </Paper>
      </Popper>
    </ClickAwayListener>
  );
};

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [focus, setFocus] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const ref = useRef<HTMLElement | null>(null);
  const clearkeyword = useCallback(() => {
    setKeyword("");
  }, []);
  return (
    <form
      className="flex-grow max-w-[720px] ml-[110px] z-10"
      action=""
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Box
        component="div"
        ref={ref}
        className="flex items-center w-full transition-shadow relative"
        sx={{
          height: 48,
          backgroundColor: "#f1f3f4",
          px: 1,
          borderRadius: 2,
          ...(focus
            ? {
                backgroundColor: "#fff",
                boxShadow: "0 1px 1px 0 rgba(65,69,73,.3), 0 1px 3px 1px rgba(65,69,73,.15);",
                borderRadius: "8px 8px 0 0",
              }
            : {}),
        }}
      >
        <Tooltip title="搜索">
          <IconButton sx={{ mr: 2 }}>
            <MdSearch />
          </IconButton>
        </Tooltip>
        <InputBase
          onFocus={() => {
            setFocus(true);
            setAnchor(ref.current);
          }}
          onBlur={() => {
            setFocus(false);
            setAnchor(null);
          }}
          inputProps={{
            style: {
              padding: 0,
            },
          }}
          value={keyword}
          onChange={(e) => {
            setKeyword(e.currentTarget.value);
          }}
          className="flex-grow"
          placeholder="搜索"
        />
        <Tooltip title="清除搜索查询">
          <IconButton className={keyword.length > 0 ? "" : "!hidden"} onClick={clearkeyword}>
            <MdClose />
          </IconButton>
        </Tooltip>
      </Box>

      <Selector
        keyword={keyword.trim()}
        containerWidth={ref.current?.offsetWidth ?? 0}
        anchor={anchor}
        setKeyword={setKeyword}
        setAnchor={setAnchor}
        setFocus={setFocus}
      />
    </form>
  );
};

const Header = () => {
  const { data: profileResponse } = useGetContact("people/me");

  return (
    <Box
      component="div"
      className="flex-shrink-0 flex items-center"
      sx={{
        height: 64,
        p: 1,
      }}
    >
      <IconButton sx={{ ml: "8px" }}>
        <MdMenu />
      </IconButton>
      <Avatar sx={{ mr: "8px", ml: "8px" }} src="/contacts_2022_48dp.png" variant="square" />
      <Typography
        variant="h5"
        fontWeight={400}
        sx={{
          fontSize: 22,
          color: "#5f6368",
        }}
      >
        通讯录
      </Typography>
      <Search />
      <Box sx={{ ml: "auto" }} component="div" className="flex items-center">
        <IconButton>
          <MdOutlineHelpOutline size={20} />
        </IconButton>
        <IconButton sx={{ ml: 1.5 }}>
          <MdSettings size={20} />
        </IconButton>
        <IconButton sx={{ ml: 3 }}>
          <MdApps size={24} />
        </IconButton>
        <Avatar
          src={profileResponse?.data?.photos?.[0].url}
          sx={{
            ml: 2,
            width: 32,
            height: 32,
          }}
        />
      </Box>
    </Box>
  );
};

export default Header;
