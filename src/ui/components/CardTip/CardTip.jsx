import PropTypes from "prop-types";
import "./CardTip.css";

export default function CardTip({ 
  title,
  text,
  rightSvg: RightSvg
}) {
  return (
    <div className="card-tip">
      {title && <h2 className="card-tip__title">{title}</h2>}
      {text && (
        <div className="card-tip__text-container">
          <p className="card-tip__text">{text}</p>
        </div>
      )}
      {RightSvg && <RightSvg className="card-tip__svg-right" />}
    </div>
  );
}

CardTip.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  rightSvg: PropTypes.elementType
};

CardTip.defaultProps = {
  rightSvg: null
};
