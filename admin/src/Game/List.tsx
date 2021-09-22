import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  DateField,
} from "react-admin";

export const GameList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <NumberField source="currentPlayer" label="Curent id player" />
      <BooleanField source="hasWinner" />
      <BooleanField source="started" />
      <DateField source="creationDate" />
      <DateField source="lastMoveDate" />
    </Datagrid>
  </List>
);
