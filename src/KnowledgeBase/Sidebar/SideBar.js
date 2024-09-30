import style from "./SideBar.module.css";

export default function SideBar({knowledgebase,setDocumentname}){
    

    return(
        <div className={style.SideBarContainer}>
            {knowledgebase.knowledgeBases.map(element=>(
                <div className={style.sidebarelement} onClick={()=>(setDocumentname(element.title))}>{element.title}</div>
            )
            )}
        </div>
    );
}