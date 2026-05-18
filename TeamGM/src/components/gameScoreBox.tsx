import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

export function GameScoreBox() {
  return (
    <Box className="bg-teamgm-surface rounded-lg p-4">
      <Text className="text-teamgm-text-primary">Game Score</Text>
    </Box>
  );
}