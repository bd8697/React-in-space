import classes from "./Background.module.css";

export const Background = (props: { colorValue: number }) => {
  const bgOverlayStyle = {
    background: `rgba(128, ${props.colorValue}, 0, 0.1)`,
  };

  return (
    <div className={classes.bg}>
      <div className={classes.bgOverlay} style={bgOverlayStyle}></div>
    </div>
  );
};
