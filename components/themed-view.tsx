import { useThemeColor } from '@/hooks/use-theme-color';
import { SafeAreaView , type SafeAreaViewProps} from 'react-native-safe-area-context';

export type ThemedViewProps = SafeAreaViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'bg');

  return <SafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
}
