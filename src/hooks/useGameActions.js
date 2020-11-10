import React, { useState, useEffect, useRef } from 'react';
import { firebase } from '_firebase';

const useGameActions = (eventId, gameOver) => {
  const database = firebase.database();
  // gameActions is used as an object inside this function for quicker,
  // updates and search. An array will be return as the state
  const [gameActions, setGameActions] = useState([]);
  useEffect(() => {
    const gameActionsRef = database.ref(`v1/${eventId}/game-actions`);
    if (gameOver) {
      /*
      if game is over we only need to get the game actions once
      and there is no need to add listeners for new actions or removal.
      */

      gameActionsRef.once('value', actionsSnapshot => {
        /* 
        actionsSnapshot is an Object with multiple object values.
        Change main Object to array and store the keys inside the
        value object as id. This will help render a list on react
        by passing the id as key to the render element and identify 
        the action.  
        */
        const actions = actionsSnapshot.val();
        Object.keys(actions).forEach(key => (actions[key].id = key));
        setGameActions(Object.values(actions));
      });
    } else {
      // If the game is not over listen to changes, addition and removal
      gameActionsRef.on('child_added', actionSnapshot => {
        // On first run all child nodes will be fetch i.e all action
        const key = actionSnapshot.key;
        if (!gameActions.some(action => action.id == key)) {
          // Only add an action to the state if it hasn't been added before
          const newAction = { id: key, ...actionSnapshot.val() };
          // Since game is live we want to add recent actions at the top
          setGameActions(prevActions => [newAction, ...prevActions]);
        }
      });
      gameActionsRef.on('child_removed', actionSnapshot => {
        const key = actionSnapshot.key;
        setGameActions(prevActions =>
          // Set state to new array without the removed action
          prevActions.filter(action => action.id != key)
        );
      });
      gameActionsRef.on('child_changed', actionSnapshot => {
        const key = actionSnapshot.key;
        setGameActions(prevActions =>
          prevActions.map(action => {
            if (action.id == key) {
              // update action value
              return { id: key, ...actionSnapshot.val() };
            } else {
              return action;
            }
          })
        );
      });
    }

    return () => {
      gameActionsRef.off();
    };
  }, [eventId, gameOver]);

  return gameActions;
};

export default useGameActions;
