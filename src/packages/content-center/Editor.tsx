import { computed, defineComponent } from "vue";

import { changeStyleWithScale, canvasStyleData } from "../../utils";

import "./editor.scss";

export default defineComponent({
  name: "Editor",
  props: {
    editing: {
      type: Boolean,
      required: true,
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
          ContentEditor
        </div>
      );
    };
  },
});
