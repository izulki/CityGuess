import React from "react";
import { StyleSheet, css } from "aphrodite";
import "./App.css";
import LikeIcon from "./likeIcon";

import CountUp from "react-countup";

export default class Likes extends React.Component {
  state = { number: 0 };

  componentDidUpdate(prevProps) {
    if (this.props.number !== prevProps.number) {
      this.setState({ number: this.props.number });
    }
  }

  render() {
    console.log(this.props.number);
    return (
      <div className={css(style.likesWrapper)}>
        <CountUp
          className={css(style.likesNumber)}
          start={0}
          end={this.state.number}
          duration={2.75}
        />
        <div>
          {" "}
          <LikeIcon />{" "}
        </div>
      </div>
    );
  }
}

const style = StyleSheet.create({
  likesWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  likesNumber: {
    fontFamily: "Nunito Sans",
    fontWeight: "bold",
    marginRight: "0.5vw"
  },
  likesImg: {}
});
