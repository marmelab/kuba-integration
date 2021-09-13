import {
  Create,
  Edit,
  SimpleForm,
  TextInput,
  required,
  List,
  Datagrid,
  TextField,
  EmailField,
} from "react-admin";

export const UserList = (props: any) => (
  <List {...props} filters={UserFilter}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <EmailField source="email" />
      <TextField source="hash" />
    </Datagrid>
  </List>
);

export const UserEdit = (props: any) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput disabled label="Id" source="id" />
        <TextInput source="email" validate={required()} />
        <TextInput source="hash" validate={required()} />
      </SimpleForm>
    </Edit>
  );
};

export const UserCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" validate={required()} />
      <TextInput source="password" validate={required()} />
    </SimpleForm>
  </Create>
);

export const UserFilter = [
  <TextInput label="Search on email" source="email" alwaysOn />,
];
