// api/payment-callback.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('OK');
  }

  const { refno, status, billcode, amount } = req.body;

  // Status 1 bermaksud bayaran BERJAYA
  if (status === '1') {
    // 1. Jana kod baucar unik (cth: CF-9821-XP)
    // 2. Simpan kod dan emel pembeli ke pangkalan data (Supabase / Google Sheets)
    // 3. (Pilihan) Hantar emel pengesahan dan kod baucar kepada pembeli
    console.log(`Bayaran berjaya untuk Bil ${billcode}, Ref: ${refno}`);
  }

  // Beritahu ToyyibPay bahawa data telah diterima
  res.status(200).send('OK');
}
