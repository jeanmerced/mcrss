import React, { useState, useEffect } from 'react';
import { firebase } from '_firebase';

/**
 * Fetch team rosters for both UPRM and the opponent given an event
 * @param {number} eventId ID of the event
 * @param {boolean} gameOver Game status, ended or ongoing
 */
const useTeamRosters = (eventId, gameOver) => {
  const database = firebase.database();
  const [uprmRoster, setUprmRoster] = useState({});
  const [opponentRoster, setOpponentRoster] = useState({});
  useEffect(() => {
    const uprmRosterRef = database.ref(`v1/${eventId}/uprm-roster`);
    const opponentRosterRef = database.ref(`v1/${eventId}/opponent-roster`);
    // If the game has ended only fetch the rosters once since there will be no changes
    if (gameOver) {
      uprmRosterRef.once('value', rosterSnapshot =>
        setUprmRoster(rosterSnapshot.val())
      );
      opponentRosterRef.once('value', rosterSnapshot =>
        setOpponentRoster(rosterSnapshot.val())
      );
    } else {
      // If the game is not over listen to roster changes

      //UPRM Listener
      uprmRosterRef.on('value', rosterSnapshot =>
        setUprmRoster(rosterSnapshot.val())
      );
      // Opponent Listener
      opponentRosterRef.on('value', rosterSnapshot =>
        setOpponentRoster(rosterSnapshot.val())
      );
    }

    return () => {
      uprmRosterRef.off();
      opponentRosterRef.off();
    };
  }, [gameOver]);
  return { uprm: uprmRoster, opponent: opponentRoster };
};

export default useTeamRosters;
