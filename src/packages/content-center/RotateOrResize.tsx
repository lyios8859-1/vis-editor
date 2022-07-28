import { defineComponent, Fragment } from "vue";
import { dividerProps, ElIcon } from "element-plus";
import { Lock, Refresh } from "@element-plus/icons";

import "./rotate-resize.scss";

enum Direction {
  start = "start",
  center = "center",
  end = "end",
}

interface IDirection {
  horizontal: Direction;
  vertical: Direction;
}

export default defineComponent({
  name: "RotateOrResize",
  props: {
    shape: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const width = false;
    const height = true;
    const lock = false;
    const rotate = false;

    const onMousedown = (() => {
      let data = {
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        startLeft: 0,
        startTop: 0,
        dragging: false,
        direction: {
          horizontal: Direction.start,
          vertical: Direction.start,
        },
      };

      const mouseMove = (ev: MouseEvent) => {
        const {
          startX,
          startY,
          startWidth,
          startHeight,
          startLeft,
          startTop,
          direction,
          dragging,
        } = data;

        let { clientX: moveX, clientY: moveY } = ev;

        // 判断是那个点的方向
        if (direction.horizontal === Direction.center) {
          moveX = startX;
        }
        if (direction.vertical === Direction.center) {
          moveY = startY;
        }

        let durX = moveX - startX;
        let durY = moveY - startY;

        const shape = props.shape;

        // 解决拖动上边的点,下边线变化问题
        if (direction.vertical === Direction.start) {
          // if (Math.abs(shape.props.top) - Math.abs(startTop) > 0) {
          //   // TODO：反向
          // } else {
          //   durY = -durY;
          //   shape.props.top = startTop - durY;
          // }

          durY = -durY;
          shape.props.top = startTop - durY;
        }
        // 解决拖动左边的点,右边线变化问题
        if (direction.horizontal === Direction.start) {
          // if (Math.abs(shape.props.left) - Math.abs(startLeft) > 0) {
          //   // TODO： 反向
          // } else {
          //   durX = -durX;
          //   shape.props.left = startLeft - durX;
          // }

          durX = -durX;
          shape.props.left = startLeft - durX;
        }

        const width = startWidth + durX;
        const height = startHeight + durY;
        shape.props.width = width;
        shape.props.height = height;
        shape.hasResize = true;
      };
      const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
      };

      const mousedown = (ev: MouseEvent, dir: IDirection) => {
        // 中间顶上的拖动
        ev.stopPropagation();
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);

        data = {
          startX: ev.clientX,
          startY: ev.clientY,
          startWidth: props.shape.props.width || 0,
          startHeight: props.shape.props.height || 0,
          startLeft: props.shape.props.left || 0,
          startTop: props.shape.props.top || 0,
          dragging: false,
          direction: dir,
        };
      };
      return mousedown;
    })();
    return () => (
      <Fragment>
        {/* 支持设置旋转 */}
        {rotate && (
          <div class="shape-rotate">
            <ElIcon>
              <Refresh />
            </ElIcon>
          </div>
        )}
        {/* 支持锁定 */}
        {lock && (
          <div class="shape-lock">
            <ElIcon>
              <Lock />
            </ElIcon>
          </div>
        )}
        {/* 支持设置高度 */}
        {height && (
          <>
            <div
              class="shape-resize shape-resize__top"
              onMousedown={(ev) =>
                onMousedown(ev, {
                  horizontal: Direction.center,
                  vertical: Direction.start,
                })
              }
            ></div>
            <div
              class="shape-resize shape-resize__bottom"
              onMousedown={(ev) =>
                onMousedown(ev, {
                  horizontal: Direction.center,
                  vertical: Direction.end,
                })
              }
            ></div>
          </>
        )}
        {/* 支持设置宽度 */}
        {width && (
          <>
            <div
              class="shape-resize shape-resize__left"
              onMousedown={(ev) =>
                onMousedown(ev, {
                  horizontal: Direction.start,
                  vertical: Direction.center,
                })
              }
            ></div>
            <div
              class="shape-resize shape-resize__right"
              onMousedown={(ev) =>
                onMousedown(ev, {
                  horizontal: Direction.end,
                  vertical: Direction.center,
                })
              }
            ></div>
          </>
        )}
        {/* 支持设置宽度和高度 */}
        {width && height && (
          <>
            <div
              class="shape-resize shape-resize__top-left"
              onMousedown={(ev) =>
                onMousedown(ev, {
                  horizontal: Direction.start,
                  vertical: Direction.start,
                })
              }
            ></div>
            <div
              class="shape-resize shape-resize__top-right"
              onMousedown={(ev) =>
                onMousedown(ev, {
                  horizontal: Direction.end,
                  vertical: Direction.start,
                })
              }
            ></div>
            <div
              class="shape-resize shape-resize__bottom-left"
              onMousedown={(ev) =>
                onMousedown(ev, {
                  horizontal: Direction.start,
                  vertical: Direction.end,
                })
              }
            ></div>
            <div
              class="shape-resize shape-resize__bottom-right"
              onMousedown={(ev) =>
                onMousedown(ev, {
                  horizontal: Direction.end,
                  vertical: Direction.end,
                })
              }
            ></div>
          </>
        )}
      </Fragment>
    );
  },
});
