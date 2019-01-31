import React from 'react';
import Moment from 'react-moment';
import User from './User.js';
import ContentEditable from 'react-contenteditable';

class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      post: null,
      comment: null
    };
  }

  componentWillMount() {
    fetch('/api/v1/posts/' + this.props.match.params.id)
      .then(res => res.json())
      .then(data => {
        this.setState({
          post: data
        });
      });
  }

  handleChange = (evt) => {
    this.setState({comment: evt.target.value});
    if (evt.target.value.includes("<br>")) {
      this.setState({comment: ""});
    }
  };

  render() {
    if (this.state.post == null)
      return(<span />);
    return(
     <div className="good-container">
      <div className="post">
        <article className="media">
            <figure className="media-left">
              <div>
                <p>{this.state.post.likes.length}</p>
                <i class="fa like-heart fa-heart-o" aria-hidden="true"></i>
              </div>
            </figure>
            <div className="media-content">
                <div className="content">
                  <p>
                  <span className="media-title has-text-dark">{this.state.post.title}</span>
                  <span className="media-details has-text-grey-light">Posted by <User user={this.state.post.user} /> <Moment fromNow>{this.state.post.date_created}</Moment></span>
                  </p>
                  <div className="media-options">
                    <ul>
                      <li>{this.state.post.comments.length} COMMENT{(this.state.post.comments.length === 1) ? '' : 'S'}</li>
                      <li>LIKED BY</li>
                      <li>SHARE</li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>
            <article className="media">
              <p className="content">{this.state.post.content}</p>
            </article>
        </div>

        <div className="comment-box">
          <article className="media">
            <div className="media-content">
              <div className="content">
                <div className="write-comment">
                  <div className="a-textarea this-is-the-comment">
                    <ContentEditable html={this.state.comment} data-text="Write your comment here..." onChange={this.handleChange} />
                  </div>
                </div>
              </div>
            </div>
          </article>

          {this.state.post.comments.map(comment =>
            <article className="media">
              <div className="media-content">
                <div className="content">
                  <p>
                  <span className="comment-info has-text-grey"><User user={comment.user}>comment.user.username}</User> <Moment fromNow>{comment.date_created}</Moment></span><br />
                  <span className="comment-content">{comment.comment}</span><br />
                  </p>
                  <div className="comment-options has-text-grey">
                    <ul>
                      <li><a>REPLY</a></li>
                      <li><a>SHARE</a></li>
                    </ul>
                  </div>
                </div>
                {comment.replies.length !== 0 && <div className="reply">
                  {comment.replies.map(reply =>
                  <article className="media">
                    <div className="media-content">
                      <div className="content">
                        <p>
                        <span className="reply-info has-text-grey"><User user={reply.user}>comment.user.username}</User> <Moment fromNow>{reply.date_created}</Moment></span><br />
                        <span className="reply-content">{reply.reply}</span><br />
                        </p>
                        <div className="reply-options has-text-grey">
                          <ul>
                            <li><a>REPLY</a></li>
                            <li><a>SHARE</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </article>
                  )}
                </div>}
              </div>
            </article>
          )}
        </div>
     </div>
    );
  }
}

export default Post;
