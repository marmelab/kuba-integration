import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Admin, Resource, ListGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

// const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");
import { dataProvider } from "./myDataProvider";
const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="user" list={ListGuesser} />
  </Admin>
);

export default App;
