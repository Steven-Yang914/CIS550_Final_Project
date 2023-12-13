import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";

const config = require("../config.json");

const headCells = [
  {
    id: "name",
    label: "Name",
  },
  {
    id: "birthYear",
    label: "Birth Year",
  },
  {
    id: "deathYear",
    label: "Death Year",
  },
  {
    id: "job",
    label: "Job",
  },
  {
    id: "genre",
    label: "Most Frequent Genres",
  },
];

function EnhancedTable(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  var rawdata = Object.values(props.data);
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);

  function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount } = props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell key={headCell.id}>{headCell.label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            View/Edit Your Crew
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <div></div>
        )}
      </Toolbar>
    );
  }

  function handleDelete() {
    var peopleIDs = searchParams.get("chosen-crew").split(",");
    peopleIDs = peopleIDs.filter((item) => !selected.includes(item));
    setSearchParams({
      ...Object.fromEntries(searchParams),
      "chosen-crew": peopleIDs.join(","),
    });
    window.location.reload();
  }

  useEffect(() => {
    const fetchPromises = rawdata.map(async (item) => {
      const genre_res = await fetch(
        `http://${config.server_host}:${config.server_port}/result/genre-freq/${item.PeopleID}`
      );

      const genre_data = await genre_res.json();

      const job_res = await fetch(
        `http://${config.server_host}:${config.server_port}/result/job-freq/${item.PeopleID}`
      );
      const job_data = await job_res.json();

      return {
        ...item,
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
  }, [rawdata]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.PeopleID);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={Object.keys(rows).length}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.PeopleID);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.PeopleID)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.PeopleID}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row">
                      {row.Name}
                    </TableCell>
                    <TableCell>{row.BirthYear ? row.BirthYear : "/"}</TableCell>
                    <TableCell>{row.DeathYear ? row.DeathYear : "/"}</TableCell>
                    <TableCell>{row.topJob ? row.topJob : "/"}</TableCell>
                    <TableCell>{row.topGenres ? row.topGenres : "/"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default EnhancedTable;
