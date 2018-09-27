import React from 'react';
import axios from 'axios';
import moment from 'moment';
import queryString from 'query-string'
import { connect } from 'react-redux';

class Viewer extends React.Component {
  constructor(props) {
    super(props);
  }

  trackViewed(id, email) {
    axios.post('http://localhost:8000/api/articles/recordviewed', {
      id,
      email,
    });
  }

  componentDidMount() {
    const { onLoad } = this.props;

    axios('http://localhost:8000/api/articles')
      .then((res) => onLoad(res.data));
  }

  render() {
    const { articles, match, onViewed } = this.props;

    const article = articles.filter((article) => article._id === match.params.id)[0];
    const values = queryString.parse(this.props.location.search);

    if (article && values.read_by){
      this.trackViewed(article._id, values.read_by);
    }

    return (
      <div className="container">
        <div className="row pt-5">
          <div className="col-12 col-lg-6 offset-lg-3">
            <h1 className="text-center">Article Viewer</h1>
          </div>
        </div>
        <div className="row pt-5">
          <div className="col-12 col-lg-6 offset-lg-3">
            {article &&
              <div className="card my-3" key="{article._id}">
                <div className="card-header">
                  {article.title}
                </div>
                <div className="card-body">
                  {article.body}
                  <p className="mt-5 text-muted"><b>author: {article.author}</b> {moment(new Date(article.createdAt)).fromNow()}</p>
                </div>
              </div>
            }
          </div>
      </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  articles: state.home.articles,
});

const mapDispatchToProps = dispatch => ({
  onLoad: data => dispatch({ type: 'VIEWER_LOADED', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);
