// import React from "react";
// import cn from "classnames";
// import styles from "./Card.module.css";

// type CardVariant = "primary" | "secondary" | "tertiary";
// type TextSize = "default" | "small";
// type ImagePosition = "top-right" | "bottom-right";

// interface CardProps {
//   variant?: CardVariant;
//   title?: string;
//   text?: string;
//   textSize?: TextSize;
//   image?: string;
//   imagePosition?: ImagePosition;
//   children?: React.ReactNode;
//   ActionIcon?: React.ComponentType<{ className?: string }>;
//   onActionIconClick?: () => void;
//   enableActionIconGap?: boolean;
// }

// export const Card = ({
//   variant = "primary",
//   title,
//   text,
//   textSize = "default",
//   image,
//   imagePosition,
//   children,
//   ActionIcon,
//   onActionIconClick,
//   enableActionIconGap = true,
// }: CardProps) => {
//   const cardClasses = cn(styles.card, {
//     [styles[`card--variant-${variant}`]]: variant,
//   });

//   const titleClasses = cn(styles.card__title, {
//     [styles[`card__title--size-${textSize}`]]: textSize,
//   });

//   const bodyClasses = cn(styles.card__body, {
//     // Отступ теперь зависит от наличия иконки, а не от QR
//     [styles["card__body--with-action-gap"]]: ActionIcon && enableActionIconGap,
//   });

//   const imageClasses = cn(styles.card__image, {
//     [styles[`card__image--position-${imagePosition}`]]: imagePosition,
//   });

//   return (
//     <div className={cardClasses}>
//       <div className={styles.card__header}>
//         {title && <h2 className={titleClasses}>{title}</h2>}

//         {/* Рендерим иконку и кнопку, только если они предоставлены */}
//         {ActionIcon && (
//           <div className={styles.card__action} onClick={onActionIconClick}>
//             <button
//               className={cn(
//                 styles["card__action-button"],
//                 styles[`card__action-button--variant-${variant}`]
//               )}
//               aria-label="Action" // Лейбл должен быть более осмысленным в месте использования
//             >
//               <ActionIcon className={styles["card__action-icon"]} />
//             </button>
//           </div>
//         )}
//       </div>

//       <div className={bodyClasses}>
//         {text && <p className={styles.card__text}>{text}</p>}
//         {children}
//       </div>

//       {image && imagePosition && (
//         <img src={image} alt="" className={imageClasses} />
//       )}
//     </div>
//   );
// };

import React from "react";
import cn from "classnames";
import styles from "./Card.module.css";

type CardVariant = "primary" | "secondary" | "accent";

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}
const Root = ({ className, variant = "primary", ...props }: RootProps) => (
  <div
    className={cn(styles.card, styles[`card--variant-${variant}`], className)}
    {...props}
  />
);

const Header = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(styles.card__header, className)} {...props} />
);

const Title = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn(styles.card__title, className)} {...props} />
);

const Body = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(styles.card__body, className)} {...props} />
);

export const Card = {
  Root,
  Header,
  Title,
  Body,
};
