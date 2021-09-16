import { Admin, Resource } from "react-admin";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { UserCreate, UserEdit, UserList } from "./User";
import { AdminList, AdminCreate, AdminEdit } from "./Admins";


const App = () => {
  
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider as any}>
    <Resource name="user" list={UserList} create={UserCreate} edit={UserEdit} />
    <Resource name="admins" list={AdminList} create={AdminCreate} edit={AdminEdit} /> 
  </Admin>
  
);
}

export default App;
