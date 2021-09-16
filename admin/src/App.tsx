import { Admin, ListGuesser, Resource } from "react-admin";
import { dataProvider } from "./dataProvider";
// import { UserCreate, UserEdit, UserList } from "./User";

const App = () => (
  <Admin dataProvider={dataProvider}>
    {/* <Resource name="user" list={UserList} create={UserCreate} edit={UserEdit} /> */}
    <Resource name="games" list={ListGuesser} />
  </Admin>
);

export default App;
