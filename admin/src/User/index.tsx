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
  Show,
  SimpleShowLayout,
  ReferenceManyField,
  ChipField,
  SingleFieldList,
} from "react-admin";

const validateEmail = [email(), required()];
const validateUsername = [required()];

export const UserFilter = [
  <TextInput label="Search on email" source="email" alwaysOn />,
];

export const UserList = (props: any) => (
  <List {...props} filters={UserFilter}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="username" />
      <EmailField source="email" />
    </Datagrid>
  </List>
);

export const UserEdit = (props: any) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="username" type="text" validate={validateUsername} />
        <TextInput source="email" type="email" validate={validateEmail} />
        <TextInput source="password" label="new Password" />
      </SimpleForm>
    </Edit>
  );
};

export const UserCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="email" type="email" validate={validateEmail} />
      <TextInput source="username" type="text" validate={validateUsername} />
      <TextInput source="password" validate={required()} />
    </SimpleForm>
  </Create>
);

export const UserShow = (props: any) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="email" />
      <ReferenceManyField
        label="User's games"
        reference="games"
        target="playerNumber"
      >
        <SingleFieldList linkType="show">
          <ChipField source="id" />
        </SingleFieldList>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
