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
import DisplayIF_ID_PACKET from "./DisplayIF_ID_PACKET";

type IFDebuggerProps = {
  className: string;
  signalIF: ScopeData;
};

const IFDebugger: React.FC<IFDebuggerProps> = ({ className, signalIF }) => {
  const if_valid = extractSignalValueToInt(signalIF, "if_valid");
  const take_branch = extractSignalValueToInt(signalIF, "take_branch");
  const branch_target = extractSignalValueToInt(signalIF, "branch_target");
  const Imem_data = extractSignalValue(signalIF, "Imem_data").value;
  const IF_Imem_data = parse_to_INST_List(Imem_data);

  const if_packet = extractSignalValue(signalIF, "if_packet").value;
  const IF_if_packet = parseIF_ID_PACKET(if_packet);

  const Imem_addr = extractSignalValueToInt(signalIF, "Imem_addr");

  return (
    <>
      <Module className={`${className}`}>
        <ModuleHeader label="Fetch" />
        <ModuleContent className="space-y-2">
          <Card>
            <CardHeader label="Inputs" />
            <CardContent className="justify-items-center">
              <SimpleValDisplay label="Take Branch: ">
                {displayValue(take_branch)}
              </SimpleValDisplay>
              <SimpleValDisplay label="Branch Target: " className="w-full">
                {displayValueHex(branch_target)}
              </SimpleValDisplay>

              <Dtable>
                <Dthead>
                  <Dtr>
                    <Dth>Imem_data</Dth>
                  </Dtr>
                </Dthead>
                <Dtbody>
                  {IF_Imem_data.map((d, idx) => (
                    <Dtr key={idx}>
                      <Dtd>
                        <div className="w-40">{parseInstruction(d)}</div>
                      </Dtd>
                    </Dtr>
                  ))}
                </Dtbody>
              </Dtable>
            </CardContent>
          </Card>

          <Card>
            <CardHeader label="Outputs" />
            <CardContent>
              <DisplayIF_ID_PACKET packet={IF_if_packet} />
              <SimpleValDisplay label="Imem_addr: ">
                {displayValueHex(Imem_addr)}
              </SimpleValDisplay>
            </CardContent>
          </Card>
        </ModuleContent>
      </Module>
    </>
  );
};

export default IFDebugger;
