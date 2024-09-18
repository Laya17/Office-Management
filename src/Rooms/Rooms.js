import React, { useEffect, useState } from "react";
import style from "./Rooms.module.css";
import RoomCard from "./RoomCards/RoomCards";
import { gql, useQuery } from "@apollo/client";
import BookingForm from "./BookingForm/BookingForm";

const query = gql`
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

export default function Rooms() {
  const [formState, setFormState] = useState({
    time: "",
    team: "",
    date: new Date().toISOString().split("T")[0],
    roomId: "",
  });

  const { loading, error, data } = useQuery(query);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className={style.roomsPage}>
      <input
        className={style.dateContainer}
        value={formState.date}
        type="date"
        name="date"
        placeholder={formState.date}
        onChange={handleInputChange}
      ></input>

      {/* <a href="https://superopsalpha.com?src=pax" target="_blank">
        Superops
      </a> */}
      {data.rooms.map((room) => {
        return (
          <RoomCard
            room={room}
            formState={formState}
            setFormState={setFormState}
            roomId={formState.roomId}
          />
        );
      })}
    </div>
  );
}
