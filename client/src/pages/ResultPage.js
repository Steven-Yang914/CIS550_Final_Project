import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Paper";

import LinkWithCrewInfo from "../components/LinkWithCrewInfo";
import EnhancedTable from "../components/EnhancedTable";

const config = require("../config.json");

function ResultPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const peopleIDs = searchParams.get("chosen-crew");
  const peopleIDList = peopleIDs.split(",");
  const [collaborations, setCollaborations] = useState([]);
  const [peopleInfos, setPeopleInfos] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/result/collaboration-summary/?peopleIDs=${peopleIDs}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        setCollaborations(resJson);
      });
  }, [peopleIDs]);

  useEffect(() => {
    const fetchActorNames = async () => {
      let infos = {};
      for (const peopleID of peopleIDList) {
        if (!infos[peopleID]) {
          try {
            const response = await fetch(
              `http://${config.server_host}:${config.server_port}/personInfo/${peopleID}`
            );
            const data = await response.json();
            infos[peopleID] = data[0];
          } catch (error) {
            console.error("Error fetching actor info:", error);
            infos[peopleID] = {};
          }
        }
      }
      setPeopleInfos(infos);
      setIsLoading(false);
    };

    fetchActorNames();
  }, [peopleIDList]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container style={{ marginTop: '20px' }}>
      <EnhancedTable data={peopleInfos}></EnhancedTable>
      <h2>Previous Collaborations</h2>
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>People1</TableCell>
              <TableCell>People2</TableCell>
              <TableCell>#Previous Collaborations</TableCell>
              <TableCell>Best Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collaborations.map((row) => (
              <TableRow
                key={row.ActorID1 + row.ActorID2}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  {
                    <LinkWithCrewInfo to={`/person/${row.ActorID1}`}>
                      {peopleInfos[row.ActorID1].Name}
                    </LinkWithCrewInfo>
                  }
                </TableCell>
                <TableCell>
                  {
                    <LinkWithCrewInfo to={`/person/${row.ActorID2}`}>
                      {peopleInfos[row.ActorID2].Name}
                    </LinkWithCrewInfo>
                  }
                </TableCell>
                <TableCell>{row.NumberOfCollaborations}</TableCell>
                <TableCell>{row.BestRating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ResultPage;
