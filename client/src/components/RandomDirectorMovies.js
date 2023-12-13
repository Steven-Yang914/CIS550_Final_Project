// still need to add endpoint to server and add to routes

import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

function RandomDirectorMovies() {
    const [movies, setMovies] = useState([]);
    const [director, setDirector] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/director/random`)
            .then(res => res.json())
            .then(resJson => {
                setDirector(resJson[0].director);
                setMovies(resJson);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <h2>Movies by {director}</h2>
            <Grid container>
                {movies.map((movie, index) => {
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
                                {movie.PrimaryTitle}
                            </NavLink>
                            <div>Director: {movie.Director}</div>
                            <NavLink to={`/movie/${movie.MovieID}`}>
                                <div style={{ marginBottom: '20px' }}>
                                    <img src={movie.PosterURL} alt={movie.PrimaryTitle} style={{ width: '180px', height: '200px' }} />
                                </div>
                            </NavLink>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    )
}

export default RandomDirectorMovies;