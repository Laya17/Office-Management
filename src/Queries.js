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