import React from "react";
import { StyleSheet, css } from "aphrodite";
import Avatar from "@material-ui/core/Avatar";

import "./App.css";

import { cities } from "./globals.js";
import NextButton from "./nextButton.js";
import Likes from "./likes.js";

// ES Modules syntax
import Unsplash from "unsplash-js";
const unsplash = new Unsplash({
  applicationId:
    "788b5f9b52c7e5b5ce51de9108719f0b4be68d7ba2f74dc3fbd270e2df7f9a56",
  secret: "9e1f6bfa18fd3c1e5b2b9d28c9ffcd0e0d79672dd69454af7713f894254d81a8"
});

export default class CityGuess extends React.Component {
  state = {
    cityObj: {}, //City Object that holds city information
    userAnswer: "", //User's guess
    selected: -1 //Index of user's guess
  };

  /**
   * getRandomCity() selects a photo in a random city with its meta data.
   * Pulls data from API by searching a random city.
   * RETURN: Populated Random City Object
   */
  getRandomCity = function() {
    var city = {};

    //Radomly select an index from cities array and choose random city
    let randomCityIndex = Math.floor(Math.random() * Math.floor(cities.length));
    let randomCity = cities[randomCityIndex];

    //Variables to accessed by thenables below.
    var photoIndex;
    var selectedPhoto;
    var guessMap = this.randomizeGuess(randomCityIndex);

    //Request photos of random city from Unsplash through search query
    return unsplash.search
      .photos(`${randomCity} city`, 1)
      .then((response, err) => {
        if (err) console.log(err);
        return response.json();
      })
      .then((jsonResponse, err) => {
        if (err) console.log(err);
        if (!jsonResponse.results.length) Promise.reject("Error");
        //Select a random photo from results
        photoIndex = Math.floor(Math.random() * Math.floor(10));
        selectedPhoto = jsonResponse.results[photoIndex];
        //Get more details of the selected photo
        return unsplash.photos.getPhoto(selectedPhoto.id);
      })
      .then((result, err) => {
        if (err) console.log(err);
        return result.json();
      })
      .then((json, err) => {
        if (err) console.log(err);

        city = {
          url: json.urls.regular,
          location: json.location,
          title: json.location.title,
          likes: json.likes,
          userName: json.user.name,
          userSocial: json.user.username,
          userAvatar: json.user.profile_image.large,
          correctGuess: randomCity,
          guesses: guessMap
        };

        //Return city object populated by API searches
        return city;
      });
  };

  /**
   * randomizeGuess() creates an array of random cities to guess from, including the correct answer
   * Uses data from existing cities array
   * PARAMS: Index of the correct city (cities array)
   * RETURN: A shuffled array of cities (4 elements)
   */
  randomizeGuess = cityIndex => {
    var result = [];

    //Make a copy of cities to prevent destruction
    let tempCities = [...cities];

    //Push correct answer onto resulting array and remove from temp array.
    result.push(cities[cityIndex]);
    tempCities.splice(cityIndex, 1);

    //Choose three random cities and push onto resulting array, then remove from temp array
    for (var i = 0; i < 3; i++) {
      let index = Math.floor(Math.random() * tempCities.length);
      result.push(tempCities[index]);
      tempCities.splice(index, 1);
    }

    //Return a shuffled array.
    return result.sort(() => 0.5 - Math.random());
  };

  /**
   * getNextCity() Handles the trigger to pull information for a new city
   * Calls getRandomCity() to get information of new city
   * Resets userAnswer and Selected states to reset style
   */
  getNextCity() {
    this.getRandomCity().then(result => {
      this.setState({ cityObj: result, userAnswer: "", selected: -1 });
    });
  }

  /**
   * _userSelect() Handles the event when a user chooses and answer
   * Sets "selected" and "userAnswer" state
   * PARAMS: Index: Index of chosen answer, used to identify an answer has been selected and styling
   * PARAMS: Answer: String value of chosen answer, used to compare user selection with string of correct answer
   */
  _userSelect = (index, answer) => {
    this.setState({ selected: index, userAnswer: answer });
  };

  componentDidMount() {
    //Initial random city
    this.getNextCity();
  }


  render() {

    //Wait until guess options are available
    if (this.state.cityObj.guesses) {
      //Map each guess option into a List Item  
      var guessList = this.state.cityObj.guesses.map((x, i) => (
        <li
          onClick={() => {
            this._userSelect(i, x);
          }}
          key={i}
          className={
            //Assign selected style if selected index matches list index
            this.state.selected === i
              ? css(styles.selectedListStyle)
              : css(styles.listStyle)
          }
        >
          {x} 
        </li>
      ));
    }

    //Answer(): Revelation of answer section, shown only when a guess has been made.
    var answer = () => {
      //Check if a guess has been selected  
      if (this.state.selected > -1) {
        
        //Handle CORRECT Answer: Check value of selected answer equals to correct answer
        if (this.state.userAnswer === this.state.cityObj.correctGuess) {
          return (
            <div>
              <div className={css(styles.questionTextStyle)}>Correct!</div>
              {next()} 
            </div>
          );

        //Handle INCORRECT Answer
        } else {
          return (
            <div>
              <div className={css(styles.questionTextStyle)}>Incorrect!</div>
              <div className={css(styles.bodyTextStyle)}>
                Answer: {this.state.cityObj.correctGuess}
              </div>
              {next()}
            </div>
          );
        }
      } else {
        return <div />;
      }
    };

    //next(): Reveals Next Button, called by answer()
    var next = () => {
        return(
            <div style={{marginTop: "1vw"}}>
            <div className={css(styles.bodyTextStyle)}>
                {this.state.cityObj.userName} took this picture in{" "}
                {this.state.cityObj.title}
              </div>
              <NextButton
                press={() => {
                  this.getNextCity(this.bind);
                }}
              />
              </div>
        )
    }

    return (
      <div className={css(styles.mainWrapper)}>
        <div className={css(styles.leftWrapper)}>
          <div className={css(styles.questionWrapper)}>
            <div className={css(styles.questionTextStyle)}>
              Where was this picture taken?
            </div>
            <ul style={{ listStyleType: "none", padding: 0 }}>{guessList}</ul>
          </div>
          <div className={css(styles.answerWrapper)}>{answer()}</div>
        </div>
        <div className={css(styles.rightWrapper)}>
          <div className={css(styles.rightUserRow)}>
            <div className={css(styles.userWrapper)}>
              <div>
                <Avatar src={this.state.cityObj.userAvatar} />
              </div>
              <div className={css(styles.userNameAndSocialWrapper)}>
                <div className={css(styles.userNameTextStyle)}>
                  <a
                    className="userName"
                    href={`https://unsplash.com/@${
                      this.state.cityObj.userSocial
                    }`}
                  >
                    {" "}
                    {this.state.cityObj.userName}{" "}
                  </a>
                </div>
                <div className={css(styles.userSocialTextStyle)}>
                  <a
                    className="userName"
                    href={`https://unsplash.com/@${
                      this.state.cityObj.userSocial
                    }`}
                  >
                    {" "}
                    @{this.state.cityObj.userSocial}{" "}
                  </a>
                </div>
              </div>
            </div>
            <div className={css(styles.userWrapper)}>
              <Likes number={this.state.cityObj.likes} />
            </div>
          </div>
          <div className={css(styles.rightImageRow)}>
            <img
              className={css(styles.imageStyle)}
              src={this.state.cityObj.url}
              alt=""
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    display: "flex",
    maxWidth: "100vw",
    maxHeight: "100vh",
    minWidth: "100vw",
    minHeight: "100vh",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  bodyTextStyle: {
    textAlign: "center",
    fontFamily: "Nunito Sans"
  },
  leftWrapper: {
    display: "flex",
    flexDirection: "column",
    flex: 3,
    maxWidth: "30vw",
    maxHeight: "100vh",
    minHeight: "100vh"
  },
  userWrapper: {
    display: "flex",
    flexDirection: "row",
    marginTop: "2.5vh",
    marginRight: "2.5vw",
    marginBottom: "2.5vh"
  },
  rightUserRow: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "65vw",
    flex: 1
  },
  listStyle: {
    listStyleType: "none",
    padding: 0,
    marginBottom: "2vh",
    fontSize: "1.25em",
    fontFamily: "Nunito Sans",
    textAlign: "center",
    ":hover": {
      fontSize: "1.75em",
      fontWeight: "bold"
    }
  },
  selectedListStyle: {
    listStyleType: "none",
    padding: 0,
    marginBottom: "2vh",
    fontSize: "1.75em",
    fontFamily: "Nunito Sans",
    textAlign: "center",
    fontWeight: "bold"
  },
  rightImageRow: {
    display: "flex",
    flex: 9,
    marginRight: "5vw",
    justifyContent: "center"
  },

  userNameAndSocialWrapper: {
    marginLeft: "1vw"
  },
  userNameTextStyle: {
    fontFamily: "Nunito Sans",
    fontWeight: "bold"
  },
  userSocialTextStyle: {
    fontFamily: "Nunito Sans",
    fontSize: "0.8em"
  },
  questionTextStyle: {
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Nunito Sans",
    fontSize: "1.35em"
  },
  titleTextStyle: {
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Merriweather",
    fontSize: "1.75em"
  },

  questionWrapper: {
    display: "flex",
    flexDirection: "column",
    marginTop: "2.5vh",
    marginRight: "2.5vw",
    marginBottom: "2.5vh",
    marginLeft: "2.5vw"
  },

  answerWrapper: {
    display: "flex",
    flexDirection: "column",
    marginTop: "5vh",
    marginRight: "2.5vw",
    marginLeft: "2.5vw"
  },

  rightWrapper: {
    display: "flex",
    flexDirection: "column",
    flex: 7,
    maxWidth: "70vw"
  },
  imageStyle: {
    display: "flex",
    maxWidth: "65vw",
    maxHeight: "85vh",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)"
  }
});
