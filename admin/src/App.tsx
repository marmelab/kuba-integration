import { Admin, Resource } from "react-admin";
import { dataProvider } from "./dataProvider";
import { GameList } from "./Game/List";
import { GameShow } from "./Game/Show";
import { UserCreate, UserEdit, UserList } from "./User";
import { UserShow } from "./User/Show";

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="user" list={UserList} show={UserShow} create={UserCreate} edit={UserEdit} />
    <Resource name="games" list={GameList} show={GameShow} />
  </Admin>
);

export default App;
