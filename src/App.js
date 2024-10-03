import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import style from "./App.module.css";
import LandingPage from "./LandingPage/LandingPage";
import RoomDetails from "./RoomsLanding/RoomDetails/RoomDetails";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RoomsLandingPage from "./RoomsLanding/RoomsLandingPage";
import { useState } from "react";
import KnowledgeBase from "./KnowledgeBase/KnowledgeBase";
import Solution from "./Solution/Solution";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
const client = new ApolloClient({
  uri: "https://ap-south-1.cdn.hygraph.com/content/cm0wesbba00hl07w18seprk52/master",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <div className={style.app}>
      <ApolloProvider client={client}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/rooms" element={<RoomsLandingPage />} />
            <Route path="/room/:name" element={<RoomDetails />} />
            <Route path="/knowledgebase" element={<KnowledgeBase />} />
            <Route path="/solution" element={<Solution />} />
          </Routes>
        </Router>
      </ApolloProvider>
    </div>
  );
}
