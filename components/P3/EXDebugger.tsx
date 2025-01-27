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
import DisplayID_EX_PACKET from "./DisplayID_EX_PACKET";
import DisplayEX_MEM_PACKET from "./DisplayEX_MEM_PACKET";

type EXDebuggerProps = {
  className: string;
  signalEX: ScopeData;
};

const EXDebugger: React.FC<EXDebuggerProps> = ({ className, signalEX }) => {
  const id_ex_reg = extractSignalValue(signalEX, "id_ex_reg").value;
  const ex_packet = extractSignalValue(signalEX, "ex_packet").value;

  const EX_id_ex_reg = parseID_EX_PACKET_orig(id_ex_reg);
  const EX_ex_packet = parseEX_MEM_PACKET(ex_packet);

  return (
    <>
      <Module className={className}>
        <ModuleHeader label="eXecute" />
        <ModuleContent className="space-y-2">
          <Card>
            <CardHeader label="Inputs" />
            <CardContent>
              <DisplayID_EX_PACKET packet={EX_id_ex_reg} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader label="Outputs" />
            <CardContent>
              <DisplayEX_MEM_PACKET packet={EX_ex_packet} />
            </CardContent>
          </Card>
        </ModuleContent>
      </Module>
    </>
  );
};
export default EXDebugger;
