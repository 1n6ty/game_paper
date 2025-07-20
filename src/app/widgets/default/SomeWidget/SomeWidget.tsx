import { useNavigate } from "react-router-dom";
import { Card } from "@/app/shared-kernel/ui/components/Card/Card";

export const SomeWidget = () => {
  const navigate = useNavigate();

  const handleQrClick = () => {
    navigate("/scanner");
  };

  return (
    <Card.Root title="Мои очки">
      <p>У вас 150 очков</p>
    </Card.Root>
  );
};
