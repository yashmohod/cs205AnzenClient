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
import { useDispatch } from "react-redux";
import { userActions } from "../../redux/slices/user";

export default function Nav() {
    const navigate = useNavigate();
    const location = useLocation();
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
        if (location.pathname !== "/") {
            setShowMore(true)
        }
    })

  return (
    <div style={{position: "relative", zIndex: 999, width: "100vw"}}>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} mb={10}> 
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box m={5}>  
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
                    <p>Hi, {localStorage.getItem("firstName")}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem onClick={() => navigate("/")}>
                  <img src="https://img.icons8.com/dusk/512/home-page.png" alt="" width={40} height={40}/> Home
                  </MenuItem>

                  <MenuItem onClick={() => navigate("/UserPersonalProfile")}>
                    <img src="https://img.icons8.com/plasticine/512/settings.png" alt="" width={40} height={40}/> Settings
                  </MenuItem>
                  
                  <MenuItem onClick={() => logoutUserHandler()}>
                      <img src="https://img.icons8.com/plasticine/512/logout-rounded.png" alt="" width={40} height={40}/> Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </div>
  );
}