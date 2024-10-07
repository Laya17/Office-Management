import style from "./RoomsLandingPage.module.css";
import logo from "../assets/logo-icon.svg";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { RoomDetails } from "../Queries";

import RoomComponent from "./RoomComponent/RoomComponent";
import { isTimeSlotBooked } from "../helpers/helpers";

export default function RoomsLandingPage() {
  const { loading, error, data } = useQuery(RoomDetails);
  const [roomId, setRoomId] = useState();
  const [sortedRooms, setSortedRooms] = useState([]);
  const [bookingsByRoom, setBookingsByRoom] = useState({});

  const [formState, setFormState] = useState({
    time: [],
    team: "",
    date: new Date().toISOString().split("T")[0],
    roomId: "",
  });
  useEffect(() => {
    if (data) {
      setSortedRooms(data.rooms);
    }
  }, [data]);
  // useEffect(() => {
  //   if (data && data.rooms) {
  //     const currentTime = new Date();
  //     const hour = currentTime.getHours();
  //     const period = hour >= 12 ? "PM" : "AM";
  //     const curr = `${hour % 12 || 12}:00 ${period}`;

  //     const sorted = [...data.rooms].sort((roomA, roomB) => {
  //       const isRoomABookedNow = isTimeSlotBooked(
  //         curr,
  //         roomA.id,
  //         bookingsByRoom[roomA.id]
  //       );
  //       const isRoomBBookedNow = isTimeSlotBooked(
  //         curr,
  //         roomB.id,
  //         bookingsByRoom[roomB.id]
  //       );
  //       console.log(
  //         `Checking: ${roomA.name}  at ${curr}(Booked: ${isRoomABookedNow}) vs ${roomB.name}  at ${curr} (Booked: ${isRoomBBookedNow})    `
  //       );

  //       if (!isRoomABookedNow && isRoomBBookedNow) return -1;
  //       if (isRoomABookedNow && !isRoomBBookedNow) return 1;

  //       return roomA.id.localeCompare(roomB.id);
  //     });
  //     console.log("Sorted List ", sorted);
  //     setSortedRooms(sorted);
  //   }
  // }, [bookingsByRoom]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  console.log("Sorted Rooms Data:", sortedRooms);

  return (
    <div className={style.RoomsContainer}>
      <div className={style.header}>
        <div className={style.datePickerContainer}>
          <label htmlFor="date">Select Date: </label>
          <input
            className={style.dateContainer}
            type="date"
            name="date"
            value={formState.date}
            onChange={handleInputChange}
          />
        </div>
        <div className={style.textContent}>
          <div className={style.title}>SuperOps</div>
          <div className={style.subtitle}>Ramanujam IT Park</div>
        </div>
        <div className={style.logo}>
          <img className={style.imagelogo} src={logo} alt="SuperOps logo"></img>
        </div>
      </div>
      <div className={style.searchbarContainer}>
        <input className={style.searchbar} placeholder="Search" type="text" />
      </div>

      <div className={style.roomCardsContainer}>
        {sortedRooms.map((room) => (
          <RoomComponent
            data={data}
            room={room}
            roomId={roomId}
            setRoomId={setRoomId}
            sortedRooms={sortedRooms}
            setSortedRooms={setSortedRooms}
            formState={formState}
            setFormState={setFormState}
            bookingsByRoom={bookingsByRoom}
            setBookingsByRoom={setBookingsByRoom}
          />
        ))}
      </div>
    </div>
  );
}
