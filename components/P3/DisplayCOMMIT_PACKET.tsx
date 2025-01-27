import { displayBoolAsInt, displayValue, displayValueHex } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardHeaderSmall } from "../dui/Card";
import { SimpleValDisplay } from "../dui/SimpleValDisplay";

import * as Types from "@/lib/types";

type DisplayCOMMIT_PACKETProps = {
  packet: Types.COMMIT_PACKET;
};

const DisplayCOMMIT_PACKET: React.FC<DisplayCOMMIT_PACKETProps> = ({
  packet,
}) => {
  return (
    <>
      <div
        className={`${
          packet.valid ? "bg-good" : "bg-bad"
        } border rounded-lg p-1 justify-items-center`}
      >
        <CardHeaderSmall label="EX_MEM Packet" />
        <div>
          <SimpleValDisplay label="NPC: ">
            {displayValueHex(packet.NPC)}
          </SimpleValDisplay>
          <SimpleValDisplay label="data: " className="w-48">
            {displayValueHex(packet.data)}
          </SimpleValDisplay>

          <SimpleValDisplay label="reg_idx: ">
            {displayValue(packet.reg_idx)}
          </SimpleValDisplay>

          <SimpleValDisplay label="halt: ">
            {displayBoolAsInt(packet.halt)}
          </SimpleValDisplay>
          <SimpleValDisplay label="illegal: ">
            {displayBoolAsInt(packet.illegal)}
          </SimpleValDisplay>
        </div>
      </div>
    </>
  );
};

export default DisplayCOMMIT_PACKET;
