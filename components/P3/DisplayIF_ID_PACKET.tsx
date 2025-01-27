import { ScopeData } from "@/lib/tstypes";
import {
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

type DisplayIF_ID_PACKETProps = {
  packet: Types.IF_ID_PACKET;
};

const DisplayIF_ID_PACKET: React.FC<DisplayIF_ID_PACKETProps> = ({
  packet,
}) => {
  return (
    <>
      <div
        className={`${
          packet.valid ? "bg-good" : "bg-bad"
        } border rounded-lg p-1 justify-items-center`}
      >
        <CardHeaderSmall label="IF_ID Packet" />
        <div>
          <SimpleValDisplay label="INST: " className="w-48">
            {parseInstruction(packet.inst)}
          </SimpleValDisplay>
          <SimpleValDisplay label="PC: ">
            {displayValueHex(packet.PC)}
          </SimpleValDisplay>
          <SimpleValDisplay label="NPC: ">
            {displayValueHex(packet.NPC)}
          </SimpleValDisplay>
        </div>
      </div>
    </>
  );
};

export default DisplayIF_ID_PACKET;
