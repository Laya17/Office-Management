import { useLocation } from "react-router-dom";
import { useState, useCallback } from "react";
import style from "./RoomDetails.module.css";
import { gql, useQuery, useMutation } from "@apollo/client";
import { timing } from "../../Queries";

// const timings = [
//   { time: "9:00 AM" },
//   { time: "10:00 AM" },
//   { time: "11:00 AM" },
//   { time: "12:00 PM" },
//   { time: "1:00 PM" },
//   { time: "2:00 PM" },
//   { time: "3:00 PM" },
//   { time: "4:00 PM" },
//   { time: "5:00 PM" },
//   { time: "6:00 PM" },
//   { time: "7:00 PM" },
//   { time: "8:00 PM" },
//   { time: "9:00 PM" },
// ];

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

const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $hours: Int!
    $time: String!
    $date: Date!
    $bookingTeam: String!
    $roomId: ID!
  ) {
    createBooking(
      data: {
        hours: $hours
        time: $time
        date: $date
        bookingTeam: $bookingTeam
        room: { connect: { id: $roomId } }
      }
    ) {
      bookingTeam
      date
      hours
      time
      id
    }
  }
`;

const Publish = gql`
  mutation PublishBooking($id: ID!) {
    publishBooking(where: { id: $id }) {
      id
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

export default function RoomDetails() {
  const location = useLocation();
  const room = location.state;

  const [formState, setFormState] = useState({
    time: "",
    team: "",
    date: new Date().toISOString().split("T")[0],
    roomId: room.id,
  });

  const [booking, setBooking] = useState("");
  const [bookedby, setBookedby] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [isdisabledbutton, setIsdisabled] = useState("");
  const [bookedArray, setBookedArray] = useState([]);
  const [createBooking] = useMutation(CREATE_BOOKING);
  const [publishBooking] = useMutation(Publish);

  const { loading, error, data, refetch } = useQuery(BOOKINGS_QUERY, {
    variables: { date: formState.date, roomId: room.id },
    onCompleted: (data) => {
      setBookedArray(data.bookings);
    },
  });

  const { loading: loading2, error: error2, data: data2 } = useQuery(timing);

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
  if (error) console.log("ERROR CODE", error.networkError);

  if (loading2) return <p>Loading...</p>;
  if (error2) console.log("ERROR CODE", error2.networkError);

  const timings = data2.timings[0].timings;
  console.log("neww", data2.timings[0].timings);

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

  const getBookedby = (date, time) => {
    console.log(bookedArray);
    bookedArray.map((book) => {
      if (book.date === date && book.time === time) {
        console.log(book.bookingTeam);
        setBookedby(book.bookingTeam);
      }
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

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
          roomId: room.id,
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
  //   const { name } = useParams();
  console.log(room);
  return (
    <div className={style.RoomContainer}>
      <div className={style.imageContainer}>
        <img className={style.image} src={room.image.url} alt="room"></img>
      </div>

      <div className={style.descriptionPadding}>
        <div className={style.descriptionContainer}>
          <div className={style.description}>
            <div className={style.Roomname}>{room.name}</div>
            <div className={style.occupants}>occupants: {room.occupants}</div>
          </div>
          {room.amenities.length > 0 && (
            <div className={style.facility}>
              <div className={style.facilityTitle}>FACILITIES</div>
              <div className={style.facilityItemContainer}>
                {room.amenities.map((facility) => {
                  return <div className={style.facilityitems}>{facility}</div>;
                })}
              </div>
            </div>
          )}
        </div>
        <div className={style.timingsTitle}>AVAILABLE TIME :</div>

        <div className={style.availableTimeContainer}>
          {timings.map((timeSlot) => {
            const isBooked = isTimeSlotBooked(timeSlot.time, room.id);
            const isPast = isTimeSlotPast(timeSlot.time, formState.date);
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
                    console.log(`Booking time set to: ${timeSlot.time}`);
                  } else if (isBooked) {
                    setBookedby("");

                    getBookedby(formState.date, timeSlot.time);
                  }
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
    </div>
  );
}
