import  React,{useState,memo,PropsWithChildren} from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { View, Dimensions } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

const AnimatedChild = ({
  index,
  children,
  anim,
  textWidth,
  spacing,
  direction,
  autofill,
}: React.PropsWithChildren<{
  index: number;
  anim: SharedValue<number>;
  textWidth: SharedValue<number>;
  spacing: number;
  direction:string;
  autofill?:boolean;
}>) => {

  const actualDirection = direction || 'left'; 

  const stylez = useAnimatedStyle(() => {
    const translateValue =
    actualDirection === 'left'
        ? -(anim.value % (textWidth.value + spacing ))
        : anim.value % (textWidth.value + spacing);
      
    return {
      position: 'absolute',
      left: index * (textWidth.value + spacing),
      transform: [{ translateX: translateValue }],

    };
  }, [index, spacing, textWidth, direction, autofill]); // Include 'direction' in the dependencies array

  return <Animated.View style={stylez}>{children}</Animated.View>;
};


export type MarqueeProps = PropsWithChildren<{
  speed?: number;
  spacing?: number;
  style?: ViewStyle;
  direction?:string;
  autofill?: boolean; // New prop to control autofill behavior
}>;

/**
 * Used to animate the given children in a horizontal manner.
 */
export const Marquee = memo(
  ({ speed = 1, children, spacing = 0, style,direction = 'left',autofill }: MarqueeProps) => {
    const parentWidth = useSharedValue(0);
    const textWidth = useSharedValue(0);
    const [cloneTimes, setCloneTimes] = useState(0);
    const anim = useSharedValue(0);

    useFrameCallback(() => {
      anim.value += speed;
    }, true);

    useAnimatedReaction(
      () => {
        if (textWidth.value === 0 || parentWidth.value === 0) {
          return 0;
        }
        return Math.round(parentWidth.value / textWidth.value) + 1;
      },
      (v) => {
        if (v === 0) {
          return ;
        }
        // This is going to cover the case when the text/element size
        // is greater than the actual parent size
        // Double this to cover the entire screen twice, in this way we can
        // reset the position of the first element when its going to move out
        // of the screen without any noticible glitch
        runOnJS(setCloneTimes)(v * 2);
      },
      []
    );


    return (
      <Animated.View
        style={style}
        onLayout={(ev) => {
          parentWidth.value = ev.nativeEvent.layout.width;          
        }}
        pointerEvents="box-none"
      >
        <Animated.View style={direction === 'left'?styles.row : styles.row2} pointerEvents="box-none">
          {
            // We are adding the text inside a ScrollView because in this way we
            // ensure that its not going to "wrap".
          }
          <Animated.ScrollView
            horizontal
            style={styles.hidden}
            pointerEvents={autofill ? 'box-none' : 'auto'} 
          >
            <View
              onLayout={(ev) => {
                textWidth.value = autofill ? ev.nativeEvent.layout.width : Dimensions.get('window').width;
              }}
            >
                {children}
            </View>
          </Animated.ScrollView>
          {cloneTimes > 0 &&
            [...Array(cloneTimes).keys()].map((index) => {
              console.log('check textwidth:', textWidth);
              
              return (
                <AnimatedChild
                  key={`clone-${index}`}
                  index={index}
                  anim={anim}
                  textWidth={textWidth}
                  spacing={spacing}
                  direction={direction}
                  autofill={autofill}
                >
                 {children}
                </AnimatedChild>
              );
            })}
        </Animated.View>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  hidden: { opacity: 0, zIndex: -9999, },
  row: { flexDirection: 'row', overflow: 'hidden'},
  row2: { flexDirection:'row-reverse', overflow: 'scroll'},

});
