// still need to add endpoint to server and add to routes

import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

function TopAvgRateMoviesTable() {
    const [topMoviesByGenre, setTopMoviesByGenre] = useState([]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/genre/top-movies`)
            .then(res => res.json())
            .then(resJson => setTopMoviesByGenre(resJson));
    }, []);

    return (
        <div>
            <h2>Top Movies by Genre</h2>
            {topMoviesByGenre.map((genre, index) => (
                <div key={index}>
                    <h3>{genre.genre}</h3>
                    <Grid container>
                        {genre.movies.map((movie) => (
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
                        ))}
                    </Grid>
                </div>
            ))}
        </div>
    )
}

export default TopAvgRateMoviesTable;