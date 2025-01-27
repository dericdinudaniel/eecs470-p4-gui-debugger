import { ScopeData } from "@/lib/tstypes";
import {
  displayValue,
  displayValueHex,
  extractSignalValue,
  extractSignalValueToInt,
  parse_to_INST_List,
  parseEX_MEM_PACKET,
  parseID_EX_PACKET_orig,
  parseIF_ID_PACKET,
  parseMEM_WB_PACKET,
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
import DisplayEX_MEM_PACKET from "./DisplayEX_MEM_PACKET";
import DisplayMEM_WB_PACKET from "./DisplayMEM_WB_PACKET";

type MEMDebuggerProps = {
  className: string;
  signalMEM: ScopeData;
};

const MEMDebugger: React.FC<MEMDebuggerProps> = ({ className, signalMEM }) => {
  const ex_mem_reg = extractSignalValue(signalMEM, "ex_mem_reg").value;
  const MEM_ex_mem_reg = parseEX_MEM_PACKET(ex_mem_reg);

  const mem_packet = extractSignalValue(signalMEM, "mem_packet").value;
  const MEM_mem_packet = parseMEM_WB_PACKET(mem_packet);

  return (
    <>
      <Module className={className}>
        <ModuleHeader label="Memory" />
        <ModuleContent className="space-y-2">
          <Card>
            <CardHeader label="Inputs" />
            <CardContent>
              <DisplayEX_MEM_PACKET packet={MEM_ex_mem_reg} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader label="Outputs" />
            <CardContent>
              <DisplayMEM_WB_PACKET packet={MEM_mem_packet} />
            </CardContent>
          </Card>
        </ModuleContent>
      </Module>
    </>
  );
};
export default MEMDebugger;
