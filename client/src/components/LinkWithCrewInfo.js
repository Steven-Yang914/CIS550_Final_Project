import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const LinkWithCrewInfo = ({ to, ...props }) => {
  const [searchParams] = useSearchParams();
  const peopleIDs = searchParams.get("chosen-crew");
  const search = searchParams.toString();
  const linkTo = search ? `${to}?chosen-crew=${peopleIDs}` : to;

  return <Link to={linkTo} {...props} />;
};

export default LinkWithCrewInfo;
