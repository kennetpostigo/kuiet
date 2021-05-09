import { renderHook, act } from "@testing-library/react-hooks";
import useOrderbookStore from "./useOrderbookStore";

describe("useOrderbookStore", () => {
  test("correctly sets initialState", () => {
    const { result } = renderHook(() => useOrderbookStore());
    expect(result.current.asks).toEqual({});
    expect(result.current.bids).toEqual({});
    expect(result.current.group).toEqual(0.5);
    expect(result.current.limit).toEqual(12);
  });

  test("sets the next ask/bid state on action.update -> method.computeNextOrder", () => {
    const { result } = renderHook(() => useOrderbookStore());
    act(() =>
      result.current.actions.update({
        asks: [
          [1, 10],
          [1, 10],
          [2, 20],
          [2, 20],
          [3, 0],
        ],
        bids: [
          [4, 40],
          [5, 50],
        ],
      })
    );

    expect(result.current.asks).toEqual({
      1: { price: 1, size: 10, total: 20, show: true },
      2: { price: 2, size: 20, total: 40, show: true },
      3: { price: 3, size: 0, total: 0, show: false },
    });
    expect(result.current.bids).toEqual({
      4: { price: 4, size: 40, total: 40, show: true },
      5: { price: 5, size: 50, total: 50, show: true },
    });
    expect(result.current.group).toEqual(0.5);
    expect(result.current.limit).toEqual(12);
  });

  test("increment group with actions.incGroup", () => {
    const { result } = renderHook(() => useOrderbookStore());
    act(() => result.current.actions.incGroup());

    expect(result.current.group).toEqual(1);
  });

  test("decrement group with actions.decGroup", () => {
    const { result } = renderHook(() => useOrderbookStore());
    act(() => result.current.actions.decGroup());

    expect(result.current.group).toEqual(0.5);
  });

  test("compute groupedOrders with methods.groupOrders", () => {
    const { result } = renderHook(() => useOrderbookStore());

    act(() =>
      result.current.actions.update({
        asks: [
          [1.2, 10],
          [1.5, 10],
          [1.7, 10],
          [2.2, 10],
          [2.5, 10],
          [2.7, 10],
        ],
        bids: [
          [4.2, 10],
          [4.5, 10],
          [4.7, 10],
          [5.2, 10],
          [5.5, 10],
          [5.7, 10],
        ],
      })
    );

    const groupedAsks = result.current.methods.groupOrders(
      result.current.asks,
      result.current.group,
      result.current.limit,
      true
    );

    const groupedBids = result.current.methods.groupOrders(
      result.current.bids,
      result.current.group,
      result.current.limit
    );

    expect(groupedAsks).toEqual([
      { price: 2.5, size: 10, total: 40, show: true },
      { price: 2, size: 20, total: 30, show: true },
      { price: 1.5, size: 10, total: 20, show: true },
      { price: 1, size: 10, total: 10, show: true },
    ]);
    expect(groupedBids).toEqual([
      { price: 5.5, size: 10, total: 10, show: true },
      { price: 5, size: 50, total: 20, show: true },
      { price: 4.5, size: 10, total: 30, show: true },
      { price: 4, size: 40, total: 40, show: true },
    ]);
    expect(result.current.group).toEqual(0.5);
    expect(result.current.limit).toEqual(12);
  });

  test("get orders min/max with methods.getMinMax", () => {
    const { result } = renderHook(() => useOrderbookStore());

    const groupedAsks = result.current.methods.groupOrders(
      result.current.asks,
      result.current.group,
      result.current.limit,
      true
    );

    const groupedBids = result.current.methods.groupOrders(
      result.current.bids,
      result.current.group,
      result.current.limit
    );

    const { min: minAsk, max: maxAsk } = result.current.methods.getMinMax(
      groupedAsks
    );
    const { min: minBid, max: maxBid } = result.current.methods.getMinMax(
      groupedBids
    );

    expect(minAsk.price).toEqual(1);
    expect(maxAsk.price).toEqual(2.5);
    expect(minBid.price).toEqual(4);
    expect(maxBid.price).toEqual(5.5);
  });

  test("compute spread with methods.getSpread", () => {
    const { result } = renderHook(() => useOrderbookStore());

    const groupedAsks = result.current.methods.groupOrders(
      result.current.asks,
      result.current.group,
      result.current.limit,
      true
    );

    const groupedBids = result.current.methods.groupOrders(
      result.current.bids,
      result.current.group,
      result.current.limit
    );

    const { min: minAsk } = result.current.methods.getMinMax(groupedAsks);
    const { max: maxBid } = result.current.methods.getMinMax(groupedBids);

    const {
      spread,
      spreadBase,
      spreadPercentage,
    } = result.current.methods.getSpread(maxBid.price, minAsk.price);

    expect(spread).toEqual(4.5);
    expect(spreadPercentage).toEqual(81.82);
    expect(spreadBase).toEqual(maxBid.price);
  });

  test("format currency", () => {
    const { result } = renderHook(() => useOrderbookStore());
    const formatted = result.current.methods.formatCurrency(123.4501);

    expect(formatted).toEqual("$123.45");
  });

  test("format number", () => {
    const { result } = renderHook(() => useOrderbookStore());
    const formatted = result.current.methods.formatNumbers(123.4501);

    expect(formatted).toEqual("123.45");
  });
});
