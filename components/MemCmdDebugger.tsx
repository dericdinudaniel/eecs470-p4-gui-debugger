import { ModuleBase, ModuleHeader } from "./dui/Module";
import { ScopeData } from "@/lib/tstypes";
import {
  displayValueHex,
  extractSignalValue,
  extractSignalValueToInt,
  parseMEM_COMMAND,
} from "@/lib/utils";
import { CardBase } from "./dui/Card";
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
      <ModuleBase>
        <ModuleHeader>Memory Command</ModuleHeader>
        <CardBase className="mt-2">
          <SimpleValDisplay label="Command: ">
            {getMemCommandName(MC_proc2mem_command)}
          </SimpleValDisplay>
          <SimpleValDisplay label="Address: ">
            {displayValueHex(proc2mem_addr)}
          </SimpleValDisplay>
        </CardBase>
      </ModuleBase>
    </>
  );
};

export default MemCmdDebugger;
