import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  DateField,
} from "react-admin";
import { GameUser } from "./User";

export const GameList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <NumberField source="currentPlayer" label="Curent id player" />
      <GameUser />
      <BooleanField source="hasWinner" />
      <BooleanField source="started" />
      <DateField source="creationDate" />
      <DateField source="lastMoveDate" />
    </Datagrid>
  </List>
);
