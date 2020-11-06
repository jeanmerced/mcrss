import React, { useState, useEffect, useRef } from 'react';
import { firebase } from '_firebase';

const useGameActions = (eventId, gameOver) => {
  const database = firebase.database();
  const gameActionsRef = database.ref(`v1/${eventId}/game-actions`);

  const [gameActions, setGameActions] = useState([]);
  useEffect(() => {
    /* 
    actionsSnapshot is an Object with multiple object values.
    Change main Object to array and store the keys inside the
    value object as id. This will help render a list on react
    by passing the id as key to the render element and identify 
    the action.  
    */
    function transformDataSetState(response, reverse = false) {
      const keys = Object.keys(response);
      const actionsArr = Object.values(response);
      actionsArr.forEach((value, index) => (value.id = keys[index]));
      setGameActions(reverse ? actionsArr.reverse() : actionsArr);
    }
    if (gameOver) {
      /*
      if game is over we only need to get the game actions once
      and there is no need to add listener for new actions or removal.
      */
      gameActionsRef.once('value', actionsSnapshot =>
        transformDataSetState(actionsSnapshot.val())
      );
    } else {
      // If the game is not over listen to changes, addition and removal
      gameActionsRef.on('value', actionsSnapshot =>
        transformDataSetState(actionsSnapshot.val(), true)
      );
    }

    return () => {
      gameActionsRef.off();
    };
  }, [eventId, gameOver]);

  return gameActions;
};

export default useGameActions;
