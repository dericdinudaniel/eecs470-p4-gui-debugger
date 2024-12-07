import { ScopeData } from "@/lib/tstypes";
import { Module, ModuleContent, ModuleHeader } from "./dui/Module";
import {
  displayValue,
  displayValueHex,
  extractSignalValue,
  extractSignalValueToBool,
  extractSignalValueToInt,
  parseBoolArrToBoolArray,
  parseLOAF_FORWARD_REQ_List,
  parseLOAF_FORWARD_RESULT_List,
  parseSQ_DATA_List,
  parseSQ_IDX_List,
  parseSQ_RETIRE_List,
  parseSTR_CMPLT_List,
} from "@/lib/utils";
import * as Types from "@/lib/types";
import { Card, CardContent, CardHeader, CardHeaderSmall } from "./dui/Card";
import { Dtable, Dtbody, Dtd, Dth, Dthead, DthLeft, Dtr } from "./dui/DTable";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";
import PaddedNum from "./dui/PaddedNum";
import { useState } from "react";
import DisplaySQData from "./DisplaySQData";
import { DButton } from "./dui/DButton";

// Dispatch Interface Component
const DispatchIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
  display: boolean;
}> = ({ className, signalSQ, display }) => {
  // DISPATCH INTERFACE
  // input signals
  const dispatched_stores = extractSignalValue(
    signalSQ,
    "dispatched_stores"
  ).value;
  const SQ_dispatched_stores = parseSQ_DATA_List(dispatched_stores);

  // output signals
  const dispatch_tails = extractSignalValue(signalSQ, "dispatch_tails").value;
  const SQ_dispatch_tails = parseSQ_IDX_List(dispatch_tails);

  return (
    <Card className={className} display={display}>
      <CardHeader label="Dispatch IF" />
      <CardContent className="flex space-x-2">
        <div className="justify-items-center">
          <CardHeaderSmall label="Inputs" />
          <DisplaySQData
            className="shadow-none p-0"
            SData={SQ_dispatched_stores}
            head={-1}
            tail={-1}
            isSQ={false}
          />
        </div>

        <div className="justify-items-center">
          <CardHeaderSmall label="Outputs" />
          <Dtable>
            <Dthead>
              <Dtr>
                <Dth>#</Dth>
                <Dth>Saved Tail</Dth>
              </Dtr>
            </Dthead>
            <Dtbody>
              {SQ_dispatch_tails.map((tail, idx) => (
                <Dtr key={idx} className="bg-neutral">
                  <Dtd>{idx}</Dtd>
                  <Dtd>{displayValue(tail)}</Dtd>
                </Dtr>
              ))}
            </Dtbody>
          </Dtable>
        </div>
      </CardContent>
    </Card>
  );
};

// ROB Interface Component
const ROBIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
  display: boolean;
}> = ({ className, signalSQ, display }) => {
  // ROB INTERFACE
  // input signals
  const rob_retire_valid = extractSignalValueToInt(
    signalSQ,
    "rob_retire_valid"
  );
  // output signals
  const str_retire_valid = extractSignalValueToInt(
    signalSQ,
    "str_retire_valid"
  );

  return (
    <Card className={className} display={display}>
      <CardHeader label="ROB IF" />
      <CardContent>
        <CardHeaderSmall label="Valid Retires?" />
        <div className="justify-items-center space-y-[-.35rem]">
          <SimpleValDisplay label="ROB Valid: ">
            {displayValue(rob_retire_valid)}
          </SimpleValDisplay>
          <SimpleValDisplay label="STR Valid: ">
            {displayValue(str_retire_valid)}
          </SimpleValDisplay>
        </div>
      </CardContent>
    </Card>
  );
};

// Stoaf Interface Component
const StoafIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
  display: boolean;
}> = ({ className, signalSQ, display }) => {
  // STORE FU INTERFACE
  const cmplt_str = extractSignalValue(signalSQ, "cmplt_str").value;
  const SQ_cmplt_str = parseSTR_CMPLT_List(cmplt_str);

  return (
    <Card className={className} display={display}>
      <CardHeader label="Stoaf IF" />
      <CardContent>
        <CardHeaderSmall label="Completed Stores" />
        <Dtable>
          <Dthead>
            <Dtr>
              <DthLeft>#</DthLeft>
              <Dth>
                <div className="w-14">SQ IDX</div>
              </Dth>
              <Dth>Addr</Dth>
              <Dth>Data</Dth>
            </Dtr>
          </Dthead>
          <Dtbody>
            {SQ_cmplt_str.map((complete, idx) => (
              <Dtr
                key={idx}
                className={complete.address_valid ? "bg-good" : "bg-bad"}
              >
                <Dtd>{idx}</Dtd>
                <Dtd>{displayValue(complete.index)}</Dtd>
                <Dtd>{displayValueHex(complete.store_address)}</Dtd>
                <Dtd>{displayValueHex(complete.store_data)}</Dtd>
              </Dtr>
            ))}
          </Dtbody>
        </Dtable>
      </CardContent>
    </Card>
  );
};

// RSLoad Interface Component
const RSLoadIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
  display: boolean;
}> = ({ className, signalSQ, display }) => {
  //
  // RS LOAD INTERFACE
  // output signals
  const mem_ready_tail = extractSignalValueToInt(signalSQ, "mem_ready_tail");
  const output_head = extractSignalValueToInt(signalSQ, "output_head");
  const output_empty = extractSignalValueToBool(signalSQ, "output_empty");
  const any_complete = extractSignalValueToBool(signalSQ, "any_complete");

  return (
    <Card className={className} display={display}>
      <CardHeader label="RS Load IF" />
      <CardContent className="space-y-[-.35rem]">
        <CardHeaderSmall label="Outputs" />

        <SimpleValDisplay label="Mem Ready Tail: ">
          {mem_ready_tail}
        </SimpleValDisplay>
        <SimpleValDisplay label="Out Head: ">{output_head}</SimpleValDisplay>
        <SimpleValDisplay label="Out Empty: ">
          {output_empty ? "Y" : "N"}
        </SimpleValDisplay>
        <SimpleValDisplay label="Any Cmplte: ">
          {any_complete ? "Y" : "N"}
        </SimpleValDisplay>
      </CardContent>
    </Card>
  );
};

// Loaf Interface Component
const LoafIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
  display: boolean;
}> = ({ className, signalSQ, display }) => {
  // LOAF INTERFACE (store functional unit)
  const loaf_forward_req = extractSignalValue(
    signalSQ,
    "loaf_forward_req"
  ).value;
  const SQ_loaf_forward_req = parseLOAF_FORWARD_REQ_List(loaf_forward_req);
  const loaf_forward_result = extractSignalValue(
    signalSQ,
    "loaf_forward_result"
  ).value;
  const SQ_loaf_forward_result =
    parseLOAF_FORWARD_RESULT_List(loaf_forward_result);

  return (
    <Card className={className} display={display}>
      <CardHeader label="Loaf IF" />
      <CardContent className="space-y-1">
        {/* forward requests from load FU */}
        <div className="justify-items-center">
          <CardHeaderSmall label="Forward Requests" />
          <Dtable>
            <Dthead>
              <Dtr>
                <Dth>#</Dth>
                <Dth>Addr</Dth>
                <Dth>Type</Dth>
                <Dth>
                  <div className="w-14">SQ IDX</div>
                </Dth>
              </Dtr>
            </Dthead>
            <Dtbody>
              {SQ_loaf_forward_req.map((req, idx) => (
                <Dtr
                  key={idx}
                  className={`${req.load_data_req ? "bg-good" : "bg-bad"}`}
                >
                  <Dtd>{idx}</Dtd>
                  <Dtd>{displayValueHex(req.forwarding_address)}</Dtd>
                  <Dtd>{Types.getLOADFuncName(req.load_type)}</Dtd>
                  <Dtd>{displayValue(req.sq_tail)}</Dtd>
                </Dtr>
              ))}
            </Dtbody>
          </Dtable>
        </div>

        {/* forward results from load FU */}
        <div className="justify-items-center">
          <CardHeaderSmall label="Forward Results" />
          <Dtable>
            <Dthead>
              <Dtr>
                <Dth>#</Dth>
                <Dth>Stall?</Dth>
                <Dth className="w-20">Data</Dth>
              </Dtr>
            </Dthead>
            <Dtbody>
              {SQ_loaf_forward_result.map((res, idx) => (
                <Dtr
                  key={idx}
                  className={`${res.forwarded_valid ? "bg-good" : "bg-bad"}`}
                >
                  <Dtd>{idx}</Dtd>
                  <Dtd>{res.stall_LOAF ? "Yes" : "No"}</Dtd>
                  <Dtd>{displayValueHex(res.forwarding_data)}</Dtd>
                </Dtr>
              ))}
            </Dtbody>
          </Dtable>
        </div>
      </CardContent>
    </Card>
  );
};

// LSArb Interface Component
const LSArbIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
  display: boolean;
}> = ({ className, signalSQ, display }) => {
  // MASON MEMORY UNIT INTERFACE (actually the ls arbiter)
  const stall_sq = extractSignalValueToBool(signalSQ, "stall_sq");
  const retire_str = extractSignalValue(signalSQ, "retire_str").value;
  const SQ_retire_str = parseSQ_RETIRE_List(retire_str);

  return (
    <Card className={className} display={display}>
      <CardHeader label="LS Arb IF" />
      <CardContent className="space-y-1">
        <div className="justify-items-center">
          <CardHeaderSmall label="Inputs" />
          <SimpleValDisplay label="Stall SQ?: ">
            {stall_sq ? "Y" : "N"}
          </SimpleValDisplay>
        </div>

        <div className="justify-items-center">
          <CardHeaderSmall label="Outputs" />

          <Dtable>
            <Dthead>
              <Dtr>
                <DthLeft>#</DthLeft>
                <Dth>Addr</Dth>
                <Dth>Data</Dth>
              </Dtr>
            </Dthead>
            <Dtbody>
              {SQ_retire_str.map((retire, idx) => (
                <Dtr key={idx} className={retire.valid ? "bg-good" : "bg-bad"}>
                  <Dtd>{idx}</Dtd>
                  <Dtd>{displayValueHex(retire.store_address)}</Dtd>
                  <Dtd>{displayValueHex(retire.store_data)}</Dtd>
                </Dtr>
              ))}
            </Dtbody>
          </Dtable>
        </div>
      </CardContent>
    </Card>
  );
};

// Mispred Interface Component
const MispredIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
  display: boolean;
}> = ({ className, signalSQ, display }) => {
  // MISPREDICT RECOVERY INTERFACE
  const prediction = extractSignalValueToInt(
    signalSQ,
    "prediction"
  ) as Types.BRANCH_PREDICT_T;
  const sq_recovery_tail = extractSignalValueToInt(
    signalSQ,
    "sq_recovery_tail"
  );
  const sq_checkpoint_tail = extractSignalValueToInt(
    signalSQ,
    "sq_checkpoint_tail"
  );

  return (
    <Card className={className} display={display}>
      <CardHeader label="Mispred IF" />
      <CardContent className="space-y-[-.35rem]">
        <SimpleValDisplay
          label="Prediction: "
          className={`p-1 mb-1 ${
            prediction == Types.BRANCH_PREDICT_T.CORRECT_PRED
              ? "rounded-lg bg-veryGood"
              : prediction == Types.BRANCH_PREDICT_T.MISPREDICT
              ? "rounded-lg bg-veryBad"
              : ""
          }`}
          labelClassName="text-base"
        >
          {Types.getBranchPredictName(prediction)}
        </SimpleValDisplay>

        <SimpleValDisplay label="SQ Recovery Tail: ">
          {sq_recovery_tail}
        </SimpleValDisplay>
        <SimpleValDisplay label="SQ Checkpoint Tail: ">
          {sq_checkpoint_tail}
        </SimpleValDisplay>
      </CardContent>
    </Card>
  );
};

type SQDebuggerProps = {
  className: string;
  signalSQ: ScopeData;
};
const SQDebugger: React.FC<SQDebuggerProps> = ({ className, signalSQ }) => {
  const available_spots = extractSignalValueToInt(signalSQ, "available_spots");

  const entries = extractSignalValue(signalSQ, "entries").value;
  const SQ_entries = parseSQ_DATA_List(entries);

  const head = extractSignalValueToInt(signalSQ, "head");
  const tail = extractSignalValueToInt(signalSQ, "tail");

  const [showSQInterfaces, setShowSQInterfaces] = useState(true);

  return (
    <>
      <Module>
        <ModuleHeader label="Store Queue">
          <SimpleValDisplay label="(Avail. Spots: " className="pl-3">
            {Number.isNaN(available_spots) ? "X" : available_spots}
            {")"}
          </SimpleValDisplay>

          {/* Toggle buttons */}
          <div className="pl-3 space-x-2">
            <DButton onClick={() => setShowSQInterfaces(!showSQInterfaces)}>
              {showSQInterfaces ? "Hide SQ Interfaces" : "Show SQ Interfaces"}
            </DButton>
          </div>
        </ModuleHeader>

        <ModuleContent className="justify-items-center space-y-2 mt-2">
          <div className="flex gap-x-2 justify-items-center items-start">
            <div className="justify-items-center space-y-2">
              <DispatchIF
                className=""
                display={showSQInterfaces}
                signalSQ={signalSQ}
              />
              <div className="justify-items-center flex gap-x-2 items-start">
                <ROBIF
                  className=""
                  display={showSQInterfaces}
                  signalSQ={signalSQ}
                />
                <RSLoadIF
                  className=""
                  display={showSQInterfaces}
                  signalSQ={signalSQ}
                />
                <LSArbIF
                  className=""
                  display={showSQInterfaces}
                  signalSQ={signalSQ}
                />
              </div>
              <DisplaySQData // Actual Store Queue
                className=""
                SData={SQ_entries}
                head={head}
                tail={tail}
                isSQ={true}
              />
            </div>

            <div className="justify-items-center space-y-2">
              <StoafIF
                className=""
                display={showSQInterfaces}
                signalSQ={signalSQ}
              />
              <MispredIF
                className=""
                display={showSQInterfaces}
                signalSQ={signalSQ}
              />
              <LoafIF
                className=""
                display={showSQInterfaces}
                signalSQ={signalSQ}
              />
            </div>
          </div>
        </ModuleContent>
      </Module>
    </>
  );
};

export default SQDebugger;
