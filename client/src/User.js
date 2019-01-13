import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

function User(props) {
  return (
    <Link to={"/users/@" + props.user.username}>@{props.user.username}</Link>
  );
}

export default User;
