import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, Paper } from '@mui/material';
import LinkWithCrewInfo from "../components/LinkWithCrewInfo";
import { useNavigate } from 'react-router-dom';


const config = require('../config.json');

function PersonInfoPage() {
    const { person_id } = useParams();
    const [personInfo, setPersonInfo] = useState({});
    const [relatedMovies, setRelatedMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get general info of the person
                let response = await fetch(`http://${config.server_host}:${config.server_port}/personInfo/${person_id}`);
                let data = await response.json();
                setPersonInfo(data[0]);

                // Get movies related to the person
                response = await fetch(`http://${config.server_host}:${config.server_port}/person/${person_id}`);
                data = await response.json();
                setRelatedMovies(data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [person_id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading data.</div>;
    }

    const { Name, BirthYear, DeathYear } = personInfo;

    const handleAddButtonClick = () => {
        const searchParams = new URLSearchParams(window.location.search);
        
        const existingCrew = searchParams.get('chosen-crew');
        const updatedCrew = existingCrew ? `${existingCrew},${person_id}` : person_id;
        searchParams.set('chosen-crew', updatedCrew);

        navigate(`/design?${searchParams.toString()}`);
    };


    return (
        <Container>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="h3">{Name}</Typography>
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" onClick={handleAddButtonClick}>
                                    <LinkWithCrewInfo to={`/result`}>
                                        Add
                                    </LinkWithCrewInfo>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell><strong style={{ fontSize: '16px' }}>Birth Year:</strong> {BirthYear}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <strong style={{ fontSize: '16px' }}>Death Year:</strong>
                                {DeathYear && DeathYear !== 0 ? DeathYear : ' NA'}
                            </TableCell>
                        </TableRow>
                        {relatedMovies.length > 0 && 
                            <TableRow>
                                <TableCell>
                                    <strong style={{ fontSize: '16px' }}>Related Movies:</strong> 
                                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                                        {relatedMovies.map((movie, index) => (
                                            <li key={index} style={{ marginBottom: '16px' }}>
                                                <LinkWithCrewInfo to={`/movie/${movie.MovieID}`} style={{ textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>
                                                    <div>
                                                        <span style={{ fontSize: '18px' }}>{movie.PrimaryTitle}</span> ({movie.Year})
                                                    </div>
                                                    <div style={{ fontSize: '14px', color: '#666' }}>
                                                        Role: {movie.Job}
                                                    </div>
                                                </LinkWithCrewInfo>
                                            </li>
                                        ))}
                                    </ul>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default PersonInfoPage;
