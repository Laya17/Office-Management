import React, { useState, useEffect } from "react";
import style from "./RoomCards.module.css";
import BookingForm from "../BookingForm/BookingForm";
import { gql ,useQuery} from "@apollo/client";


const getCurrentTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

const convertTo24HourFormat = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
};


const isTimePast = (inputTime) => {
  const currentTime = getCurrentTime();
  const input24HourTime = convertTo24HourFormat(inputTime);
  // console.log("24 time" ,input24HourTime, "current time",currentTime);
  return currentTime > input24HourTime;
};

export default function RoomCardDummy({room}) {
    

  const [booking, setBooking] = useState(""); 
  const [form, setForm] = useState(false); 
  const [availableTime, setAvailableTime] = useState([]); 

  const [formState, setFormState] = useState({
    team: "",
  });

  
 
  useEffect(() => {
    const updatedTimeSlots = room.availableTime.map((timeSlot) => {
      if (isTimePast(timeSlot.time) || timeSlot.booked) {
        return { ...timeSlot, booked: true }; 
      }
      return timeSlot;
    });
    setAvailableTime(updatedTimeSlots); 
    console.log("available time",availableTime);
  }, [room.availableTime]);


  const handleBooking = (selectedTime) => {
    const updatedTimeSlots = availableTime.map((timeSlot) => {
      if (timeSlot.time === selectedTime) {
        return { ...timeSlot, booked: true }; 
      }
      return timeSlot;
    });

    setAvailableTime(updatedTimeSlots); 
    setBooking(selectedTime);
    setForm(true);
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
          {availableTime
            .filter((timeSlot) => !timeSlot.booked)
            .map((timeSlot, index) => (
              <p
                key={index}
                className={style.timeslot}
                onClick={() => handleBooking(timeSlot.time)}
              >
                {timeSlot.time}
              </p>
            ))}
        </div>

        {booking && (
          <button className={style.bookslot} onClick={() => setForm(true)}>
            Book a slot at {booking}
          </button>
        )}

        {form && (
          <BookingForm
            room={room}
            booking={booking}
            formState={formState}
            setFormState={setFormState}
            availableTime={availableTime}
            setAvailableTime={setAvailableTime}
          />
        )}
      </div>
    </div>
  );
}
