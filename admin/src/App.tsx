import { Admin, Resource } from "react-admin";
import { dataProvider } from "./dataProvider";
import { GameList } from "./Game/List";
import { GameShow } from "./Game/Show";
// import { UserCreate, UserEdit, UserList } from "./User";

const App = () => (
  <Admin dataProvider={dataProvider}>
    {/* <Resource name="user" list={UserList} create={UserCreate} edit={UserEdit} /> */}
    <Resource name="games" list={GameList} show={GameShow} />
  </Admin>
);

export default App;
