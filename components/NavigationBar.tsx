import {Box, AppBar, Toolbar, Typography } from '@mui/material'

export default function NavigationBar() {
  return(
    <Box>
      <AppBar>
        <Toolbar>
          <Typography variant="h4" component="div">
            han-tiet.com
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

