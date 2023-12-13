import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, Paper } from '@mui/material';
import LinkWithCrewInfo from "../components/LinkWithCrewInfo";

const config = require('../config.json');

function PeopleInfoPage() {
  const {person_id} = useParams();
  const [personInfo, setPersonInfo] = useState({});
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(person_id);

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
        console.log(data);
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

  const { Name, BirthYear, DeathYear, Role } = personInfo;

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
                <Button variant="contained">
                  <LinkWithCrewInfo to={`/result`}>
                    Add
                  </LinkWithCrewInfo>
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* ... existing TableRows ... */}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default PeopleInfoPage;

