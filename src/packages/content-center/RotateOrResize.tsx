import { defineComponent, Fragment } from "vue";
import { ElIcon } from "element-plus";
import { Lock, Refresh } from "@element-plus/icons";

import "./rotate-resize.scss";

export default defineComponent({
  name: "RotateOrResize",
  setup() {
    const width = true;
    const height = true;
    const lock = false;
    const rotate = false;
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
            <div class="shape-resize shape-resize__top"></div>
            <div class="shape-resize shape-resize__bottom"></div>
          </>
        )}
        {/* 支持设置宽度 */}
        {width && (
          <>
            <div class="shape-resize shape-resize__left"></div>
            <div class="shape-resize shape-resize__right"></div>
          </>
        )}
        {/* 支持设置宽度和高度 */}
        {width && height && (
          <>
            <div class="shape-resize shape-resize__top-left"></div>
            <div class="shape-resize shape-resize__top-right"></div>
            <div class="shape-resize shape-resize__bottom-left"></div>
            <div class="shape-resize shape-resize__bottom-right"></div>
          </>
        )}
      </Fragment>
    );
  },
});
