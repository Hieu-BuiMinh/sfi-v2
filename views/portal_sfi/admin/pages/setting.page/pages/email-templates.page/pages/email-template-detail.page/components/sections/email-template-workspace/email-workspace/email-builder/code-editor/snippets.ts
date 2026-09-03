export const EMAIL_CODE_SNIPPETS = [
	{
		label: 'Primary Button',
		content: `<table border="0" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
  <tr>
    <td align="center" style="background-color: #0F766E; border-radius: 6px;">
      <a href="{{ $data['url'] }}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; color: #ffffff; text-decoration: none; font-weight: bold;">
        Buka Portal Trading &rarr;
      </a>
    </td>
  </tr>
</table>`,
	},
	{
		label: 'Callout Box',
		content: `<div style="margin: 16px 0; padding: 16px; border-left: 4px solid #0F766E; background-color: #F0FDFA;">
  <strong>Informasi Penting</strong>
  <p style="margin: 8px 0 0;">Tambahkan informasi penting di sini.</p>
</div>`,
	},
	{
		label: 'Details Table',
		content: `<table cellpadding="8" cellspacing="0" width="100%" style="border-collapse: collapse;">
  <tr><td>Nomor Akun</td><td>{{ $data['account_number'] }}</td></tr>
  <tr><td>Jumlah Deposit</td><td>{{ $data['amount'] }}</td></tr>
  <tr><td>Status Transaksi</td><td>{{ $data['status'] }}</td></tr>
</table>`,
	},
	{
		label: 'Contact Block',
		content: `<div>
  <p>Website: <a href="https://panasia.id">panasia.id</a></p>
  <p>Email: {{ $data['email'] }}</p>
  <p>Kontak: {{ $data['phone'] }}</p>
</div>`,
	},
	{
		label: 'Risk Disclaimer',
		content: `<p style="font-size: 12px; color: #6B7280;">Perdagangan produk keuangan memiliki risiko. Pastikan Anda memahami seluruh risiko sebelum melakukan transaksi.</p>`,
	},
] as const
