import { useColorMode } from "@chakra-ui/color-mode";
import { ListItem, Text, UnorderedList } from "@chakra-ui/layout";
import React from "react";
import useOrderbookStore, { Order } from "../hooks/useOrderbookStore";

interface OrderBookTableProps {
  orders: Array<Order>;
  bidAskMax: number;
  isAsks?: boolean;
}

const Table: React.FC<OrderBookTableProps> = ({
  orders,
  bidAskMax,
  isAsks = false,
}) => {
  const { colorMode } = useColorMode();
  const methods = useOrderbookStore((ob) => ob.methods);

  const formattedOrders = orders.map((b) => ({
    total: methods.formatNumbers(b.total),
    size: methods.formatNumbers(b.size),
    price: methods.formatCurrency(b.price),
  }));
  const isDark = colorMode === "dark";
  const green = isDark ? "green.300" : "green.500";
  const red = isDark ? "red.300" : "red.500";
  const greenBG = "rgba(56, 161, 105, 0.3)";
  const redBG = "rgba(229, 62, 62, 0.3)";
  const gradientColor = isAsks ? redBG : greenBG;

  return (
    <UnorderedList margin="0px" padding="0px">
      {formattedOrders.map((order, i) => {
        const offset =
          100 - Math.round((orders[i].total / bidAskMax) * 100);

        return (
          <ListItem
            key={order.price}
            display="flex"
            flex="1"
            width="100%"
            height="30px"
            alignItems="center"
            pl="5px"
            pr="5px"
            borderRadius="3px"
            bgGradient={`linear(to-l, transparent ${offset}%, ${gradientColor} ${offset}%)`}
          >
            <Text flex="1" color={isAsks ? red : green}>
              {order.price}
            </Text>
            <Text flex="1" textAlign="right">
              {order.size}
            </Text>
            <Text flex="1" textAlign="right">
              {order.total}
            </Text>
          </ListItem>
        );
      })}
    </UnorderedList>
  );
};

export default Table;
