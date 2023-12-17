import { useEffect, useState } from 'react';
import { Container, Divider } from '@mui/material';
import TopMoviesTable from '../components/TopMoviesTable';
import LinkWithCrewInfo from '../components/LinkWithCrewInfo';

const config = require('../config.json');

// Code for the home page
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
        <h2>
          Movie of the day:&nbsp;
          <LinkWithCrewInfo to={`/movie/${randomMovie.MovieID}`} style={{ textDecoration: 'none' }}>
            {randomMovie.PrimaryTitle}
          </LinkWithCrewInfo>
        </h2>
      </div>

      <div>
        <TopMoviesTable />
      </div>
      
      <Divider />
    </Container>
  );
};