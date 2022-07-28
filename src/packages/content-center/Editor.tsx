import { computed, defineComponent } from "vue";

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
    return () => {
      return (
        <div
          class={editorClsName.value}
          style={{
            width: changeStyleWithScale(canvasStyleData.width) + "px",
            height: changeStyleWithScale(canvasStyleData.height) + "px",
          }}
        >
          {props.shapes.map((shape: any, index) => (
            <Shape
              shape={shape}
              config={props.config}
              isActive={props.editing}
            />
          ))}
        </div>
      );
    };
  },
});
