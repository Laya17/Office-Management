import style from "./Document.module.css";

export default function Documents({ knowledgebase, documentname }) {
  // console.log(knowledgebase.knowledgeBases[0].document[0].document[0].url);
  return (
    <div className={style.DocumentContainer}>
      <div>{documentname}</div>
      {knowledgebase.knowledgeBases.map((element) =>
        element.title === documentname
          ? element.document.map((ele) => (
              <a href={ele.document[0].url} className={style.Documentelement}>
                <div className={style.imageContainer}>
                  <img
                    className={style.image}
                    src="https://www.bing.com/th?id=OIP.7UdBga7ObHp7xPv32-uJ8gHaHM&w=150&h=146&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.5&pid=3.1&rm=2"
                    alt="image"
                  ></img>
                </div>
                <div className={style.contentContainer}>
                  <div className={style.title}>{ele.documentName}</div>
                  <div className={style.description}>{ele.description}</div>
                </div>
              </a>
            ))
          : null
      )}
    </div>
  );
}
