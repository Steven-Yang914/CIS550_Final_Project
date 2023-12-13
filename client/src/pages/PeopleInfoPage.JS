import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

function PeopleInfoPage() {
  const { person_id } = useParams();
  const [personInfo, setPersonInfo] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);

  useEffect(() => {
    // Get general info of the person
    fetch(`http://${config.server_host}:${config.server_port}/personInfo/${person_id}`)
      .then(res => res.json())
      .then(resJson => {
        setPersonInfo(resJson);
      });

    // Get movies related to the person
    fetch(`http://${config.server_host}:${config.server_port}/person/${person_id}`)
    .then(res => res.json())
    .then(resJson => {
      setRelatedMovies(resJson);
    });
    
  }, [person_id]);

  if (!personInfo) {
    return <div>Loading...</div>;
  }

  const { Name, BirthYear, DeathYear, Role } = personInfo;

  return (
    <Container>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h3">{Name}</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell><strong style={{ fontSize: '16px' }}>Role:</strong> {Role}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong style={{ fontSize: '16px' }}>Birth Year:</strong> {BirthYear}</TableCell>
            </TableRow>
            {DeathYear && 
              <TableRow>
                <TableCell><strong style={{ fontSize: '16px' }}>Death Year:</strong> {DeathYear}</TableCell>
              </TableRow>
            }
            {relatedMovies.length > 0 && 
              <TableRow>
                <TableCell>
                  <strong style={{ fontSize: '16px' }}>Related Movies:</strong> 
                  {relatedMovies.map((movie, index) => (
                    <div key={index}>
                      <NavLink style={{ textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>
                        {movie.Title} ({movie.Year})
                      </NavLink>
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default PeopleInfoPage;
