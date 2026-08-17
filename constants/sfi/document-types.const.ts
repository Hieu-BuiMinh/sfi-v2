export const SFI_DOCUMENT_TYPES = {
  PASSPORT_FRONT: 1,
  PASSPORT_SELFIE: 24,
  KTP_FRONT: 2,
  ID_BACK: 24,
  NPWP: 25,
} as const

export type SfiDocumentType =
  (typeof SFI_DOCUMENT_TYPES)[keyof typeof SFI_DOCUMENT_TYPES]
