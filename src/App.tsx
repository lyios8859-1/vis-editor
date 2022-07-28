import { defineComponent, ref, watch } from "vue";

import VisEditor from "./packages/VisEditor";
import viseditorConfig from "./packages/VisEditorConf";

export default defineComponent({
  name: "App",
  setup() {
    const menuDatas = ref(viseditorConfig);

    const data = JSON.parse(localStorage.getItem("canvasData") || "[]");
    const canvasDatas = ref(data || []);

    const handle = {
      change: (value: any) => {
        console.log("change:", value);
      },
      save: (value: any) => {
        console.log("save:", value);
      },
    };

    return () => {
      return (
        <VisEditor
          data={canvasDatas.value}
          config={menuDatas.value}
          onChangeValue={handle.change}
          onSave={handle.save}
        />
      );
    };
  },
});
