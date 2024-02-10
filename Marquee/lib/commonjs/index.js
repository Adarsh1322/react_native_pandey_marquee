"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Marquee = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const AnimatedChild = _ref => {
  let {
    index,
    children,
    anim,
    textWidth,
    spacing,
    direction,
  } = _ref;
  const stylez = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const translateValue =
      direction === 'left'
        ? -(anim.value % (textWidth.value + spacing))
        : anim.value % (textWidth.value + spacing);
    return {
      position: 'absolute',
      left: index * (textWidth.value + spacing),
      transform: [{ translateX: translateValue }],
      // transform: [{
      //   translateX: -(anim.value % (textWidth.value + spacing))
      // }]
    };
  }, [index, spacing, textWidth,direction]);
  return /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
    style: stylez
  }, children);
};
/**
 * Used to animate the given children in a horizontal manner.
 */
const Marquee = /*#__PURE__*/React.memo(_ref2 => {
  let {
    speed = 1,
    children,
    spacing = 0,
    style
  } = _ref2;
  const parentWidth = (0, _reactNativeReanimated.useSharedValue)(0);
  const textWidth = (0, _reactNativeReanimated.useSharedValue)(0);
  const [cloneTimes, setCloneTimes] = React.useState(0);
  const anim = (0, _reactNativeReanimated.useSharedValue)(0);
  (0, _reactNativeReanimated.useFrameCallback)(() => {
    anim.value += speed;
  }, true);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => {
    if (textWidth.value === 0 || parentWidth.value === 0) {
      return 0;
    }
    return Math.round(parentWidth.value / textWidth.value) + 1;
  }, v => {
    if (v === 0) {
      return;
    }
    // This is going to cover the case when the text/element size
    // is greater than the actual parent size
    // Double this to cover the entire screen twice, in this way we can
    // reset the position of the first element when its going to move out
    // of the screen without any noticible glitch
    (0, _reactNativeReanimated.runOnJS)(setCloneTimes)(v * 2);
  }, []);
  return /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
    style: style,
    onLayout: ev => {
      parentWidth.value = ev.nativeEvent.layout.width;
    },
    pointerEvents: "box-none"
  }, /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
    style: styles.row,
    pointerEvents: "box-none"
  }, /*#__PURE__*/React.createElement(_reactNativeReanimated.default.ScrollView, {
    horizontal: true,
    style: styles.hidden,
    pointerEvents: "box-none"
  }, /*#__PURE__*/React.createElement(_reactNative.View, {
    onLayout: ev => {
      textWidth.value = ev.nativeEvent.layout.width;
    }
  }, children)), cloneTimes > 0 && [...Array(cloneTimes).keys()].map(index => {
    return /*#__PURE__*/React.createElement(AnimatedChild, {
      key: `clone-${index}`,
      index: index,
      anim: anim,
      textWidth: textWidth,
      spacing: spacing,
      direction:direction
    }, children);
  })));
});
exports.Marquee = Marquee;
const styles = _reactNative.StyleSheet.create({
  hidden: {
    opacity: 0,
    zIndex: -9999
  },
  row: {
    flexDirection: 'row',
    overflow: 'hidden'
  }
});
//# sourceMappingURL=index.js.map