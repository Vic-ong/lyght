export const appHeaderProps = (breakpoint = {}) => {
  const { smAndDown } = breakpoint;
  return {
    height: smAndDown ? 56 : 64,
  };
};

export const navBarProps = () => ({
  width: 220,
});

export const pageContainerProps = () => ({
  header: {
    height: 60,
  },
});
