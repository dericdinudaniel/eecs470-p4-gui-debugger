import { ScopeData } from "@/lib/tstypes";
import {
  displayValue,
  displayValueHex,
  extractSignalValue,
  extractSignalValueToInt,
  parse_to_INST_List,
  parseIF_ID_PACKET,
  displayBoolAsInt,
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

type DisplayID_EX_PACKETProps = {
  packet: Types.ID_EX_PACKET_orig;
};

const DisplayID_EX_PACKET: React.FC<DisplayID_EX_PACKETProps> = ({
  packet,
}) => {
  console.log("len: ", Types.ID_EX_PACKET_orig_WIDTH);
  console.log("DisplayID_EX_PACKET: packet: ", packet);
  return (
    <>
      <div
        className={`${
          packet.valid ? "bg-good" : "bg-bad"
        } border rounded-lg p-1 justify-items-center`}
      >
        <CardHeaderSmall label="ID_EX Packet" />
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

          <SimpleValDisplay label="rs1_value: ">
            {displayValue(packet.rs1_value)}
          </SimpleValDisplay>
          <SimpleValDisplay label="rs2_value: ">
            {displayValue(packet.rs2_value)}
          </SimpleValDisplay>

          <SimpleValDisplay label="opa_select: ">
            {Types.getALUOpaSelectName(packet.opa_select)}
          </SimpleValDisplay>
          <SimpleValDisplay label="opb_select: " className="w-36">
            {Types.getALUOpbSelectName(packet.opb_select)}
          </SimpleValDisplay>

          <SimpleValDisplay label="dest_reg_idx: ">
            {displayValue(packet.dest_reg_idx)}
          </SimpleValDisplay>
          <SimpleValDisplay label="alu_func: ">
            {Types.getALUFuncName(packet.alu_func)}
          </SimpleValDisplay>

          <SimpleValDisplay label="mult: ">
            {displayBoolAsInt(packet.mult)}
          </SimpleValDisplay>
          <SimpleValDisplay label="rd_mem: ">
            {displayBoolAsInt(packet.rd_mem)}
          </SimpleValDisplay>
          <SimpleValDisplay label="wr_mem: ">
            {displayBoolAsInt(packet.wr_mem)}
          </SimpleValDisplay>
          <SimpleValDisplay label="cond_branch: ">
            {displayBoolAsInt(packet.cond_branch)}
          </SimpleValDisplay>
          <SimpleValDisplay label="uncond_branch: ">
            {displayBoolAsInt(packet.uncond_branch)}
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
        </div>
      </div>
    </>
  );
};

export default DisplayID_EX_PACKET;
