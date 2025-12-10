import formidable from 'formidable';
import fs from 'fs';
import { supabase } from '../../lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).end();
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'form parse error' });
    const file = files.file;
    const data = fs.readFileSync(file.filepath);
    const fileName = `receipts/${Date.now()}-${file.originalFilename}`;
    const { error } = await supabase.storage.from('receipts').upload(fileName, data);
    if(error) return res.status(500).json({ error: error.message });
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/,'')}/storage/v1/object/public/receipts/${encodeURIComponent(fileName)}`;
    res.json({ url: publicUrl });
  });
}
