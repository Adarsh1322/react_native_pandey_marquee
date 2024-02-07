import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import Animated, { runOnJS, useAnimatedReaction, useAnimatedStyle, useFrameCallback, useSharedValue } from 'react-native-reanimated';
const AnimatedChild = _ref => {
  let {
    index,
    children,
    anim,
    textWidth,
    spacing,
    direction
  } = _ref;
  const stylez = useAnimatedStyle(() => {
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
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: stylez
  }, children);
};
/**
 * Used to animate the given children in a horizontal manner.
 */
export const Marquee = /*#__PURE__*/React.memo(_ref2 => {
  let {
    speed = 1,
    children,
    spacing = 0,
    style
  } = _ref2;
  const parentWidth = useSharedValue(0);
  const textWidth = useSharedValue(0);
  const [cloneTimes, setCloneTimes] = React.useState(0);
  const anim = useSharedValue(0);
  useFrameCallback(() => {
    anim.value += speed;
  }, true);
  useAnimatedReaction(() => {
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
    runOnJS(setCloneTimes)(v * 2);
  }, []);
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: style,
    onLayout: ev => {
      parentWidth.value = ev.nativeEvent.layout.width;
    },
    pointerEvents: "box-none"
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: styles.row,
    pointerEvents: "box-none"
  }, /*#__PURE__*/React.createElement(Animated.ScrollView, {
    horizontal: true,
    style: styles.hidden,
    pointerEvents: "box-none"
  }, /*#__PURE__*/React.createElement(View, {
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
const styles = StyleSheet.create({
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