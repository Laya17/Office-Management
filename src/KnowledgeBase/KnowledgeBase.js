import React, { useState } from "react";
import SideBar from "./Sidebar/SideBar";
import { gql, useQuery } from "@apollo/client";
import style from "./KnowledgeBase.module.css";
import Documents from "./Documents/Document";

const QUERY = gql`
  query MyQuery {
    knowledgeBases {
      document {
        description
        documentName
        document {
          url
        }
      }
      title
    }
  }
`;

export default function KnowledgeBase() {
  const { loading, error, data } = useQuery(QUERY);
  const [documentname, setDocumentname] = useState("HR");
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div className={style.KnowledgeBase}>
      <SideBar knowledgebase={data} setDocumentname={setDocumentname}></SideBar>
      <Documents documentname={documentname} knowledgebase={data}></Documents>
    </div>
  );
}
