import * as React from "react";
import { Module, ModuleHeader, ModuleContent } from "./dui/Module";
import { Card, CardContent, CardHeader, CardHeaderSmall } from "./dui/Card";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";
import * as Types from "@/lib/types";
import PaddedNum from "./dui/PaddedNum";
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
import { ScopeData } from "@/lib/tstypes";
import { displayValueHex } from "@/lib/utils";
import { parseInstruction } from "@/lib/tsutils";

export type IFProps = {
  className: string;
  signal: ScopeData;
  display?: boolean;
};
const IFBase: React.FC<React.PropsWithChildren<IFProps>> = ({
  className,
  signal,
  display,
  children,
  ...rest
}) => {
  return (
    <Card className={className} display={display} {...rest}>
      {children}
    </Card>
  );
};

type IOProps = {
  className: string;
  type: "input" | "output" | "none";
};
const IOBase: React.FC<React.PropsWithChildren<IOProps>> = ({
  className,
  type,
  children,
  ...rest
}) => {
  return (
    <div className={`${className} justify-items-center`} {...rest}>
      {type != "none" && (
        <CardHeaderSmall label={type == "input" ? "Inputs" : "Outputs"} />
      )}
      <div className="justify-items-center">{children}</div>
    </div>
  );
};

const MemArbToI$: React.FC<
  IOProps & {
    transTag: number;
    dataTag: number;
    data: number[];
  }
> = ({ className, type, transTag, dataTag, data }) => {
  return (
    <IOBase className={className} type={type}>
      <SimpleValDisplay label="Tran Tag: ">
        <PaddedNum number={transTag} maxNumber={15} />
      </SimpleValDisplay>

      <div className="justify-items-center p-0">
        <SimpleValDisplay label="Data Tag: ">
          <PaddedNum number={dataTag} maxNumber={15} />
        </SimpleValDisplay>
        {/* <SimpleValDisplay label="Addr: ">
          {displayValueHex(Imem2proc_addr)}
        </SimpleValDisplay> */}

        <Dtable>
          <Dthead>
            <Dtr>
              <Dth colSpan={2}>Insts.</Dth>
            </Dtr>
          </Dthead>
          <Dtbody>
            {data.map((inst, idx) => (
              <Dtr key={idx} className="bg-neutral">
                <Dtd>
                  <div className="w-40">{parseInstruction(inst)}</div>
                </Dtd>
              </Dtr>
            ))}
          </Dtbody>
        </Dtable>
      </div>
    </IOBase>
  );
};

const I$ToMemArb: React.FC<
  IOProps & {
    memCommand: Types.MEM_COMMAND;
    memAddr: number;
    memBlock?: Types.MEM_BLOCK;
  }
> = ({ className, type, memCommand, memAddr, memBlock }) => {
  return (
    <>
      <IOBase className={className} type={type}>
        <SimpleValDisplay label="Command: ">
          {Types.getMemCommandName(memCommand)}
        </SimpleValDisplay>
        <SimpleValDisplay label="Addr: ">
          {displayValueHex(memAddr)}
        </SimpleValDisplay>
        {memBlock && (
          <Dtable>
            <Dthead>
              <Dtr>
                <Dth>Data</Dth>
              </Dtr>
            </Dthead>
            <Dtbody
              className={
                memCommand != Types.MEM_COMMAND.MEM_NONE ? "bg-good" : "bg-bad"
              }
            >
              <Dtr>
                <Dtd>
                  <div className="w-20">{displayValueHex(memBlock[0])}</div>
                </Dtd>
              </Dtr>
              <Dtr>
                <Dtd>
                  <div className="w-20">{displayValueHex(memBlock[1])}</div>
                </Dtd>
              </Dtr>
            </Dtbody>
          </Dtable>
        )}
      </IOBase>
    </>
  );
};

const MemToMemArb: React.FC<
  IOProps & {
    transTag: number;
    dataTag: number;
    data: number[];
  }
> = ({ className, type, transTag, dataTag, data }) => {
  return (
    <>
      <MemArbToI$
        className={className}
        type={type}
        transTag={transTag}
        dataTag={dataTag}
        data={data}
      />
    </>
  );
};

const MemArbToMem: React.FC<
  IOProps & {
    memCommand: Types.MEM_COMMAND;
    memAddr: number;
    memBlock: Types.MEM_BLOCK;
  }
> = ({ className, type, memCommand, memAddr, memBlock }) => {
  return (
    <>
      <I$ToMemArb
        className={className}
        type={type}
        memCommand={memCommand}
        memAddr={memAddr}
        memBlock={memBlock}
      />
    </>
  );
};

export { IFBase };
export { MemArbToI$, I$ToMemArb, MemToMemArb, MemArbToMem };
