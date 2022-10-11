const RECT_W = 100;
const RECT_H = 50;

export const useRectangles = () => {
  function createRectangle(canvas: HTMLCanvasElement) {
    if (!canvas) return;

    const context = canvas.getContext('2d');

    if (!context) return;
    //Our first draw
    context.fillStyle = '#000000';
    context.fillRect(0, 0, RECT_W, RECT_H);
  }


  return {
    createRectangle,
  }
};