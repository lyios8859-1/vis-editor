import { defineComponent, ref, watch } from "vue";

import VisEditor from "./packages/VisEditor";
import editorConf from "./packages/VisEditorConf";

export default defineComponent({
  name: "App",
  setup() {
    const menuDatas = ref(editorConf);
    const canvasDatas = ref([]);

    const handleChange = (value: any) => {
      console.log("value:", value);
    };

    return () => {
      return (
        <VisEditor
          data={canvasDatas.value}
          config={menuDatas.value}
          onChangeValue={handleChange}
        />
      );
    };
  },
});
