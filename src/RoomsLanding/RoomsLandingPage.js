import React, { useCallback, useState } from "react";
import style from "./RoomsLandingPage.module.css";
import logo from "../assets/logo-icon.svg";
import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { RoomDetails, timing, BOOKINGS_QUERY } from "../Queries";
import {
  isTimeSlotPast,
  isTimeSlotBooked,
  getBookedby,
} from "../helpers/helpers";

export default function RoomsLandingPage() {
  const navigate = useNavigate();
  const [bookedArray, setBookedArray] = useState([]);
  const [formState, setFormState] = useState({
    time: "",
    team: "",
    date: new Date().toISOString().split("T")[0],
    roomId: "",
  });
  const [booking, setBooking] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [bookedby, setBookedby] = useState("");

  const handleRoomClick = useCallback((name, room) => {
    navigate(`/room/${name}`, { state: room });
  }, []);

  const { loading, error, data } = useQuery(RoomDetails);
  const { loading: loading2, error: error2, data: data2 } = useQuery(timing);

  const {
    loading: loading3,
    error: error3,
    data: data3,
    refetch,
  } = useQuery(BOOKINGS_QUERY, {
    variables: { date: formState.date, roomId: formState.roomId },
    onCompleted: (data) => {
      setBookedArray(data.bookings);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;
  console.log("Hello from rooms data", data.rooms);
  if (loading2) return <p>Loading...</p>;
  if (error2) console.log("ERROR CODE", error2.networkError);
  const timings = data2.timings[0].timings;
  if (loading3) return <p>Loading...</p>;
  if (error3) console.log("ERROR CODE", error2.networkError);

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
        {data.rooms.map((element) => {
          return (
            <div
              className={style.roomCards}
              onClick={() => {
                handleRoomClick(element.name, element);
              }}
            >
              <div className={style.imageContainer}>
                <img
                  className={style.image}
                  src={element.image.url}
                  alt="room alternate"
                ></img>
              </div>
              <div className={style.description}>
                <div className={style.topContainer}>
                  <div className={style.roomName}>
                    <span class="material-symbols-outlined">badge</span>
                    {element.name}
                  </div>
                  <div className={style.roomDetails}>
                    <div className={style.roomName}>
                      <span class="material-symbols-outlined">person</span>
                      {element.occupants}
                    </div>
                  </div>
                </div>
                <div style={{ width: "50%" }}>
                  <div className={style.availableTimeContainer}>
                    {timings.map((timeSlot) => {
                      const isBooked = isTimeSlotBooked(
                        timeSlot.time,
                        element.id,
                        bookedArray
                      );
                      const isPast = isTimeSlotPast(
                        timeSlot.time,
                        formState.date
                      );
                      const isDisabled = isBooked || isPast;

                      return (
                        <button
                          key={timeSlot.time}
                          className={`${style.timeslot} ${
                            isPast ? style.disabledButton : ""
                          }${isBooked ? style.bookedbutton : ""} ${
                            booking === timeSlot.time ? style.activeButton : ""
                          }`}
                          onClick={() => {
                            if (!isDisabled) {
                              setFormVisible(true);
                              setBookedby("");
                              setBooking(timeSlot.time);
                              setFormState((prevState) => ({
                                ...prevState,
                                time: timeSlot.time,
                              }));
                              console.log(
                                `Booking time set to: ${timeSlot.time}`
                              );
                            } else if (isBooked) {
                              setBookedby("");

                              getBookedby(
                                formState.date,
                                timeSlot.time,
                                bookedArray,
                                setBookedby
                              );
                            }
                          }}
                        >
                          {timeSlot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
