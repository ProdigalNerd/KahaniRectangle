import React, { FC, useRef, RefObject } from "react";
import { Rect, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import { RectDef } from "../../interfaces/RectDef";
import useCursor from "../../hooks/useCursor";
import COLORS from "../../const/colors";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import "./Rectangle.css";

interface RectangleViewProps {
  shape: RectDef,
  onSelect(id: number): void,
  isSelected: boolean,
  transformRef: RefObject<any>,
  shapeRef: RefObject<any>,
  changeColor(color: string): void,
  removeRectangle(id: string): void,
}

const View: FC<RectangleViewProps> = ({
  shape,
  onSelect,
  isSelected,
  transformRef,
  shapeRef,
  changeColor,
  removeRectangle,
...props }) => (
  <>
    <Rect
      onClick={() => onSelect(shape.id)}
      onTap={() => onSelect(shape.id)}
      ref={shapeRef}
      x={shape.x}
      y={shape.y}
      fill={shape.fill}
      width={shape.width}
      height={shape.height}
      draggable={shape.draggable}
      {...props}
    />
    {isSelected && (
      <>
        <Transformer
          ref={transformRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
        <Html
          divProps={{
            style: {
              alignItems: 'center',
              backgroundColor: 'white',
              border: '1px solid #000',
              display: 'flex',
              flexDirection: 'row',
              padding: '10px',
              position: 'absolute',
              top: shape.y + 20 + 'px',
              left: shape.x + 20 + 'px',
            }
          }}
        >
          {COLORS.map((color) => color !== shape.fill && (
            <div 
              className="colorPicker"
              key={color}
              style={{
                backgroundColor: color
              }}
              onClick={() => changeColor(color)}
            />
          ))}
          <DeleteOutlinedIcon className="delete" onClick={() => removeRectangle(shape.id)} />
        </Html>
      </>
    )}
  </>
);

interface RectangleProps {
  shape: RectDef,
  isSelected: boolean,
  onSelect(id: number): void,
  onChange(shape: RectDef): void,
  removeRectangle(id: string): void,
}

const Rectangle: FC<RectangleProps> = ({ shape, isSelected, onSelect, onChange, ...props }) => {
  const shapeRef = useRef() as RefObject<any>;
  const transformRef = useRef() as RefObject<any>;

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      transformRef?.current?.nodes([shapeRef.current]);
      transformRef?.current?.getLayer().batchDraw();
    }
  }, [isSelected]);

  const {
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
  } = useCursor();

  const hookProps = {
    onDragEnd: (e) => {
      // check within bounds
      // reposition if needed
      // save to store
      onChange({
        ...shape,
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    onTransformEnd: (e) => {
      // transformer is changing scale of the node
      // and NOT its width or height
      // but in the store we have only width and height
      // to match the data better we will reset scale on transform end
      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      // we will reset it back
      node.scaleX(1);
      node.scaleY(1);
      onChange({
        ...shape,
        x: node.x(),
        y: node.y(),
        // set minimal value
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(node.height() * scaleY),
      });
    },
    changeColor: (color) => {
      onChange({
        ...shape,
        fill: color,
      });
    },
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    isSelected,
    transformRef,
    shapeRef,
    onSelect,
    shape,
  }

  return (
    <View {...props} {...hookProps} />
  )
};

export default Rectangle;