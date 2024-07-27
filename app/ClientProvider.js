"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";

export default function ClientProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
// "use client";

// import { Provider } from "react-redux";
// import { store, persistor } from "@/lib/store";
// import { PersistGate } from "redux-persist/integration/react";

// export default function ClientProvider({ children }) {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
//         {children}
//       </PersistGate>
//     </Provider>
//   );
// }
