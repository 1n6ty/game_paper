import PropTypes from "prop-types";
import "./CardReward.css";

export default function CardReward({ 
  count,
  svgLarge: SvgLarge,
  svgSmall: SvgSmall
}) {
  return (
    <div className="card-reward">
      <div className="card-reward__visual">
        {SvgLarge && <SvgLarge className="card-reward__svg card-reward__svg--large" />}
      </div>
      <div className="card-reward__info">
        <span className="card-reward__count">{count}</span>
        {SvgSmall && <SvgSmall className="card-reward__svg card-reward__svg--small" />}
      </div>
    </div>
  );
}

CardReward.propTypes = {
  count: PropTypes.number.isRequired,
  svgLarge: PropTypes.elementType,
  svgSmall: PropTypes.elementType,
};

CardReward.defaultProps = {
  svgLarge: null,
  svgSmall: null,
};