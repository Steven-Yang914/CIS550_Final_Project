import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import EnhancedTable from "../components/EnhancedTable";

const config = require("../config.json");


// Code for the design page
function DesignPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const peopleIDs = searchParams.get("chosen-crew");
  const [peopleInfos, setPeopleInfos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const scriptInputRef = useRef();
  const titleInputRef = useRef();

  // get people info
  useEffect(() => {
    const fetchActorNames = async () => {
      let peopleIDList;
      if (peopleIDs === null) {
        peopleIDList = [];
      } else {
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
              infos[peopleID] = {};
            }
          }
        }
        setPeopleInfos(infos);
        setIsLoading(false);
      }
    };
    fetchActorNames();
  }, [peopleIDs]);

  if (isLoading) {
    return (
      <Stack
        style={{ marginTop: "30px", marginLeft: "50px", marginRight: "50px" }}
        spacing={2}
      >
        <h1>Please choose your crew first!</h1>
      </Stack>
    )
  }
  // handle button click for result generation
  const handleButtonClick = () => {
    const scriptInput = scriptInputRef.current.value;
    const titleInput = titleInputRef.current.value;
    navigate(`/result?chosen-crew=${peopleIDs}`, {
      state: { scriptText: scriptInput, titleText: titleInput },
    });
  };
  
  return (
    <Stack
      style={{ marginTop: "30px", marginLeft: "50px", marginRight: "50px" }}
      spacing={2}
    >
      <EnhancedTable data={peopleInfos}></EnhancedTable>
      <TextField
        placeholder="Write Your Title Here..."
        inputRef={titleInputRef}
      />
      <TextField
        placeholder="Write Your Script Here..."
        multiline
        rows={5}
        inputRef={scriptInputRef}
      />
      <Button variant="contained" onClick={handleButtonClick}>
        Show Result
      </Button>
    </Stack>
  );
}

export default DesignPage;
