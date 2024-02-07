import * as React from 'react';
import type { ViewStyle } from 'react-native';
export type MarqueeProps = React.PropsWithChildren<{
    speed?: number;
    spacing?: number;
    style?: ViewStyle;
    direction?:string;
    autofill?:boolean;
}>;
/**
 * Used to animate the given children in a horizontal manner.
 */
export declare const Marquee: React.MemoExoticComponent<({ speed, children, spacing, style,direction,autofill  }: MarqueeProps) => React.JSX.Element>;
//# sourceMappingURL=index.d.ts.map