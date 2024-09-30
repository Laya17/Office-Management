import { gql } from "@apollo/client";

export const RoomDetails = gql`
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

export const timing = gql`
  query {
    timings {
      timings
    }
  }
`;


export const BOOKINGS_QUERY = gql`
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

export const CREATE_BOOKING = gql`
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

export const Publish = gql`
  mutation PublishBooking($id: ID!) {
    publishBooking(where: { id: $id }) {
      id
    }
  }
`;