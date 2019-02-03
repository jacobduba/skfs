import React from 'react';
import PostSnippet from './PostSnippet';

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
    return (
      <div className="good-container">
          {this.state.timeline.map(post =>
            <PostSnippet post={post} user={this.props.user} />
          )}
      </div>
    )
  }
}

export default Timeline;
