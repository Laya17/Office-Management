import style from "./RoomsLandingPage.module.css";
import logo from "../assets/logo-icon.svg";
import { useQuery } from "@apollo/client";

import { RoomDetails } from "../Queries";

import RoomComponent from "./RoomComponent/RoomComponent";

export default function RoomsLandingPage() {
  const { loading, error, data } = useQuery(RoomDetails);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;
  console.log("Hello from rooms data", data.rooms);

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
        {data.rooms.map((element) => (
          <RoomComponent element={element}></RoomComponent>
        ))}
      </div>
    </div>
  );
}
