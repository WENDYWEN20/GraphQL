import ReactDOM from 'react-dom/client';
import React from 'react';
import "./index.css";
import App from "./App.tsx";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import {ApolloProvider } from "@apollo/client/react"
import type { NormalizedCacheObject } from '@apollo/client';
const httpLink = new HttpLink({
  uri: 'http://localhost:4000', // Replace with your actual GraphQL server URL
});
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: httpLink, // Your GraphQL server URL
  cache: new InMemoryCache(),// Local caching strategy
});
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element. Make sure it exists in your HTML.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);