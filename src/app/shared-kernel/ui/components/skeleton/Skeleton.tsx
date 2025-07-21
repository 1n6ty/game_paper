import React from "react";
import cn from "classnames";
import styles from "./Skeleton.module.css";

type SkeletonProps = {
  className?: string;
  isCircle?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = ({ className, isCircle, ...props }: SkeletonProps) => {
  const skeletonClasses = cn(
    styles.skeleton,
    { [styles["skeleton--circle"]]: isCircle },
    className
  );

  return <div className={skeletonClasses} {...props} />;
};
