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
  email,
} from "react-admin";

const validateEmail = [email(), required()];

export const UserFilter = [
  <TextInput label="Search on email" source="email" alwaysOn />,
];

export const UserList = (props: any) => (
  <List {...props} filters={UserFilter}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <EmailField source="email" />
    </Datagrid>
  </List>
);

export const UserEdit = (props: any) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="email" type="email" validate={validateEmail} />
        <TextInput source="hash" validate={required()} />
      </SimpleForm>
    </Edit>
  );
};


export const UserCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" type="email" validate={validateEmail} />
      <TextInput source="password" validate={required()} />
    </SimpleForm>
  </Create>
);
