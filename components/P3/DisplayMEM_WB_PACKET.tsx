import { ScopeData } from "@/lib/tstypes";
import {
  displayBoolAsInt,
  displayValue,
  displayValueHex,
  extractSignalValue,
  extractSignalValueToInt,
  parse_to_INST_List,
  parseIF_ID_PACKET,
} from "@/lib/utils";
import {
  Dthead,
  Dtd,
  DtdLeft,
  Dtr,
  Dth,
  DthLeft,
  Dtbody,
  Dtable,
} from "@/components/dui/DTable";
import { Module, ModuleHeader, ModuleContent } from "../dui/Module";
import { Card, CardHeader, CardContent, CardHeaderSmall } from "../dui/Card";
import { SimpleValDisplay } from "../dui/SimpleValDisplay";
import { parseInstruction } from "@/lib/tsutils";
import * as Types from "@/lib/types";

type DisplayMEM_WB_PACKETProps = {
  packet: Types.MEM_WB_PACKET;
};

const DisplayMEM_WB_PACKET: React.FC<DisplayMEM_WB_PACKETProps> = ({
  packet,
}) => {
  return (
    <>
      <div
        className={`${
          packet.valid ? "bg-good" : "bg-bad"
        } border rounded-lg p-1 justify-items-center`}
      >
        <CardHeaderSmall label="MEM_WB Packet" />
        <div>
          <SimpleValDisplay label="result: " className="w-48">
            {displayValueHex(packet.result)}
          </SimpleValDisplay>
          <SimpleValDisplay label="NPC: ">
            {displayValueHex(packet.NPC)}
          </SimpleValDisplay>
          <SimpleValDisplay label="dest_reg_idx: ">
            {" "}
            {displayValue(packet.dest_reg_idx)}
          </SimpleValDisplay>
          <SimpleValDisplay label="take_branch: ">
            {packet.take_branch}
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

export default DisplayMEM_WB_PACKET;
