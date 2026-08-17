import { ESfiFlowStatus } from './sfi-flow-res.dto'

export interface TSfiFlowOperationReq {
  approve_status: ESfiFlowStatus | number
  revision_type?: number[]
  revision_message?: string
  reject_message?: string
  atp_id_number?: string
}
