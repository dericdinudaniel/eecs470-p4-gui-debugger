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
import { displayValue, displayValueHex } from "@/lib/utils";
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
    dataAddr: Types.ADDR;
    cacheType: "i" | "d";
  }
> = ({ className, type, transTag, dataTag, data, dataAddr, cacheType }) => {
  return (
    <IOBase className={className} type={type}>
      <SimpleValDisplay label="Tran Tag: ">
        {displayValue(transTag)}
      </SimpleValDisplay>

      <div className="justify-items-center p-0">
        <SimpleValDisplay label="Data Tag: ">
          {displayValue(dataTag)}
        </SimpleValDisplay>
        {/* <SimpleValDisplay label="Addr: ">
          {displayValueHex(Imem2proc_addr)}
        </SimpleValDisplay> */}

        <Dtable>
          <Dthead>
            <Dtr>
              <Dth colSpan={2}>{`Addr: ${displayValueHex(dataAddr)}`}</Dth>
            </Dtr>
          </Dthead>
          <Dtbody className={dataTag != 0 ? "bg-good" : "bg-bad"}>
            {data.map((d, idx) => (
              <Dtr key={idx}>
                <Dtd>
                  <div className="w-40">
                    {cacheType == "i"
                      ? parseInstruction(d)
                      : displayValueHex(d)}
                  </div>
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
    dataAddr: Types.ADDR;
  }
> = ({ className, type, transTag, dataTag, data, dataAddr }) => {
  return (
    <>
      <MemArbToI$
        className={className}
        type={type}
        transTag={transTag}
        dataTag={dataTag}
        data={data}
        dataAddr={dataAddr}
        cacheType="d"
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
