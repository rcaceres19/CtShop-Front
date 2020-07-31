import React from 'react';
import Comment from './comment';
import moment from 'moment';

const internals = {
  comment: '',
  comments: [],
  user: null,
  title: ''
}

class productComments extends React.Component {
  constructor(props){ 
    super(props);

    this.state = {
      loading: true,
      commentErrors: [],
      selectedRating: null,
      isButtonLoading: false,
      showSuccessMessage: false
    };

    this._handleCommentInputChange = this._handleCommentInputChange.bind(this);
    this._handleCommentButtonClick = this._handleCommentButtonClick.bind(this);
    this._handleRatingChange = this._handleRatingChange.bind(this);
  }
  
  async componentDidMount() {
    console.log(this.props.product);
    try{
      const commentsRequest = await this.props.firebase.db.ref(`/comments/${this.props.product}`).once('value');
      const userInfo = this.props.firebase.auth ? await this.props.firebase.db.ref(`/users/${this.props.firebase.auth.currentUser.uid}`).once('value') : null;
      const comments = commentsRequest.val();

      internals.comments = comments;
      internals.user = userInfo ? userInfo.val() :null;

      console.log(internals.comments);
      
    } catch(e) {
      console.log(e.message);
    } finally {
      this.setState({ loading: false });
    }
  }

  _handleCommentInputChange(e) {
    internals[e.target.name] = e.target.value;
  }

  _handleRatingChange(rating) {
    this.setState({selectedRating: rating});
  }

  async _handleCommentButtonClick() {
    try{
      const errors = [];
      this.setState({isButtonLoading: true, showSuccessMessage: false});
      
      if (internals.comment.trim() === '') {
        errors.push('El comentario no puede estar vacio');
      }

      if (internals.title.trim() === '') {
        errors.push('La reseña necesita un titulo');
      }

      if(this.state.selectedRating === null) {
        errors.push('Debes asignar un rating');
      }

      this.setState({commentErrors: errors});

      if (errors.length) return;

      const commentsRef = await this.props.firebase.db.ref(`/comments/${this.props.product}/${this.props.firebase.auth.currentUser.uid}/`);
      await commentsRef.set({
        comment: internals.comment,
        rating: this.state.selectedRating,
        username: internals.user.nombre,
        title: internals.title,
        created: moment().valueOf()
      });

      this.setState({showSuccessMessage: true});
    } catch(e) {
      console.log(e.message);
    } finally {
      this.setState({isButtonLoading: false});
    }
  }

  render() {
    return(
      <>
        <div className="columns is-centered">
          <div className="column">
            {this.state.loading === false && <>
              {this.state.commentErrors.length > 0 && <div className="tags">
                {this.state.commentErrors.map( error => <div className="tag is-danger">{error}</div>)}
              </div>}
              <p><b>Titulo:</b></p>
              <div class="field">
                <div class="control">
                  <input class="input is-primary" type="text" name="title" placeholder="Agrega un titulo" onChange={e => this._handleCommentInputChange(e)}/>
                </div>
              </div>
              <p><b>Agregar una Rese&ntilde;a:</b></p>
              <div class="field">
                <div class="control">
                  <textarea className="textarea is-primary" name="comment" onChange={e => this._handleCommentInputChange(e)}></textarea>
                </div>
              </div>
              <br/>
              <p><b>Como valoras este producto:</b></p>
              <br/>
              <div className="columns is-mobile">
                <div className="column">
                  <div className="buttons is-centered"><button onClick={ _ => this._handleRatingChange(1)} className={`button is-small ${this.state.selectedRating && this.state.selectedRating === 1 ? 'is-success' : 'is-light'} is-rounded`}><b>1</b></button></div>
                </div>
                <div className="column">
                  <div className="buttons is-centered"><button onClick={ _ => this._handleRatingChange(2)} className={`button is-small ${this.state.selectedRating && this.state.selectedRating === 2 ? 'is-success' : 'is-light'} is-rounded`}><b>2</b></button></div>
                </div>
                <div className="column">
                  <div className="buttons is-centered"><button onClick={ _ => this._handleRatingChange(3)} className={`button is-small ${this.state.selectedRating && this.state.selectedRating === 3 ? 'is-success' : 'is-light'} is-rounded`}><b>3</b></button></div>
                </div>
                <div className="column">
                  <div className="buttons is-centered"><button onClick={ _ => this._handleRatingChange(4)} className={`button is-small ${this.state.selectedRating && this.state.selectedRating === 4 ? 'is-success' : 'is-light'} is-rounded`}><b>4</b></button></div>
                </div>
                <div className="column">
                  <div className="buttons is-centered"><button onClick={ _ => this._handleRatingChange(5)} className={`button is-small ${this.state.selectedRating && this.state.selectedRating === 5 ? 'is-success' : 'is-light'} is-rounded`}><b>5</b></button></div>
                </div>
              </div>
              <hr/>
              <br/>
              {this.state.showSuccessMessage && <p className="is-success has-text-success has-text-centered">Rese&ntilde;a Enviada. <br/><br/></p>}
              {!this.props.firebase.auth.currentUser && this.state.loading === false && <p className="has-text-centered"><b>Debes iniciar sesi&oacute;n para enviar</b></p>}
              {this.props.firebase.auth.currentUser && <div className="buttons is-centered">
                <button className={`button is-info is-rounded is-light ${this.state.isButtonLoading ? 'is-loading' : ''}`} onClick={this._handleCommentButtonClick}><b>Agregar</b></button>
              </div>}
            </>}
          </div>
          <div className="column is-three-fifths">
            {this.state.loading === false  && !internals.comments && <p className="has-text-centered"><b>No hay rese&ntilde;as para este producto</b></p>}
            {this.state.loading === false && internals.comments && <>
              <h5 className="title is-3">Rese&ntilde;as</h5>
              <hr/>
              {Object.keys(internals.comments).map( key => <Comment {...internals.comments[key]}/>)}
            </>}
          </div>
          
        </div>
      </>
    );
  }
}

export default productComments;