import React, {Component} from "react";
import {Card, CardBody} from "mdbreact"
import {Feed, Icon} from 'semantic-ui-react';
import profile from '../../daniel.jpg';
import axios from 'axios';
import FadeIn from 'react-fade-in';
import './TweetComponent.css';
import {Link} from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../../LoadingGif.gif';
import shallowCompare from 'react-addons-shallow-compare';


//load another component
import ModalTwitt from '../Modal/Modal_Detail_Twitt/Modal_Twitt';
import ModalDelete from '../Modal/Modal_Delete/Modal_Delete';

import openSocket from 'socket.io-client';

// Ini yang nge buat dia connect sama si backend nya
const socket = openSocket('http://10.183.28.153:8000');

const Timestamp = require('react-timestamp');

class TweetComponent extends Component {

    constructor() {
        super();
        this.state = {
            likes: null,
            tweet: [],
            tweetCounter: '',
            userId: '',
            likeId: '',
            modalTweet: false,
            modalDelete: false,
            checkLikes: false,
            black: "blackColor"
        };
        this.openModalDelete = this.openModalDelete.bind(this);
        this.setProfileImage = this.setProfileImage.bind(this);
        this.viewUserProfile = this.viewUserProfile.bind(this);
        this.buttonDelete = this.buttonDelete.bind(this);
        this.openModalTweet = this.openModalTweet.bind(this);
        this.closeModalTweet = this.closeModalTweet.bind(this);
        this.closeModalDelete = this.closeModalDelete.bind(this);
        this.onClickedImage = this.onClickedImage.bind(this);
    }

    componentDidMount(){
        this.setState({
          tweet: this.props.tweet,
          likes:this.props.tweet.likes
        })
        this.getLikeData();
        console.log(this.props.tweet._id+'like');

        // Untuk Like
        socket.on(this.props.tweet._id+'like' , bebas => {
          this.setState({
            likes: this.state.likes.concat(bebas.userId)
          })
          this.likeIkonColor();
        })

        //  Untuk UNLIKE
        socket.on(this.props.tweet._id+"unlike", bebas => {
            let likeList = []
            for(var unlike in this.state.likes){
                if(this.state.likes[unlike] != bebas.userId){
                    likeList.push(this.state.likes[unlike])
                }
            }
            this.setState({
                likes:likeList
            })
            this.likeIkonColor();
        })
        this.likeIkonColor();
    }

    getLikeData() {
        const url = '/api/tweet/tweets';
            fetch(url, {
                method: 'GET',
            }).then(res => res.json())
            .then(response =>
                this.setState({
                  stateLikeData: response[0].likes.length
                })
            )
            .catch(error => console.error('Error:', error));
    }

    // changeColor(){
    //     this.setState({black: !this.state.black})
    // }

    onClickedImage(userId, username){

        if (this.props.located === "profile") {

        }
        else{
            if(this.props.userId === userId){
                this.props.history.push({
                    pathname: `/home/myProfile/${username}`.replace(' ', ''),
                })
            }
            else {
                this.props.history.push({
                    pathname: `/home/profile/${username}`.replace(' ', ''),
                    state: {
                        userId: userId
                    }
                })
            }
        }
    }

    setProfileImage(profilePicture, userId, username) {
        let imageUrl = profilePicture;

        if (imageUrl) {
            return (
                <img alt=" "
                     src={require(`../../uploads/${imageUrl}`)}
                     id="profilePictureTweet"
                     onClick={() => this.onClickedImage(userId, username)}
                />
            );
        }
        else {
            return (
                <img alt=" "
                     src={profile}
                     id="profilePictureTweet"
                     onClick={() => this.onClickedImage(userId, username)}
                />
            );
        }
    }

    viewUserProfile(username, userId) {
      // console.log("Func ViewUserPRofile ", username);
      // console.log("Func ViewUserPRofile ", userId);
      //   console.log('this.props.located ',this.props.located);
        if (this.props.located === "home") {
            //Jika id di container sam dengan yang login sekarang akan ke page "My Profile"
            if(userId === this.props.userId){
                return (
                    <Link to={{
                        pathname: `/home/myProfile/${username}`.replace(' ', ''),
                    }}>
                        <div>
                            <Feed.Summary content={username}/>
                        </div>
                    </Link>
                );
            }
            else{
                return (
                    <Link to={{
                        pathname: `/home/profile/${username}`.replace(' ', ''),
                        state: {
                            userId: userId
                        }
                    }}>
                        <div>
                            <Feed.Summary content={username}/>
                        </div>
                    </Link>
                );
            }
        }

        else if (this.props.located === "profile") {
            return (
                <div>
                    <Feed.Summary content={username}/>
                </div>
            );
        }
    }

    buttonDelete(userId, tweetId) {
        if (userId === this.props.userId) {
            return (
                <Icon
                    size='large' name='trash'
                    id="recycleIcon"
                    onClick={() => this.openModalDelete(tweetId)}
                />
            );
        }
    }

    openModalTweet(tweetId) {
        axios.get('/api/tweet/tweet/' + tweetId)
            .then(res => {
                this.setState({
                    tweet: res.data,
                    modalTweet: true
                });
            });
    }

    openModalDelete(tweetId) {
        axios.get('/api/tweet/tweet/' + tweetId)
            .then(res => {
                this.setState({
                    tweet: res.data,
                    modalDelete: true
                });
            });
    }

    closeModalTweet(isOpen) {
        if (isOpen) {
            this.setState({
                modalTweet: false
            })
        }
    }

    closeModalDelete(isOpen) {
        if (isOpen) {
            this.setState({
                modalDelete: false
            })
        }
    }

    clickLikeButton(userId, tweetId){
        const likeData = {
            userId: this.props.userId,
            tweetId: this.props.tweet._id
        };
        console.log(this.state.tweet);
        const tweetLikesLength = this.state.likes;
        const checkValidID = tweetLikesLength.includes(userId);
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
        // Udabener ini
        if(checkValidID){
          console.log('UNLIKE');
                  axios({
                      method: 'PUT',
                      responseType: 'json',
                      url: `/api/tweet/unlikeTweet/` + this.state.tweet._id,
                      data: likeData
                  })
                  .then(res => {
                      this.setState({
                          checkLikes: false,
                          black: true
                      });
                      socket.emit('unlike', likeData)
                  })
        }
        else{
          console.log('LIKE');
                  axios({
                      method: 'PUT',
                      responseType: 'json',
                      url: `/api/tweet/likeTweet/` + this.state.tweet._id,
                      data: likeData
                  })
                  .then(res => {
                      this.setState({
                          checkLikes: true,
                          black: false
                      });
                      socket.emit('sendLike', likeData)
                  })
        }

    }

    likeIkonColor(){
      if(this.state.likes === null){
          if(this.props.tweet.likes.includes(this.props.userId)){
            // IF yang ini, cek kondisi skrg, kalo [] mengadung, maka warna nya merah
              this.setState({
                black:"redColor"
              })
          }
          else{
              this.setState({
                black:"blackColor"
              })
          }
      }
      else{
          if(this.state.likes.includes(this.props.userId)){
            // Ini cek state likes nya mengandung id dia ga atau ada ga id dia di sana?
              this.setState({
                black:"redColor"
              })
          }
          else{
              this.setState({
                black:"blackColor"
              })
          }
      }
    }

    render() {
      const tweet = this.props.tweet;
      return (
      <div id="scrollableDiv" style={{ overflow: "auto" }}>
            <Card className="Tweet_Container" id="text-warp" key={tweet._id}>
                <CardBody className="Tweet">
                    <Feed>
                        <Feed.Event>
                            <Feed.Label style={{width: "60px", padding: "8px 0"}}>
                                {this.setProfileImage(tweet.profilePicture, tweet.userId, tweet.username)}

                            </Feed.Label>
                            <Feed.Content className="Tweet-Content">

                                {this.viewUserProfile(tweet.username, tweet.userId)}

                                <Feed.Extra onClick={() => this.openModalTweet(tweet._id)} id="tweetText" text content={tweet.tweetText}/> <br/>

                                <Feed.Date onClick={() => this.openModalTweet(tweet._id)} id="tweetText" content={<Timestamp time={tweet.timestamp} precision={1}/>}/>

                                <div className="buttonGroup">
                                    <Icon.Group className={this.state.black} >
                                        <Icon name='like'
                                        onClick={() => this.clickLikeButton(this.props.userId, this.props.tweetId)}> {!this.state.likes ?
                                          tweet.likes.length
                                            :
                                          this.state.likes.length
                                        } likes</Icon>
                                    </Icon.Group>
                                    <Icon.Group className="commentsIcon">
                                        {" "}<Icon name='comments'/> {" "} 0 Comments
                                    </Icon.Group>
                                </div>

                            </Feed.Content>

                            <Feed.Label className="Tweet-Delete">
                                {this.buttonDelete(tweet.userId, tweet._id)}
                            </Feed.Label>

                        </Feed.Event>
                    </Feed>
                </CardBody>
            </Card>
            <ModalTwitt
                            isOpen={this.state.modalTweet}
                            tweet={this.state.tweet}
                            isClose={this.closeModalTweet}
                            profilePicture={this.props.profilePicture}
                        />

                        <ModalDelete
                            isOpen={this.state.modalDelete}
                            tweet={this.state.tweet}
                            isClose={this.closeModalDelete}
                        />
      </div>
    );
  }
}

export default TweetComponent;