import React from "react";
import { ScopeData } from "@/lib/tstypes";
import { Card, CardContent, CardHeader, CardHeaderSmall } from "./dui/Card";

import {
  displayValue,
  displayValueHex,
  extractSignalValue,
  extractSignalValueToBool,
  extractSignalValueToInt,
  parseLOAF_FORWARD_REQ,
  parseLOAF_FORWARD_RESULT,
  parseMEM_BLOCK,
} from "@/lib/utils";
import * as Types from "@/lib/types";
import { Dtable, Dtbody, Dtd, Dth, Dthead, DthLeft, Dtr } from "./dui/DTable";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";

type DisplayLoafProps = {
  className: string;
  signalLoaf: ScopeData;
};

const DisplayLoaf: React.FC<DisplayLoafProps> = ({ className, signalLoaf }) => {
  try {
    const test = extractSignalValueToInt(
      signalLoaf,
      "state"
    ) as Types.LOAF_STATE_T;
  } catch (e) {
    throw new Error("Check Constants.ts & sysdefs.h: NUM_FU_LOAD");
  }

  const state = extractSignalValueToInt(
    signalLoaf,
    "state"
  ) as Types.LOAF_STATE_T;
  const fwd_result = extractSignalValue(signalLoaf, "fwd_result").value;
  const LD_fwd_result = parseLOAF_FORWARD_RESULT(fwd_result);

  const fwd_req = extractSignalValue(signalLoaf, "fwd_req").value;
  const LD_fwd_req = parseLOAF_FORWARD_REQ(fwd_req);

  const loaded_data_valid = extractSignalValueToBool(
    signalLoaf,
    "loaded_data_valid"
  );
  const load_result = extractSignalValueToInt(
    signalLoaf,
    "load_result"
  ) as Types.DATA;

  const mem_complete = extractSignalValueToBool(signalLoaf, "mem_complete");
  const mem_data = extractSignalValue(signalLoaf, "mem_data").value;
  const LD_mem_data = parseMEM_BLOCK(mem_data);
  const mem_addr = extractSignalValueToInt(
    signalLoaf,
    "mem_addr"
  ) as Types.ADDR;
  const mem_valid = extractSignalValueToBool(signalLoaf, "mem_valid");

  return (
    <>
      <div
        className={`${className} hover:shadow-2xl transition-shadow border rounded-lg p-2`}
      >
        <div className="justify-items-center space-y-2">
          {/* Forwarding IF */}
          <div className="justify-items-center bg-card rounded-lg p-2 pt-0">
            <CardHeaderSmall label="Forward?" />
            <div className="justify-items-center space-y-1">
              <div className="justify-items-center border rounded-lg p-1 bg-neutral">
                <CardHeaderSmall label="Forward Results" />
                <Dtable>
                  <Dthead>
                    <Dtr>
                      <Dth>Stall?</Dth>
                      <Dth className="w-20">Data</Dth>
                    </Dtr>
                  </Dthead>
                  <Dtbody>
                    <Dtr
                      className={`${
                        LD_fwd_result.forwarded_valid ? "bg-good" : "bg-bad"
                      }`}
                    >
                      <Dtd>{LD_fwd_result.stall_LOAF ? "Yes" : "No"}</Dtd>
                      <Dtd>
                        {displayValueHex(LD_fwd_result.forwarding_data)}
                      </Dtd>
                    </Dtr>
                  </Dtbody>
                </Dtable>
              </div>

              <div className="justify-items-center border rounded-lg p-1 bg-neutral">
                <CardHeaderSmall label="Forward Req" />
                <Dtable>
                  <Dthead>
                    <Dtr>
                      <Dth>Addr</Dth>
                      <Dth>Type</Dth>
                      <Dth>
                        <div className="w-14">SQ IDX</div>
                      </Dth>
                    </Dtr>
                  </Dthead>
                  <Dtbody>
                    <Dtr
                      className={`${
                        LD_fwd_req.load_data_req ? "bg-good" : "bg-bad"
                      }`}
                    >
                      <Dtd>
                        {displayValueHex(LD_fwd_req.forwarding_address)}
                      </Dtd>
                      <Dtd>{Types.getLOADFuncName(LD_fwd_req.load_type)}</Dtd>
                      <Dtd>{displayValue(LD_fwd_req.sq_tail)}</Dtd>
                    </Dtr>
                  </Dtbody>
                </Dtable>
              </div>
            </div>
          </div>

          <div className="justify-items-center bg-card rounded-lg p-2 pt-0">
            <CardHeaderSmall label="Cache" />
            <div className="justify-items-center space-y-1">
              <div
                className={`justify-items-center border rounded-lg p-1 ${
                  mem_valid ? "bg-good" : "bg-bad"
                }`}
              >
                <CardHeaderSmall label="Request Addr" />
                {displayValueHex(mem_addr)}
              </div>

              <div
                className={`justify-items-center border rounded-lg p-1 ${
                  mem_complete ? "bg-good" : "bg-bad"
                }`}
              >
                <CardHeaderSmall label="Result Data" />
                <Dtable>
                  <Dtbody>
                    <Dtr>
                      <Dtd>
                        <div className="w-20">
                          {displayValueHex(LD_mem_data[0])}
                        </div>
                      </Dtd>
                    </Dtr>
                    <Dtr>
                      <Dtd>
                        <div className="w-20">
                          {displayValueHex(LD_mem_data[1])}
                        </div>
                      </Dtd>
                    </Dtr>
                  </Dtbody>
                </Dtable>
              </div>
            </div>
          </div>

          {/* Internals */}
          <div className="justify-items-center">
            <CardHeaderSmall label="Internals" />
            <SimpleValDisplay label="State: ">
              {Types.getLOAFStateName(state)}
            </SimpleValDisplay>
          </div>

          {/* Outputs */}
          <div className="justify-items-center">
            <CardHeader label="Outputs " />
            <div className="justify-items-center space-y-2">
              <div
                className={`justify-items-center border rounded-lg p-1 ${
                  loaded_data_valid ? "bg-good" : "bg-bad"
                }`}
              >
                <CardHeaderSmall label="Loaded Data" />
                {displayValueHex(load_result)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayLoaf;
