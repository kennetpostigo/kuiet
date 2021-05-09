import React from "react";
import { Sentry } from "react-activity";
import { Box, Heading } from "@chakra-ui/layout";
import { useColorMode } from "@chakra-ui/color-mode";
import useCryptoFacilities from "../hooks/useCryptoFacilities";
import useOrderbookStore from "../hooks/useOrderbookStore";
import OrderbookTable from "./OrderbookTable";
import OrderbookInfoControls from "./OrderbookInfoControls";

const TITLES = ["PRICE", "SIZE", "TOTAL"];

interface OrderBookProps {}
const OrderBook: React.FC<OrderBookProps> = () => {
  const { colorMode } = useColorMode();
  const { isReady } = useCryptoFacilities();
  const group = useOrderbookStore((ob) => ob.group);
  const limit = useOrderbookStore((ob) => ob.limit);
  const asks = useOrderbookStore((ob) => ob.asks);
  const bids = useOrderbookStore((ob) => ob.bids);
  const methods = useOrderbookStore((ob) => ob.methods);

  const isDark = colorMode === "dark";
  const finalBids = methods.groupOrders(bids, group, limit);
  const finalAsks = methods.groupOrders(asks, group, limit, true);

  const { max: maxBid } = methods.getMinMax(finalBids);
  const { max: maxAsk } = methods.getMinMax(finalAsks);
  const max = Math.max(maxBid?.total, maxAsk?.total);

  return (
    <Box width="100%" height="100%" display="flex" alignItems="center">
      {isReady ? (
        <Box
          width="100%"
          height="500px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Sentry size={50} />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" padding="10px" margin="20px">
          <OrderbookInfoControls
            asks={finalAsks}
            bids={finalBids}
            group={group}
          />
          <Box
            width="350px"
            padding="10px"
            bg={isDark ? "gray.700" : "gray.50"}
            borderRadius="0.375rem"
            borderWidth="1px"
            borderColor={isDark ? "gray.800" : "gray.200"}
          >
            <Box display="flex" height="30px" pl="5px" pr="5px">
              {TITLES.map((title) => (
                <Heading
                  key={title}
                  flex="1"
                  fontSize="16px"
                  textAlign={title === "PRICE" ? "left" : "right"}
                >
                  {title}
                </Heading>
              ))}
            </Box>
            <OrderbookTable orders={finalAsks} bidAskMax={max} isAsks={true} />
            <OrderbookTable orders={finalBids} bidAskMax={max} isAsks={false} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OrderBook;
