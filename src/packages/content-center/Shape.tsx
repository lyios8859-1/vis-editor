import { computed, defineComponent, onMounted, ref } from "vue";

import "./shape.scss";

export default defineComponent({
  name: "EditorShape",
  props: {
    isActive: {
      type: Boolean,
      default: true,
    },
    shape: {
      type: Object,
      default: () => {},
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const key = props.shape.componentKey;
    const render = props.config.menuMap[key].render;

    const shapeRef = ref({} as HTMLDivElement); // 这样写是在使用时候能保证已经渲染了,如果不能保证 需这样写 ref(null as null | HTMLDivElement);

    const shapeClass = computed(() => [
      "edit-shaper",
      key,
      { active: props.isActive },
    ]);

    const styles = computed(() => ({
      top: `${props.shape.props.top}px`,
      left: `${props.shape.props.left}px`,
      zIndex: props.shape.props.zIndex,
    }));

    onMounted(() => {
      const shape = props.shape;
      if (shape?.adjustPosition === true) {
        const { offsetHeight, offsetWidth } = shapeRef.value;
        // 保证拖拽的位置在鼠标点位置, 调整位置上下左右居于鼠标居中
        shape.props.left = shape.props.left - offsetWidth / 2;
        shape.props.top = shape.props.top - offsetHeight / 2;
        shape.adjustPosition = false;

        shape.props.width = offsetWidth;
        shape.props.height = offsetHeight;
      }
    });

    return () => {
      return (
        <div class={shapeClass.value} style={styles.value} ref={shapeRef}>
          {render()}
        </div>
      );
    };
  },
});
