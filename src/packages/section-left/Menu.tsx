import { defineComponent, ref } from "vue";

import "./menu.scss";

export default defineComponent({
  name: "VisMenu",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const menutList = ref(props.data);

    const handle = {
      dragstart: (e: any) => {
        // console.log("dragstart");
        const index = e.target.dataset.index;
        // console.log(menutList.value[index], index);
        e.dataTransfer.setData("index", index);
      },
      drag: () => {
        // console.log("drag");
      },
      dragend: () => {
        // console.log("dragend");
      },
    };

    return () => {
      return (
        <div
          class="vis-menu__list"
          onDragstart={handle.dragstart}
          onDragend={handle.dragend}
          onDrag={handle.drag}
        >
          {menutList.value.map((item: any, index) => (
            <div class="item" key={index} draggable data-index={index}>
              <span class={`iconfont icon-${item.icon}`}>{item.label}</span>
            </div>
          ))}
        </div>
      );
    };
  },
});
