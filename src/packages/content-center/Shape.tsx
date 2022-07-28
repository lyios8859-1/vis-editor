import { computed, defineComponent, onMounted, ref } from "vue";

import RotateOrResize from "./RotateOrResize";

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
      default: () => ({}),
    },
    config: {
      type: Object,
      default: () => ({}),
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
      width: `${props.shape.props.width}px`,
      height: `${props.shape.props.height}px`,
    }));

    onMounted(() => {
      const shape = props.shape;
      if (shape?.adjustPosition === true) {
        const { width, height } = shapeRef.value.getBoundingClientRect();
        // 保证拖拽的位置在鼠标点位置, 调整位置上下左右居于鼠标居中
        shape.props.left = shape.props.left - width / 2;
        shape.props.top = shape.props.top - height / 2;
        shape.adjustPosition = false;

        shape.props.width = width;
        shape.props.height = height;
      }
    });

    return () => {
      return (
        <div class={shapeClass.value} style={styles.value} ref={shapeRef}>
          {render()}

          {/* 控制大小或旋转 */}
          <RotateOrResize shape={props.shape} />
        </div>
      );
    };
  },
});
