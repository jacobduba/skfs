import React from 'react';
import Moment from 'react-moment';
import User from './User.js';
import PostSnippet from './PostSnippet.js';
import ContentEditable from 'react-contenteditable';
import Cookies from "universal-cookie";

const cookies = new Cookies();

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
      fetch ("/api/v1/posts/" + this.state.post.id + "/comment", {
        method: "POST",
        body: JSON.stringify({
          token: cookies.get('token'),
          comment: this.state.comment
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then(res => {
          if (res.status == 200) {
            console.log("hey! :)");
          }
        })
      this.setState({comment: ""});
      document.getElementById("terriblecode").blur();

    }
  };

  render() {
    if (this.state.post == null)
      return(<span />);
    return(
     <div className="good-container">
      <div className="post">

            <PostSnippet post={this.state.post} user={this.props.user}/>
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
                    <ContentEditable html={this.state.comment} data-text="Write your comment here..." id="terriblecode" onChange={this.handleChange} />
                  </div>
                  <button class="a-submit-button">
                    Ok
                  </button>
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
