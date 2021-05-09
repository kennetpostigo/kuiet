import create from "zustand";

export type RawOrder = [number, number];
export type Orders = { [key: string]: Order };
export type Order = {
  price: number;
  size: number;
  total: number;
  show: boolean;
};

export type OrderbookStore = {
  asks: Orders;
  bids: Orders;
  group: number;
  limit: number;
  methods: {
    formatCurrency: (currency: number) => string;
    formatNumbers: (number: number) => string;
    getMinMax: (orders: Array<Order>) => { min: Order; max: Order };
    getSpread: (
      maxBid: number,
      minAsk: number
    ) => { spread: number; spreadBase: number; spreadPercentage: number };
    groupOrders: (
      orders: Orders,
      group: number,
      limit: number,
      isAsk?: boolean
    ) => Array<Order>;
    computeNextOrders: (
      currentOrders: Orders,
      updateOrders: Array<RawOrder>
    ) => Orders;
  };
  actions: {
    incGroup: () => void;
    decGroup: () => void;
    update: (order: { bids?: Array<RawOrder>; asks?: Array<RawOrder> }) => void;
  };
};

const useOrderbookStore = create<OrderbookStore>((set) => ({
  asks: {},
  bids: {},
  group: 0.5,
  limit: 12,
  methods: {
    formatCurrency: (currency: number) => {
      return currency.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },
    formatNumbers: (number) => {
      return number.toLocaleString("en-US");
    },
    getMinMax: (orders) => ({ min: orders[orders.length - 1], max: orders[0] }),
    getSpread: (maxBid, minAsk) => {
      const spread = maxBid > minAsk ? maxBid - minAsk : minAsk - maxBid;
      const spreadBase = maxBid;
      return {
        spread,
        spreadBase,
        spreadPercentage: Math.round((spread / spreadBase) * 10000) / 100,
      };
    },
    groupOrders: (orders, group, limit, isAsk = false) => {
      const groups = Object.values(orders).reduce((grouped: Orders, order) => {
        const round = isAsk ? Math.ceil : Math.floor;
        const price = round(order.price / group) * group;
        const sPrice = `${price}`;
        if (!grouped[sPrice]) {
          grouped[sPrice] = {
            price,
            size: order.size,
            total: order.size,
            show: order.show,
          };
          return grouped;
        }

        grouped[sPrice].total = order.size;
        return grouped;
      }, {});

      const groupOrders = Object.values(groups)
        .sort((a, b) => (isAsk ? a.price - b.price : b.price - a.price))
        .filter((order) => order.show)
        .slice(0, limit);

      const totaled = groupOrders
        .reduce(
          (next: { orders: Array<Order>; currentTotal: number }, order) => {
            next.currentTotal = next.currentTotal + order.total;
            order.total = next.currentTotal;
            next.orders.push(order);

            return next;
          },
          { orders: [], currentTotal: 0 }
        )
        .orders.sort((a, b) => b.price - a.price);

      return totaled;
    },
    computeNextOrders: (currentOrders, updateOrders) => {
      return (updateOrders || []).reduce((acc, [price, size]) => {
        if (!acc[price]) {
          acc[price] = {
            price: price,
            size: size,
            total: size,
            show: size === 0 ? false : true,
          };
          return acc;
        }

        acc[price].size = size === 0 ? acc[price].size : size;
        acc[price].total = acc[price].total + size;
        acc[price].show = size === 0 ? false : true;
        return acc;
      }, currentOrders);
    },
  },
  actions: {
    incGroup: () =>
      set((state) => ({
        group: state.group < 1250 ? state.group * 2 : state.group,
      })),
    decGroup: () =>
      set((state) => ({
        group: state.group > 0.5 ? state.group / 2 : state.group,
      })),
    update: (orders) =>
      set((state) => ({
        asks: state.methods.computeNextOrders(state.asks, orders?.asks || []),
        bids: state.methods.computeNextOrders(state.bids, orders?.bids || []),
      })),
  },
}));

export default useOrderbookStore;
