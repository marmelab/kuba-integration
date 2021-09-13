import "./App.css";
import { Admin, Resource, ListGuesser } from "react-admin";
import { dataProvider } from "./myDataProvider";
import { UserCreate, UserEdit } from "./User/User";

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="user" list={ListGuesser} create={UserCreate} edit={UserEdit} />
  </Admin>
);

export default App;
