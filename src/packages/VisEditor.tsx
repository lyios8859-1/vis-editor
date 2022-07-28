import {
  computed,
  defineComponent,
  Fragment,
  reactive,
  ref,
  Teleport,
} from "vue";

import { ElTabs, ElTabPane } from "element-plus";
import "element-plus/es/components/tabs/style/css";
import "element-plus/es/components/tab-pane/style/css";

import deepcopy from "deepcopy";

import { useModel } from "../utils/useModel";

import Toolbar from "./header/Toolbar";
import Menu from "./section-left/Menu";
import Editor from "./content-center/Editor";
import Preview from "./preview/Preview";

import "./viseditor.scss";
import { createNewShape } from "./VisEditor.utils";

export default defineComponent({
  name: "VisEditor",
  props: {
    // 画布区域呈现的视图数据信息
    data: {
      type: Array,
      default: () => [],
    },
    // 左侧菜单的列表配置
    config: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["changeValue", "save"],
  setup(props, { emit }) {
    const dataModel = useModel<any>(
      () => props.data,
      (val: any) => emit("changeValue", val)
    );

    const state = reactive({
      editing: true, // 关编辑页的预览
      preview: false, // 开启编辑页的预览
    });

    // 编辑状态
    const isEditing = computed(() => state.editing && !state.preview);

    const methods = {
      updateShapes: (shape?: any) => {
        if (shape) {
          // 更新数据
          const oldShapes = [...(dataModel.value || [])];
          const newShapes = [...oldShapes, shape];
          dataModel.value = deepcopy(newShapes);
        } else {
          // 清空数据
          dataModel.value = [];
        }
      },
      drop: (index: string, params: any) => {
        if (!index) return;
        const idx = parseInt(index);

        const component = (props.config.menus as any[])[idx];

        const shape = createNewShape({
          component,
          ...params,
        });
        // 向画布区域添加
        methods.updateShapes(shape);
      },

      preview: () => {
        state.preview = !state.preview;
      },
      save: () => {
        const data = deepcopy(dataModel.value);
        localStorage.setItem("canvasData", JSON.stringify(data));
        emit("save", data);
      },
      clear: () => {
        methods.updateShapes();
        localStorage.setItem("canvasData", JSON.stringify([]));
      },
      close: () => {
        state.editing = !state.editing;
      },
    };

    const handle = {
      dragenter: (e: DragEvent) => {
        // console.log("dragenter");
        e.dataTransfer!.dropEffect = "move";
      },
      dragover: (e: DragEvent) => {
        // console.log("dragover");
        e.preventDefault(); // 阻止默认事件是必须的，否则 drop 事件监听没效果
        e.dataTransfer!.dropEffect = "copy";
      },
      dragleave: (e: DragEvent) => {
        // console.log("dragleave");
        e.dataTransfer!.dropEffect = "none";
      },
      drop: (e: DragEvent) => {
        // console.log("drop");
        e.preventDefault();
        e.stopPropagation();

        const index = e.dataTransfer!.getData("index");
        const top = e.offsetY;
        const left = e.offsetX;
        methods.drop(index, {
          top,
          left,
        });
      },
    };

    const activeName = ref("attr");

    return () => {
      return (
        <Fragment>
          {state.editing ? (
            <div class="vis-editor__container">
              <Toolbar
                onPreview={methods.preview}
                onClose={methods.close}
                onSave={methods.save}
                onClear={methods.clear}
              />

              <main class="vis-editor">
                {/* 左侧组件列表 */}
                <section class="editor-left">
                  <Menu config={props.config} />
                </section>
                {/* 中间画布 */}
                <section class="editor-center">
                  <div
                    class={[
                      "editor-content",
                      "custom-bar",
                      { "is-editing": isEditing.value },
                      { "is-preview": state.preview },
                    ]}
                    onDragover={handle.dragover}
                    onDragenter={handle.dragenter}
                    onDragleave={handle.dragleave}
                    onDrop={handle.drop}
                  >
                    <Editor
                      editing={isEditing.value}
                      shapes={dataModel.value}
                      config={props.config}
                    />
                  </div>
                </section>
                {/* 右侧属性列表 */}
                <section class="editor-right">
                  <ElTabs v-model={activeName.value}>
                    <ElTabPane label="属性" name="attr">
                      <p class="placeholder">请选择组件 - 属性</p>
                    </ElTabPane>
                    <ElTabPane label="动画" name="animation">
                      <p class="placeholder">请选择组件 - 动画</p>
                    </ElTabPane>
                    <ElTabPane label="事件" name="events">
                      <p class="placeholder">请选择组件 - 事件</p>
                    </ElTabPane>
                  </ElTabs>
                </section>
              </main>
            </div>
          ) : (
            <Teleport to="body">
              <Preview onEditor={methods.close}>预览页面</Preview>
            </Teleport>
          )}
        </Fragment>
      );
    };
  },
});
