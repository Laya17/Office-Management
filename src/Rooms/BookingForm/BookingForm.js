import React from "react"
import style from "./BookingForm.module.css"
import { gql, useMutation } from '@apollo/client';


const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $hours: Int!,
    $time: String!,
    $date: Date!,
    $bookingTeam: String!,
    $roomId: ID!
  ) {
    createBooking(
      data: {
        hours: $hours,
        time: $time,
        date: $date,
        bookingTeam: $bookingTeam,
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

const Publish=gql`mutation PublishBooking($id: ID!) {
  publishBooking(where: { id: $id }) {
    id

  }
}`



export default function BookingForm({
  formState,
  setFormState,
  room,
  handleChange
}) {
  const handleInputChange = event => {
    const { name, value } = event.target
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const [createBooking] = useMutation(CREATE_BOOKING);
  const [publishBooking] = useMutation(Publish);


  
  // useEffect(() => {
  //   refetchBookings()
  // }, [])

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createBooking({
        variables: {
          hours: 1,
          time: formState.time,
          date: formState.date,
          bookingTeam: formState.team,
          roomId: room.id,
        },
      });

      // console.log("hello",data.createBooking.id);
      
      await publishBooking({ variables: { id: data.createBooking.id } });
      // console.log("PUBLISHED RESPONSE",response)
  
      // console.log('Booking created:', data);
      await handleChange(); 

        
     
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  



  return (
    <div className={style.FormContainer}>
      <form onSubmit={handleBooking}>
        <div>
          <label>
            Team Name:
            <input
              type="text"
              name="team"
              value={formState.team}
              onChange={handleInputChange}
            ></input>
          </label>

          <label>
            Date :
            <input
              type="date"
              name="date"
              value={formState.date}
              onChange={handleInputChange}
            ></input>
          </label>

          <button onClick={handleBooking}>Create Booking</button>;
        </div>
      </form>
    </div>
  )
}
