import { Create, Edit, SimpleForm, TextInput, required } from "react-admin";

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
