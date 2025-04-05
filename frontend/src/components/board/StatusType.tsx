import React from 'react';
import {StatusType as StatusType_Type} from "@/types/board.types";

const StatusType = ({statusType, cn}: {
  statusType: StatusType_Type;
  cn?: string;
}) => {
  return (
    <span className={`p-1 text-white font-semibold rounded-md shadow-md w-fit max-w-fit
     ${statusType.status.length > 15 ? 'text-xs' : 'text-sm'}
     ${cn}`} style={{
      backgroundColor: statusType.color
    }}>
      {statusType.status.length > 15 ? statusType.status.slice(0, 12) + '...' : statusType.status}
    </span>
  );
};

export default StatusType;