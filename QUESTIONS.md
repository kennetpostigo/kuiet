1. What would you add to your solution if you had more time?

   - Rerender the UI in 500ms - 1000ms interval using zustands transient updates
   - Implement the row order highlight
   - Use window size observer to update the limit based on screen size

2. What would you have done differently if you knew this page was going to get thousands of views per second vs per week?

   - use nextjs in order to easily use browser cache to aggressively cache
     assets and and static dependencies/app bundles

3. What was the most useful feature that was added to the latest version of your chosen language? Please include a snippet of code that shows how you've used it.

   - Optional Chaining

   ```tsx
   update: (orders) =>
     set((state) => ({
       asks: state.methods.computeNextOrders(state.asks, orders?.asks || []),
       bids: state.methods.computeNextOrders(state.bids, orders?.bids || []),
     }));
   ```

4. How would you track down a performance issue in production? Have you ever had to do this?

   - I would use the performance tab to record the parts of the application
     that have a performance issue to find out where most time is being spent
     and how to avoid or minimize that bottleneck. The performance tab allows you
     to inspect recorded profiles and inspect the callstack/timespent and memory
     usage.

5. Can you describe common security concerns to consider for a frontend developer?

   - XXS attacks, this happens when inputs, event
     handlers, and potentially variables used in templates or markup. React helps
     with these because it escapes and sanitazes inputs, and doesn't set string
     event handlers.
   - CSRF are a type of authenticated attack where cookies are hi-jacked by
     another malicious site and performs unwanted actions on a trusted site. It
     can be easy to mistakenly forget to set SameSite/Secure/HttpOnly cookie
     attribute to avoid this from happening.

6. How would you improve the API that you just used?

   - Add a heartbeat websocket event
   - It would be nice if the response from the websocket endpoint had a consistent
     shape, whe initially connecting the shape or the websocket response changes twice,
     so it is something you have to guard against in code.
   - Some documentation would have been nice to have
