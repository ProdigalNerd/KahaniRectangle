const useCursor = () => {
  return {
    onMouseEnter: (e) => {
      // style stage container:
      const container = e.target.getStage().container();
      container.style.cursor = "pointer";
    },
    onMouseDown: (e) => {
      const container = e.target.getStage().container();
      container.style.cursor = "move";
    },
    onMouseLeave: (e) => {
      const container = e.target.getStage().container();
      container.style.cursor = "default";
    },
    onMouseUp: (e) => {
      const container = e.target.getStage().container();
      container.style.cursor = "pointer";
    }
  };
};

export default useCursor;