import {
  Show,
  SimpleShowLayout,
} from "react-admin";
import { Board } from "./Board";

export const GameShow = (props: any) => {
  console.log(props);
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <Board />
      </SimpleShowLayout>
    </Show>
  );
};
