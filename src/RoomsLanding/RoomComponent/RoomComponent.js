import style from "../RoomsLandingPage.module.css";
import {
  isTimeSlotPast,
  isTimeSlotBooked,
  getBookedby,
} from "../../helpers/helpers";
import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { timing, BOOKINGS_QUERY, CREATE_BOOKING, Publish } from "../../Queries";

export default function RoomComponent({
  data,
  room,
  roomId,
  setRoomId,
  bookingsByRoom,
  setBookingsByRoom,
  formState,
  setFormState,
}) {
  const [time, setTime] = useState("");
  const [booking, setBooking] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [bookedby, setBookedby] = useState("");
  const [tooltipTimeSlot, setTooltipTimeSlot] = useState(null); // New state to track the time slot for tooltip
  const [createBooking] = useMutation(CREATE_BOOKING);
  const [publishBooking] = useMutation(Publish);

  const { loading: loading2, error: error2, data: data2 } = useQuery(timing);

  const {
    loading: loading3,
    error: error3,
    data: bookingsData,
    refetch,
  } = useQuery(BOOKINGS_QUERY, {
    variables: { date: formState.date, roomId: room.id },
    onCompleted: (data) => {
      setBookingsByRoom((prevBookings) => ({
        ...prevBookings,
        [room.id]: data.bookings,
      }));
    },
  });

  useEffect(() => {
    if (room.id !== roomId) {
      setBooking([]);
    }
  }, [room.id, roomId, setFormState, time]);

  const handleChange = useCallback(async () => {
    try {
      const response = await refetch();
      setBookingsByRoom((prevBookings) => ({
        ...prevBookings,
        [room.id]: response.data.bookings,
      }));
    } catch (err) {
      console.error("REFETCH ERROR", err);
    }
  }, [refetch, room.id]);

  const handleClickOutside = (event) => {
    if (event.target.classList.contains(style.background)) {
      setFormVisible(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const pattern = /^[a-zA-Z0-9._%+-]+@superops\.com$/;
    if (!pattern.test(formState.team)) {
      window.alert("Invalid email");
      return;
    }

    setFormVisible(false);

    try {
      for (const time of formState.time) {
        const { data } = await createBooking({
          variables: {
            hours: 1,
            time: time,
            date: formState.date,
            bookingTeam: formState.team,
            roomId: formState.roomId,
          },
          awaitRefetchQueries: true,
        });

        await publishBooking({
          variables: { id: data.createBooking.id },
          awaitRefetchQueries: true,
        });

        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      setTimeout(() => {
        setBooking([]);
        handleChange();
      }, 500);
    } catch (error) {
      console.error("Error creating bookings:", error);
    }
  };

  function MultipleBookings(
    isBooked,
    isDisabled,
    timeSlot,
    booking,
    isSelected
  ) {
    setTime(timeSlot);
    if (roomId !== room.id) {
      setRoomId(room.id);
    }

    if (!isDisabled) {
      let updatedBooking;
      if (isSelected) {
        updatedBooking = booking.filter(
          (bookedTime) => bookedTime !== timeSlot
        );
      } else {
        updatedBooking = [...booking, timeSlot];
      }

      setBooking(updatedBooking);
      setFormState((prevState) => ({
        ...prevState,
        time: updatedBooking,
        roomId: room.id,
      }));
    } else if (isBooked) {
      setBookedby("");
      getBookedby(formState.date, timeSlot, bookedArray, setBookedby);
      setTooltipTimeSlot(timeSlot); // Set the time slot for tooltip
    }
  }

  if (loading2 || loading3) return <p>Loading...</p>;
  if (error2 || error3) console.error("ERROR", error2 || error3);

  const timings = data2.timings[0].timings;
  const bookedArray = bookingsByRoom[room.id] || [];

  return (
    <div style={{ display: "flex" }}>
      <div className={style.roomCards}>
        <div
          className={style.imageContainer}
          onClick={() => setFormVisible(true)}
        >
          <img
            className={style.image}
            src={room.image.url}
            alt="room image"
          ></img>
        </div>
        <div className={style.description}>
          <div className={style.topContainer}>
            <div className={style.roomName}>
              <span className="material-symbols-outlined">badge</span>
              {room.name}
            </div>
            <div className={style.roomDetails}>
              <div className={style.roomName}>
                <span className="material-symbols-outlined">person</span>
                {room.occupants}
              </div>
            </div>
          </div>
          <div className={style.availableTimeContainer}>
            {timings.map((timeSlot) => {
              const isBooked = isTimeSlotBooked(
                timeSlot.time,
                room.id,
                bookedArray
              );
              const isPast = isTimeSlotPast(timeSlot.time, formState.date);
              const isDisabled = isBooked || isPast;
              const isSelected = booking.includes(timeSlot.time);

              return (
                <div key={timeSlot.time} className={style.timeslotContainer}>
                  <button
                    className={`${style.timeslot} ${
                      isPast ? style.disabledButton : ""
                    } 
                      ${isBooked ? style.bookedbutton : ""} 
                      ${isSelected ? style.activeButton : ""}
                      ${style.tooltip}`}
                    onClick={() =>
                      MultipleBookings(
                        isBooked,
                        isDisabled,
                        timeSlot.time,
                        booking,
                        isSelected
                      )
                    }
                  >
                    {timeSlot.time}
                  </button>
                  {isBooked &&
                    tooltipTimeSlot === timeSlot.time &&
                    bookedby && (
                      <div className={style.tooltipText}>
                       {bookedby}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {formVisible && (
        <div className={style.background} onClick={handleClickOutside}>
          <form className={style.formContainer} onSubmit={handleBooking}>
            <label>
              <input
                className={style.dateContainer}
                value={formState.date}
                type="date"
                name="date"
                placeholder="Date"
                onChange={handleInputChange}
              ></input>
            </label>
            <label>
              <input
                className={style.dateContainer}
                type="text"
                name="team"
                value={formState.team}
                placeholder="Mail Id"
                onChange={handleInputChange}
              ></input>
            </label>
            <button className={style.submitbutton} type="submit">
              Create Booking
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
