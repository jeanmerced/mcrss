import { useState, useEffect } from 'react';
import { firebase } from '_firebase';

const gameMetadata = {
  currentSet: 1,
  gameIsOver: '',
  opponentColor: '',
  sport: '',
};

const useGameData = eventId => {
  const database = firebase.database();
  const gameMetadataRef = database.ref(`v1/${eventId}/game-metadata`);
  const [gameData, setGameData] = useState(gameMetadata);

  useEffect(() => {
    gameMetadataRef.on('value', snapshot => {
      if (snapshot.val()) {
        const metadata = snapshot.val();
        setGameData({
          currentSet: metadata['current-set'],
          gameIsOver: metadata['game-over'].answer == 'No',
          opponentColor: metadata['opp-color'],
          sport: metadata['sport'],
        });
      }
    });
    return () => {
      gameMetadataRef.off();
    };
  }, []);
  return gameData;
};

export default useGameData;
