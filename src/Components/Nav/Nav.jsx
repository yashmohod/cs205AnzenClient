import React, { useEffect, useState } from "react";
import './Nav.css'
import { useNavigate,useLocation } from "react-router-dom";
import Logo from './Ithaca_College_logo.svg.png'
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../redux/slices/user";
import { themeActions } from "../../redux/slices/theme";
import HomeIcon from "./icons/home.png"
import SettingIcon from "./icons/settings.png"
import LogoutIcon from "./icons/logout.png"

export default function Nav() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector(state => state.user)
    const [showmore,setShowMore] = useState(false)
    const dispatch = useDispatch()
    const { colorMode, toggleColorMode } = useColorMode();
    // const [darkHome,setDarkHome] = useState(false)
    
    
    function home() {
        navigate("/")
    }

    function logoutUserHandler() {
        localStorage.removeItem("token")
        localStorage.removeItem("firstName")
        document.location.replace("/")
        dispatch(userActions.updateLoggedIn(false))
    }

    useEffect(() => {
      dispatch(themeActions.updateTheme(colorMode))
    }, [colorMode])

    useEffect(() => {
        if (location.pathname !== "/") {
            setShowMore(true)
        }
    }, [])

  const navbarOptions = [
      {
        title: "Home",
        icon: HomeIcon,
        onClickAction: () => navigate("/"),
      },
      {
        title: "Settings",
        icon: SettingIcon,
        onClickAction: () => navigate("/UserPersonalProfile"),
      },
      {
        title: "Logout",
        icon: LogoutIcon,
        onClickAction: () => logoutUserHandler(),
      },
    ]

  return (
    <div style={{position: "relative", zIndex: 999, width: "100vw"}}>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} mb={10}> 
        <Flex alignItems={'center'} justifyContent={'space-between'} h={24}>
          <Box m={10}>  
              <div className="ithaca-logo-container" onClick={() => home()}>
                  <img src={Logo} alt="Ithaca-Logo"  className="img-fluid mx-auto d-block ithaca-logo"/>
              </div>
          </Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={'https://shop.line-scdn.net/themeshop/v1/products/32/6e/3a/326e3a9d-92a9-4299-b762-608ce00a577d/89/WEBSTORE/icon_198x278.png'}
                  />
                </MenuButton>
                <MenuList alignItems={'center'} >
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={'https://shop.line-scdn.net/themeshop/v1/products/32/6e/3a/326e3a9d-92a9-4299-b762-608ce00a577d/89/WEBSTORE/icon_198x278.png'}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>Hi, {user.metadata?.firstName}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  {
                    navbarOptions?.map((option) => {
                      return (
                        <MenuItem onClick={option.onClickAction} className=" hover:bg-blue-300 active:bg-white">
                            <div className="flex items-center space-x-2">
                              <div className="basis-3/6"><img src={option.icon} alt="" width={40} height={40}/></div>
                              <div className="basis-3/6">{option.title}</div>
                            </div>
                        </MenuItem>
                      ) 
                    })
                  }
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </div>
  );
}