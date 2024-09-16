import React from "react";
import style from "./Feedcard.module.css";

export default function FeedCards({feed}){

    return(
        <div className={style.FeedCard}>
            <div> {feed.title}</div>
            <div>{feed.description}</div>
            <div>{feed.date}</div>
        </div>
    );
}