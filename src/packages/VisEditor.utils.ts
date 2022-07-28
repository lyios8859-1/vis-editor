export function createVisEditorConfig() {
  const menus: any[] = []; // 左侧菜单组件列表
  const menuMap: Record<string, any> = {};
  return {
    menus,
    menuMap,
    registry: <
      Props extends Record<string, any>,
      Model extends Record<string, string>
    >(
      key: string,
      component: {
        label: string;
        preview: () => JSX.Element | string;
        render: (data: {
          size: {
            width?: number;
            height?: number;
          };
          custom: Record<string, any>;
          props: Record<string, any>;
          model: Partial<Record<string, any>>;
        }) => JSX.Element;
        props?: Props;
        model?: Model;
        resize?: {
          width?: boolean;
          height?: boolean;
        };
      }
    ) => {
      const comp = { ...component, key };
      menus.push(comp);
      menuMap[key] = comp;
    },
  };
}

// 公共样式
const commonStyle = {
  rotate: 0,
  opacity: 1,
};

const commonAttr = {
  animations: [],
  events: {},
  groupStyle: {}, // 当一个组件成为 Group 的子组件时使用
  adjustPosition: true, // 调整精确的鼠标位置
  isLock: false, // 是否锁定组件
  isResize: false, // 是否可以调整大小
  isActive: false, // 是否选中状态
};

export function createNewShape({
  component,
  top,
  left,
}: {
  component: any;
  top: number;
  left: number;
}): any {
  return {
    // 用来标识是什么组件, 映射 VisEditorConfig 中 menuMap 的 component 对象
    componentKey: component!.key,
    // 组件右侧配置的相关属性
    props: {
      top,
      left,
      zIndex: 0,
      width: "auto",
      height: "auto",
      fontSize: 14,
      fontWeight: 400,
      letterSpacing: 0,
      textAlign: "",
      color: "",
      ...commonStyle,
    },
    // 绑定的字段
    model: {},
    ...commonAttr,
  };
}
