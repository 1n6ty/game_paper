import "./DashboardHeader.css";

export default function DashboardHeader({ 
  logoSrc,
  title
}) {
  return (
    <div className="dashboard-header">
      <div className="dashboard-header__logo">
        <img src={logoSrc} alt="Logo" />
      </div>
      <h1 className="dashboard-header__title">{title}</h1>
    </div>
  );
}