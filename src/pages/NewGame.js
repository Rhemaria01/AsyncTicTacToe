import React,{useState,useContext} from 'react'
import { UserContext } from '../context/UserContext'

import { Link, Navigate } from "react-router-dom";
import Back from '../components/Back'

import { v4 as uuidv4 } from 'uuid';

import db from '../firebase';
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { getDatabase, ref, set, get, child } from "firebase/database";
import "../css/Auth.css"
import "../css/NewGame.css"


const NewGame = () => {

    const context = useContext(UserContext);
    const [sessionID,setSessionID] = useState(uuidv4());
    const [email, setEmail] = useState('');
    const [error, setError] = useState({
        error: false,
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [sessionCreated, setSessionCreated] = useState(false);
        if (context.user === null) {
            return <Navigate to='/login' />
        }
      

    
    const userRef = doc(db, "users", context.user.uid);
    
    const q = query(collection(db, "users"), where("Email", "==", email));
    
    const searchSession = async (querySnapshot) => {
        setLoading(true);
        let sessionFound = false;
        const userSnapshot = await getDoc(userRef);
        
        console.log('Searching for session');
        
       userSnapshot.data().Session.forEach(session => {
              if (session.opponent === email) {
                  console.log(session.sessionID);
                  const dbref = ref(getDatabase()); 
                  get(child(dbref, `sessions/${session.sessionID}`)).then((snapshot) => {
                      if (snapshot.exists()) {
                        console.log('Session Found');
                        
                    if (snapshot.val().winner === "ongoing") {
                        console.log('Session ongoing');
                        sessionFound = true;
                        setError({
                            error: true,
                            message: 'You already have an ongoing game with this user'
                        })
                        setLoading(false);
                    }
                    }}).catch((error) => {
                        console.error(error);
                    });
               
                    return 
                }
             
            });
            sessionFound ? console.log('Session Found') : createSession(querySnapshot,userSnapshot);
    }



    const createSession = async (querySnapshot,userSnapshot) => {
        setError({
            error: false,
            message: ''
        })
        console.log('Creating Session');
        

        const opponentRef = doc(db, "users", querySnapshot.data().userId);
        const prevSessions = userSnapshot.data().Session;

           const database = getDatabase(); 
            set(ref(database, 'sessions/' + sessionID), {
                sessionID: sessionID,
                player1ID: context.user.uid,
                player2ID: querySnapshot.data().userId,
                board: ["0","0","0","0","0","0","0","0","0"],
                turn: context.user.uid,
                lastUpdated: new Date().getTime(),
                stepCount: 0,
                winner: "ongoing"
            });

        console.log('Session Created');
        
        await updateDoc(userRef, {
            Session: [...prevSessions, {sessionID: sessionID, opponent: querySnapshot.data().Email, opponentId: querySnapshot.data().userId, opponentName: querySnapshot.data().Name }]
        });
        console.log('Session Updated for player1');
        
        await updateDoc(opponentRef, {
            Session: [...querySnapshot.data().Session, {sessionID: sessionID, opponent: userSnapshot.data().Email, opponentId: userSnapshot.data().userId, opponentName: userSnapshot.data().Name}]
        });

        console.log('Session Updated for player2');
        
        setLoading(false);
        setSessionCreated(true);
    }
        
    const getUsers = async (e) => {
        
        e.preventDefault();
        if (context.user.email === email) {
            setError({
                error: true,
                message: 'Cannot play with yourself'
            });
            return
        }
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.length > 0 ?
        searchSession(querySnapshot.docs[0]) 
        : 
        setError({
            error: true,
            message: 'No users registered with this email'
        });
    }
  return (
    <>
        <Back />
        <div className='new-email'>
            <div>
            <h5>Start a new game</h5>
            <h1>Whom do you want to play with?</h1>
            <h4>Email</h4>
            <input type="email" onChange={(e)=>setEmail(e.target.value)} placeholder="Type their email here"/>
            </div>
            <div>
            <button type='button' className='error-btn' style={{textTransform: "initial",fontSize:"0.9rem"}} hidden={!error.error}>{error.message}</button>
            
            {loading ? <div style={{marginLeft: "9rem"}} className="lds-ring"><div></div><div></div><div></div><div></div></div> :<button type='submit' onClick={e => getUsers(e)} className='regis-btn' hidden={sessionCreated} > Start Game</button>}
            <Link to={`/game/${window.btoa(sessionID)}`} ><button type='button' className='congs-btn' hidden={!sessionCreated} > Play Game</button></Link>
            </div>
        </div>
    </>
  )
}

export default NewGame