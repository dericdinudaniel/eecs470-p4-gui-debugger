import { ScopeData } from "@/lib/tstypes";
import {
  displayValue,
  displayValueHex,
  extractSignalValue,
  extractSignalValueToInt,
  parse_to_INST_List,
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
import DisplayIF_ID_PACKET from "./DisplayIF_ID_PACKET";
import DisplayID_EX_PACKET from "./DisplayID_EX_PACKET";

type IDDebuggerProps = {
  className: string;
  signalID: ScopeData;
};

const IDDebugger: React.FC<IDDebuggerProps> = ({ className, signalID }) => {
  const if_id_reg = extractSignalValue(signalID, "if_id_reg").value;
  const ID_if_id_reg = parseIF_ID_PACKET(if_id_reg);

  const wb_regfile_en = extractSignalValueToInt(signalID, "wb_regfile_en");
  const wb_regfile_idx = extractSignalValueToInt(signalID, "wb_regfile_idx");
  const wb_regfile_data = extractSignalValue(signalID, "wb_regfile_data").value;

  const id_packet = extractSignalValue(signalID, "id_packet").value;
  const ID_id_packet = parseID_EX_PACKET_orig(id_packet);

  return (
    <>
      <Module className={className}>
        <ModuleHeader label="Decode" />
        <ModuleContent className="space-y-2">
          <Card>
            <CardHeader label="Inputs" />
            <CardContent>
              <DisplayIF_ID_PACKET packet={ID_if_id_reg} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader label="Outputs" />
            <CardContent>
              <DisplayID_EX_PACKET packet={ID_id_packet} />
            </CardContent>
          </Card>
        </ModuleContent>
      </Module>
    </>
  );
};

export default IDDebugger;
