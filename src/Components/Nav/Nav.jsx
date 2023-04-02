import { hover } from "@testing-library/user-event/dist/hover";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../Utils/API";
import './Nav.css'
import { useNavigate,useLocation } from "react-router-dom";
import { BsHouse,BsHouseFill } from "react-icons/bs";
import Logo from './Ithaca_College_logo.svg.png'

import { ReactNode } from 'react';
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

export default function Nav({setLoggedIn, loggedInUser}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showmore,setshowmore] = useState(false)
    const [darkHome,setDarkHome] = useState(false)
    
    function home() {
        navigate("/")
        console.log(location.pathname)
    }

    function logoutUserHandler() {
        localStorage.removeItem("token")
        localStorage.removeItem("firstName")
        document.location.replace("/")
        setLoggedIn(false)
    }
    useEffect(() => {


        if(location.pathname != "/"){
            setshowmore(true)
        }
    })
    const [hovered,setHovered] = useState(false)

    function changeHoverFalse() {
        setHovered(false)
    }

    function changeHoverTrue() {
        setHovered(true)
    }



        const { colorMode, toggleColorMode } = useColorMode();
const { isOpen, onOpen, onClose } = useDisclosure();
//px={4} mb={10}
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



/*
<div className="nav">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-7 col-md-5 " >
                                <div className="ithaca-logo-container" >
                                    <img src="https://www.planetforward.org/sites/default/files/styles/840-x-variable/public/154059_ithaca-college-logo-horizontal-for-ICpg.png?itok=AcYdum-L" alt="Ithaca-Logo"  className="img-fluid mx-auto d-block ithaca-logo"/>
                                </div>
                                
                            </div>
                            <div className="col-3 col-md-2"></div>
                            <div className="col-2 col-md-5">
                                <div className="logout-logo-container">
                                { loggedInUser &&   <p className="m-2">Hi, {loggedInUser.firstName}</p>}
                                    <div onMouseEnter={() => changeHoverTrue()} onMouseLeave={() => changeHoverFalse()} onClick={() => logoutUserHandler()}>
                                        {hovered ? <img src="https://cdn-icons-png.flaticon.com/512/4043/4043198.png" alt="Logout" onClick={() => logoutUserHandler()} className="logout-logo"/>   : <img src="https://cdn-icons-png.flaticon.com/512/126/126467.png" alt="Logout"  className="logout-logo"/>}
                                    </div>
                                 
                                </div>
                            </div>
                        </div>
                        {showmore ? 
                        <div className='row-12'>
                            <div className="col-4 col-sm-6 h-25">
                                <div className="col-lg-2 col-sm-4" onMouseEnter={()=>setDarkHome(true)} onMouseLeave={()=>setDarkHome(false)}>
                                    {darkHome? <BsHouseFill size={50} onClick={()=>home()} />:<BsHouse size={50} onClick={()=>home()}/>}
                                </div>
                            </div>
                        </div>
                        :null}
                    </div>
                       
                           
        
                       
                        
                       
                </div>
*/