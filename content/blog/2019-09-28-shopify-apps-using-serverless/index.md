---
title: Creating a Shopify app using Serverless tech
category: JavaScript
date: "2019-09-28T20:00:00.000Z"
indexImage: './shopify-serverless.png'
---

In our agency Alt Labs, we're currently working on a new Shopify app of our own which has allowed us to try out some cutting-edge technologies.

Nearly all of the resources and tutorials for working with Shopify's App SDKs show examples in Rails or Node.js. We wanted to try something different and set out to use as little backend code as possible building a slick static React app and deploying it to a CDN.

For this app, we have ended up using AWS lambda functions and dynamo DB to fully do away with the need for provisioned servers and be billed only for the execution time of the code and queries to the database.

This approach can drastically save on hosting costs and also simplify the developer experience, check out [this article from Postlight](https://postlight.com/trackchanges/serving-39-million-requests-for-370-month-or-how-we-reduced-our-hosting-costs-by-two-orders-of) who moved one of their projects to AWS lambda and shrunk their hosting costs from $10,000/month down to a mere $370/month, impressive stuff!

## Authentication
The first action users of your app will do is install it, this process usually kicks off the OAuth dance with Shopify. The first approach I tried was using [Auth0's Shopify login](https://auth0.com/docs/connections/social/shopify). This allows a merchant to connect with Shopify and all of the OAuth happens securely through Auth0's servers.

Unfortunately, this proved a little cumbersome and I don't think the Auth0 integration is really meant for custom apps, so whilst I got sign-in working I had no way of retrieving the Shopify access token on the frontend and would need a backend function anyway – this lead to me giving up on Auth0 and doing the normal OAuth process but using a couple of lambda functions to help keep things secure.

#### Function 1: Install URL
The first lambda can be called from your app when users attempt to install, if you get them to enter their myshopify domain into a text field and post off to [this function](https://gist.github.com/phawk/5e47aef501135001c0e443f68a1d7826) it will return a URL to redirect to and kick-off an OAuth request.

#### Function 2: Get an access token
When redirecting back to your app I've used `/auth/callback` as the endpoint there will be some params in the URL such as the code to exchange for an access token. [View the code](https://gist.github.com/phawk/afc0e1acd5f9194f19e27702c348fad2), it first uses HMAC to verify the request came from Shopify's servers (using your apps client secret as a signing key), then moves on to request an access token. Once done, rather than spit out the Shopify access token to the frontend I create an account in dynamodb and generated our access token for use by the frontend – this can then be used to secure all other requests and keep things safely stored in dynamodb.

### Authenticating other requests
Since we now have a token for the user we want to authenticate all other requests from the frontend.

From my React experience I have learnt some handy design patterns and have [created an Authentication higher-order component](https://gist.github.com/phawk/b46f3e603a91be7e66d4653b655b9700) to wrap all additional routes with, ensuring they are authenticated using the shop ID and token for the current user.

From the frontend you can authenticate all request by adding an HTTP basic header like so (the user is stored in localStorage after the getToken request):

```js
export function withAuthHeader(headers) {
  const user = JSON.parse(localStorage.getItem("user"))
  if (user) {
    const auth = btoa(`${user.shop}:${user.token}`)
    return {
      ...headers,
      "Authorization": `Basic ${auth}`
    }
  }
  return headers
}

// Can be used like so...
fetch(url, {
  method: requestType,
  headers: withAuthHeader({
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  }),
  credentials: "same-origin",
  body: JSON.stringify(params)
})
```

*N.B. the reason I am passing the myshopify domain alongside the token at all times is for efficient querying and indexes in dynamoDB.*

### Shopify graphql
For perhaps obvious reasons Shopify's graphql and REST API endpoints don't support CORS so they can't be called directly from the browser. Since the Shopify access token is tucked away in dynamoDB we needed a proxy lambda function to take our custom API token, lookup the users account, and pass the request onto Shopify’s graphql endpoint.

You can [see my solution here](https://gist.github.com/phawk/1a410ec6a2f34066538e0141aff49e9d), it uses the same header approach mentioned above and is simple to accomplish in apollo:

```js
export const client = new ApolloClient({
  uri: "/.netlify/functions/graphql",
  request: async operation => {
    operation.setContext({
      headers: withAuthHeader({})
    })
  }
})
```

## Deployment

This is the nice part, deploys are fast, simple, and idempotent. Everything is deployed to netlify.

### Netlify functions
I'm a massive fan of [netlify](https://www.netlify.com/), I love how simple they make it to deploy static sites and I've been wanting to try their functions feature for a while. Using netlify functions they will deploy your code to AWS lambda and set it up on the same domain so you don't need to worry about CORS headers etc.

Functions on netlify were every bit as simple to deploy as a static site and keep all your code together in the one repository, versioned together with no need to sync up API and frontend deploys when introducing breaking changes. I will definitely be using netlify functions on other projects!

### Static frontend
The frontend of this Shopify app is using [create-react-app](https://create-react-app.dev/) and allows us to easily make use of [Shopify Polaris](https://polaris.shopify.com/) for the UI and create a stunning user experience that is lightning fast served over netlify’s global CDN.

## In summary
So far this approach is working great, the app is not yet live, but I'm very much looking forward to seeing how much the hosting costs when it goes into production.

In theory, this stack should be near-infinitely scalable without any optimisations, while the hosting costs should be very affordable.

---

If you have any questions or want to chat to us about developing a Shopify app please [get in touch](mailto:hello@alternatelabs.co).
