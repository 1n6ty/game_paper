import { useContext, useEffect } from "react";
import TopCards from "../../components/TopCards/TopCards";
import ScoreBar from "../../components/ScoreBar/ScoreBar";
import { UserContext } from "../../contexts/UserContext";

import "./Profile.css";

export default function Profile() {
  const { loadScore } = useContext(UserContext);
  useEffect(() => {
    loadScore();
  }, [loadScore]);

  return (
    <div className="profile-container">
      <TopCards />
      <ScoreBar />
    </div>
  );
}