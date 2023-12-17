import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import {
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
} from "@mui/material";

import LinkWithCrewInfo from "../components/LinkWithCrewInfo";

const config = require("../config.json");

// Code for the result page
function ResultPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rows, setRows] = useState([]);
  const peopleIDs = searchParams.get("chosen-crew");
  const [collaborations, setCollaborations] = useState([]);
  const [peopleInfos, setPeopleInfos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const scriptText = location.state?.scriptText || "";
  const titleText = location.state?.titleText || "";

  // get collaborations data
  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/result/collaboration-summary/?peopleIDs=${peopleIDs}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        setCollaborations(resJson);
      });
  }, [peopleIDs]);

  // get people info
  useEffect(() => {
    const fetchActorNames = async () => {
      const peopleIDList = peopleIDs.split(",");
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
  }, [peopleIDs]);

  useEffect(() => {
    const peopleIDList = peopleIDs.split(",");
    const fetchPromises = peopleIDList.map(async (item) => {
      const info_res = await fetch(
        `http://${config.server_host}:${config.server_port}/personInfo/${item}`
      );
      const info_data = await info_res.json();

      const genre_res = await fetch(
        `http://${config.server_host}:${config.server_port}/result/genre-freq/${item}`
      );

      const genre_data = await genre_res.json();

      const job_res = await fetch(
        `http://${config.server_host}:${config.server_port}/result/job-freq/${item}`
      );
      const job_data = await job_res.json();

      return {
        PeopleID: item,
        name: info_data[0]?.Name,
        topGenres: genre_data
          .slice(0, 3)
          .map((item) => item.Genre)
          .join(", "),
        topJob: job_data[0]?.Job,
      };
    });
    Promise.all(fetchPromises).then((updatedRawData) => {
      setRows(updatedRawData);
    });
  }, [peopleIDs]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack
      style={{
        marginTop: "30px",
        marginBottom: "30px",
        marginLeft: "50px",
        marginRight: "50px",
      }}
    >
      <Card style={{ width: 400, margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h3">{titleText}</Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="h5">{scriptText}</Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            {rows.map((row, index) => {
              return (
                <TableRow key={row.PeopleID}>
                  <TableCell>
                    {row.topJob
                      ? row.topJob.charAt(0).toUpperCase() + row.topJob.slice(1)
                      : "/"}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

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
    </Stack>
  );
}

export default ResultPage;
