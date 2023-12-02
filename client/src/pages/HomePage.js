import { useEffect, useState, useRef } from 'react';
import { Container, Divider, Button } from '@mui/material';
import TopMoviesTable from '../components/TopMoviesTable';
// import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function HomePage() {
  const [randomMovie, setRandomMovie] = useState({});

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/random`)
      .then(res => res.json())
      .then(resJson => setRandomMovie(resJson));
  }, []);

  return (
    <Container>
      <div style={{ display: 'flex'}}>
        <h2>Movie of the day:&nbsp;{randomMovie.PrimaryTitle}
        </h2>
        <img src={randomMovie.PosterURL} alt={randomMovie.PrimaryTitle} />
      </div>

      <div>
        <TopMoviesTable />
      </div>
      
      <Divider />
    </Container>
  );
};