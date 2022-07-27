import { defineComponent, Fragment } from "vue";

export default defineComponent({
  name: "editor-preview",
  emits: ["editor"],
  setup(_, { slots, emit }) {
    return () => (
      <div
        class="editor-preview"
        style={{ userSelect: "none", height: "100vh" }}
        onDblclick={() => emit("editor")}
      >
        <p>双击页面关闭</p>
        {slots.default && slots.default()}
      </div>
    );
  },
});
