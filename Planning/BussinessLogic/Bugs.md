# BUGS:

1. When client tries to create a move request, the luggage types form is all messed up. all 5 entries update the quanity at the same time and in console i see this error:
   1. When going to Luggage Form or changing luggage quanity or submitting the form: chunk-R6S4VRB5.js?v=9f92404b:521 Warning: Encountered two children with the same key, `null`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.
      at div
      at div
      at div
      at div
      at http://localhost:3000/node_modules/.vite/deps/chunk-PBNCKGTQ.js?v=9f92404b:43:13
      at http://localhost:3000/node_modules/.vite/deps/chunk-JT3PYGKM.js?v=9f92404b:71:7
      at http://localhost:3000/node_modules/.vite/deps/chunk-6LRRM7M2.js?v=9f92404b:79:13
      at http://localhost:3000/node_modules/.vite/deps/chunk-6LRRM7M2.js?v=9f92404b:56:13
      at http://localhost:3000/node_modules/.vite/deps/chunk-PBNCKGTQ.js?v=9f92404b:43:13
      at http://localhost:3000/node_modules/.vite/deps/chunk-MKQDW5C4.js?v=9f92404b:29:5
      at http://localhost:3000/node_modules/.vite/deps/@radix-ui_react-dialog.js?v=9f92404b:234:13
      at http://localhost:3000/node_modules/.vite/deps/@radix-ui_react-dialog.js?v=9f92404b:157:58
      at Presence (http://localhost:3000/node_modules/.vite/deps/chunk-EOIGY3RQ.js?v=9f92404b:24:11)
      at http://localhost:3000/node_modules/.vite/deps/@radix-ui_react-dialog.js?v=9f92404b:148:64
      at http://localhost:3000/node_modules/.vite/deps/chunk-6LRRM7M2.js?v=9f92404b:79:13
      at http://localhost:3000/node_modules/.vite/deps/chunk-6LRRM7M2.js?v=9f92404b:56:13
      at http://localhost:3000/node_modules/.vite/deps/chunk-PBNCKGTQ.js?v=9f92404b:43:13
      at http://localhost:3000/node_modules/.vite/deps/chunk-JT3PYGKM.js?v=9f92404b:270:22
      at Presence (http://localhost:3000/node_modules/.vite/deps/chunk-EOIGY3RQ.js?v=9f92404b:24:11)
      at Provider (http://localhost:3000/node_modules/.vite/deps/chunk-VMKDFUY6.js?v=9f92404b:48:15)
      at DialogPortal (http://localhost:3000/node_modules/.vite/deps/@radix-ui_react-dialog.js?v=9f92404b:110:11)
      at \_c1 (http://localhost:3000/src/components/ui/dialog.tsx:40:63)
      at Provider (http://localhost:3000/node_modules/.vite/deps/chunk-VMKDFUY6.js?v=9f92404b:48:15)
      at Dialog (http://localhost:3000/node_modules/.vite/deps/@radix-ui_react-dialog.js?v=9f92404b:50:5)
      at div
      at div
      at ClientMoveRequests (http://localhost:3000/src/pages/client/ClientMoveRequests.tsx?t=1773001490816:42:24)
      at RenderedRoute (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=9f92404b:4088:5)
      at Outlet (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=9f92404b:4494:26)
      at main
      at div
      at div
      at DashboardLayout (http://localhost:3000/src/layouts/DashboardLayout.tsx:120:28)
      at RenderedRoute (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=9f92404b:4088:5)
      at Routes (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=9f92404b:4558:5)
      at Router (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=9f92404b:4501:15)
      at BrowserRouter (http://localhost:3000/node_modules/.vite/deps/react-router-dom.js?v=9f92404b:5247:5)
      at Provider (http://localhost:3000/node_modules/.vite/deps/chunk-VMKDFUY6.js?v=9f92404b:48:15)
      at TooltipProvider (http://localhost:3000/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=9f92404b:59:5)
      at AuthProvider (http://localhost:3000/src/context/AuthContext.tsx:34:32)
      at QueryClientProvider (http://localhost:3000/node_modules/.vite/deps/@tanstack_react-query.js?v=9f92404b:2934:3)
      at V (http://localhost:3000/node_modules/.vite/deps/next-themes.js?v=9f92404b:44:25)
      at J (http://localhost:3000/node_modules/.vite/deps/next-themes.js?v=9f92404b:42:18)
      at App
2. Vehicle Types are not showing up in Vehicle form
