import React from "react";
import { Link } from "react-router-dom";
import style from "./cards.module.css";

export default function Card({ carditem }) {
  return (
    <Link to={`/${carditem.title.toLowerCase()}`}>
      <div className={style.Card}>
        <div className={style.ImageContainer}>
          <img
            className={style.Cardimg}
            alt={carditem.title}
            src={carditem.image.url}
          />
        </div>
        <div className={style.cardDescription}>
          <p className={style.title}>{carditem.title}</p>
          <p className={style.description}>{carditem.description}</p>
        </div>
      </div>
    </Link>
  );
}
