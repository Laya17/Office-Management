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
  //     const currentTime = new Date().toLocaleTimeString([], {
  //       hour: "2-digit",
  //     });
  //     var curr = currentTime.split(" ")[0] + " 00 PM";
  //     // console.log("Time", curr);
  //     const sorted = [...data.rooms].sort((roomA, roomB) => {
  //       const isRoomABookedNow = isTimeSlotBooked(curr, roomA.id, data.rooms);
  //       const isRoomBBookedNow = isTimeSlotBooked(curr, roomB.id, data.rooms);
  //       console.log("bookedArray", data.rooms);
  //       console.log("Room A?", isRoomABookedNow, "Room B", isRoomBBookedNow);
  //       if (!isRoomABookedNow && isRoomBBookedNow) return -1;
  //       if (isRoomABookedNow && !isRoomBBookedNow) return 1;
  //       return 0;
  //     });
  //     setSortedRooms(sorted);
  //   }
  // }, [data]);

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
          />
        ))}
      </div>
    </div>
  );
}
