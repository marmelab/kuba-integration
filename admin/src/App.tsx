import { Admin, Resource } from "react-admin";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { UserCreate, UserEdit, UserList } from "./User";
import { AdminList, AdminCreate, AdminEdit } from "./Admins";
import { ADMIN_TYPE } from "./constants";


const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider as any}>
    
    {
      permissions => {
        return [
        <Resource name="user" list={UserList} create={UserCreate} edit={UserEdit} />,
        permissions === ADMIN_TYPE.SUPER_ADMIN ? <Resource name="admins" list={AdminList} create={AdminCreate} edit={AdminEdit} /> : null
      ]}
    }
    </Admin>
);


export default App;
