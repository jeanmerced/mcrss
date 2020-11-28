import React, { useEffect, useState } from 'react';
import { firebase } from '_firebase';

const usePartialScores = eventId => {
  const database = firebase.database();
  const [partialScores, setPartialScores] = useState([]);
  useEffect(() => {
    const partialScoreRef = database.ref(`v1/${eventId}/score`);
    partialScoreRef.on('value', snapshot => {
      const values = Object.values(snapshot.val());
      const scores = [];
      /*
          Snapshot value returns:
          set1-opponent
          set1-uprm
          set2-opponent
          set2-uprm
          set3-opponent
          set3-uprm
          ...
        */

      for (let i = 0; i < values.length; i += 2) {
        /* 
          following the return value opponent score is in even indices.
          I want to put both score in an object in put into array
          that way the an array value has both score and array indice + 1 
          is the partial
          */
        const opponentScore = values[i];
        const uprmScore = values[i + 1];
        scores.push({ uprmScore, opponentScore });
      }
      setPartialScores([...scores]);
    });

    return () => {
      partialScoreRef.off();
    };
  }, []);
  return partialScores;
};

export default usePartialScores;
