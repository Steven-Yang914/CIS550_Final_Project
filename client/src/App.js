import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import MovieInfoPage from './pages/MovieInfoPage';
import PersonInfoPage from "./pages/PersonInfoPage";
import ResultPage from './pages/ResultPage';
import PeoplePage from './pages/People';
// Import additional components if you have created separate pages for them


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
          <Route path="/movie/:movie_id" element={<MovieInfoPage />} />
          <Route path="/person/:person_id" element={<PersonInfoPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
