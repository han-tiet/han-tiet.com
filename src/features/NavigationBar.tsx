import {Box, AppBar, Toolbar, Typography } from '@mui/material'

export default function NavigationBar() {
  return(
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div">
            han-tiet.com
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  )
}

