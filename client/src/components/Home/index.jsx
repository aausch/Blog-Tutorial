import React from 'react';
import axios from 'axios';
import moment from 'moment';

import FontAwesome from 'react-fontawesome';
import {PopupTable, PopupMenu} from 'react-rectangle-popup-menu';
import { connect } from 'react-redux';

import { Form } from '../../components/Article';



class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      articleToSend: null,
      usersList: [],
    }

    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    const { onLoad } = this.props;

    axios('http://localhost:8000/api/articles')
      .then((res) => onLoad(res.data));
    axios('http://localhost:8000/api/users')
      .then((res) => {
        this.setState({usersList: res.data.users});
      });

  }

  handleDelete(id) {
    const { onDelete } = this.props;

    return axios.delete(`http://localhost:8000/api/articles/${id}`)
      .then(() => onDelete(id));
  }

  handleView(id) {
    window.open(`/view/${id}`);
  }

  handleSendEmail(id, email) {
    axios.post('http://localhost:8000/api/articles/sendmail', {
      id,
      email,
    });
  }

  handleEdit(article) {
    const { setEdit } = this.props;

    setEdit(article);
  }

  handleCopy(article) {
    const { onLoad } = this.props;
    const {title, body, author} = article;
    const copiedTitle = title + ' copy';

    return axios.post('http://localhost:8000/api/articles', {
      title: copiedTitle,
      body,
      author,
    })
      .then(() => axios('http://localhost:8000/api/articles'))
      .then((res) => onLoad(res.data)); // FIXME use setstate instead of refresh
  }

  handleShare(event) {
    const article_id = event.target.parentElement.dataset["articleId"];
    this.setState({
      articleToSend: article_id,
    });
  }

  closeUsers() {
    this.setState({ articleToSend: null});
  }

  renderUsers() {
    const {usersList} = this.state;
    return usersList.map(user => {
      debugger;
      return <div
        id={user._id}
        onClick={() =>
            this.handleSendEmail(this.state.articleToSend, user.email)} >
          {user.email}
        </div>;
    });
  }

  render() {
    const { articles } = this.props;

    return (
      <div className="container">
        <div className="row pt-5">
          <div className="col-12 col-lg-6 offset-lg-3">
            <h1 className="text-center">Article Editor Exercise</h1>
          </div>
          <Form />
        </div>
        <div className="row pt-5">
          <div className="col-12 col-lg-6 offset-lg-3">
            {articles.map((article) => {
              const shareButton = (
                <button onClick={(evt) => this.handleShare(evt)} className="btn btn-primary">
                  Share
                </button>);

              return (
                <div className="card my-3" key={article._id}>
                  <div className="card-header">
                    {article.title}
                  </div>
                  <div className="card-body">
                    {article.body}
                    <p className="mt-5 text-muted">author: <b>{article.author}</b> {moment(new Date(article.createdAt)).fromNow()}</p>
                  </div>


                  <div className="card-footer">
                    <div className="row" data-article-id={article._id} >
                      <button id={'view-' + article._id}
                        onClick={() => this.handleView(article._id)} className="btn btn-primary mx-2">
                        View
                      </button>
                      <button id={'edit-' + article._id}
                        onClick={() => this.handleEdit(article)} className="btn btn-primary mx-2">
                        Edit
                      </button>
                      <button id={'copy-' + article._id}
                        onClick={() => this.handleCopy(article)} className="btn btn-primary mx-2">
                        Copy
                      </button>
                      <button id={'delete-' + article._id}
                        onClick={() => this.handleDelete(article._id)} className="btn btn-danger mx-2">
                        Delete
                      </button>
                      {this.state.usersList.length > 0 &&
                        <PopupMenu className="mx-2" width={190} direction="bottom" button={shareButton}>
                          <PopupTable rowItems={this.state.usersList.length}>
                            {this.renderUsers()}
                          </PopupTable>
                        </PopupMenu>
                      }
                    </div>
                  </div>
                </div>
              )
            })}
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
  onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
  onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
  setEdit: article => dispatch({ type: 'SET_EDIT', article }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
