import * as React from "react";
import { Stage, Layer, Rect as KRect, Transformer } from "react-konva";
import { Action } from "./updater/actions";
import {ValueWithToken, Environment} from './language/value'

interface RectProps {
  x: ValueWithToken<number>
  y: ValueWithToken<number>
  width: ValueWithToken<number>
  height: ValueWithToken<number>
  fill?: ValueWithToken<string>
  dispatchActions: (actions: Action[]) => void
}

const defaultFill = "#ccc";

const Rect = ({ x, y, width, height, fill, dispatchActions }: RectProps) => {
  const [isSelected, setIsSelected] = React.useState(false);
  const rectRef = React.useRef<any>(null);
  const transformerRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (transformerRef && rectRef && isSelected) {
      // we need to attach transformer manually
      transformerRef!.current!.setNode(rectRef.current);
      transformerRef!.current!.getLayer().batchDraw();
    }
  }, [rectRef, transformerRef, isSelected]);
  try {
    return (
      <>
        <KRect
          onClick={() => setIsSelected(!isSelected)}
          ref={rectRef}
          x={x.value}
          y={y.value}
          width={width.value}
          height={height.value}
          fill={fill ? fill.value : defaultFill}
          draggable
          onDragEnd={e => {
            const [newX, newY] = [e.currentTarget.x(), e.currentTarget.y()];
            const actions: Action[] = [
              { type: "update", tokenId: x.token.id, value: Math.round(newX) },
              { type: "update", tokenId: y.token.id, value: Math.round(newY) }
            ];
            dispatchActions(actions);
          }}
          onTransformEnd={e => {
            const node = rectRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);

            const [newX, newY] = [e.currentTarget.x(), e.currentTarget.y()];

            const actions: Action[] = [
              {
                type: "update",
                tokenId: width.token.id,
                value: Math.round(width.value * scaleX)
              },
              {
                type: "update",
                tokenId: height.token.id,
                value: Math.round(height.value * scaleY)
              },
              { type: "update", tokenId: x.token.id, value: Math.round(newX) },
              { type: "update", tokenId: y.token.id, value: Math.round(newY) }
            ];
            dispatchActions(actions);
          }}
        />
        <Transformer ref={transformerRef} />
      </>
    );
  } catch (e) {
    return null;
  }
};

export default ({
  env,
  dispatchActions
}: {
  env: Environment;
  dispatchActions: (actions: Action[]) => void;
}) => {
  return (
    <Stage width={500} height={500}>
      <Layer>
        <KRect width={500} height={500} x={0} y={0} fill="white" />
        {Object.entries(env)
          .filter(([key, ]) => key.startsWith("$export"))
          .map(([, value]) => {
            if (typeof value === "object" && !Array.isArray(value) && value.type) {
              switch (value.type) {
                case "rect": {
                  const [x, y, width, height] = value.params
                  const { fill } = value.properties;

                  return (
                    <Rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={fill}
                      dispatchActions={dispatchActions}
                    />
                  );
                }
              }
            }
          })}
      </Layer>
    </Stage>
  );
};
