import { ElButton } from "element-plus";
import { createVisEditorConfig } from "./VisEditor.utils";

const viseditorConfig = createVisEditorConfig();

viseditorConfig.registry("text", {
  label: "文本",
  preview: () => "预览文本",
  render: () => <span>文本</span>,
});

viseditorConfig.registry("button", {
  label: "按钮",
  preview: () => <ElButton>按钮</ElButton>,
  render: () => <ElButton>按钮</ElButton>,
});

export default viseditorConfig;
