import React from "react";
import { StyleSheet, css } from "aphrodite";

import { cities } from "./globals.js";
import Avatar from "@material-ui/core/Avatar";

import "./App.css";

// ES Modules syntax
import Unsplash from "unsplash-js";

const unsplash = new Unsplash({
  applicationId:
    "788b5f9b52c7e5b5ce51de9108719f0b4be68d7ba2f74dc3fbd270e2df7f9a56",
  secret: "9e1f6bfa18fd3c1e5b2b9d28c9ffcd0e0d79672dd69454af7713f894254d81a8"
});

export default class CityGuess extends React.Component {
  state = {
    cityObj: {}
  };

  randomizeGuess = cityIndex => {
    let tempCities = cities;
    var result = [];
    result.push(cities[cityIndex]);
    tempCities.splice(cityIndex, 1);
    for (var i = 0; i < 3; i++) {
      let index = Math.floor(Math.random() * tempCities.length);
      result.push(tempCities[index]);
      tempCities.splice(index, 1);
    }

    result.sort(() => 0.5 - Math.random());

    return result.map(x => (
      <li
        style={{
          listStyleType: "none",
          padding: 0,
          marginBottom: "2vh",
          fontSize: "1.25em",
          fontFamily: "Nunito Sans",
          textAlign: "center"
        }}
      >
        {x}
      </li>
    ));
  };

  getRandomCity = function() {
    var city = {};
    //Radomly select an index from cities array and choose random city
    let randomCityIndex = Math.floor(Math.random() * Math.floor(cities.length));
    let randomCity = cities[randomCityIndex];
    var photoIndex;
    var selectedPhoto;
    var guessMap = this.randomizeGuess(randomCityIndex);

    //Request photos of random city from Unsplash through search query
    return unsplash.search
      .photos(randomCity, 1)
      .then(response => response.json())
      .then(jsonResponse => {
        //Select a random photo from results
        photoIndex = Math.floor(Math.random() * Math.floor(10));
        selectedPhoto = jsonResponse.results[photoIndex];
        //Get more details of the selected photo
        return unsplash.photos.getPhoto(selectedPhoto.id);
      })
      .then(result => result.json())
      .then(json => {
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
        return city;
      });
  };

  componentDidMount() {
    this.getRandomCity().then(result => {
      console.log(result.guesses, result);
      this.setState({ cityObj: result });
    });
  }

  render() {
    return (
      <div className={css(styles.mainWrapper)}>
        <div className={css(styles.leftWrapper)}>
          <div className={css(styles.questionWrapper)}>
            <div className={css(styles.questionTextStyle)}>
              Where this picture was taken?
            </div>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {this.state.cityObj.guesses}
            </ul>
          </div>
        </div>
        <div className={css(styles.rightWrapper)}>
            <div className={css(styles.rightUserRow)}>
                <div className={css(styles.userWrapper)}>
                <div>
                <Avatar src={this.state.cityObj.userAvatar} />
                </div>
                <div className={css(styles.userNameAndSocialWrapper)}>
                <div className={css(styles.userNameTextStyle)}>
                    {this.state.cityObj.userName}
                </div>
                <div className={css(styles.userSocialTextStyle)}>
                    @{this.state.cityObj.userSocial}
                </div>
                </div>
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
    marginBottom: "2.5vh",
  },
  rightUserRow: {
    display: "flex",
    flex: 1,
  },

  rightImageRow: {
    display: "flex",
    flex: 9,
    marginRight: '5vw',
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

  questionWrapper: {
    display: "flex",
    flexDirection: "column",
    marginTop: "2.5vh",
    marginRight: "2.5vw",
    marginBottom: "2.5vh",
    marginLeft: "2.5vw"
  },

  rightWrapper: {
    display: "flex",
    flexDirection: "column",
    flex: 7,
    maxWidth: "70vw",
    maxHeight: "100vh",
  },
  imageStyle: {
    display: "flex",
    maxWidth: '65vw',
    maxHeight: "85vh",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)"
  }
});
