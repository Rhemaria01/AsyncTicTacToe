import React,{useContext,useState,useEffect} from 'react'
import { UserContext } from '../context/UserContext'
import { Link, redirect } from 'react-router-dom';

import { doc, getDoc } from "firebase/firestore";
import db from '../firebase';
import { getDatabase, ref, child, get } from "firebase/database";


import { BsPlusLg } from 'react-icons/bs';
import "../css/Home.css"


const Home = () => {
  const context = useContext(UserContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
    const getData = async () => {
 
        const docRef = doc(db, "users", context.user.uid);
        const docSnap = await getDoc(docRef);
        const dbRef = ref(getDatabase());
        
        if (docSnap.exists()) {
            docSnap.data().Session.reverse().forEach(session => {
                // console.log(session);
                
            get(child(dbRef, `sessions/${session.sessionID}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(new Date(snapshot.val().lastUpdated));
                    
                  setGames(games => [...games, { sessionID: session.sessionID, opponentName: session.opponentName, turn: snapshot.val().turn, lastUpdated: snapshot.val().lastUpdated, winner : snapshot.val().winner}]);
                  setLoading(false);
                } else {
                  setLoading(false);
                }
              }).catch((error) => {
                console.error(error);
              }); 
        })
        
        } 

          

    }
      useEffect(() => {
          if (context.user === null) {
            return redirect("/login")
          }
        
          getData();
      },[])                                   


  return (
    <>
        <h2 className='home-title'>Your Games</h2>

            {
            games.length > 0 ? 
            <div className='games'>

            {games.map((game, index) => {
                return (
                    <div className='game' key={index}>
                            <h3>Game with {game.opponentName.split(" ")[0]}</h3>
                        <h4>{
                            game.winner === "ongoing" ?
                            game.turn === context.user.uid ?
                            <>
                                {game.opponentName.split(" ")[0]} just made their move.
                                <br />
                                It's your turn to play now.
                            </> : 'You’ve made your move! Waiting for them.'
                            : game.winner === context.user.uid ?
                            'You won!'
                            : game.winner === 'draw' ?
                            'It was a draw!'
                            : 'You lost!'

                        }</h4>
                        <h5>
                        {
                            new Date(game.lastUpdated).toUTCString().split(" ").splice(1,3).join(" ")
                            + " " +
                            new Date(game.lastUpdated).toLocaleTimeString().split(":").splice(0,2).join(":")
                            + " " +
                            new Date(game.lastUpdated).toLocaleTimeString('en-US').split(" ").splice(1).join(" ")
                            }</h5>
                      <button type='button' className='game-button'><Link to={`/game/${window.btoa(game.sessionID)}`} className='link' exact="true">{game.turn === context.user.uid ?"Play!":"View Game"}</Link></button>
                    <button type='button' className='new-game-btn'><Link to="/newgame" className='link' exact="true"><BsPlusLg className='logo'/>  New Game</Link></button>
                    </div>
                )
            })}
            </div>
             : 
        <div className='home'>
            { loading ?<div className="lds-ring"><div></div><div></div><div></div><div></div></div> :
            <>
            <h2 className='no-games'>No Games Found</h2>
            <button className='new-game-button'><Link to="/newgame" className='link' exact="true">Start a new game</Link></button>
            </>}
        </div>
            }
    </>
  )
}

export default Home