# Tài liệu chuyển giao luồng OCR tài liệu — Onboarding / Identification

## 1. Mục tiêu tài liệu

Tài liệu này mô tả chi tiết luồng upload/chụp ảnh và scan OCR tại bước **Customer Particular → Identity Verification** của onboarding SFI, để có thể triển khai lại ở một project khác mà vẫn giữ đúng hành vi nghiệp vụ hiện tại.

Phạm vi gồm:

- Chọn loại giấy tờ: KTP hoặc Passport.
- Upload file hoặc chụp ảnh từ camera.
- Lưu ảnh vào application.
- OCR KTP qua backend eKYC/Privy.
- OCR Passport và NPWP qua OCR Job API.
- Liveness sau khi OCR KTP.
- Mapping kết quả OCR vào form và application content.
- Điều kiện cho phép bấm `Next`.
- Endpoint, headers, payload, response và thời điểm trigger.
- Các khác biệt giữa khách Indonesia và khách nước ngoài.
- Checklist cần có khi đem flow sang project khác.

> Lưu ý: tên file hiện tại là `ocr-scan.dm`, nhưng nội dung được viết theo Markdown. Có thể đổi extension thành `.md` khi project đích yêu cầu.

---

## 2. Source of truth trong project hiện tại

Các file chính:

| Vai trò                                       | File                                                                                             |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| UI và orchestration cho khách Indonesia       | `BaseComponents/pages/CreateApplication/v2/SFID_V2/CustomerParticular/Identification.tsx`        |
| UI và orchestration cho khách nước ngoài      | `BaseComponents/pages/CreateApplication/v2/SFID_V2/CustomerParticular/IdentificationForeign.tsx` |
| TypeScript contract của OCR Job               | `BaseComponents/Interfaces/OCR.ts`                                                               |
| Document type ID                              | `BaseComponents/libraries/ConstDocumentType.tsx`                                                 |
| API lưu application, upload document và Privy | `app/actions/applicationActions.ts`                                                              |
| Wrapper lưu application SFI                   | `BaseComponents/libraries/usePostSFIApplications.tsx`                                            |
| Next.js proxy tạo OCR job                     | `app/api/ocr/v1/jobs/route.ts`                                                                   |
| Next.js proxy upload file vào OCR job         | `app/api/ocr/v1/jobs/[id]/file/route.ts`                                                         |
| Next.js proxy lấy/xóa OCR job                 | `app/api/ocr/v1/jobs/[id]/route.ts`                                                              |
| Next.js proxy kiểm tra OCR service            | `app/api/ocr/health/live/route.ts`, `app/api/ocr/health/ready/route.ts`                          |
| Chọn component theo nationality               | `BaseComponents/pages/CreateApplication/v2/SFID_V2/CustomerParticular/MainCustomerPar.tsx`       |

---

## 3. Kiến trúc tổng thể

Luồng có ba nhóm API độc lập. Không được gộp chúng thành một API nếu backend project đích chưa thay đổi contract.

```text
Browser / Identification UI
        |
        |-- A. Lưu ảnh vào hồ sơ ------------------------------+
        |   POST {MAIN_API}/api/v1/applications/documents/upload|
        |                                                       |
        |-- B1. Nếu là KTP ----------------------------------+  |
        |   POST {MAIN_API}/api/v1/ekyc/ocr                  |  |
        |   GET  {MAIN_API}/api/v1/ekyc/liveness/start       |  |
        |   POST {MAIN_API}/api/v1/ekyc/liveness/callback    |  |
        |                                                    |  |
        |-- B2. Nếu là Passport hoặc NPWP ----------------+  |  |
        |   /api/ocr/* trên cùng Next.js host             |  |  |
        |                 |                                |  |  |
        |                 +-- x-api-key chỉ ở server ------+--+--+
        |                     {API_OCR_URL}/api/v1/*
        |
        +-- C. Lưu dữ liệu form/application
            POST {MAIN_API}/api/v1/applications
```

Ý nghĩa:

- API upload document chỉ lưu file và tạo `application_documents`.
- API OCR chỉ phân tích nội dung ảnh, không thay thế API lưu document.
- API update application lưu các field đã OCR vào `content.customer_particular`.
- OCR key của OCR Job service phải nằm ở server; browser không được biết `API_OCR_KEY`.
- Các API `{MAIN_API}` đi qua Axios client của ứng dụng, dùng `NEXT_PUBLIC_API_URL`, header `Authorization: Bearer <access token>` và header `Entity` theo host config.

---

## 4. Điều kiện chọn flow theo nationality

Tại `MainCustomerPar`, component được chọn bằng:

```ts
application.content.nationality === 'indonesian'
  ? <Identification />
  : <IdentificationForeign />
```

### 4.1. Khách Indonesia

Cho phép chọn:

- `nation_id`: KTP.
- `passport`: Passport.

Có thêm NPWP, nhưng NPWP là tùy chọn.

### 4.2. Khách nước ngoài

- Luôn dùng Passport.
- Không có lựa chọn KTP.
- Không có NPWP trong màn hình này.
- Selfie với Passport là bắt buộc.
- Không dùng Privy liveness trong component hiện tại.

---

## 5. Document type ID — contract bắt buộc với API upload

| Hằng số                    |   ID | Ý nghĩa                               | Có OCR?            | OCR engine                                |
| -------------------------- | ---: | ------------------------------------- | ------------------ | ----------------------------------------- |
| `MAIN_ACCOUNT_ID_PASSPORT` |  `1` | Passport của chủ tài khoản chính      | Có                 | OCR Job API, `docType=passport`           |
| `MAIN_ACCOUNT_ID_FRONT`    |  `2` | Mặt trước KTP của chủ tài khoản chính | Có                 | Backend eKYC/Privy                        |
| `SELFIE_WITH_ID`           | `24` | Selfie/liveness image                 | Không OCR document | Upload thường hoặc ảnh trả về từ liveness |
| `NPWP_PHOTO`               | `25` | Ảnh mã số thuế NPWP                   | Có                 | OCR Job API, `docType=npwp`               |

Project đích phải xác nhận các ID này tồn tại trong database/backend. Đây không chỉ là giá trị UI; chúng là contract gửi vào `documents[0][type_id]`.

---

## 6. Quy tắc file và camera

### 6.1. File upload

- UI chấp nhận extension: `JPG`, `PNG`, `jpeg`.
- Kích thước tối đa được kiểm tra ở component: `10 * 1024 * 1024` byte, tức 10 MiB.
- Nếu vượt giới hạn, dừng toàn bộ flow và hiển thị lỗi:
  `The uploaded file is too large or not in the correct format`.
- UI ghi rõ chỉ hỗ trợ PNG/JPG và tối đa 10 MB.
- Code hiện tại không tự resize, compress, rotate hoặc normalize ảnh trước khi gửi.

### 6.2. Camera

- Dùng `react-webcam`.
- Mặc định camera sau: `facingMode='environment'`.
- Người dùng có thể chuyển giữa `environment` và `user`.
- Screenshot format: `image/jpeg`.
- Ảnh base64 được đổi thành `File` tên `capture.jpg`.
- Sau khi chụp, ảnh đi qua đúng hàm `handleChange(file, type)` giống file upload.
- Camera preview được lưu client-side theo document type để hiển thị ngay.

### 6.3. Quy tắc thay thế file cũ

Trước khi upload file mới, frontend tìm document cũ và gọi API delete:

- Upload KTP hoặc Passport: xóa mọi document cũ thuộc nhóm type `[1, 2]`.
- Upload selfie: xóa document cũ type `[24]`.
- Upload NPWP: xóa document cũ type `[25]`.

Điều này bảo đảm KTP và Passport là hai lựa chọn loại trừ nhau: đổi từ KTP sang Passport sẽ xóa ảnh KTP cũ và ngược lại.

> Hành vi code hiện tại: các lệnh delete được tạo trong `map(async ...)` nhưng không được `await` tập trung trước upload. Vì vậy delete và upload có thể overlap. Khi port nên giữ business rule “một file hiện hành cho mỗi nhóm”, đồng thời nên tuần tự hóa delete → upload nếu backend không tự xử lý race condition.

---

## 7. Trigger matrix

| User action / system event            | API hoặc xử lý được trigger                                                                        |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Chọn file KTP hoặc chụp KTP           | Xóa document type 1/2 cũ; chạy Privy OCR; đồng thời upload KTP type 2 vào application              |
| Chọn file Passport hoặc chụp Passport | Xóa document type 1/2 cũ; tạo OCR job; đồng thời upload Passport type 1 vào application            |
| Chọn file NPWP hoặc chụp NPWP         | Xóa NPWP type 25 cũ; tạo OCR job; đồng thời upload NPWP type 25 vào application                    |
| Upload/chụp selfie với Passport       | Xóa selfie type 24 cũ; upload type 24; không chạy OCR                                              |
| Bấm Camera tại vùng liveness của KTP  | Chỉ được bắt đầu sau khi KTP OCR trả về `attempt_id`; gọi liveness start                           |
| Liveness iframe gửi `postMessage`     | Gọi liveness callback; nếu có face image thì upload image type 24                                  |
| OCR KTP thành công                    | Auto-fill field, lưu OCR state, auto-save application ngay                                         |
| OCR Passport/NPWP thành công          | Auto-fill React Hook Form; chưa auto-save ngay, được lưu khi bấm `Next`                            |
| Bấm `Next`                            | Update application content; nếu success code 200 thì refetch và chuyển sang `personal_information` |
| OCR Job quá 60 giây                   | Gọi DELETE job và dừng loading                                                                     |
| Người dùng bấm dấu X trên OCR overlay | Abort các fetch dùng `AbortController` của OCR Job flow                                            |

### 7.1. Hai tác vụ chạy song song sau upload document

Đối với Passport/NPWP, code gọi `runOcrFlow(file, type)` mà không `await`, sau đó upload file vào application. Vì vậy:

```text
handleChange(file)
  ├─ runOcrFlow(file) ---------------- OCR service
  └─ postUploadDocument(file) -------- Main application API
```

OCR thất bại không đồng nghĩa upload file thất bại, và upload file thất bại không tự hủy OCR.

---

## 8. Flow A — OCR KTP qua backend eKYC/Privy

KTP là nhánh đặc biệt. Nó không dùng `/api/ocr/v1/jobs`.

### 8.1. Trình tự

1. Người dùng chọn `nation_id`.
2. Upload hoặc chụp ảnh, type ID là `2`.
3. Validate size.
4. Xóa Passport/KTP cũ thuộc type 1 hoặc 2.
5. Bật trạng thái loading OCR cho key `'2'`.
6. Gọi `POST {MAIN_API}/api/v1/ekyc/ocr` với file KTP.
7. Song song, upload ảnh vào application bằng document upload API.
8. Nếu OCR response có `attempt_id`, lưu vào state để dùng cho liveness.
9. Tìm object chứa field `nik` bên trong response bằng cách duyệt đệ quy.
10. Mapping dữ liệu KTP vào form.
11. Lưu bản sao field OCR trong `ocrCapturedData`.
12. Gọi auto-save application.
13. Tắt OCR loading.
14. Sau đó người dùng mới có thể bắt đầu liveness.

### 8.2. API OCR KTP

#### Request

```http
POST {MAIN_API}/api/v1/ekyc/ocr
Authorization: Bearer <access-token>
Entity: <entity-from-host-config>
Content-Type: multipart/form-data
```

Multipart payload:

| Field            | Type   | Bắt buộc trong onboarding lần đầu | Ý nghĩa                                                                        |
| ---------------- | ------ | --------------------------------: | ------------------------------------------------------------------------------ |
| `ktp`            | File   |                                Có | Ảnh KTP                                                                        |
| `attempt_id`     | string |                             Không | Chỉ dùng khi tiếp tục một attempt có sẵn                                       |
| `reverify_token` | string |                             Không | Dành cho flow reverify, không được truyền ở onboarding Identification hiện tại |

Onboarding hiện tại gọi:

```ts
postPrivyOcr(file)
```

Tức payload thực tế chỉ có `ktp`.

#### Response tối thiểu frontend đang phụ thuộc

```json
{
	"attempt_id": "<privy-attempt-id>",
	"data": {
		"...": {
			"nik": "317xxxxxxxxxxxxx",
			"nama": "NAMA PEMOHON",
			"tanggal_lahir": "31-12-1990",
			"kewarganegaraan": "WNI",
			"alamat": "ALAMAT",
			"rt_rw": "001/002",
			"kelurahan": "KELURAHAN",
			"kecamatan": "KECAMATAN",
			"provinsi": "PROVINSI ...",
			"kota": "KOTA ...",
			"status_perkawinan": "BELUM KAWIN",
			"jenis_kelamin": "LAKI-LAKI"
		}
	}
}
```

Object chứa KTP data có thể nằm sâu trong `data`; frontend tìm object đầu tiên có `nik`.

### 8.3. Mapping KTP OCR

| Field OCR                              | Field form/application | Rule transform                                                            |
| -------------------------------------- | ---------------------- | ------------------------------------------------------------------------- |
| `nik`                                  | `ktp_or_passport`      | Giữ nguyên                                                                |
| `nama`                                 | `full_name`            | `toTitleCase`                                                             |
| `tanggal_lahir` hoặc `tgl_lahir`       | `birthday`             | Nếu dạng `DD-MM-YYYY`, đổi thành `YYYY-MM-DD`; dạng khác giữ nguyên       |
| `kewarganegaraan`                      | `id_country`           | Rỗng, `WNI`, hoặc có chứa `WNI` → `Indonesia`; còn lại title case         |
| `kewarganegaraan`                      | `place_birth`          | Đang dùng cùng rule với `id_country`                                      |
| `alamat` + các phần địa chỉ            | `id_address`           | Ghép RT/RW, kelurahan, kecamatan, provinsi rồi format title case đặc biệt |
| `provinsi`                             | `id_province`          | Bỏ prefix `PROVINSI `, trim, title case                                   |
| `kota`                                 | `city`                 | Bỏ `KABUPATEN ` / `KOTA `; nếu có tỉnh thì format `<Province> - <City>`   |
| `kecamatan`                            | `home_sub_district`    | Title case                                                                |
| `kelurahan`                            | `home_village`         | Bỏ `KELURAHAN ` / `DESA `, trim, title case                               |
| `status_perkawinan` chứa `BELUM KAWIN` | `marriage_status`      | `single`                                                                  |
| `status_perkawinan` chứa `KAWIN`       | `marriage_status`      | `married`                                                                 |
| `status_perkawinan` chứa `CERAI`       | `marriage_status`      | `widower`                                                                 |
| `jenis_kelamin` chứa `LAKI`            | `gender`               | `male`                                                                    |
| `jenis_kelamin` chứa `PEREMPUAN`       | `gender`               | `female`                                                                  |

Thứ tự marital-status quan trọng: phải check `BELUM KAWIN` trước `KAWIN`, vì chuỗi `BELUM KAWIN` cũng chứa từ `KAWIN`.

### 8.4. Format địa chỉ KTP

Địa chỉ được ghép theo thứ tự:

```text
alamat
+ " RT/RW " + rt_rw
+ " Kelurahan " + kelurahan
+ " Kecamatan " + kecamatan
+ " Provinsi " + provinsi
```

Sau đó:

- Chuyển toàn bộ về lowercase.
- `no.<số>` → `No. <số>`.
- Viết hoa ký tự đầu sau đầu chuỗi, khoảng trắng, `.`, `/`, `,`, `-`.
- Chuẩn hóa `rt` và `rw` thành chữ hoa.

### 8.5. Auto-save sau KTP OCR

KTP OCR thành công gọi ngay:

```http
POST {MAIN_API}/api/v1/applications
Authorization: Bearer <access-token>
Content-Type: application/json
```

Payload logic:

```json
{
	"id": "<application.id>",
	"type_id": "<application.type_id>",
	"entity_id": "<application.entity_id>",
	"currentStep": "customer_particular",
	"content": {
		"...existingApplicationContent": "preserved",
		"customer_particular": {
			"...existingCustomerParticular": "preserved",
			"identify_verification": {
				"verification_document": "nation_id",
				"indonesia_identity_number": "<existing-or-captured>",
				"ktp_or_passport": "<nik>",
				"privy_attempt_id": "<attempt-id>"
			},
			"personal_information": {
				"...existingPersonalInformation": "preserved",
				"ktp_or_passport": "<nik>",
				"indonesia_identity_number": "<value>",
				"full_name": "<mapped-name>",
				"birthday": "<YYYY-MM-DD-or-source>",
				"id_address": "<mapped-address>",
				"gender": "male|female",
				"postal_code": "<value>",
				"id_country": "<value>",
				"home_sub_district": "<value>",
				"place_birth": "<value>",
				"city": "<value>",
				"id_province": "<value>",
				"home_village": "<value>",
				"marriage_status": "single|married|widower"
			}
		}
	}
}
```

Merge priority cho mỗi field:

```text
giá trị vừa OCR
  ?? giá trị hiện có trong form
  ?? giá trị application đã lưu trước đó
```

Auto-save lỗi chỉ được log `Silent autosave failed`; không làm upload file thất bại và không hiển thị toast lỗi.

Hai chi tiết timing cần lưu ý:

- `setAttemptId(ocrRes.attempt_id)` là cập nhật React state bất đồng bộ, trong khi `autoSaveOcrData(capture)` được gọi ngay trong cùng lượt xử lý. Vì `autoSaveOcrData` đọc `attemptId` từ render hiện tại, lần auto-save đầu tiên có thể vẫn dùng attempt ID cũ/null. Attempt ID mới chắc chắn nằm trong state để mở liveness và sẽ được đưa vào payload khi người dùng bấm `Next` sau khi component render lại.
- Auto-save gọi thẳng `postUpdateApp`, không đi qua `mutationPost`; vì vậy nó không tự thêm `product_ids: ['19']` và không tự thêm `time_save`. Project đích phải xác nhận update endpoint có cho phép partial/update payload kiểu này hay không.

---

## 9. Flow B — Liveness sau OCR KTP

### 9.1. Rule bắt buộc

- Liveness chỉ áp dụng khi người dùng chọn KTP.
- Nút liveness chỉ hoạt động khi state đã có `attemptId` từ OCR KTP.
- Nếu chưa có `attemptId`, hiển thị lỗi `Please wait for KTP scan to complete first` và không gọi API start.
- Selfie kết quả liveness được lưu dưới document type `24`.

### 9.2. Start liveness API

Ngôn ngữ lấy từ cookie `NEXT_LOCALE`, fallback theo locale của `next-intl`:

- Bắt đầu bằng `id` → `id`.
- Các giá trị khác → `en`.

Request:

```http
GET {MAIN_API}/api/v1/ekyc/liveness/start?lang=<id|en>&attempt_id=<attempt-id>
Authorization: Bearer <access-token>
```

Response frontend hỗ trợ các shape sau:

```json
{
	"success": true,
	"user_landing_url": "https://..."
}
```

hoặc URL nằm trong `data.user_landing_url` / `data.data.user_landing_url`.

Frontend thêm các query param sau vào landing URL:

```text
lang=<id|en>
locale=<id|en>
language=<id|en>
hl=<id|en>
```

URL được mở trong iframe có quyền:

```html
allow="camera *; microphone *; autoplay *;"
```

### 9.3. Nhận kết quả từ iframe

Frontend listen toàn cục:

```ts
window.addEventListener('message', handleLivenessMessage)
```

Các message shape được chấp nhận:

1. `event.data.data.source === 'privypass_liveness'` → payload là `event.data.data.data`.
2. `event.data.source === 'privypass_liveness'` → payload là `event.data.data`.
3. Root object có `fc_token` hoặc `result` → payload là root object.

Khi nhận payload hợp lệ:

1. Đóng iframe/modal.
2. Đóng popup nếu có.
3. Gọi callback backend.
4. Chọn ảnh khuôn mặt.
5. Upload ảnh type 24 nếu là data URL.
6. Invalidate query application.
7. Hiển thị success/error toast theo `payload.result`.

### 9.4. Callback API

Request thực tế từ component:

```http
POST {MAIN_API}/api/v1/ekyc/liveness/callback
Authorization: Bearer <access-token>
Content-Type: application/json
```

```json
{
	"payload": "<toàn bộ payload nhận từ iframe>",
	"attempt_id": "<attempt-id hoặc null>"
}
```

Lưu ý: helper có tên `postPrivyLivenessCallback(payload)` và gửi nguyên argument làm body. Component truyền `{ payload, attempt_id: attemptId }`, vì vậy wrapper object trên là contract thực tế của màn hình này.

### 9.5. Chọn ảnh face và upload

```ts
const usedKey = payload.used_face || 'face_1'
const faceImg = payload[usedKey] || payload.face_1 || payload.face_2
```

Chỉ upload nếu `faceImg`:

- Là string.
- Bắt đầu bằng `data:image`.

Ảnh được đổi thành `liveness_selfie.jpg` và upload với type `24`.

### 9.6. Liveness error mapping

| Code                     | Message                       |
| ------------------------ | ----------------------------- |
| `FALSE`                  | Liveness verification failed  |
| `EYES-CLOSED`            | Eyes Closed                   |
| `FACE-NOT-DETECTED`      | Face not detected             |
| `MISALIGNED-FACE`        | Misaligned face               |
| `FACE-NOT-WITHIN-CIRCLE` | Face is not within the circle |
| `FACE-TOO-FAR`           | Face is too far               |
| `FACE-TOO-CLOSE`         | Face is too close             |
| `FACE-TOO-BRIGHT`        | Face too bright               |
| `FACE-TOO-DARK`          | Face too dark                 |
| `TWO-FACES-DETECTED`     | There are two faces           |

---

## 10. Flow C — OCR Passport/NPWP qua OCR Job service

### 10.1. Document type mapping

|            Application type ID | OCR `docType` | `issuingCountry` | `docLang` |
| -----------------------------: | ------------- | ---------------- | --------- |
|  `1` Passport, khách Indonesia | `passport`    | `ID`             | `ID`      |
|                      `25` NPWP | `npwp`        | `ID`             | `ID`      |
| `1` Passport, khách nước ngoài | `passport`    | `null`           | `null`    |

Enum OCR:

```ts
enum DocType {
	ID_CARD = 'id-card',
	PASSPORT = 'passport',
	NPWP = 'npwp',
}
```

### 10.2. Trình tự OCR Job

1. Bật loading theo document type.
2. Tạo `AbortController` riêng cho type.
3. Gọi live health check.
4. Chỉ tiếp tục nếu JSON trả về `status === 'ok'`.
5. Tạo job với hai UUID độc lập: `refId` và `docId`.
6. Lấy `jobData.id`.
7. Upload file vào job bằng multipart field `file`.
8. Poll trạng thái job ngay lần đầu, sau đó mỗi 2 giây.
9. Dừng khi status là `successful` hoặc `failed`.
10. Nếu có `results[0].structured`, map vào form.
11. Nếu quá 60 giây, gọi DELETE job.
12. Tắt loading và xóa AbortController khỏi ref khi hoàn tất/lỗi.

### 10.3. OCR status contract

```ts
enum OcrStatus {
	AwaitingFile = 'awaiting_file',
	Pending = 'pending',
	Processing = 'processing',
	Successful = 'successful',
	Failed = 'failed',
}
```

Frontend coi cả `successful` và `failed` là terminal status. Nếu terminal response vẫn có `results[0].structured`, code hiện tại vẫn map structured data.

### 10.4. Response contract

```json
{
	"id": "<job-id>",
	"status": "awaiting_file|pending|processing|successful|failed",
	"results": [
		{
			"page_num": 1,
			"ocr_text": "...",
			"doc_type": "passport",
			"doc_lang": "ID",
			"structured": {
				"address": {
					"city": "...",
					"district": "...",
					"province": "...",
					"postalCode": "...",
					"streetAddress": "...",
					"country": "..."
				},
				"dateOfBirth": "YYYY-MM-DD",
				"dateOfExpiry": "YYYY-MM-DD",
				"gender": "M|F|...",
				"idNumber": "...",
				"passportNumber": "...",
				"maritalStatus": "...",
				"name": "...",
				"country": "...",
				"nationality": "...",
				"occupation": "...",
				"placeOfBirth": "...",
				"religion": "...",
				"kpp": "...",
				"nik": "...",
				"taxNumber": "..."
			},
			"schema_version": "...",
			"ocr_text_ms": 0,
			"doc_type_ms": 0,
			"doc_lang_ms": 0,
			"structured_ms": 0
		}
	],
	"updated_at": "<timestamp>"
}
```

### 10.5. Rule giá trị `UNKNOWN`

Một field chỉ được map nếu:

- Có giá trị truthy.
- `value.toUpperCase() !== 'UNKNOWN'`.

Không overwrite dữ liệu hiện tại bằng `UNKNOWN`.

### 10.6. Mapping Passport/NPWP cho khách Indonesia

Rule đầu tiên:

- Nếu `structured.taxNumber` hợp lệ, set `indonesia_identity_number = taxNumber` và đánh dấu `isTaxOnly=true`.
- Khi `isTaxOnly=true`, bỏ qua toàn bộ mapping thông tin cá nhân còn lại.

Nếu không có `taxNumber`, mapping:

| OCR structured field    | Form field          | Transform                                          |
| ----------------------- | ------------------- | -------------------------------------------------- |
| `idNumber               |                     | passportNumber`                                    | `ktp_or_passport` | Ưu tiên `idNumber` |
| `dateOfBirth`           | `birthday`          | Giữ nguyên                                         |
| `name`                  | `full_name`         | Title case                                         |
| `address.streetAddress` | `id_address`        | Title case                                         |
| `gender=M`              | `gender`            | `male`                                             |
| `gender=F`              | `gender`            | `female`                                           |
| `address.postalCode`    | `postal_code`       | Giữ nguyên                                         |
| `country`               | `id_country`        | `WNI`/chứa `WNI` → `Indonesia`, còn lại giữ nguyên |
| `address.district`      | `home_sub_district` | Title case                                         |

Khác với KTP Privy, nhánh OCR Job này không ghi vào `ocrCapturedData` và không auto-save ngay. Các field nằm trong React Hook Form và được lưu khi bấm `Next`.

### 10.7. Mapping Passport cho khách nước ngoài

| OCR structured field | Form/application field | Transform                    |
| -------------------- | ---------------------- | ---------------------------- |
| `passportNumber`     | `ktp_or_passport`      | Giữ nguyên                   |
| `dateOfBirth`        | `birthday`             | Giữ nguyên                   |
| `name`               | `full_name`            | Giữ nguyên, không title case |
| `gender=M`           | `gender`               | `male`                       |
| `gender=F`           | `gender`               | `female`                     |
| `nationality`        | `country_foreigner`    | Ưu tiên nationality          |
| `country`            | `country`              | Ưu tiên country              |

Nếu `nationality` có nhưng `country` thiếu, expression có fallback sang country; và ngược lại. Tuy nhiên mỗi block chỉ chạy khi field chính của block hợp lệ.

---

## 11. API catalog đầy đủ

### 11.1. API trên main application backend

Các request này dùng base URL từ host config, thường là `NEXT_PUBLIC_API_URL`, và dùng access token của phiên đăng nhập.

| Method   | Endpoint                                                  | Trigger                                             | Content type        |
| -------- | --------------------------------------------------------- | --------------------------------------------------- | ------------------- |
| `POST`   | `/api/v1/applications/documents/upload`                   | Mỗi lần upload/chụp KTP, Passport, Selfie hoặc NPWP | multipart/form-data |
| `DELETE` | `/api/v1/application-documents/{documentId}`              | Trước khi thay document cũ                          | JSON/no body        |
| `POST`   | `/api/v1/applications`                                    | Auto-save KTP OCR và khi bấm Next                   | application/json    |
| `POST`   | `/api/v1/ekyc/ocr`                                        | Upload/chụp KTP                                     | multipart/form-data |
| `GET`    | `/api/v1/ekyc/ocr/balance`                                | Helper tồn tại nhưng Identification không trigger   | JSON                |
| `GET`    | `/api/v1/ekyc/liveness/start?lang={lang}&attempt_id={id}` | Bấm Camera liveness sau KTP OCR                     | JSON                |
| `POST`   | `/api/v1/ekyc/liveness/callback`                          | Nhận postMessage từ liveness iframe                 | application/json    |

#### Upload document payload

```http
POST {MAIN_API}/api/v1/applications/documents/upload
Authorization: Bearer <access-token>
Content-Type: multipart/form-data
```

```text
documents[0][type_id] = "1" | "2" | "24" | "25"
documents[0][file]    = <binary File>
application_ids[]    = <application.id>
```

`application_ids[]` được helper `postAppUploadDocument(ids, formData)` append vào FormData trước khi gửi.

#### Delete document

```http
DELETE {MAIN_API}/api/v1/application-documents/{documentId}
Authorization: Bearer <access-token>
```

`documentId` là ID record trong `application.application_documents`, không phải document type ID.

#### Update application khi bấm Next

```http
POST {MAIN_API}/api/v1/applications
Authorization: Bearer <access-token>
Content-Type: application/json
```

Payload đi qua `mutationPost`. Với SFI `entity_id === '13'`, helper tự bổ sung:

```json
{
	"product_ids": ["19"]
}
```

Helper cũng thêm:

```json
{
	"content": {
		"customer_particular": {
			"time_save": "<formatted-current-time>"
		}
	}
}
```

Response được coi là success khi:

```json
{ "code": 200 }
```

### 11.2. Browser-facing Next.js OCR proxy

| Method   | Browser endpoint                | Upstream endpoint                        |
| -------- | ------------------------------- | ---------------------------------------- |
| `GET`    | `/api/ocr/health/live`          | `{API_OCR_URL}/api/v1/health/live`       |
| `GET`    | `/api/ocr/health/ready`         | `{API_OCR_URL}/api/v1/health/ready`      |
| `POST`   | `/api/ocr/v1/jobs`              | `{API_OCR_URL}/api/v1/jobs`              |
| `PUT`    | `/api/ocr/v1/jobs/{jobId}/file` | `{API_OCR_URL}/api/v1/jobs/{jobId}/file` |
| `GET`    | `/api/ocr/v1/jobs/{jobId}`      | `{API_OCR_URL}/api/v1/jobs/{jobId}`      |
| `DELETE` | `/api/ocr/v1/jobs/{jobId}`      | `{API_OCR_URL}/api/v1/jobs/{jobId}`      |

Mọi upstream request gắn server-only header:

```http
x-api-key: <process.env.API_OCR_KEY>
```

Browser tuyệt đối chỉ gọi relative path `/api/ocr/...`; không gọi `API_OCR_URL` trực tiếp và không nhận OCR API key.

### 11.3. Health live

```http
GET /api/ocr/health/live
```

Frontend yêu cầu response:

```json
{ "status": "ok" }
```

Nếu status khác `ok`, flow dừng trước khi tạo job.

`health/ready` có proxy nhưng Identification hiện chỉ dùng `health/live`.

### 11.4. Create OCR job

```http
POST /api/ocr/v1/jobs
Content-Type: application/json
```

Payload cho Passport Indonesia:

```json
{
	"refId": "<uuid-v4>",
	"docId": "<uuid-v4>",
	"docType": "passport",
	"issuingCountry": "ID",
	"docLang": "ID"
}
```

Payload cho NPWP:

```json
{
	"refId": "<uuid-v4>",
	"docId": "<uuid-v4>",
	"docType": "npwp",
	"issuingCountry": "ID",
	"docLang": "ID"
}
```

Payload cho Passport khách nước ngoài:

```json
{
	"refId": "<uuid-v4>",
	"docId": "<uuid-v4>",
	"docType": "passport",
	"issuingCountry": null,
	"docLang": null
}
```

Response bắt buộc phải có:

```json
{ "id": "<job-id>" }
```

Nếu thiếu `id`, frontend dừng loading và không upload file vào OCR service.

Các option sau có trong interface/comment nhưng không được gửi ở runtime hiện tại:

```json
{
	"ocrMethod": "paddle",
	"pdfEngine": "auto",
	"preprocessing": { "grayscale": false, "deskew": false },
	"classification": { "language": true, "type": true, "mode": "single" },
	"llmConnection": "remote",
	"llmModel": ""
}
```

Không nên tự thêm chúng ở project mới nếu OCR backend không yêu cầu.

### 11.5. Attach file vào OCR job

```http
PUT /api/ocr/v1/jobs/{jobId}/file
Content-Type: multipart/form-data
```

```text
file = <binary File>
```

Không tự set `Content-Type` ở browser khi dùng `FormData`; browser phải tự thêm multipart boundary.

### 11.6. Poll OCR job

```http
GET /api/ocr/v1/jobs/{jobId}
```

- Lần poll đầu tiên chạy ngay sau attach file.
- Nếu chưa terminal, dùng `setTimeout(poll, 2000)`.
- Timeout tổng: 60.000 ms tính từ sau attach file.
- Terminal: `successful` hoặc `failed`.

### 11.7. Delete OCR job

```http
DELETE /api/ocr/v1/jobs/{jobId}
```

Được gọi khi timeout. Proxy trả:

```json
{ "success": true }
```

nếu upstream delete thành công.

---

## 12. Form state và persistence

### 12.1. Dữ liệu nằm ở hai nhánh application content

Các field ID được lưu lặp có chủ đích ở:

```text
content.customer_particular.identify_verification
content.customer_particular.personal_information
```

`identify_verification` lưu tối thiểu:

```json
{
	"verification_document": "nation_id|passport",
	"indonesia_identity_number": "<NPWP/tax number>",
	"ktp_or_passport": "<NIK/passport number>",
	"privy_attempt_id": "<attempt-id>"
}
```

`personal_information` nhận các field OCR để màn hình kế tiếp hiển thị sẵn.

### 12.2. Merge dữ liệu khi submit

Khách Indonesia dùng ưu tiên:

```text
ocrCapturedData ?? current form data ?? previous application data
```

Khách nước ngoài dùng:

```text
submitted form data ?? previous application data
```

Toàn bộ `application.content`, `customer_particular` và `personal_information` cũ được spread/merge để không làm mất field của substep khác.

### 12.3. Sau submit thành công

1. Chờ response có `code === 200`.
2. Refetch application.
3. Chuyển URL sang:

```text
<current-path>?step=<current-step>&subStep=personal_information
```

---

## 13. Điều kiện UI và nút Next

### 13.1. Khách Indonesia

Nút `Next` disabled khi:

- Bất kỳ OCR nào còn loading; hoặc
- Chưa có document chính tương ứng lựa chọn hiện tại; hoặc
- Chưa có document type 24.

Logic tương đương:

```ts
hasNoOcrRunning &&
	((document === 'nation_id' && hasKtpType2) || (document === 'passport' && hasPassportType1)) &&
	hasSelfieType24
```

NPWP type 25 không nằm trong điều kiện bắt buộc.

Zod schema hiện tại khai báo toàn bộ field OCR là optional/nullable. Do đó validation thực tế của màn hình chủ yếu nằm ở sự tồn tại của application documents và OCR loading, không phải ở việc các field OCR có đầy đủ hay không.

Với KTP, document type 24 thường đến từ liveness callback. Với Passport, type 24 đến từ upload hoặc camera selfie.

### 13.2. Khách nước ngoài

Nút `Next` chỉ yêu cầu:

```text
Passport type 1 tồn tại AND Selfie type 24 tồn tại
```

Code hiện tại không disable `Next` theo `ocrLoadingStatus` ở component Foreign; nút chỉ dùng `loading={isSubmitting}`.

### 13.3. Refresh application documents

Sau upload thành công, frontend invalidate React Query key:

```ts
;['submit_applications']
```

Điều kiện `hasPassport`, `hasKtp`, `hasSelfie`, `hasNpwp` dựa trên `application.application_documents` sau refetch, không chỉ dựa vào preview local.

---

## 14. Loading, cancel, timeout và error behavior

### 14.1. Loading state

Hai state độc lập:

- `uploadingType`: file đang upload vào application backend.
- `ocrLoadingStatus[type]`: OCR đang chạy theo document type.

OCR overlay hiển thị spinner, text `Waiting for scan...` và nút close.

### 14.2. Cancel OCR Job

Mỗi Passport/NPWP OCR flow tạo `AbortController` theo key document type. Bấm close:

1. `abort()` các fetch đang dùng signal.
2. Xóa controller khỏi ref.
3. Tắt loading UI.

Cancel hiện tại không gọi DELETE OCR job. Chỉ timeout mới gọi DELETE.

### 14.3. Cancel KTP Privy

KTP branch không tạo `AbortController`. Vì vậy close overlay chỉ tắt loading state; request `postPrivyOcr` thực tế vẫn có thể tiếp tục và sau đó auto-fill/auto-save.

Đây là hành vi kỹ thuật hiện tại, không nên xem là business requirement. Project mới nên quyết định rõ:

- Không cho cancel Privy OCR; hoặc
- Truyền signal/cancellation thực sự; hoặc
- Bỏ qua response của attempt đã bị người dùng cancel.

### 14.4. Error behavior hiện tại

| Trường hợp                               | Hành vi                                                            |
| ---------------------------------------- | ------------------------------------------------------------------ |
| File > 10 MiB                            | Toast lỗi và dừng                                                  |
| Upload application document lỗi          | Tắt upload loading; toast message từ `error.response.data.message` |
| Health không trả `status=ok`             | Tắt OCR loading; không toast                                       |
| Create job không có `id`                 | Tắt OCR loading; Indonesia log console, Foreign im lặng            |
| Attach file lỗi HTTP nhưng fetch resolve | Code không check `response.ok`; vẫn có thể bắt đầu poll            |
| Poll fetch throw                         | Tắt loading; không toast                                           |
| OCR status `failed`                      | Dừng polling; nếu có structured data vẫn map; không toast lỗi      |
| OCR timeout                              | Tắt loading; DELETE job; không toast                               |
| Privy OCR lỗi                            | Log console; tắt loading; không toast                              |
| Auto-save KTP lỗi                        | Log console; không rollback field/ảnh                              |
| Liveness start lỗi                       | Toast lỗi                                                          |
| Liveness callback lỗi                    | Log console                                                        |

---

## 15. Next.js OCR proxy — yêu cầu triển khai ở project khác

### 15.1. Environment variables

Server runtime cần:

```bash
API_OCR_URL=<base-url-cua-ocr-service>
API_OCR_KEY=<secret-api-key>
```

Quy tắc bảo mật:

- Không dùng prefix `NEXT_PUBLIC_` cho OCR key.
- Không gửi `x-api-key` từ browser.
- Không log giá trị key.
- Browser chỉ biết các route `/api/ocr/...` cùng origin.

Main API client cần base URL và Auth0/access-token wiring tương ứng project đích. Trong project hiện tại base URL đến từ `NEXT_PUBLIC_API_URL` qua host config.

### 15.2. Proxy behavior

Proxy phải:

- Forward method đúng.
- Forward JSON body khi create job.
- Forward multipart body khi attach file.
- Gắn `x-api-key` server-side.
- Dùng `cache: 'no-store'` cho health/create/get/file.
- Trả JSON upstream cho browser.
- Giữ nguyên upstream HTTP status, đặc biệt create job và file upload.

Trạng thái hiện tại:

- Create job và attach file đã preserve `response.status`.
- GET job và health proxy đang trả JSON mà không truyền `response.status`, nên upstream error có thể bị browser nhìn thành HTTP 200.
- DELETE preserve upstream error status.

Khi port, nên preserve upstream status cho tất cả proxy route để frontend có thể xử lý lỗi theo HTTP status.

---

## 16. Các điểm không nên copy mù quáng

Phần này phân biệt business rule với chi tiết/điểm yếu của implementation hiện tại.

1. **Không tin mọi `postMessage` từ mọi origin.** Listener hiện tại không kiểm tra `event.origin`. Project mới phải whitelist origin của liveness provider nếu endpoint/SDK cho phép xác định origin.
2. **Không log OCR URL hoặc secret marker trong production.** Health live route hiện có log debug.
3. **Phải check `response.ok`.** Flow hiện tại parse JSON và tiếp tục ở một số bước mà không kiểm tra HTTP status.
4. **Delete → upload nên có thứ tự rõ ràng.** Code hiện tại có race do async `map` không await.
5. **Cancel phải có semantics rõ.** KTP cancel hiện không hủy request; Passport cancel không delete upstream job.
6. **Status `failed` không nên map dữ liệu nếu backend không cam kết structured result hợp lệ.** Current code vẫn map nếu structured tồn tại.
7. **`verification_document` phải là domain value.** Giá trị lưu hợp lệ nên là `nation_id` hoặc `passport`. Camera handler hiện có effect set field này bằng document type string như `'1'`, `'2'`, `'24'`, `'25'` khi `currentDocType` thay đổi; project mới không nên copy hành vi này.
8. **Type contract hiện chưa khớp hoàn toàn runtime body.** `CreateOcrJobBody` khai báo nhiều field bắt buộc nhưng runtime chỉ gửi `refId`, `docId`, `docType`, `issuingCountry`, `docLang`.
9. **KTP `place_birth` hiện lấy từ nationality.** Đây là mapping code hiện tại nhưng cần backend/business xác nhận trước khi áp dụng cho project khác.
10. **Marital status `CERAI` → `widower`.** Mapping này không phân biệt divorced/widowed; cần giữ nếu tương thích dữ liệu hiện tại, hoặc xác nhận domain project đích.
11. **NPWP OCR dùng chung field `indonesia_identity_number`.** Cần xác nhận tên field đích vẫn mang nghĩa tax number ở project mới.
12. **Auto-save KTP khác Passport.** KTP auto-save ngay; Passport/NPWP chỉ save khi Next. Nếu project mới cần hành vi thống nhất, đó là thay đổi business flow và cần quyết định riêng.
13. **Attempt ID có timing gap khi auto-save.** Không nên phụ thuộc vào `setState` vừa gọi để tạo payload trong cùng function. Hãy truyền `ocrRes.attempt_id` trực tiếp vào hàm save hoặc chờ state/render theo thiết kế rõ ràng.
14. **Auto-save và submit dùng hai wrapper khác nhau.** Submit thêm SFI product ID/time-save, còn KTP auto-save hiện không thêm. Project mới nên xác định một application-update contract thống nhất.

---

## 17. Blueprint đề xuất để port sang project khác

### 17.1. Các module tối thiểu

```text
identification/
  IdentificationPage
  DocumentUploader
  CameraDialog
  useDocumentUpload
  useOcrJob
  useKtpPrivyOcr
  usePrivyLiveness
  ocr-contracts
  document-type-contracts

server routes/
  GET    /api/ocr/health/live
  GET    /api/ocr/health/ready
  POST   /api/ocr/v1/jobs
  PUT    /api/ocr/v1/jobs/:id/file
  GET    /api/ocr/v1/jobs/:id
  DELETE /api/ocr/v1/jobs/:id
```

Không bắt buộc phải tách đúng số file trên. Mục tiêu là giữ ranh giới rõ giữa:

- Lưu document.
- OCR orchestration.
- Mapping OCR vào domain form.
- Persistence application.
- Liveness provider integration.

### 17.2. Interface cấu hình nên inject

Project mới nên cấu hình thay vì hard-code:

```ts
type IdentificationOcrConfig = {
	applicationId: string
	nationality: 'indonesian' | 'foreign'
	documentTypeIds: {
		passport: number
		ktpFront: number
		selfie: number
		npwp: number
	}
	maxFileBytes: number
	allowedExtensions: string[]
	pollIntervalMs: number
	pollTimeoutMs: number
}
```

Giá trị tương thích project hiện tại:

```json
{
	"documentTypeIds": {
		"passport": 1,
		"ktpFront": 2,
		"selfie": 24,
		"npwp": 25
	},
	"maxFileBytes": 10485760,
	"allowedExtensions": ["JPG", "PNG", "jpeg"],
	"pollIntervalMs": 2000,
	"pollTimeoutMs": 60000
}
```

### 17.3. State machine tối thiểu cho mỗi document

```text
idle
  → validating
  → deleting_previous
  → uploading_document + scanning_ocr
  → uploaded / scan_success
  → ready

Any active state
  → error
  → cancelled

scanning_ocr
  → timeout → delete_job
```

Vì upload và OCR độc lập, nên lưu hai status riêng:

```ts
type DocumentState = {
	uploadStatus: 'idle' | 'uploading' | 'success' | 'error'
	ocrStatus:
		| 'idle'
		| 'checking-health'
		| 'creating-job'
		| 'uploading-to-ocr'
		| 'polling'
		| 'success'
		| 'failed'
		| 'timeout'
		| 'cancelled'
}
```

### 17.4. Pseudocode chuẩn cho OCR Job

```ts
async function scanDocument(file, config, signal) {
	const health = await getHealth({ signal })
	assert(health.status === 'ok')

	const job = await createJob(
		{
			refId: uuid(),
			docId: uuid(),
			docType: config.docType,
			issuingCountry: config.issuingCountry,
			docLang: config.docLang,
		},
		{ signal }
	)

	await attachFile(job.id, file, { signal })

	const startedAt = Date.now()
	while (Date.now() - startedAt <= 60_000) {
		const result = await getJob(job.id, { signal })

		if (result.status === 'successful') return result
		if (result.status === 'failed') throw new OcrFailedError(result)

		await wait(2_000, signal)
	}

	await deleteJob(job.id)
	throw new OcrTimeoutError(job.id)
}
```

---

## 18. Checklist tích hợp

### Backend/main API

- [ ] Có endpoint upload application document.
- [ ] Xác nhận multipart field names chính xác.
- [ ] Xác nhận document type IDs.
- [ ] Có endpoint delete document cũ.
- [ ] Có endpoint update application và merge semantics.
- [ ] Có eKYC/Privy OCR endpoint cho KTP.
- [ ] OCR KTP trả `attempt_id`.
- [ ] Có liveness start và callback endpoint.
- [ ] Callback contract xác nhận wrapper `{ payload, attempt_id }`.
- [ ] Access token và entity headers được cấu hình.

### OCR Job service

- [ ] Có `API_OCR_URL` ở server runtime.
- [ ] Có `API_OCR_KEY` ở server runtime.
- [ ] Health live trả `{status:"ok"}`.
- [ ] Create job chấp nhận camelCase `refId`, `docId`, `docType`.
- [ ] Service chấp nhận `issuingCountry`/`docLang` là `null` cho foreign passport.
- [ ] Attach file dùng multipart field `file`.
- [ ] Job response dùng đúng status strings.
- [ ] Structured result khớp schema mapping.
- [ ] DELETE job hoạt động sau timeout/cancel.

### Frontend

- [ ] Có application trước khi upload.
- [ ] Validate file type và 10 MiB.
- [ ] Camera chạy trên HTTPS/localhost và có permission.
- [ ] KTP/Passport thay thế lẫn nhau.
- [ ] Selfie/liveness lưu type 24.
- [ ] NPWP là optional.
- [ ] OCR loading chặn Next theo đúng nationality flow.
- [ ] Không overwrite field bằng `UNKNOWN`.
- [ ] Preserve existing application content khi save.
- [ ] Refetch application documents sau upload/delete.
- [ ] Cleanup AbortController/timer khi component unmount.
- [ ] Whitelist `postMessage` origin của liveness.
- [ ] Không expose OCR secret ra client bundle.

---

## 19. Test cases bắt buộc

### Upload/document persistence

1. Upload KTP hợp lệ → document type 2 xuất hiện trong application.
2. Upload Passport sau KTP → type 2 bị xóa, type 1 tồn tại.
3. Upload KTP sau Passport → type 1 bị xóa, type 2 tồn tại.
4. Upload lại selfie → chỉ còn selfie hiện hành type 24.
5. Upload lại NPWP → chỉ còn NPWP hiện hành type 25.
6. File > 10 MiB → không delete file cũ, không upload, không OCR.
7. File sai extension → uploader từ chối.

### KTP OCR

8. OCR trả NIK/name/DOB → map đúng field.
9. DOB `DD-MM-YYYY` → lưu `YYYY-MM-DD`.
10. `WNI` → country `Indonesia`.
11. `BELUM KAWIN` → `single`, không bị map thành `married`.
12. OCR trả `attempt_id` → có thể start liveness.
13. OCR không trả `attempt_id` → liveness bị chặn.
14. Auto-save preserve các substep/customer fields cũ.
15. Privy OCR lỗi nhưng upload thành công → ảnh vẫn tồn tại, UI xử lý scan error rõ ràng.

### Liveness

16. Start với locale Indonesia → `lang=id`.
17. Start với locale khác → `lang=en`.
18. Nhận từng supported postMessage shape.
19. Reject message từ origin không hợp lệ ở implementation mới.
20. Callback thành công có `face_1` → upload type 24.
21. `used_face=face_2` → chọn đúng ảnh.
22. `result=false` và từng error code → hiển thị message đúng.

### Passport/NPWP OCR Job

23. Health không OK → không create job.
24. Create job payload Indonesia Passport đúng.
25. Create job payload Foreign Passport có country/lang null.
26. Create job payload NPWP đúng.
27. Attach file đúng multipart field `file`.
28. Status pending/processing → poll lại sau 2 giây.
29. Status successful → map result và dừng poll.
30. Status failed → dừng poll và hiển thị trạng thái phù hợp ở project mới.
31. Field `UNKNOWN` không overwrite form.
32. Quá 60 giây → DELETE job.
33. Người dùng cancel → abort request và cleanup job theo contract mới.

### Submit/navigation

34. Indonesia KTP + liveness image tồn tại, OCR đã dừng → Next enabled.
35. Indonesia Passport + selfie tồn tại, OCR đã dừng → Next enabled.
36. Thiếu selfie → Next disabled.
37. Thiếu document chính → Next disabled.
38. NPWP thiếu → vẫn Next được.
39. Foreign có Passport + selfie → Next enabled.
40. Update response `code=200` → refetch và chuyển Personal Information.
41. Update lỗi → không chuyển bước và hiển thị backend message.

---

## 20. Definition of Done khi port

Flow được xem là port hoàn tất khi:

1. Cả upload file và camera đều hoạt động trên desktop/mobile.
2. Document được lưu đúng application và đúng type ID.
3. KTP dùng đúng Privy OCR, sinh attempt ID và hoàn tất liveness.
4. Passport/NPWP dùng OCR Job proxy mà không expose API key.
5. Polling có terminal, timeout và cancellation rõ ràng.
6. Mapping OCR không ghi `UNKNOWN` và không làm mất dữ liệu application cũ.
7. Điều kiện Next đúng cho Indonesia và foreign.
8. Refresh trang vẫn lấy lại document và dữ liệu đã save.
9. Network/API errors không để UI loading vô hạn.
10. Tất cả test cases quan trọng ở mục 19 pass.

---

## 21. Tóm tắt sequence chính

### KTP

```text
Upload/chụp KTP
  → delete KTP/Passport cũ
  → [song song]
      ├─ upload document type 2 vào application
      └─ POST eKYC OCR
           → nhận attempt_id
           → map OCR fields
           → auto-save application
  → user bấm liveness
      → GET liveness/start
      → mở provider iframe
      → nhận postMessage
      → POST liveness/callback
      → upload face image type 24
  → đủ type 2 + type 24 và không còn OCR loading
  → Next
```

### Passport

```text
Upload/chụp Passport
  → delete KTP/Passport cũ
  → [song song]
      ├─ upload document type 1 vào application
      └─ health → create OCR job → attach file → poll 2s
           → map structured result vào form
  → upload/chụp selfie type 24
  → đủ type 1 + type 24
  → Next → save application
```

### NPWP

```text
Upload/chụp NPWP (optional)
  → delete NPWP cũ
  → [song song]
      ├─ upload document type 25
      └─ health → create npwp job → attach → poll
           → map taxNumber vào indonesia_identity_number
  → save khi Next
```
