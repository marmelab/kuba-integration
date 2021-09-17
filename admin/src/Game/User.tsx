import { ArrayField, Datagrid, ReferenceField, TextField, NumberField } from "react-admin";

export const GameUser = (props: any) => (
  <ArrayField source="players">
    <Datagrid>
      <ReferenceField label="User" source="playerNumber" reference="user">
        <TextField source="email" />
      </ReferenceField>
      <NumberField source="playerNumber" label="Id player" />
      <NumberField source="marblesWon.length" label="Marbles won" />
      <NumberField source="marbleColor" label="Marbles Color" />
    </Datagrid>
  </ArrayField>
);
