import React from 'react';
import StarRatings from 'react-star-ratings';
import moment from 'moment';

const Comment = ({comment, title, rating, username, created}) => (
  <>
    <div className="row">
      <div className="columns">
        <div className="column">
          <h4 className="title is-4">{title} <span className="tag is-info is-light is-small is-rounded">Escrita por: {username}</span> <span className="tag is-info is-light is-small is-rounded">{moment(created).format('DD/MM/YYYY')}</span><br/> <StarRatings
            rating={rating}
            starDimension="18px"
            starSpacing="5px"
          /></h4>
          <p className="has-background-light user-comment">{comment}</p>
        </div>
      </div>
    </div>
    <hr/>
  </>
);

export default Comment;