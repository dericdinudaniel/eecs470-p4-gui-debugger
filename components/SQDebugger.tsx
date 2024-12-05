import { ScopeData } from "@/lib/tstypes";
import { ModuleBase, ModuleHeader } from "./dui/Module";
import {
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
import { CardBase, CardHeader, CardHeaderSmall } from "./dui/Card";
import { Dtable, Dtbody, Dtd, Dth, Dthead, Dtr } from "./dui/DTable";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";
import PaddedNum from "./dui/PaddedNum";
import { useState } from "react";
import DisplaySQData from "./DisplaySQData";

// Dispatch Interface Component
const DispatchIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
}> = ({ className, signalSQ }) => {
  // DISPATCH INTERFACE
  // input signals
  const dispatched_stores = extractSignalValue(
    signalSQ,
    "dispatched_stores"
  ).value;
  const SQ_dispatched_stores = parseSQ_DATA_List(dispatched_stores);
  const branch_idx = extractSignalValue(signalSQ, "branch_idx").value;
  const SQ_branch_idx = parseBoolArrToBoolArray(branch_idx);

  // output signals
  const open_spots = extractSignalValueToInt(signalSQ, "open_spots");
  const dispatch_tails = extractSignalValue(signalSQ, "dispatch_tails").value;
  const SQ_dispatch_tails = parseSQ_IDX_List(dispatch_tails);

  return (
    <CardBase className={className}>
      <CardHeader>Dispatch IF</CardHeader>
    </CardBase>
  );
};

// ROB Interface Component
const ROBIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
}> = ({ className, signalSQ }) => {
  //
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
    <CardBase className={className}>
      <CardHeader>ROB IF</CardHeader>
    </CardBase>
  );
};

// Stoaf Interface Component
const StoafIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
}> = ({ className, signalSQ }) => {
  //
  // STORE FU INTERFACE
  const cmplt_str = extractSignalValue(signalSQ, "cmplt_str").value;
  const SQ_cmplt_str = parseSTR_CMPLT_List(cmplt_str);

  return (
    <CardBase className={className}>
      <CardHeader>Stoaf IF</CardHeader>
    </CardBase>
  );
};

// RSLoad Interface Component
const RSLoadIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
}> = ({ className, signalSQ }) => {
  //
  // RS LOAD INTERFACE
  // output signals
  const mem_ready_tail = extractSignalValueToInt(signalSQ, "mem_ready_tail");
  const output_head = extractSignalValueToInt(signalSQ, "output_head");
  const output_empty = extractSignalValueToBool(signalSQ, "output_empty");
  const any_complete = extractSignalValueToBool(signalSQ, "any_complete");

  return (
    <CardBase className={className}>
      <CardHeader>RS Load Issue IF</CardHeader>
    </CardBase>
  );
};

// Loaf Interface Component
const LoafIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
}> = ({ className, signalSQ }) => {
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
    <CardBase className={className}>
      <CardHeader>Loaf IF</CardHeader>
      <div className="justify-items-center">
        {/* forward requests from load FU */}
        <div className="justify-items-center">
          <CardHeaderSmall>Forward Requests</CardHeaderSmall>
          <Dtable>
            <Dthead>
              <Dtr>
                <Dth>#</Dth>
                <Dth>Addr</Dth>
                <Dth>Type</Dth>
                <Dth>SQ IDX</Dth>
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
                  <Dtd>{req.sq_tail}</Dtd>
                </Dtr>
              ))}
            </Dtbody>
          </Dtable>
        </div>

        {/* forward results from load FU */}
        <div className="justify-items-center">
          <CardHeaderSmall>Forward Results</CardHeaderSmall>
          <Dtable>
            <Dthead>
              <Dtr>
                <Dth>#</Dth>
                <Dth>Stall LOAF</Dth>
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
                  <Dtd>{res.stall_LOAF ? "Stall" : "--"}</Dtd>
                  <Dtd>{displayValueHex(res.forwarding_data)}</Dtd>
                </Dtr>
              ))}
            </Dtbody>
          </Dtable>
        </div>
      </div>
    </CardBase>
  );
};

// LSArb Interface Component
const LSArbIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
}> = ({ className, signalSQ }) => {
  // MASON MEMORY UNIT INTERFACE (actually the ls arbiter)
  const stall_sq = extractSignalValueToBool(signalSQ, "stall_sq");
  const retire_str = extractSignalValue(signalSQ, "retire_str").value;
  const SQ_retire_str = parseSQ_RETIRE_List(retire_str);

  return (
    <CardBase className={className}>
      <CardHeader>LS Arb IF</CardHeader>
    </CardBase>
  );
};

// Mispred Interface Component
const MispredIF: React.FC<{
  className: string;
  signalSQ: ScopeData;
}> = ({ className, signalSQ }) => {
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
    <CardBase className={className}>
      <CardHeader>Mispredict IF</CardHeader>
      <div className="justify-items-center space-y-[-.35rem]">
        <SimpleValDisplay
          label="Prediction: "
          className={`p-1 ${
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
      </div>
    </CardBase>
  );
};

type SQDebuggerProps = {
  className: string;
  signalSQ: ScopeData;
};
const SQDebugger: React.FC<SQDebuggerProps> = ({ className, signalSQ }) => {
  const entries = extractSignalValue(signalSQ, "entries").value;
  const SQ_entries = parseSQ_DATA_List(entries);

  const head = extractSignalValueToInt(signalSQ, "head");
  const tail = extractSignalValueToInt(signalSQ, "tail");

  const [showSQ, setShowSQ] = useState(true);

  return (
    <>
      <ModuleBase>
        <ModuleHeader
          className=""
          onClick={() => {
            setShowSQ(!showSQ);
          }}
        >
          Store Queue
        </ModuleHeader>

        {showSQ && (
          <div className="justify-items-center space-y-2 mt-2">
            {/* Interfaces */}
            <div className="flex gap-x-2 justify-items-center items-start">
              <DispatchIF className="" signalSQ={signalSQ} />
              <ROBIF className="" signalSQ={signalSQ} />
              <StoafIF className="" signalSQ={signalSQ} />
              <RSLoadIF className="" signalSQ={signalSQ} />
              <LoafIF className="" signalSQ={signalSQ} />
              <LSArbIF className="" signalSQ={signalSQ} />
              <MispredIF className="" signalSQ={signalSQ} />
            </div>

            {/* actual store queue */}
            <div>
              <DisplaySQData
                className="shadow-none p-0"
                SData={SQ_entries}
                head={head}
                tail={tail}
                isSQ={true}
              />
            </div>
          </div>
        )}
      </ModuleBase>
    </>
  );
};

export default SQDebugger;
