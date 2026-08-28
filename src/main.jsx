import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './App'

const theme = createTheme({
  palette: { primary: { main: '#183b2a' }, secondary: { main: '#a8874b' }, background: { default: '#fffdf9' } },
  typography: { fontFamily: '"Noto Sans Thai", sans-serif', h1: { fontFamily: '"Pridi", serif' }, h2: { fontFamily: '"Pridi", serif' }, h3: { fontFamily: '"Pridi", serif' } },
})

createRoot(document.getElementById('root')).render(<StrictMode><ThemeProvider theme={theme}><CssBaseline /><App /></ThemeProvider></StrictMode>)
