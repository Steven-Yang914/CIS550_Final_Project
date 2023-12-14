// still need to add endpoint to server and add to routes

import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Grid} from '@mui/material';
import { NavLink } from 'react-router-dom';
import SearchContext from "./SearchContext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const config = require('../config.json');

function RandomDirectorMovies() {
    const [movies, setMovies] = useState([]);
    const [director, setDirector] = useState({});
    const { currentPage, setCurrentPage} = useContext(SearchContext);
    const [isDirectorFetched, setIsDirectorFetched] = useState(false);
    const moviesPerPage = useRef(15);


    // Get a random director
    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/director/randomPick`)
            .then(res => res.json())
            .then(resJson => {
                setDirector(resJson[0]);
                setIsDirectorFetched(true); // Set isDirectorFetched to true after the director is fetched

            });
    }, []);

    // Get movies by the random director
    useEffect(() => {
        if (isDirectorFetched && director && director.PeopleID) { // Check if isDirectorFetched is true before fetching movies
            console.log("directorId: ", director.PeopleID);
            fetch(`http://${config.server_host}:${config.server_port}/director/random?directorID=${director.PeopleID}&page=${currentPage}&page_size=${moviesPerPage.current}`)
                .then(res => res.json())
                .then(resJson => {
                    console.log("movies: ", resJson);
                    setMovies(resJson);
                });
        }
    }, [director, currentPage]);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <h2>Movies by {movies[0] && movies[0].director}</h2>
            <Grid container>
                {movies && movies.length > 0 ? (
                    movies.map((movie, index) => {
                        const globalIndex = (currentPage - 1) * moviesPerPage.current + index + 1;
                        return (
                            <Grid item xs={3} key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                                <div>Director: {movie.director}</div>
                                <NavLink to={`/movie/${movie.MovieID}`}>
                                    <div style={{ marginBottom: '20px' }}>
                                        {movie.PosterURL && <img
                                            src={movie.PosterURL}
                                            alt={movie.PrimaryTitle}
                                            style={{ width: '220px', height: '200px' }}
                                            onError={(e) =>
                                            {e.target.onerror = null; e.target.src="https://demofree.sirv.com/nope-not-here.jpg"}}
                                        />}
                                    </div>
                                </NavLink>
                            </Grid>
                        );
                    })
                ) : null}
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
                    disabled={movies.length < moviesPerPage.current}
                    onClick={() => paginate(currentPage + 1)}
                    style={{ background: movies.length < moviesPerPage.current ? '#999' : '#333', color: 'white' }}
                >
                    <NavigateNextIcon />
                </Button>
            </div>
        </div>
    )
}

export default RandomDirectorMovies;

