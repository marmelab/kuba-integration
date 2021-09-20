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

export const AdminFilter = [
  <TextInput label="Search on email" source="email" alwaysOn />,
];

export const AdminList = (props: any) => (
  <List {...props} filters={AdminFilter}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <EmailField source="email" />
      <TextField source="role" />
    </Datagrid>
  </List>
);

export const AdminEdit = (props: any) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="email" type="email" validate={validateEmail} />
      </SimpleForm>
    </Edit>
  );
};

export const AdminCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" type="email" validate={validateEmail} />
      <TextInput source="password" validate={required()} />
    </SimpleForm>
  </Create>
);
