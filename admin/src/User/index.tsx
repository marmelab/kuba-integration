import { Typography } from "@material-ui/core";
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
  Link,
  linkToRecord,
  useRecordContext,
  useGetManyReference,
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
        <TextInput source="password" label="new Password" />
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

export const UserShow = (props: any) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="email" />
      <UserGame />
    </SimpleShowLayout>
  </Show>
);

const UserGame = (props: any) => {
  const user = useRecordContext(props);
  const result = useGetManyReference(
    "games",
    "playerNumber",
    user.id,
    { page: 1, perPage: 10 },
    { field: "id", order: "DESC" },
    {},
    "games"
  );

  return (
    <div className="MuiFormControl-root">
      <Typography variant="caption">User' Game: </Typography>
      {result.ids.map((gameId: number) => (
        <Link to={linkToRecord("/games", gameId, "show")}>{gameId}.</Link>
      ))}
    </div>
  );
};
