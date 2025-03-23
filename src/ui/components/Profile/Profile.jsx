import React, { useContext, useEffect } from 'react';
import TopCards from '../../components/TopCards/TopCards';
import ScoreBar from '../../components/ScoreBar/ScoreBar';
import { UserContext } from '../../contexts/UserContext';


const Profile = () => {
  const { loadScore } = useContext(UserContext);
  useEffect(() => {
    loadScore();
  }, []);

  return (
    <div>
      <TopCards />
      <ScoreBar />
    </div>
  )
}

export default Profile;