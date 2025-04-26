import { useContext, useEffect } from "react";
import TopCards from "../../components/TopCards/TopCards";
import ScoreBar from "../../components/ScoreBar/ScoreBar";
import { UserContext } from "../../contexts/UserContext";

export default function Profile() {
  const { loadScore } = useContext(UserContext);
  useEffect(() => {
    loadScore();
  }, [loadScore]);

  return (
    <div>
      <TopCards />
      <ScoreBar />
    </div>
  );
}