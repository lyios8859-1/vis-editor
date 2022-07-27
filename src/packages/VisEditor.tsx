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
      type: Array,
      default: () => [],
    },
  },
  emits: ["changeValue"],
  setup(props, { emit }) {
    const dataModel = useModel(
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
      drop: (index: string, params: any) => {
        if (!index) return;
        const idx = parseInt(index);

        const component = props.config[idx];

        console.log(params, deepcopy(component));

        const blocks = [...(dataModel.value || [])];
        // blocks.push(
        //   createNewBlock({
        //     component,
        //     ...params,
        //   })
        // );
      },

      preview: () => {
        state.preview = !state.preview;
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
      mousedown: (e: DragEvent) => {
        e.stopPropagation();
        // console.log("mouseDown");
      },
      mouseup: () => {
        // console.log("mouseup");
      },
    };

    const activeName = ref("attr");

    return () => {
      return (
        <Fragment>
          {state.editing ? (
            <div class="vis-editor__container">
              <Toolbar onPreview={methods.preview} onClose={methods.close} />

              <main class="vis-editor">
                {/* 左侧组件列表 */}
                <section class="editor-left">
                  <Menu data={props.config} />
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
                    // onDragenter={handle.dragenter}
                    // onDragleave={handle.dragleave}
                    onDrop={handle.drop}
                    // onMousedown={handle.mousedown}
                    // onMouseup={handle.mouseup}
                  >
                    <Editor editing={isEditing.value} />
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
