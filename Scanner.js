import { useEffect, useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import jsQR from 'jsqr';

export default function Scanner(){
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [textResult, setTextResult] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function startCamera(){
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
        if (videoRef.current) videoRef.current.play();
        setStatus('camera-ready');
      } catch(e){
        console.error(e);
        setStatus('camera-error');
      }
    }
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject){
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(t=>t.stop());
      }
    }
  },[]);

  async function captureAndRead(){
    setStatus('capturing');
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    const imageData = ctx.getImageData(0,0,w,h);

    // try QR detection via jsQR on the captured image
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if(code){
      setStatus('qr-detected');
      setTextResult(code.data);
      // simple parse if QR contains JSON-like items
      try{
        const parsed = JSON.parse(code.data);
        setItems(parsed.items || []);
      }catch(e){
        // plain text QR
      }
      return;
    }

    setStatus('ocr-processing');
    try{
      const { data: { text } } = await Tesseract.recognize(canvas.toDataURL(), 'por', {
        logger: m => {
          // progress info
        }
      });
      setTextResult(text);
      const parsedItems = parseReceiptText(text);
      setItems(parsedItems);
    }catch(err){
      console.error(err);
    }finally{
      setStatus('done');
    }
  }

  function parseReceiptText(text){
    const lines = text.split('\n').map(l=>l.trim()).filter(l=>l.length>2);
    const found = [];
    for(const line of lines){
      const match = line.match(/(.+?)\s+(\d+[\.,]\d{2})$/);
      if(!match) continue;
      let name = match[1].replace(/\s{2,}/g,' ').trim();
      let price = parseFloat(match[2].replace(',', '.'));
      const weightMatch = name.match(/(\d+[\.,]?\d*)\s*(KG|G|L)/i);
      let weightKg = null;
      if(weightMatch){
        const v = parseFloat(weightMatch[1].replace(',', '.'));
        const unit = weightMatch[2].toUpperCase();
        weightKg = unit === 'G' ? v/1000 : v;
        name = name.replace(weightMatch[0],'').trim();
      }
      found.push({ name, price, weightKg, pricePerKg: weightKg ? price/weightKg : null });
    }
    return found;
  }

  return (
    <div>
      <div style={{marginBottom:10}}>
        <video ref={videoRef} style={{width:'100%',maxWidth:400,border:'1px solid #ddd'}} playsInline muted />
      </div>
      <div style={{marginBottom:10}}>
        <button onClick={captureAndRead}>Capturar / Ler</button>
        <span style={{marginLeft:10}}>{status}</span>
      </div>
      <canvas ref={canvasRef} style={{display:'none'}} />
      <div style={{marginTop:20}}>
        <h3>Texto bruto extraído</h3>
        <pre style={{whiteSpace:'pre-wrap'}}>{textResult}</pre>
        <h3>Itens detectados</h3>
        <ul>
          {items.map((it, i)=>(<li key={i}>{it.name} — R$ {it.price.toFixed(2)} {it.pricePerKg?` — R$ ${it.pricePerKg.toFixed(2)}/kg`:''}</li>))}
        </ul>
      </div>
    </div>
  )
}
