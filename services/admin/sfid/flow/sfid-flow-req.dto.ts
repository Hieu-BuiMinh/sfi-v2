import { ESfidFlowStatus } from './sfid-flow-res.dto'

export interface TSfidFlowOperationReq {
  approve_status: ESfidFlowStatus | number
  revision_type?: number[]
  revision_message?: string
  reject_message?: string
  atp_id_number?: string
}
