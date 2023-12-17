import { useEffect, useState, useRef,useContext } from 'react';
import { Button, Grid } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { NavLink } from 'react-router-dom';
import SearchContext from './SearchContext';

const config = require('../config.json');

// Get actors acted in more than 2 adult movies
function OverTwoAdultTable() {
    const [ActorMoreThan2Adult, setActorMoreThan2Adult] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const {moviesPerPage } = useContext(SearchContext);

    // fetch data from backend
    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/overTwoAdult?page=${currentPage}&page_size=${moviesPerPage.current}`)
            .then(res => res.json())
            .then(resJson => {
                console.log("resJson: ", resJson);
                setActorMoreThan2Adult(resJson)
            });
        console.log("ActorMoreThan2Adult: ", ActorMoreThan2Adult);
    }, [currentPage]);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <h2>Actors Acted in More Than 2 Adult Movies</h2>
            <Grid container>
                {ActorMoreThan2Adult.map((movie, index) => {
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
                                <p>Actor: {movie.Name}</p >
                            </NavLink>
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
                    disabled={ActorMoreThan2Adult.length < moviesPerPage.current}
                    onClick={() => paginate(currentPage + 1)}
                    style={{ background: ActorMoreThan2Adult.length < moviesPerPage.current ? '#999' : '#333', color: 'white' }}
                >
                    <NavigateNextIcon />
                </Button>
            </div>
        </div>
    )

}

export default OverTwoAdultTable