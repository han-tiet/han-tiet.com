import { createTheme } from "@mui/material/styles"

const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#000000',
      },
      secondary: {
        main: '#f50000',
      },
      background: {
        default: '#FCF5E5',
        paper: '#f6f4ef',
      },
      info: {
        main: '#2196f3',
      },
    },
  })

export default theme