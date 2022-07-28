import { computed, defineComponent, onMounted, ref } from "vue";

import { changeStyleWithScale, canvasStyleData } from "../../utils";

import Shape from "./Shape";

import "./editor.scss";

export default defineComponent({
  name: "Editor",
  props: {
    editing: {
      type: Boolean,
      required: true,
    },
    shapes: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const editorClsName = computed(() => [
      "editor",
      { editing: props.editing },
    ]);
    const editorRef = ref({} as HTMLDivElement);
    onMounted(() => {
      const editor = editorRef.value.getBoundingClientRect();
      console.log(editor);
    });

    // 选中和未选中
    const focusData = computed(() => {
      const focus: any[] = [];
      const unFocus: any[] = [];
      (props.shapes || []).forEach((shape: any) =>
        (shape.focus ? focus : unFocus).push(shape)
      );
      return {
        unFocus, // 未选中的数据
        focus,
      };
    });

    // 记录拖动时的信息
    let dragState = {
      startX: 0,
      startY: 0,
      startLeft: 0,
      startTop: 0,
      dragging: false,
      startPos: [] as { left: number; top: number }[],
    };

    const methods = {
      mousemove: (e: MouseEvent) => {
        // console.log("move");
        let { clientX: moveX, clientY: moveY } = e;
        const { startX, startY, startPos } = dragState;

        focusData.value.focus.forEach((shape: any, index: number) => {
          shape.props.left = startPos[index].left + moveX - startX;
          shape.props.top = startPos[index].top + moveY - startY;
        });
      },
      mouseup: () => {
        document.removeEventListener("mousemove", methods.mousemove);
        document.removeEventListener("mouseup", methods.mouseup);
        console.log(focusData.value);
      },
    };

    const focusShapeHandler = {
      onMousedown: (e: MouseEvent, shape: any) => {
        // 如果没有选中组件 在画布上点击时需要调用 e.preventDefault() 防止触发 drop 事件
        // TODO
        // if (!curComponent) {
        //   e.preventDefault();
        // }
        e.stopPropagation();

        shape.focus = !shape.focus;

        dragState = {
          ...dragState,
          startX: e.clientX,
          startY: e.clientY,
          startLeft: shape.props.left,
          startTop: shape.props.top,
          // 控制了可以操作多个
          startPos: focusData.value.focus.map(({ props: style }) => ({
            left: style.left,
            top: style.top,
          })),
        };

        console.log("mouseDown", dragState);
        document.addEventListener("mousemove", methods.mousemove);
        document.addEventListener("mouseup", methods.mouseup);
      },
    };

    return () => {
      return (
        <div
          class={editorClsName.value}
          style={{
            width: changeStyleWithScale(canvasStyleData.width) + "px",
            height: changeStyleWithScale(canvasStyleData.height) + "px",
          }}
          ref={editorRef}
        >
          {props.shapes.map((shape: any, index) => (
            <Shape
              key={index}
              shape={shape}
              config={props.config}
              isActive={props.editing}
              {...{
                onMousedown: (e: MouseEvent) =>
                  focusShapeHandler.onMousedown(e, shape),
              }}
            />
          ))}
        </div>
      );
    };
  },
});
