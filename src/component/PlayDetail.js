import { useEffect, useState } from "react";  
import { useParams, Link } from "react-router-dom";
import { PlayDomain} from "./common";
import { useNavigate } from "react-router-dom";
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');  // replace '#root' with the id of your app's root element

export default function PlayDetail( ) {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newAuthor, setNewAuthor] = useState("");
    const [newGerne, setNewGerne] = useState("");
  
    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    const titleStyle = {
        fontSize: '3rem', // Increased the font size to 3 times the default size
        textDecoration: 'none', // Removing underline
      };
    const [play, setPlay] = useState({
        "id": 0,
        "name": null,
        "author": null,
        "gerne": null
    });
    const navigate = useNavigate();
    const {id} = useParams(); 

    useEffect( ()=>  {
        console.log(id); 
        fetch(`${PlayDomain}/playlist/${id}`) 
        .then( res => { return res.json() } ) 
        .then( data => { console.log(data); setPlay( data ) } );
    }, [id]) ; 
 
    function updatePlay(){
        play.title = newTitle; 
        play.author = newAuthor; 
        play.gerne = newGerne;
        let newPlay = { ...play }
         
        fetch(`${PlayDomain}/playlist/${id}`,
        { 
                method : "Put" ,   // 갱신을 위해 Put Method 로 요청 
                headers : {
                'Content-Type' : "application/json",
                },
                body : JSON.stringify( 
                    newPlay
		) 
        }).then( res => {
            if (res.ok ){
                closeModal();
                setPlay(newPlay) ;    //state 변경으로 화면 갱신 
            }
        }
        )
    }
    function deletePlay(){
        if (window.confirm("정말로 삭제하시겠습니까?")) {
        fetch(`${PlayDomain}/playlist/${id}`, 
            { 
                method:"Delete" , 
                headers : {
                'Content-Type' : "application/json",
                },   
            }
        ).then( () => 
            {  navigate('/playlist'); }
        )
      }
    }
     return (
        <div> 
            <table border={1}>
            <caption className="title"><Link to='/playlist' style={titleStyle}> 플레이리스트 정보 </Link></caption>
            <tbody>
                <tr><th>제목</th><th>가수</th><th>장르</th>
										<th>수정</th>
										<th>삭제</th></tr>
                <tr key={play.id}> 
                    <td>{play.title}</td> 
                    <td>{play.author} </td>
                    <td>{play.gerne} </td>
                    <td><button onClick={openModal} >수정</button>
                    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Update Board"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>수정</h2>
      <div className="input-container">
        <label className="input-label">
          {'제목:  '}
          <input className="input-field" type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        </label>
        <label className="input-label">
        {'가수:  '}
          <input className="input-field" type="text" value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} />
        </label>
        <label className="input-label">
        {'장르: '} 
          <input className="input-field" type="text" value={newGerne} onChange={(e) => setNewGerne(e.target.value)} />
        </label>
      </div>
      <div className="button-container">
        <button onClick={updatePlay}>완료</button>
        <button onClick={closeModal}>취소</button>
      </div>
    </Modal></td> 

                    <td><button onClick={deletePlay}>Delete</button></td>
                </tr> 
            </tbody>
            </table>
        </div>
     );
}