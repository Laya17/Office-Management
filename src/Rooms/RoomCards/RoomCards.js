import React, {
  useState,
  useEffect,
  cloneElement,
  useCallback,
  useRef,
} from "react";
import style from "./RoomCards.module.css";
import BookingForm from "../BookingForm/BookingForm";
import { gql, useQuery } from "@apollo/client";
import { memo } from "react";

const timings = [
  { time: "9:00 AM" },
  { time: "10:00 AM" },
  { time: "11:00 AM" },
  { time: "12:00 PM" },
  { time: "1:00 PM" },
  { time: "2:00 PM" },
  { time: "3:00 PM" },
  { time: "4:00 PM" },
  { time: "5:00 PM" },
  { time: "6:00 PM" },
  { time: "7:00 PM" },
  { time: "8:00 PM" },
  { time: "9:00 PM" },
];

const BOOKINGS_QUERY = gql`
  query Bookings($date: Date!, $roomId: ID!) {
    bookings(where: { date: $date, room: { id: $roomId } }) {
      bookingTeam
      date
      hours
      id
      time
      room {
        id
        name
      }
    }
  }
`;

const parseTime = (timeStr) => {
  const [hourStr, modifier] = timeStr.split(" ");
  let [hour, minute] = hourStr.split(":").map(Number);

  if (modifier === "PM" && hour !== 12) {
    hour += 12;
  }
  if (modifier === "AM" && hour === 12) {
    hour = 0;
  }

  return new Date().setHours(hour, minute, 0, 0);
};

const RoomCard = ({ room, formState, setFormState }) => {
  const [booking, setBooking] = useState("");
  const [form, setForm] = useState(false);

  const [bookedArray, setBookedArray] = useState([]);

  const { loading, error, data, refetch } = useQuery(BOOKINGS_QUERY, {
    variables: { date: formState.date, roomId: room.id },
    onCompleted: (data) => {
      console.log("ON COMPLETED");
      setBookedArray(data.bookings);
    },
  });

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  const isTimeSlotBooked = (timeSlot, roomId) => {
    return bookedArray?.some(
      (booking) => booking.time === timeSlot && booking.room.id === roomId
    );
  };

  const isTimeSlotPast = (timeSlot, date) => {
    const today = new Date();

    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const [year, month, dates] = date.split("-");
    const dateOnly = new Date(year, month - 1, dates);
    // console.log("Date:", todayDateOnly,"Check", date, typeof date,dateOnly )

    if (dateOnly < todayDateOnly) {
      return true;
    }
    if (dateOnly > todayDateOnly) {
      return false;
    }

    const slotTime = parseTime(timeSlot);
    const now = today.getTime();

    return slotTime < now;
  };

  return (
    <div className={style.roomCardContainer}>
      <div className={style.imageContainer}>
        <img className={style.roomimg} src={room.image.url} alt={room.name} />
      </div>

      <div className={style.descriptionContainer}>
        <div className={style.NameContainer}>
          <p className={style.title}>{room.name}</p>
          <p className={style.location}>
            {room.location} | {room.occupants} seats
          </p>
        </div>

        <div className={style.amenitiesContainer}>
          {room.amenities.map((amenity, index) => (
            <p key={index} className={style.amenities}>
              {amenity}
            </p>
          ))}
        </div>

        <div className={style.availableTimeContainer}>
          {timings.map((timeSlot) => {
            const isBooked = isTimeSlotBooked(timeSlot.time, room.id);
            const isPast = isTimeSlotPast(timeSlot.time, formState.date);
            const isDisabled = isBooked || isPast;

            return (
              <button
                key={timeSlot.time}
                className={`${style.timeslot} ${
                  isDisabled ? style.disabledButton : ""
                }`}
                onClick={() => {
                  if (!isDisabled) {
                    setBooking(timeSlot.time);
                    console.log(`Booking time set to: ${timeSlot.time}`);
                  }
                }}
                disabled={isDisabled}
              >
                {timeSlot.time}
              </button>
            );
          })}
        </div>

        {booking && (
          <button
            className={style.bookslot}
            onClick={() => {
              setForm(true);
              setFormState((prevState) => ({
                ...prevState,
                time: booking,
              }));
            }}
          >
            Book a slot at {booking}
          </button>
        )}

        {form && (
          <BookingForm
            room={room}
            formState={formState}
            setFormState={setFormState}
            availableTime={timings}
            handleChange={handleChange}
            query={BOOKINGS_QUERY}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(RoomCard);
