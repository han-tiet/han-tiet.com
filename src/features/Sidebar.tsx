'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import {useState, useEffect} from 'react'
import Profile from "@features/Profile"
import ProfileDetails from './ProfileDetails';
import UserDetails from './UserDetails';

export default function TemporaryDrawer() {
  const [user, setUser] = useState()

  useEffect (() => {
    const fetchData = async () => {
      try {
        const resp = await fetch ("https://jsonplaceholder.typicode.com/users/1")
        const data = await resp.json()
        setUser(data)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchData() // Call fetchData
  }, []) // Empty dependency array means function only runs once on mount

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
          <ListItem disablePadding>{}
            
          </ListItem>
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Open drawer</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Profile
          username={user.username}
          email={user.email}
          city={user.address.city}
        />
      </Drawer>
    </div>
  );
}