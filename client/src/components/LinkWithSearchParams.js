import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const LinkWithSearchParams = ({ to, ...props }) => {
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();
  const linkTo = search ? `${to}?${search}` : to;

  return <Link to={linkTo} {...props} />;
};

export default LinkWithSearchParams;
