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
      uprmRosterRef.on('child_added', rosterSnapshot => {
        setUprmRoster(prevRoster => {
          // create roster entry
          prevRoster[rosterSnapshot.key] = rosterSnapshot.val();
          // merge to previous state
          return { ...prevRoster };
        });
      });

      // Same as on added because using same key updates value.
      uprmRosterRef.on('child_changed', rosterSnapshot => {
        setUprmRoster(prevRoster => {
          // create roster entry
          prevRoster[rosterSnapshot.key] = rosterSnapshot.val();
          // merge to previous state
          return { ...prevRoster };
        });
      });

      uprmRosterRef.on('child_removed', rosterSnapshot => {
        setUprmRoster(prevRoster => {
          // delete entry from object
          delete prevRoster[rosterSnapshot.key];
          return { ...prevRoster };
        });
      });

      //Opponent Listeners
      opponentRosterRef.on('child_added', rosterSnapshot => {
        setOpponentRoster(prevRoster => {
          prevRoster[rosterSnapshot.key] = rosterSnapshot.val();
          return { ...prevRoster };
        });
      });

      opponentRosterRef.on('child_changed', rosterSnapshot => {
        setOpponentRoster(prevRoster => {
          prevRoster[rosterSnapshot.key] = rosterSnapshot.val();
          return { ...prevRoster };
        });
      });

      opponentRosterRef.on('child_removed', rosterSnapshot => {
        setOpponentRoster(prevRoster => {
          delete prevRoster[rosterSnapshot.key];
          return { ...prevRoster };
        });
      });
    }

    return () => {
      uprmRosterRef.off();
      opponentRosterRef.off();
    };
  }, [eventId, gameOver]);
  return { uprm: uprmRoster, opponent: opponentRoster };
};

export default useTeamRosters;
