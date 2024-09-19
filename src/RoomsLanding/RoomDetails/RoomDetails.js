import { useLocation, useParams } from "react-router-dom";

export default function RoomDetails() {
  const location = useLocation();
  const room = location.state;
  //   const { name } = useParams();
  console.log(room);
  return (
    <div>
      <div>RoomDetails : {room.name}</div>;
      <div>{/* <img src={room.}></img> */}</div>
    </div>
  );
}
