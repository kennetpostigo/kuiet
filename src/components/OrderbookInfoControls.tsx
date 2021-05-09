import React from "react";
import { Button } from "@chakra-ui/button";
import { Box, Text } from "@chakra-ui/layout";
import { useColorMode } from "@chakra-ui/color-mode";
import useOrderbookStore, { Order } from "../hooks/useOrderbookStore";

interface OrderbookInfoControlsProps {
  bids: Array<Order>;
  asks: Array<Order>;
  group: number;
}

const OrderbookInfoControls: React.FC<OrderbookInfoControlsProps> = ({
  bids,
  asks,
  group,
}) => {
  const { colorMode } = useColorMode();
  const actions = useOrderbookStore((ob) => ob.actions);
  const methods = useOrderbookStore((ob) => ob.methods);
  const { max: maxBid } = methods.getMinMax(bids);
  const { min: minAsk } = methods.getMinMax(asks);
  const { spread, spreadPercentage } = methods.getSpread(
    maxBid?.price,
    minAsk?.price
  );

  const isDark = colorMode === "dark";

  return (
    <Box display="flex" width="100%" flex="1" alignItems="center" mb="10px">
      <Box flex="0.5">
        <Box
          display="flex"
          flexDirection="column"
          width="50px"
          alignItems="center"
        >
          <Text color={isDark ? "blue.100" : "gray.500"} fontSize="sm">
            {spread.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <Text color={isDark ? "blue.100" : "gray.500"} fontSize="sm">
            Spread
          </Text>
        </Box>
      </Box>

      <Box display="flex" flex="2" justifyContent="center">
        <Text color={isDark ? "blue.100" : "gray.500"} fontSize="sm">
          (
          {spreadPercentage.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
          %)
        </Text>
        <Text
          color={isDark ? "blue.100" : "gray.500"}
          ml="10px"
          mr="10px"
          fontSize="sm"
        >
          |
        </Text>
        <Text color={isDark ? "blue.100" : "gray.500"} fontSize="sm">
          Group: {group.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </Text>
      </Box>

      <Box display="flex" flex="0.5">
        <Button
          variant="ghost"
          size="xs"
          fontSize="md"
          onClick={actions.decGroup}
        >
          -
        </Button>
        <Button
          variant="ghost"
          size="xs"
          fontSize="md"
          onClick={actions.incGroup}
        >
          +
        </Button>
      </Box>
    </Box>
  );
};

export default OrderbookInfoControls;
