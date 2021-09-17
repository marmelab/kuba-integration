import { ReferenceField, Show, SimpleShowLayout, TextField } from "react-admin";

export const UserShow = (props: any) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="email" />

      <ReferenceField label="Game" source="id" reference="games">
        <TextField source="id" />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
);
