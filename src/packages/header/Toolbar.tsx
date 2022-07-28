import { defineComponent, Fragment, handleError, ref } from "vue";

import { ElButton } from "element-plus";
import "element-plus/es/components/button/style/css";

import "./toolbar.scss";

export default defineComponent({
  name: "VisToolbar",
  emits: ["preview", "close", "save", "clear"],
  setup(props, { emit }) {
    const handle = {
      undo: () => {},
      redo: () => {},
      fileChange: () => {},

      preview: () => emit("preview"),
      close: () => emit("close"),
      save: () => emit("save"),
      clear: () => emit("clear"),

      compose: () => {},
      decompose: () => {},
      lock: () => {},
      unlock: () => {},
    };

    return () => {
      return (
        <div class="vis-editor__toolbar">
          <ElButton onClick={handle.undo}>撤消</ElButton>
          <ElButton onClick={handle.redo}>重做</ElButton>
          <ElButton onClick={handle.preview}>预览</ElButton>
          <ElButton onClick={handle.close}>关闭</ElButton>
          <ElButton onClick={handle.save}>保存</ElButton>
          <ElButton onClick={handle.clear}>清空</ElButton>
          <ElButton onClick={handle.compose}>组合</ElButton>
          <ElButton onClick={handle.decompose}>拆分</ElButton>
          <ElButton onClick={handle.lock}>锁定</ElButton>
          <ElButton onClick={handle.unlock}>解锁</ElButton>
          <label for="input" class="insert">
            插入图片
            <input id="input" type="file" hidden onChange={handle.fileChange} />
          </label>
        </div>
      );
    };
  },
});
