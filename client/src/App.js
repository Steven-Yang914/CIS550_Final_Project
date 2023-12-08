import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import People from './pages/People';
// Import additional components if you have created separate pages for them

<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/people" element={<PeoplePage />} />
</Routes>

export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add new routes here if you have separate pages for detailed person info */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
