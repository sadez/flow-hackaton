# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`



# Some assumptions: 

- Amazon and Google stocks contains same occurence of price
- We can sell some stock A and buy a stock B in the same day
- the algorithm is based on buying in Troughs and selling in Peaks
- 
# tech stack:

- UI : Chakra UI
- Testing : Vitest (jest installed but not cofigured to support jsx) 
- Framework : Remix
- ORM : Prisma is configured but we used direct JSON for better performance

