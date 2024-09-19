import React, { useCallback, useState } from "react";
import style from "./RoomsLandingPage.module.css";
import logo from "../assets/logo-icon.svg";
import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const QUERY = gql`
  query {
    rooms {
      amenities
      image {
        url
      }
      name
      occupants
      location
      id
    }
  }
`;

export default function RoomsLandingPage() {
  const navigate = useNavigate();

  const handleRoomClick = useCallback((name, room) => {
    navigate(`/room/${name}`, { state: room });
  }, []);

  const { loading, error, data } = useQuery(QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;
  console.log(data);

  return (
    <div className={style.RoomsContainer}>
      <div className={style.header}>
        <div className={style.textContent}>
          <div className={style.title}>SuperOps</div>
          <div className={style.subtitle}>Ramanujam IT Park</div>
        </div>
        <div className={style.logo}>
          <img className={style.imagelogo} src={logo} alt="Superops logo"></img>
        </div>
      </div>
      <div className={style.searchbarContainer}>
        <input className={style.searchbar} placeholder="Search" type="text" />
      </div>

      <div className={style.roomCardsContainer}>
        {data.rooms.map((element) => (
          <div
            className={style.roomCards}
            onClick={() => handleRoomClick(element.name, element)}
          >
            <div className={style.imageContainer}>
              <img
                className={style.image}
                src={element.image.url}
                alt="room alternate"
              ></img>
            </div>
            <div className={style.description}>
              <div className={style.roomName}>{element.name}</div>
              <div className={style.roomDetails}>
                <div>{element.occupants}</div>
                <div>{element.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
