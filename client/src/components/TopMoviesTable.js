import { useEffect, useState, useRef } from 'react';
import { Button, Grid } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

function TopMoviesTable() {
  const [topMovies, setTopMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = useRef(12);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/topMovies?page=${currentPage}&page_size=${moviesPerPage.current}`)
      .then(res => res.json())
      .then(resJson => setTopMovies(resJson));
  }, [currentPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h2>Top Movies</h2>
      <Grid container>
        {topMovies.map((movie, index) => {
          const globalIndex = (currentPage - 1) * moviesPerPage.current + index + 1;
          return (
            <Grid item xs={3} key={movie.MovieID} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <NavLink
                to={`/movie/${movie.MovieID}`}
                style={{
                  textAlign: 'center',
                  maxWidth: '180px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                  color: '#333',
                }}
              >
                <span>{globalIndex}. </span>
                {movie.PrimaryTitle}
            </NavLink>
            <NavLink to={`/movie/${movie.MovieID}`}>
              <div style={{ marginBottom: '20px' }}>
                <img src={movie.PosterURL} alt={movie.PrimaryTitle} style={{ width: '180px', height: '200px' }} />
              </div>
            </NavLink>
          </Grid>
          );
        })}
      </Grid>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
          style={{ marginRight: '10px', background: currentPage === 1 ? '#999' : '#333', color: 'white' }}
        >
          <NavigateBeforeIcon />
        </Button>
        <Button
          disabled={topMovies.length < moviesPerPage.current}
          onClick={() => paginate(currentPage + 1)}
          style={{ background: topMovies.length < moviesPerPage.current ? '#999' : '#333', color: 'white' }}
        >
          <NavigateNextIcon />
        </Button>
      </div>
    </div>
  )
}

export default TopMoviesTable