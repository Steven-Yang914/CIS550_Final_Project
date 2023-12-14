// import React, { useEffect, useState } from 'react';
// import config from '../config.json';



// // RandomPerson Component
// export const RandomPerson = () => {
//   const [randomPerson, setRandomPerson] = useState({});

//   useEffect(() => {
//     fetch(`http://${config.server_host}:${config.server_port}/random-person`)
//       .then(res => res.json())
//       .then(data => setRandomPerson(data))
//       .catch(err => console.error('Error fetching random person:', err));
//   }, []);

//   return (
//     <div>
//       <h2>Person of the Day: {randomPerson.Name}</h2>
//       {randomPerson.Name && (
//         <>
//           <p>Birth Year: {randomPerson.BirthYear}</p>
//           <p>Death Year: {randomPerson.DeathYear ? randomPerson.DeathYear : 'N/A'}</p>
//           {/* You can add more details if available */}
//         </>
//       )}
//     </div>
//   );
// };

// // PersonList Component
// export const PersonList = () => {
//   const [people, setPeople] = useState([]);

//   useEffect(() => {
//     fetch(`http://${config.server_host}:${config.server_port}/people`)
//       .then(res => res.json())
//       .then(data => setPeople(data))
//       .catch(err => console.error('Error fetching people list:', err));
//   }, []);

//   return (
//     <div>
//       <h2>Actors, Actresses, and Directors</h2>
//       {people.map(person => (
//         <div key={person.PeopleID}>
//           <h3>{person.Name}</h3>
//           <p>Birth Year: {person.BirthYear}</p>
//           <p>Death Year: {person.DeathYear ? person.DeathYear : 'N/A'}</p>
//           {/* You can add more details if available */}
//         </div>
//       ))}
//     </div>
//   );
// };

