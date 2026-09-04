// api/create-bill.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, amount } = req.body;

  // Data untuk dihantar ke ToyyibPay
  const postData = new URLSearchParams({
    userSecretKey: process.env.TOYYIBPAY_SECRET_KEY, // Simpan dalam Vercel Environment Variables
    categoryCode: process.env.TOYYIBPAY_CATEGORY_CODE,
    billName: 'Akses Game Pendidikan Cikgu Fauzan',
    billDescription: 'Pembelian lesen game interaktif murid',
    billPriceSetting: 1, // 1 = Harga tetap
    billPayorInfo: 1,
    billAmount: amount * 100, // ToyyibPay guna sen (cth: RM15 = 1500)
    billReturnUrl: 'https://cikgufauzan.com/payment-success.html',
    billCallbackUrl: 'https://cikgufauzan.com/api/payment-callback',
    billExternalReferenceNo: 'ORDER-' + Date.now(),
    billTo: name,
    billEmail: email,
    billPhone: phone
  });

  try {
    const response = await fetch('https://toyyibpay.com/index.php/api/createBill', {
      method: 'POST',
      body: postData
    });

    const data = await response.json();
    
    // ToyyibPay pulangkan BillCode
    if (data && data[0]?.BillCode) {
      const billCode = data[0].BillCode;
      return res.status(200).json({ 
        paymentUrl: `https://toyyibpay.com/${billCode}` 
      });
    } else {
      return res.status(400).json({ message: 'Gagal menjana bil ToyyibPay' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
