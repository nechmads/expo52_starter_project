import { VStack } from "@/components/ui/vstack";
import classnames from "classnames";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps extends React.ComponentProps<typeof VStack> {}

export const Screen: React.FC<ScreenProps> = ({ children, className, ...props }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <VStack
        className={classnames("w-full h-full px-4 bg-screenBackground", className)}
        {...props}
      >
        {children}
      </VStack>
    </SafeAreaView>
  );
};
