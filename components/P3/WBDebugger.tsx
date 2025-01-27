import { ScopeData } from "@/lib/tstypes";
import {
  displayValue,
  displayValueHex,
  extractSignalValue,
  extractSignalValueToInt,
  parse_to_INST_List,
  parseCOMMIT_PACKET,
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
import DisplayMEM_WB_PACKET from "./DisplayMEM_WB_PACKET";
import DisplayCOMMIT_PACKET from "./DisplayCOMMIT_PACKET";

type WBDebuggerProps = {
  className: string;
  signalWB: ScopeData;
};

const WBDebugger: React.FC<WBDebuggerProps> = ({ className, signalWB }) => {
  const mem_wb_reg = extractSignalValue(signalWB, "mem_wb_reg").value;
  const WB_mem_wb_reg = parseMEM_WB_PACKET(mem_wb_reg);

  const wb_packet = extractSignalValue(signalWB, "wb_packet").value;
  const WB_WB_packet = parseCOMMIT_PACKET(wb_packet);

  return (
    <>
      <Module className={className}>
        <ModuleHeader label="Writeback" />
        <ModuleContent className="space-y-2">
          <Card>
            <CardHeader label="Inputs" />
            <CardContent>
              <DisplayMEM_WB_PACKET packet={WB_mem_wb_reg} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader label="Outputs" />
            <CardContent>
              <DisplayCOMMIT_PACKET packet={WB_WB_packet} />
            </CardContent>
          </Card>
        </ModuleContent>
      </Module>
    </>
  );
};
export default WBDebugger;
