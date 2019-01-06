import React from 'react';
import Moment from 'react-moment';

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeline: []
    };
  }

  componentDidMount() {
    fetch('/api/v1/timeline')
      .then(res => res.json())
      .then(data => {
        this.setState({timeline: data});
      });
  }

  render() {
    return(
      <div className="main-timeline">
          {this.state.timeline.map(post =>
          <article className="media">
            <figure className="media-left">
              <div>
                <p>{post.likes.length}</p>
                <i class="fa like-heart fa-heart-o" aria-hidden="true"></i>
              </div>
            </figure>
            <div className="media-content">
                <div className="content">
                  <p>
                  <a href={"/posts/" + post.id}>
                  <span className="media-title has-text-dark">{post.title}</span>
                  <span className="media-details has-text-grey-light">Posted by <a href={"/users/@" + post.user.username}>@{post.user.username}</a> <Moment fromNow>{post.date_created}</Moment></span>
                  </a>
                  </p>
                  <div className="media-options">
                    <ul>
                      <li>{post.comments.length} COMMENT{(post.comments.length === 1) ? '' : 'S'}</li>
                      <li>COPY</li>
                      <li>SHARE</li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>)}
      </div>
    )
  }
}

export default Timeline;
