import React from 'react';
import Moment from 'react-moment';
import User from './User.js';
import Cookies from "universal-cookie";
import { BrowserRouter, Route, Link } from 'react-router-dom';

const cookies = new Cookies();

class PostSnippet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      liked: false,
      likeCounter: 0
    }
  }

  componentDidMount() {
    this.setState({ likeCounter: this.props.post.likes.length });
    if (this.props.user == undefined)
      return;
    for (var user of this.props.post.likes) {
      if (user.username == this.props.user.username) {
        this.setState({ liked: true });
      }
    }
  }

  onHeartClick() {
    if (this.state.liked == false) {
      fetch("/api/v1/posts/" + this.props.post.id + "/like", {
        method: "POST",
        body: JSON.stringify({
          token: cookies.get('token')
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then(res => {
          if (res.status == 200) {
            this.setState({ liked: !this.state.liked });
            this.setState({ likeCounter: this.state.likeCounter + 1 });
          }
        });
    } else if (this.state.liked == true) {
      fetch("/api/v1/posts/" + this.props.post.id + "/unlike", {
        method: "POST",
        body: JSON.stringify({
          token: cookies.get('token')
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then(res => {
          if (res.status == 200) {
            this.setState({ liked: !this.state.liked });
            this.setState({ likeCounter: this.state.likeCounter - 1 });
          }
        });
    }
  }

  render() {
    return (
      <article className="media">
        <figure className="media-left">
          <div>
            <p>{this.state.likeCounter}</p>
            <i className={this.state.liked ? "fa like-heart fa-heart" : "fa like-heart fa-heart-o"} onClick={this.onHeartClick.bind(this)} aria-hidden="true"></i>
          </div>
        </figure>
        <div className="media-content">
          <div className="content">
            <p>
              <Link to={"/posts/" + this.props.post.id}>
                <span className="media-title has-text-dark">{this.props.post.title}</span>
                <span className="media-details has-text-grey-light">Posted by <User user={this.props.post.user} /> <Moment fromNow>{this.props.post.date_created}</Moment></span>
              </Link>
            </p>
            <div className="media-options">
              <ul>
                <li>{this.props.post.comments.length} COMMENT{(this.props.post.comments.length === 1) ? '' : 'S'}</li>
                <li>LIKED BY</li>
                <li>SHARE</li>
              </ul>
            </div>
          </div>
        </div>
      </article>
    );
  }
}

export default PostSnippet;
