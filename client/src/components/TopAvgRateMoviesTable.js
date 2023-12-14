// still need to add endpoint to server and add to routes

import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Grid} from '@mui/material';
import { NavLink } from 'react-router-dom';
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SearchContext from "./SearchContext";

const config = require('../config.json');

function TopAvgRateMoviesTable() {
    const [topMoviesByGenre, setTopMoviesByGenre] = useState([]);
    const { currentPage, setCurrentPage} = useContext(SearchContext);
    const moviesPerPage = useRef(20);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/genre/top-movies?page=${currentPage}&page_size=${moviesPerPage.current}`)
            .then(res => res.json())
            .then(resJson => setTopMoviesByGenre(resJson));
    }, [currentPage]);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <h2>Top Movies by Genre</h2>
                    <Grid container>
                        {topMoviesByGenre.map((movie, index) => {
                            const globalIndex = (currentPage - 1) * moviesPerPage.current + index + 1;
                            return(
                                    <Grid item xs={3} key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ maxWidth: '180px', fontWeight: 'bold' }}> {movie.genre}</div>
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
                                <div style={{ maxWidth: '220px' }}>Director: {movie.director}</div>
                                <NavLink to={`/movie/${movie.MovieID}`}>
                                    <div style={{ marginBottom: '20px' }}>
                                        {movie.PosterURL ? <img
                                            src={movie.PosterURL}
                                            alt={movie.PrimaryTitle}
                                            style={{ width: '180px', height: '200px' }}
                                            onError={(e) =>
                                            {e.target.onerror = null; e.target.src="https://demofree.sirv.com/nope-not-here.jpg"}}
                                        />: <img
                                            src="https://demofree.sirv.com/nope-not-here.jpg"
                                            style={{ width: '180px', height: '200px' }}
                                        />}
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
                    disabled={topMoviesByGenre.length < moviesPerPage.current}
                    onClick={() => paginate(currentPage + 1)}
                    style={{ background: topMoviesByGenre.length < moviesPerPage.current ? '#999' : '#333', color: 'white' }}
                >
                    <NavigateNextIcon />
                </Button>
            </div>
        </div>
    )

}


export default TopAvgRateMoviesTable;