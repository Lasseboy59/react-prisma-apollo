import React, { Component } from 'react';
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import { COURSE_FEED_QUERY } from './Courses'
import ErrorMessage from './ErrorMessage';
import Spinner from './Spinner/Spinner'

class CreateCourse extends Component {
  state = {
    name: '',
    description: ''
  };
  onChangeHandler = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };
  render() {
    const { name, description } = this.state;
    return (
      <Mutation mutation={CREATE_COURSE_MUTATION}
        onCompleted={() => this.props.history.push('/')}
        update={(cache, mutationResults) => {
          // fetch the courseFeed from the cache
          const { courseFeed } = cache.readQuery({
            query: COURSE_FEED_QUERY
          })
          // debugger;
          // update the courseFeed from the cche
          cache.writeQuery({
            query: COURSE_FEED_QUERY,
            data: { courseFeed: courseFeed.concat([mutationResults.data.createCourse]) }
          })
        }}
      >

        {(createCourse, { data, error, loading }) => {
          if (loading) return <Spinner />
          if (error) return <ErrorMessage error={error} />;
          return (
            <div className="container">
              <div className="card">
                <div className="card-title">
                </div>
                <div className="card-body">
                  <form onSubmit={async e => {
                    e.preventDefault()
                    await createCourse({
                      variables: {
                        name: this.state.name,
                        description: this.state.description
                      }
                    })
                  }}>
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Enter name"
                        value={name}
                        onChange={this.onChangeHandler}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        placeholder="Enter description"
                        rows="3"
                        value={description}
                        onChange={this.onChangeHandler}
                      />
                    </div>
                    <button type="submit" className="btn btn-outline-secondary btn-block">
                      Save
              </button>
                  </form>
                </div>
              </div>
            </div>
          )
        }
        }
      </Mutation>
    );
  }
}

const CREATE_COURSE_MUTATION = gql`
mutation createCourseNew($name: String!, $description: String!) {
  createCourse(name: $name, description: $description) {
    id
    name
    description
    isPublished
  }
}
`;
export default CreateCourse;