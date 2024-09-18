import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import "./App.css";

import LandingPage from "./LandingPage/LandingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Rooms from "./Rooms/Rooms";
import RoomsLandingPage from "./RoomsLanding/RoomsLandingPage";
import { useState } from "react";
import KnowledgeBase from "./KnowledgeBase/KnowledgeBase";

const client = new ApolloClient({
  uri: "https://ap-south-1.cdn.hygraph.com/content/cm0wesbba00hl07w18seprk52/master",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/knowledgebase" element={<KnowledgeBase />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}
