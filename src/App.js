import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from "@apollo/client";
import './App.css';
import LandingPage from "./LandingPage/LandingPage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Rooms from "./Rooms/Rooms";
import { useState } from "react";
import Solution from "./Solution/Solution";
import 'bootstrap/dist/css/bootstrap.min.css';


const client = new ApolloClient({
  uri: "https://ap-south-1.cdn.hygraph.com/content/cm0wesbba00hl07w18seprk52/master", 
  cache: new InMemoryCache(),
});


export default function App() {

  const [room,setroom]=useState()

  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
        <Route path="/" element={ <Solution/>  } />
        <Route path="/rooms" element={<Rooms  />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}
