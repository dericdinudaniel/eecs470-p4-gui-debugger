import { Module, ModuleHeader, ModuleContent } from "./dui/Module";
import { ScopeData } from "@/lib/tstypes";
import {
  displayValueHex,
  extractSignalValue,
  extractSignalValueToInt,
  parseMEM_COMMAND,
} from "@/lib/utils";
import { Card } from "./dui/Card";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";
import { getMemCommandName } from "@/lib/types";

type MemCmdDebuggerProps = {
  className: string;
  signalCPU: ScopeData;
};

const MemCmdDebugger: React.FC<MemCmdDebuggerProps> = ({
  className,
  signalCPU,
}) => {
  const proc2mem_command = extractSignalValue(
    signalCPU,
    "proc2mem_command"
  ).value;
  const MC_proc2mem_command = parseMEM_COMMAND(proc2mem_command);

  const proc2mem_addr = extractSignalValueToInt(signalCPU, "proc2mem_addr");
  return (
    <>
      <Module className={className}>
        <ModuleHeader label="Memory Command"></ModuleHeader>
        <ModuleContent>
          <Card>
            <SimpleValDisplay label="Command: ">
              {getMemCommandName(MC_proc2mem_command)}
            </SimpleValDisplay>
            <SimpleValDisplay label="Address: ">
              {displayValueHex(proc2mem_addr)}
            </SimpleValDisplay>
          </Card>
        </ModuleContent>
      </Module>
    </>
  );
};

export default MemCmdDebugger;
