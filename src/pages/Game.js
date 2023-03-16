import React,{useState,useContext, useEffect} from 'react'
import { UserContext } from '../context/UserContext'
import { useParams, Navigate } from 'react-router'


import Back from '../components/Back';

import { getDoc, doc } from "firebase/firestore";
import { getDatabase, ref, get, child, update, onValue } from "firebase/database";

import db from '../firebase';

import Rectange from '../assets/Rectangle.jpeg'
import "../css/Game.css"
const Game = () => {
    const sessionID = window.atob(useParams().sessionID);
    const context = useContext(UserContext);
    const dbRef = ref(getDatabase());
    const [loading,setLoading] = useState(true);
    const [opponent,setOpponent] = useState("");

    const [auth,setAuth] = useState(false);
    const [session,setSession] = useState({});
    const [board,setBoard] = useState(["0","0","0","0","0","0","0","0","0"]);
    const [error , setError] = useState({
        error: false,
        message: ""
    });
    const getOpponent = async (opponentID) => {
        const opponentRef = doc(db, "users", opponentID);
        const opponentSnapshot = await getDoc(opponentRef);
        setOpponent(opponentSnapshot.data().Name);
    }
    const [lastTurn,setLastTurn] = useState(null);
    const authorize = async () => {
        get(child(dbRef, `sessions/${sessionID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                setSession(snapshot.val());
                console.log(snapshot.val());
                if (snapshot.val().player1ID === context.user.uid) {
                    getOpponent(snapshot.val().player2ID);
                    setAuth(true);
                    setLoading(false);
                    startBoard(snapshot.val().board);
                } else if (snapshot.val().player2ID === context.user.uid) {
                    getOpponent(snapshot.val().player1ID);
                    setAuth(true);
                    setLoading(false);
                    startBoard(snapshot.val().board);
                }
                
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          }).finally(() => {
            setLoading(false);
          });
    }
    const startBoard = async (board) => {
        let temp = ["0","0","0","0","0","0","0","0",'0'];
        // console.log(board);
        
        board.forEach((pos,index) => {
            if (pos === "1") {
                temp[index] = "1";
            } else if (pos === "2") {
                temp[index] = "2";
            }
        }) 
        setBoard(temp);
        
    }
    const checkWinner = (board) => {
        const WINNING_COMBINATIONS = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ]
        for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
            const [a, b, c] = WINNING_COMBINATIONS[i];
            if ((board[a] === "1" || board[a] === "2") && board[a] === board[b] && board[a] === board[c]) {
                return context.user.uid
            }
        }
    }
    const updateBoard = async (index) => {
        if (session.turn === context.user.uid && session.winner === "ongoing") {
            let temp = board;
            if (lastTurn !== null) {
                temp[lastTurn] = "0";
            }
            setError({
                error: false,
                message: ""
            });
            
            temp[index] = context.user.uid === session.player1ID ? "1" : "2";
            setLastTurn(index);
            setBoard(temp);
            
        }
        else{
            setError({
                error: true,
                message: session.winner === "ongoing" ? "It's not your turn" : "Game is over"
            });
            setTimeout(() => {
                setError({
                    error: false,
                    message: ""
                });
            }, 2000);
        }
    }
    const submitBoard = async (index) => {
        if (session.turn === context.user.uid && lastTurn !== null && session.winner === "ongoing") {
        setLastTurn(null);
        const updates = {};
        console.log("submitting");
        updates[`sessions/${sessionID}/board/${index}`] = context.user.uid === session.player1ID ? "1" : "2";
        updates[`sessions/${sessionID}/turn`] = context.user.uid === session.player1ID ? session.player2ID : session.player1ID;
        updates[`sessions/${sessionID}/stepCount`] = session.stepCount + 1;
        if(session.stepCount > 3) {
            const winner = checkWinner(board);
            if (winner) {
                updates[`sessions/${sessionID}/winner`] = winner;
            }
            if(session.stepCount === 8 && !winner) {
                updates[`sessions/${sessionID}/winner`] = "draw";
            }
        }
        await update(ref(getDatabase()), updates);
        console.log('Data updated.');
        const changeRef = ref(getDatabase(), `sessions/${sessionID}`);
        onValue(changeRef, (snapshot) => {
        console.log(snapshot.val());
        const data = snapshot.val();
        setSession(data);
        startBoard(data.board);
    });
        } else {
            setError({
                error: true,
                message: session.winner === "ongoing" ? "It's not your turn" : "Game is over"
            });
            setTimeout(() => {
                setError({
                    error: false,
                    message: ""
                });
            }, 2000);
        }
    }

  
    useEffect(() => {
        authorize();     
    },[])


    if(!context.user) {
        return <Navigate to="/login" />
    }
  return (
    !loading?
     <>
    <Back />
    {auth ? 
    <>
    <div className='game-page'>
        <h1>Game with {opponent}</h1>
        <h3>Your Piece</h3>
        <div className='piece-container'>
            <img src={Rectange} alt='your piece' className='piece-left'></img>
        </div>   
    </div>
        <div className='game-move'>
        
            <h2>{session.winner === "ongoing" ?  session.turn === context.user.uid ? "Your move": "Their move" : session.winner === context.user.uid ? "You Won!": session.winner === "draw"? "Its a draw":"You Lost :("}</h2>
        </div> 
        <div className='game-board'>
            {board.map((pos,index) => {
                if (pos === "0") {

                    return <div className='game-box'  onClick={() => updateBoard(index)} key={index}></div>
                } else if (session.player1ID === context.user.uid ? pos === "1" : pos === "2") {
                    return <div className='game-box' key={index}>
                                <div className='x-mark'>
                                    <img src={Rectange} alt='your piece' className='piece-left'></img>
                                </div>
                            </div>
                } else if (session.player1ID === context.user.uid ? pos === "2" : pos === "1") {
                    return <div className='game-box' key={index}>
                        <div className="outer-circle">
                            <div className='inner-circle'>
                            </div>
                        </div>    
                    </div>
                }
            })
            }
        </div>
        <button type='button' className='error-btn' style={{marginLeft:"2rem"}} disabled={true}  hidden={!error.error}>{error.message}</button>
        <button type='button' onClick={() => submitBoard(lastTurn)} className='regis-btn' disabled={!(session.turn === context.user.uid) || session.winner !== "ongoing"} style={{marginLeft:"2rem"}}>
        {session.winner === "ongoing"? session.turn === context.user.uid? "Submit Move" : "Wait for your turn": "Game Over"}
        </button>

    </>    
    : 
    <div style={{display:"flex",height:"100vh", justifyContent:"center", alignItems:"center"}}>
    <h1 style={{ width:"75%", paddingLeft:"2rem"}}>Unauthorized to play this game</h1>
    </div>
    }
    </> :
    <div style={{display:"flex",height:"100vh", justifyContent:"center", alignItems:"center"}}>  
    <div  className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>

  )
}

export default Game