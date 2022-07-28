import { defineComponent, ref } from "vue";

import "./menu.scss";

export default defineComponent({
  name: "VisMenu",
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const menutList = ref(props.config.menus);
    const current = ref(-1);
    const handle = {
      dragstart: (e: any) => {
        const index = e.target.dataset.index;
        // console.log("dragstart", index);
        // console.log(menutList.value[index]);

        e.dataTransfer.setData("index", index);
      },
      dragend: (e: Event) => {
        current.value = -1;
        e.currentTarget?.removeEventListener("dragstart", handle.dragstart);
      },
      mousedown: (e: any) => {
        current.value = parseInt(e.target.dataset.index);
        e.currentTarget?.addEventListener("dragstart", handle.dragstart);
      },
      mouseup: (e: Event) => {
        current.value = -1;
        e.currentTarget?.removeEventListener("dragstart", handle.dragstart);
      },
    };

    return () => {
      return (
        <div
          class="vis-menu__list"
          onMousedown={handle.mousedown}
          onMouseup={handle.mouseup}
          onDragend={handle.dragend}
        >
          {menutList.value.map((item: any, index: number) => (
            <div
              class="item"
              key={index}
              draggable={current.value === index}
              data-index={index}
            >
              <span class={`iconfont icon-${item.icon}`} data-index={index}>
                {item.label}
              </span>
              <span v-show={false}>{item.preview()}</span>
            </div>
          ))}
        </div>
      );
    };
  },
});
