import React, {useState} from "react";
import {FaSearch} from "react-icons/fa";
import "./SearchBar.css";

export const SearchBar = ({setResults}) => {
    const [input, setInput] = useState("");

    const fetchData = (value) => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((response) => response.json())
            .then((json) => {
                const results = json.filter((user) => {
                    return (
                        value &&
                        user &&
                        user.name &&
                        user.name.toLowerCase().includes(value)
                    );
                });
                setResults(results);
        });
    };

    const handleChanges = (value) => {
        setInput(value);
        fetchData(value);
    }
  return (
    <div className="Input-wrapper">
      <FaSearch id = "search-icon"/>
      <input
          placeholder="Type here to search..."
          value = {input}
          onChange={(e) => handleChanges(e.target.value)}
      />
  </div>
  );
};
