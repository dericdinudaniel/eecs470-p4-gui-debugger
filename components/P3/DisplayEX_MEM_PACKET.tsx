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

type DisplayEX_MEM_PACKETProps = {
  packet: Types.EX_MEM_PACKET;
};

const DisplayEX_MEM_PACKET: React.FC<DisplayEX_MEM_PACKETProps> = ({
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
          <SimpleValDisplay label="alu_result: " className="w-48">
            {displayValueHex(packet.alu_result)}
          </SimpleValDisplay>
          <SimpleValDisplay label="NPC: ">
            {displayValueHex(packet.NPC)}
          </SimpleValDisplay>

          <SimpleValDisplay label="take_branch: ">
            {packet.take_branch}
          </SimpleValDisplay>
          <SimpleValDisplay label="rs2_value: ">
            {displayValue(packet.rs2_value)}
          </SimpleValDisplay>

          <SimpleValDisplay label="rd_mem: ">
            {displayBoolAsInt(packet.rd_mem)}
          </SimpleValDisplay>
          <SimpleValDisplay label="wr_mem: ">
            {displayBoolAsInt(packet.wr_mem)}
          </SimpleValDisplay>

          <SimpleValDisplay label="dest_reg_idx: ">
            {" "}
            {displayValue(packet.dest_reg_idx)}
          </SimpleValDisplay>
          <SimpleValDisplay label="halt: ">
            {displayBoolAsInt(packet.halt)}
          </SimpleValDisplay>
          <SimpleValDisplay label="illegal: ">
            {displayBoolAsInt(packet.illegal)}
          </SimpleValDisplay>
          <SimpleValDisplay label="csr_op: ">
            {displayBoolAsInt(packet.csr_op)}
          </SimpleValDisplay>

          <SimpleValDisplay label="rd_unsigned: ">
            {displayBoolAsInt(packet.rd_unsigned)}
          </SimpleValDisplay>

          <SimpleValDisplay label="mem_size: ">
            {displayValue(packet.mem_size)}
          </SimpleValDisplay>
        </div>
      </div>
    </>
  );
};

export default DisplayEX_MEM_PACKET;
