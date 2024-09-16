import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import style from "./LandingPage.module.css";
import Card from "./Cards/cards";
import FeedCards from "./FeedCards/FeedCard";

const GET_DATA = gql`
  query {
    cards {
      image {
        url
      }
      title
      description
    }
    feeds {
      date
      description
      title
    }
  }
`;

export default function LandingPage() {
  const { loading, error, data } = useQuery(GET_DATA);
  const [searchValue, setSearchValue] = useState("");
  const [card, setCard] = useState([]);

  useEffect(() => {
    if (data) {
      setCard(data.cards);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  function handleSearch() {
    if (searchValue === "") {
      setCard(data.cards);
      return;
    }

    const filteredCard = data.cards.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    setCard(filteredCard);
  }

  return (
    <div className={style.Container}>
      <div className={style.searchbarContainer}>
        <input
          className={style.searchbar}
          placeholder="Search"
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <span className="material-symbols-outlined" onClick={handleSearch}>
          search
        </span>
      </div>

      <div className={style.LayoutContainer}>
        <div className={style.cardContainer}>
          {card.map((carditem, index) => (
            <Card key={index} carditem={carditem} />
          ))}
        </div>
        <div className={style.feedContainer}>
          {data.feeds.map((feed, index) => (
            <FeedCards key={index} feed={feed} />
          ))}
        </div>
      </div>
    </div>
  );
}
