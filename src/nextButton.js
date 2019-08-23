import React from 'react';
import {StyleSheet, css} from 'aphrodite'
import "./App.css";

export default class NextButton extends React.Component {

    render() {
        return (
            <div className={css(style.buttonWrapper)}>
                <div className={css(style.buttonTextStyle)}>NEXT CITY</div>
            </div>
        )
    }

} 

const style = StyleSheet.create({
    buttonWrapper: {
        display:'flex',
        flex: 1,
        width: '100%',
        height: '2vw',
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black",
        background: 'white',
        color: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '1vw',
        marginBottom: '2.5vw',
        ':hover': {
            background: 'black',
            color: 'white',
        }
    },
    buttonTextStyle: {
        fontFamily: 'Nunito Sans',
        fontWeight: 'bold',
    }
})