import style from "../RoomsLandingPage.module.css";
import {
  isTimeSlotPast,
  isTimeSlotBooked,
  getBookedby,
} from "../../helpers/helpers";
import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { timing, BOOKINGS_QUERY, CREATE_BOOKING, Publish } from "../../Queries";

export default function RoomComponent({ room, roomId, setRoomId }) {
  const [bookedArray, setBookedArray] = useState([]);
  const [formState, setFormState] = useState({
    time: "",
    team: "",
    date: new Date().toISOString().split("T")[0],
    roomId: "",
  });
  const [booking, setBooking] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [bookedby, setBookedby] = useState("");
  const [createBooking] = useMutation(CREATE_BOOKING);
  const [publishBooking] = useMutation(Publish);

  const { loading: loading2, error: error2, data: data2 } = useQuery(timing);

  const {
    loading: loading3,
    error: error3,
    data: datas,
    refetch,
  } = useQuery(BOOKINGS_QUERY, {
    variables: { date: formState.date, roomId: formState.roomId },
    onCompleted: (data) => {
      console.log("Booking set", data);
      setBookedArray(data.bookings);
    },
  });

  useEffect(() => {
    if (roomId !== room.id) {
      setBooking([]);
    }
  }, [roomId]);


  useEffect(() => {
    if (room.id) {
      setFormState((prevState) => ({
        ...prevState,
        roomId: room.id,
      }));
    }
  }, [room.id]);

  const handleChange = useCallback(async () => {
    console.log("BUTTON CLICK");
    try {
      const response = await refetch();
      console.log("RESPONSE REFETCH", response);
      setBookedArray(response.data.bookings);

      console.log("REFETCHed...");
    } catch (err) {
      console.error("REFETCH ERROR", err);
    }
  }, [refetch]);

  useEffect(() => {
    console.log("booking", booking);
  }, [roomId, booking]);

  if (loading2) return <p>Loading...</p>;
  if (error2) console.log("ERROR CODE", error2.networkError);
  const timings = data2.timings[0].timings;
  if (loading3) return <p>Loading...</p>;
  if (error3) console.log("ERROR CODE", error2.networkError);

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

    console.log(
      "formstate details",
      formState.date,
      formState.roomId,
      formState.team,
      formState.time
    );
    const pattern = /^[a-zA-Z0-9._%+-]+@superops\.com$/;
    console.log(formState.team);
    if (!pattern.test(formState.team)) {
      window.alert("Invalid");
      return;
    }

    setFormVisible(false);
    setFormState((prevState) => ({
      ...prevState,
      time: booking,
    }));

    try {
      const { data } = await createBooking({
        variables: {
          hours: 1,
          time: formState.time,
          date: formState.date,
          bookingTeam: formState.team,
          roomId: formState.roomId,
        },
        awaitRefetchQueries: true,
      });

      const publishedResponse = await publishBooking({
        variables: { id: data.createBooking.id },
        awaitRefetchQueries: true,
      });

      console.log("publishedResponse", publishedResponse);
      setTimeout(() => {
        setBooking("");

        handleChange();
      }, 500);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  function MultipleBookings(
    isBooked,
    isDisabled,
    timeSlot,
    booking,
    isSelected
  ) {
    if (!roomId || roomId !== room.id) {
      setBooking([timeSlot]);
      setRoomId(room.id);
    }

    console.log("booking", booking, "roomId", roomId);
    if (!isDisabled) {
      if (isSelected) {
        console.log("booking2", booking, "roomId", roomId);
        setBooking(booking.filter((bookedTime) => bookedTime !== timeSlot));
        console.log("booking after", booking, "roomId", roomId);
      } else {
        setBooking([...booking, timeSlot]);
        console.log("booking not selected", booking, "roomId", roomId);
      }

      setBookedby("");
      setFormState((prevState) => ({
        ...prevState,
        time: booking.includes(timeSlot)
          ? booking.filter((bookedTime) => bookedTime !== timeSlot)
          : [timeSlot],
        roomId: room.id,
      }));

      console.log(`Booking time toggled: ${timeSlot}`);
    } else if (isBooked) {
      setBookedby("");
      getBookedby(formState.date, timeSlot, bookedArray, setBookedby);
    }
  }

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
            alt="roomId alternate"
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
                <span class="material-symbols-outlined">person</span>
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
              console.log(
                "timeslot",
                timeSlot.time,
                "roomId",
                roomId,
                "isSelected",
                isSelected
              );

              return (
                <button
                  key={timeSlot.time}
                  className={`${style.timeslot} ${
                    isPast ? style.disabledButton : ""
                  }${isBooked ? style.bookedbutton : ""} ${
                    isSelected ? style.activeButton : ""
                  }`}
                  onClick={(e) => {
                    MultipleBookings(
                      isBooked,
                      isDisabled,
                      timeSlot.time,
                      booking,
                      isSelected
                    );
                  }}
                >
                  {timeSlot.time}
                </button>
              );
            })}
          </div>
          {bookedby && (
            <div className={style.bookedby}>Booking done by : {bookedby}</div>
          )}
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
