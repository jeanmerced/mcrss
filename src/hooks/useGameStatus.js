import React, { useState, useEffect } from 'react';
import { firebase } from '_firebase';

/**
 * Check if a sport event has ended. If the event in ongoing
 * the value will change when it ends.
 * @param {number} eventId Event id of the sport event
 * @returns {boolean} True if the game has ended
 */
const useGameStatus = eventId => {
  const database = firebase.database();
  const [gameIsOver, setGameIsOver] = useState(true);
  useEffect(() => {
    const gameOverRef = database.ref(
      `v1/${eventId}/game-metadata/game-over/answer`
    );
    gameOverRef.on('value', gameOverSnapshot =>
      setGameIsOver(gameOverSnapshot.val() == 'Yes')
    );
    return () => {
      gameOverRef.off();
    };
  }, [eventId]);
  return gameIsOver;
};

export default useGameStatus;
