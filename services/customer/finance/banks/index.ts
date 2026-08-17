import { clientApi } from '@/lib/api/client'
import { BankItem } from './banks-res.dto'

export const financeBanksService = {
	getBanks: {
		key: () => ['get_finance_bank_list'] as const,
		get: async () => {
			const res = await clientApi.get<BankItem[]>('/api/v2/finance/banks')
			return res.data
		},
	},
}
