import { Admin, Resource } from "react-admin";
import { dataProvider } from "./myDataProvider";
import { UserCreate, UserEdit, UserList } from "./User/User";

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="user" list={UserList} create={UserCreate} edit={UserEdit} />
  </Admin>
);

export default App;
