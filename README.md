# nextjs-redirect-bug-hunt

## Code Description

* `/test` endpoint redirects to `/forbidden` (using `redirect` value in `getStaticProps`);
* `fallback: true` is set;
* page revalidation is enabled (every second).

## Steps To Reproduce

### `TypeError: argument entity must be string, Buffer, or fs.Stats`

1. Run `yarn build`.
2. Run `yarn start`.
3. Go to `http://localhost:3000/test`. You should be redirected to `http://localhost:3000/forbidden`.
4. Go to `http://localhost:3000/test`.

#### Expected behavior

You are redirected to `http://localhost:3000/forbidden`

#### Actual behavior

Internal server error is shown in UI (`500`) and the following is in the application logs:

```
TypeError: argument entity must be string, Buffer, or fs.Stats
    at etag (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/compiled/etag/index.js:1:944)
    at sendPayload (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/send-payload.js:1:567)
    at Server.renderToHTMLWithComponents (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/next-server.js:89:131)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
    at async Server.renderToHTML (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/next-server.js:127:711)
    at async Server.render (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/next-server.js:70:236)
    at async Object.fn (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/next-server.js:54:264)
    at async Router.execute (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/router.js:24:67)
    at async Server.run (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/next-server.js:64:722)
    at async Server.handleRequest (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/next-server.js:33:319)
```

### `Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client`

1. Repeat the steps from the `TypeError: argument entity must be string, Buffer, or fs.Stats`.
2. Stop the nextjs application.
3. Start the application again by running `yarn start`.
4. Go to `http://localhost:3000/test` (only `[object Object]` is returned).
5. Go to `http://localhost:3000/test`.

#### Expected behavior

You are redirected to `http://localhost:3000/forbidden`

#### Actual Behavior

The web shows `[object Object]` and the following is in the application logs:
```
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    at ServerResponse.setHeader (_http_outgoing.js:518:11)
    at handleRedirect (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/render.js:17:2243)
    at renderToHTML (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/render.js:28:1111)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
    at async /home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/next-server.js:101:66
    at async __wrapper (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/lib/coalesced-function.js:1:330)
    at async Server.renderToHTMLWithComponents (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/next-server.js:126:376)
    at async Server.renderToHTML (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/next-server.js:127:711)
    at async Server.render (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/next-server.js:70:236)
    at async Object.fn (/home/gurisko/nextjs-redirect-bug-hunt/node_modules/next/dist/next-server/server/next-server.js:54:264) {
  code: 'ERR_HTTP_HEADERS_SENT'
}
```

## System information

* OS: Debian 9
* Version of Next.js: `10.0.1`
* Version of Node.js: `12.18.1`
