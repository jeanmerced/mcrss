import React, { useState, useEffect } from 'react';
import { firebase } from '_firebase';

const useGameActions = (eventId, gameOver) => {
  const database = firebase.database();
  const gameActionsRef = database.ref(`v1/${eventId}/game-actions`);
  const [gameActions, setGameActions] = useState([]);
  useEffect(() => {
    if (gameOver) {
      // if game is over we only need to get the game actions once
      // and there is no need to add listeners for new actions or removal.
      gameActionsRef.once('value', actionsSnapshot => {
        /* 
        actionsSnapshot is an Object with multiple object values.
        Change main Object to array and the objects the keys inside
        the value object as id. This will help render a list on react
        by passing the id as key to the render element and identify 
        the action.  
        */
        const actions = actionsSnapshot.val() ?? {};
        Object.keys(actions).forEach(key => (actions[key].id = key));
        setGameActions(Object.values(actions));
      });
    } else {
      // Game is live so listen to value changes
      gameActionsRef.on('value', actionsSnapshot => {
        const actions = actionsSnapshot.val() ?? {};
        Object.keys(actions).forEach(key => (actions[key].id = key));
        // reverse array to get latest action first
        setGameActions(Object.values(actions).reverse());
      });
    }

    return () => {
      gameActionsRef.off();
    };
  }, [gameOver]);

  return gameActions;
};

export default useGameActions;
