import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useIdle } from "react-use";
import useOrderbookStore from "./useOrderbookStore";

// @ts-ignore
const WS_URL: string = process.env.REACT_APP_WS_URL;
const requestMessage = {
  event: "subscribe",
  feed: "book_ui_1",
  product_ids: ["PI_XBTUSD"],
};

const THIRTY_SECONDS = 30000;

const useCryptoFacilities = () => {
  const isIdle = useIdle(THIRTY_SECONDS);
  const actions = useOrderbookStore((ob) => ob.actions);
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    { retryOnError: true }
  );

  useEffect(() => {
    if (readyState !== ReadyState.OPEN) return;
    sendJsonMessage(requestMessage);
  }, [readyState, sendJsonMessage]);

  useEffect(() => {
    if (lastJsonMessage && !isIdle) actions.update(lastJsonMessage);
  }, [actions, lastJsonMessage, isIdle]);

  return { isReady: readyState === ReadyState.CONNECTING };
};

export default useCryptoFacilities;
