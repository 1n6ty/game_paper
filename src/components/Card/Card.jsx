
const Card = ({
  title,
  text,
  image,
  variant = "default",
  className = ""
}) => {
  return (
    <div className={`card card--${variant} ${className}`}>
      {image && <img src={image} alt="Иллюстрация" className="card-image" />}
      <div className="card-content">
        {title && <h2 className="card-title">{title}</h2>}
        {text && <p className="card-text">{text}</p>}
      </div>
    </div>
  );
};
export default Card;