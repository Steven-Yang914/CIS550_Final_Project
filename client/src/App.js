import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";
import React, { useContext } from 'react';
import SearchContext from './components/SearchContext';
import {SearchProvider} from "./components/SearchProvider";

import SearchPage from "./pages/SearchPage";
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import MovieInfoPage from './pages/MovieInfoPage';
import PersonInfoPage from "./pages/PersonInfoPage";

import DesignPage from './pages/DesignPage';
import ResultPage from "./pages/ResultPage";

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
        <SearchProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add new routes here if you have separate pages for detailed person info */}
            <Route path="/movie/:movie_id" element={<MovieInfoPage />} />
            <Route path="/person/:person_id" element={<PersonInfoPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/design" element={<DesignPage />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </SearchProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
