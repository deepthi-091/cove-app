# State Management Comparison Guide

This document compares different state management approaches and explains when to use each in the cove-app shopping application.

## 1. Context API

**Used in cove-app for:** User authentication and profile data

### When to Use
- Low-frequency state updates (login/logout happen once per session)
- State that needs to be accessed across many components (auth status, user info)
- Simple state without complex reducers (no "dispatch action" patterns needed)
- Building apps without external dependencies (Context is built into React)
- Theme, locale, or global settings that rarely change

### Pros
- ✅ **Zero dependencies**: Built into React, no additional packages needed
- ✅ **Simple to understand**: Easy to set up and reason about
- ✅ **Good for auth**: Natural fit for managing login state and user data
- ✅ **Easy debugging**: State is just React state, standard React DevTools work
- ✅ **Minimal boilerplate**: One provider + useContext hook

### Cons
- ❌ **Performance**: Every context consumer re-renders when context value changes (use `React.memo` + `useMemo` to mitigate)
- ❌ **Not for frequent updates**: High-frequency mutations (cart item increments, form inputs) cause many unnecessary re-renders
- ❌ **No time-travel debugging**: Can't replay state changes like Redux DevTools
- ❌ **Manual persistence**: Have to manually wire localStorage/AsyncStorage (we use AuthContext + storage.getUser)

### Example in cove-app
```tsx
// src/context/AuthContext.tsx
const { user, isAuthenticated, login, logout } = useAuth();
// Used in: Login, Profile, Home (welcome message), index.tsx (auth gate)
```

---

## 2. Redux (Manual)

**Used in cove-app for:** Shopping cart management (add/remove/update quantity)

### When to Use
- Complex state with many related actions (10+ action types)
- State that must be auditable (every action is logged in DevTools)
- Need for time-travel debugging (replay state at any point)
- State shared deeply across the component tree
- Actions that have side-effects (though plain Redux doesn't handle side-effects well)
- Building apps where you want to demonstrate Redux core concepts

### Pros
- ✅ **Predictable**: Pure functions (reducers) are easy to test and reason about
- ✅ **Auditable**: Every action is recorded in Redux DevTools for debugging
- ✅ **Time-travel**: Jump to any action in Redux DevTools to inspect state at that point
- ✅ **Educational**: Manual Redux teaches core concepts (actions, reducers, store)
- ✅ **Explicit**: Clear boundary between actions (what happened) and reducers (state updates)

### Cons
- ❌ **Verbose**: Requires action types, action creators, and reducer switch-case (3 files for 1 feature)
- ❌ **Boilerplate**: Each new action needs manual type + creator + case in reducer
- ❌ **No async**: Plain Redux doesn't handle async (need redux-thunk or redux-saga)
- ❌ **Immutability**: Must manually spread/clone objects to maintain immutability
- ❌ **DevTools setup**: Requires Redux DevTools browser extension for best experience

### Example in cove-app
```tsx
// src/redux/cart/cartActions.ts
export const addToCart = (item: CartItem) => ({ type: ADD_TO_CART, payload: item });

// src/redux/cart/cartReducer.ts
case ADD_TO_CART:
  // Find existing item or append new item
  // Recalculate totals
  // Return new state

// In screens:
const dispatch = useAppDispatch();
dispatch(addToCart({ id, name, price, quantity: 1 }));
```

---

## 3. Redux Toolkit (RTK)

**Used in cove-app for:** Product list, selected product, loading states

### When to Use
- Any project that would use Redux (replaces manual Redux)
- Need for automatic immutability via Immer
- Want to reduce boilerplate by 60% compared to manual Redux
- Building medium-to-large apps with complex state
- Need for structured async handling (RTK Query for APIs)
- Combining slices from multiple features

### Pros
- ✅ **Less boilerplate**: `createSlice` replaces action types + creators + reducer in one call
- ✅ **Immer integration**: Allows "mutating" writes inside reducers (Immer handles immutability)
- ✅ **Better DX**: `configureStore` handles middleware setup, thunks, DevTools automatically
- ✅ **Still auditable**: RTK actions still go through Redux DevTools
- ✅ **Industry standard**: RTK is now the official recommended way to use Redux
- ✅ **Scales well**: Slices compose naturally as app grows

### Cons
- ❌ **Abstraction layer**: Hides some Redux fundamentals compared to manual Redux
- ❌ **Immer overhead**: Tiny perf cost (negligible for most apps) of tracking mutations
- ❌ **Action/reducer blur**: RTK makes it easy to confuse sync reducers with async triggers
- ❌ **Learning curve**: If coming from manual Redux, createSlice syntax takes time to learn
- ❌ **Dependency**: Adds `@reduxjs/toolkit` and `immer` to package.json

### Example in cove-app
```tsx
// src/redux/products/productSlice.ts
const productSlice = createSlice({
  name: 'products',
  initialState: { products: [], loading: false, error: null },
  reducers: {
    setProducts: (state, action) => { state.products = action.payload; }, // Immer handles mutation
    setLoading: (state, action) => { state.loading = action.payload; },
  }
});

// In sagas:
yield put(setProducts(data)); // Dispatched by Redux Saga after async API call
```

---

## 4. Redux Saga

**Used in cove-app for:** Async product fetching (saga watches actions, calls API, dispatches result)

### When to Use
- Need for complex async orchestration (multiple async operations that depend on each other)
- Side-effects that must be testable and isolated
- Managing race conditions (e.g., user rapidly switches categories)
- Logging or analytics on every action
- Polling, WebSocket subscriptions, or long-running operations
- Large team where saga tests document intent better than thunks

### Pros
- ✅ **Pure side-effects**: Sagas are pure generator functions (testable without mocks)
- ✅ **Powerful combinators**: `fork`, `race`, `throttle`, `debounce` for complex flows
- ✅ **Cancellation**: `takeLatest` cancels in-flight requests when new action dispatched
- ✅ **Separation of concerns**: Sagas are separate from components and Redux
- ✅ **Time-travel friendly**: All saga side-effects are dispatched as actions (ReplayAble)

### Cons
- ❌ **Generator syntax**: ES6 generators are unfamiliar to many JavaScript developers
- ❌ **TypeScript complexity**: `yield call(...)` returns `unknown`, requires casting
- ❌ **Learning curve**: Saga combinators (`fork`, `race`, `spawn`) have nuanced behavior
- ❌ **Debugging**: Saga traces are harder to follow than async/await
- ❌ **Dependency**: Adds `redux-saga` to package.json
- ❌ **Overkill for simple cases**: If you just need `dispatch -> API -> dispatch`, redux-thunk is simpler

### Example in cove-app
```tsx
// src/redux/sagas/productSaga.ts
function* fetchProductsSaga(action) {
  yield put(setLoading(true));
  try {
    const products = yield call([api, api.getProducts]); // call is effect, not actual call
    yield put(setProducts(products)); // dispatch sync action with result
  } catch (error) {
    yield put(setError(error.message));
  }
}

export function* watchProductSaga() {
  yield takeLatest(FETCH_PRODUCTS_REQUEST, fetchProductsSaga); // cancel previous if new dispatch
}

// In home screen:
const dispatch = useAppDispatch();
dispatch(fetchProductsRequest({ category: '2' })); // Saga watches this, calls API, updates store
```

---

## 5. MobX (Not used in cove-app, but worth knowing)

### When to Use
- App state is naturally reactive and observable (e.g., form with computed validation)
- Need fine-grained reactivity without memoization
- Team comfortable with decorators and mutable patterns
- Building tool/editor apps where live updates are critical

### Pros
- ✅ **Concise**: Reactive observers automatically subscribe to used properties
- ✅ **No boilerplate**: Mutable state with automatic change tracking
- ✅ **Fine-grained reactivity**: Only components that use a changed property re-render
- ✅ **Powerful computations**: Computed values cache automatically

### Cons
- ❌ **Magic feeling**: Automatic tracking is powerful but can be hard to debug
- ❌ **Mutable state**: Easier to accidentally create side-effects
- ❌ **Less auditable**: State changes aren't logged like Redux actions
- ❌ **Ecosystem**: Fewer integrations than Redux/React Query
- ❌ **Type safety**: Decorators required in TypeScript, less type-safe than Redux

---

## 6. Recoil / Jotai (Not used in cove-app, but worth knowing)

### When to Use
- State is naturally atom-shaped (independent pieces)
- Need React Suspense integration for async boundaries
- Building apps where atoms compose naturally (no relational state)
- Prefer a "modern" alternative to Redux

### Pros
- ✅ **Atoms are composable**: No single provider tree, atoms nest naturally
- ✅ **React Suspense first**: Built for Suspense boundaries (async components)
- ✅ **Minimal boilerplate**: Just atoms + selectors, no actions/reducers
- ✅ **Concurrent Rendering**: Works well with React 18+ concurrent features

### Cons
- ❌ **Smaller ecosystem**: Fewer resources/integrations than Redux
- ❌ **Slower adoption**: Recoil development has slowed; Jotai is the maintained alternative
- ❌ **DevTools**: Debugging tools are not as mature as Redux
- ❌ **Bad for relational state**: Recoil/Jotai encourage atoms; cart items with product references don't fit this shape well

---

## Summary Table

| Need | Best Choice | Reason |
|------|-------------|--------|
| User auth / login state | **Context API** | Low-frequency, tree-wide, no complex logic needed |
| Shopping cart (add/remove/qty) | **Manual Redux** (or RTK) | Auditable mutations, DevTools debugging |
| Product list + filters | **RTK + Saga** | Async API calls, loading states, category switching |
| Form validation + live state | **Context + local state** OR **MobX** | Fine-grained reactivity, computed errors |
| Global settings (theme/locale) | **Context API** | Fire-and-forget, rarely changes |
| Polling / WebSocket data | **Saga** | Complex async orchestration, cancellation |
| Atoms of independent state | **Recoil / Jotai** | Not applicable here; cart is relational |

---

## cove-app Architecture Decision

```
┌─────────────────────────────────┐
│       cove-app Store            │
├─────────────────────────────────┤
│ 🔐 Auth State (Context API)     │
│   └─ User, isAuthenticated      │
├─────────────────────────────────┤
│ 🛒 Cart State (Manual Redux)    │
│   └─ Items[], totalPrice        │
├─────────────────────────────────┤
│ 📦 Products State (RTK + Saga)  │
│   └─ products[], selectedProd    │
│   └─ loading, error             │
├─────────────────────────────────┤
│ ❤️ Wishlist (AsyncStorage)      │
│   └─ Acceptable for demo        │
└─────────────────────────────────┘
```

### Why these choices?

**Context for Auth:**
- User login state changes ~once per session
- Accessed everywhere (Profile, Home, index.tsx)
- No complex business logic
- Keeps bundle size small

**Manual Redux for Cart:**
- Shopping cart is the "Hello World" of Redux examples
- Easy to understand the core Redux pattern (actions → reducer → store)
- Can demonstrate Redux DevTools benefits
- When scaled, can transition to RTK as team skill increases

**RTK + Saga for Products:**
- Shows modern Redux best practices (RTK is the official recommendation)
- Saga handles async API calls cleanly (vs thunks or raw useEffect)
- Category switching demonstrates `takeLatest` (cancellation benefit)
- Scalable pattern if product filtering becomes complex

**AsyncStorage for Wishlist:**
- Acceptable for a demo because wishlist is read once on mount (useFocusEffect)
- Not high-frequency updates like cart
- Demonstrates real localStorage vs Redux patterns
- Could be migrated to Redux later if needed

---

## Migration Path

If cove-app grows, the migration path would be:

1. **Phase 1 (Current)**: Context (auth) + Manual Redux (cart) + RTK+Saga (products)
2. **Phase 2**: Add RTK Query for all API calls (replaces Saga)
3. **Phase 3**: Add React Query for server state (products, reviews, addresses)
4. **Phase 4**: Consider persisting Redux state via middleware (redux-persist)
5. **Phase 5**: Wishlist → RTK slice + Saga for consistency

---

## Key Takeaways

| Approach | Best For | Learn It When |
|----------|----------|---------------|
| **Context** | App-wide config (auth, theme) | First state management need |
| **Redux Manual** | Educational / auditable cart | Understanding Redux fundamentals |
| **RTK** | Production Redux apps | Scaling Redux (replaces manual) |
| **Saga** | Complex async orchestration | Need fine-grained side-effect control |
| **MobX** | Reactive UI apps | Automatic tracking matters more than auditability |
| **Recoil/Jotai** | Atom-shaped independent state | React Suspense needed |

**For most new projects starting today:**
- Use **React Query** (server state) + **Zustand/Redux** (client state)
- **Avoid** MobX unless team has prior experience
- **Avoid** Recoil unless you need Suspense
- **Use RTK** if you choose Redux (not manual Redux)
