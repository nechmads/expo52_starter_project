import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { signOutUser } from "@/state/authState";
import { Screen } from "@/components/screens/Screen";

export default function HomeScreen() {
  return (
    <Screen>
      <Box className="w-full h-full justify-center items-center">
        <Button
          onPress={() => {
            signOutUser();
          }}
        >
          <ButtonText>Sign Out</ButtonText>
        </Button>
      </Box>
    </Screen>
  );
}
