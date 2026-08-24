/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { TApplication } from '@/services/customer/applications/applications-res.dto'
import { InfoGrid, InfoItem, InfoSection } from '@/views/portal_sfi/customer/components/info-display'
import { Divider } from '@mui/material'
export type PersonalInfoData = {
	basicInfo: {
		fullName?: string
		dateOfBirth?: string
		gender?: string
		placeOfBirth?: string
		email?: string
		phoneNumber?: string
		registeredAddress?: string
		registeredCity?: string
		registeredPostalCode?: string
	}
	residenceInfo: {
		marriageStatus?: string
		residentialCity?: string
		residentialPostalCode?: string
		homeOwnershipStatus?: string
		currentAddress?: string
		domicileAddress?: string
	}
	emergencyContact: {
		contactName?: string
		contactPhone?: string
		relationshipWithCustomer?: string
		mothersMaidenName?: string
	}
}

function PersonalInformation({ application, t }: { application?: TApplication; t: any }) {
	const cp = application?.content?.customer_particular?.personal_information || {}

	const data: PersonalInfoData = {
		basicInfo: {
			fullName: cp.full_name,
			dateOfBirth: cp.birthday,
			gender: cp.gender,
			placeOfBirth: cp.place_birth,
			email: cp.email,
			phoneNumber: cp.phone,
			registeredAddress: cp.id_address,
			registeredCity: cp.home_address_regency_code,
			registeredPostalCode: cp.home_address_postal_code,
		},
		residenceInfo: {
			marriageStatus: cp.marriage_status,
			residentialCity: cp.home_address_regency_code,
			residentialPostalCode: cp.home_address_postal_code,
			homeOwnershipStatus: cp.home_ownership_status,
			currentAddress: cp.current_address_postal_code,
			domicileAddress: cp.current_address_postal_code,
		},
		emergencyContact: {
			contactName: cp.emergency_contact_name,
			contactPhone: cp.emergency_phone,
			relationshipWithCustomer: cp.relationship_with_customer,
			mothersMaidenName: cp.mother_maiden_name,
		},
	}
	return (
		<div className="flex flex-col gap-6">
			<InfoSection title={t('sections.basic_info')}>
				<InfoGrid>
					<InfoItem label={t('fields.full_name')} value={data?.basicInfo.fullName} />
					<InfoItem label={t('fields.dob')} value={data?.basicInfo.dateOfBirth} />
					<InfoItem label={t('fields.gender')} value={data?.basicInfo.gender} />
					<InfoItem label={t('fields.pob')} value={data?.basicInfo.placeOfBirth} />
					<InfoItem label={t('fields.email')} value={data?.basicInfo.email} />
					<InfoItem label={t('fields.phone_number')} value={data?.basicInfo.phoneNumber} />
					<InfoItem
						label={t('fields.registered_address')}
						value={data?.basicInfo.registeredAddress}
						colSpan
					/>
					<InfoItem label={t('fields.registered_city')} value={data?.basicInfo.registeredCity} />
					<InfoItem label={t('fields.registered_postal_code')} value={data?.basicInfo.registeredPostalCode} />
				</InfoGrid>
			</InfoSection>

			<Divider />

			<InfoSection title={t('sections.residence_info')}>
				<InfoGrid>
					<InfoItem label={t('fields.marriage_status')} value={data?.residenceInfo.marriageStatus} />
					<InfoItem label={t('fields.residential_city')} value={data?.residenceInfo.residentialCity} />
					<InfoItem
						label={t('fields.residential_postal_code')}
						value={data?.residenceInfo.residentialPostalCode}
					/>
					<InfoItem label={t('fields.home_ownership')} value={data?.residenceInfo.homeOwnershipStatus} />
					<InfoItem label={t('fields.current_address')} value={data?.residenceInfo.currentAddress} />
					<InfoItem label={t('fields.domicile_address')} value={data?.residenceInfo.domicileAddress} />
				</InfoGrid>
			</InfoSection>

			<Divider />

			<InfoSection title={t('sections.emergency_contact')}>
				<InfoGrid>
					<InfoItem label={t('fields.emergency_name')} value={data?.emergencyContact.contactName} />
					<InfoItem label={t('fields.emergency_phone')} value={data?.emergencyContact.contactPhone} />
					<InfoItem
						label={t('fields.relationship')}
						value={data?.emergencyContact.relationshipWithCustomer}
					/>
					<InfoItem label={t('fields.mother_maiden_name')} value={data?.emergencyContact.mothersMaidenName} />
				</InfoGrid>
			</InfoSection>
		</div>
	)
}

export default PersonalInformation
