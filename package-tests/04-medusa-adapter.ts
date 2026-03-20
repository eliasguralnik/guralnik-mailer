// package-tests/04-medusa-adapter.ts
// Tests Medusa adapter data extraction helpers
import { recordResult, printSummary, mockData } from './_helpers';

function extractAddress(raw: any) {
  if (!raw) return undefined;
  return { name: [raw.first_name, raw.last_name].filter(Boolean).join(' '), address1: raw.address_1 || '', city: raw.city || '', country: raw.country_code?.toUpperCase(), phone: raw.phone };
}

function extractItems(items: any[], sym: string) {
  if (!items || !Array.isArray(items)) return [];
  return items.map((i: any) => ({ title: i.title || 'Item', quantity: i.quantity || 1, price: i.unit_price ? `${(i.unit_price/100).toFixed(2)} ${sym}` : '', image: i.thumbnail }));
}

function formatAmount(a: any, s: string): string {
  if (a === undefined || a === null) return '';
  const n = typeof a === 'number' ? a : parseFloat(a);
  return isNaN(n) ? '' : `${(n/100).toFixed(2)} ${s}`;
}

function getCurrencySymbol(c?: string): string {
  switch(c?.toLowerCase()) { case 'usd': return '$'; case 'eur': return '€'; case 'gbp': return '£'; case 'ils': return '₪'; default: return '€'; }
}

async function main() {
  console.log('\n🧪 TEST 04: Medusa Adapter\n' + '─'.repeat(60));
  const o = mockData.medusaOrder;

  // Address
  let s = Date.now();
  try { const a = extractAddress(o.shipping_address); if(a?.name !== 'Elias Guralnik') throw new Error('name'); if(a?.city !== 'Tiberias') throw new Error('city'); recordResult({name:'Address extraction',status:'PASS',duration:Date.now()-s}); } catch(e:any) { recordResult({name:'Address extraction',status:'FAIL',duration:Date.now()-s,error:e.message}); }
  s = Date.now();
  try { if(extractAddress(null) !== undefined) throw new Error('null'); recordResult({name:'Null address',status:'PASS',duration:Date.now()-s}); } catch(e:any) { recordResult({name:'Null address',status:'FAIL',duration:Date.now()-s,error:e.message}); }

  // Items
  s = Date.now();
  try { const i = extractItems(o.items,'₪'); if(i.length!==2) throw new Error('count'); if(i[0].price!=='80.00 ₪') throw new Error('price'); recordResult({name:'Item extraction',status:'PASS',duration:Date.now()-s}); } catch(e:any) { recordResult({name:'Item extraction',status:'FAIL',duration:Date.now()-s,error:e.message}); }
  s = Date.now();
  try { if(extractItems(null as any,'₪').length!==0) throw new Error('null'); recordResult({name:'Null items',status:'PASS',duration:Date.now()-s}); } catch(e:any) { recordResult({name:'Null items',status:'FAIL',duration:Date.now()-s,error:e.message}); }

  // Amounts
  const amtTests = [{i:26700,s:'₪',e:'267.00 ₪'},{i:0,s:'€',e:'0.00 €'},{i:undefined,s:'₪',e:''},{i:null,s:'₪',e:''}];
  for(const t of amtTests) { s=Date.now(); try { const r=formatAmount(t.i,t.s); if(r!==t.e) throw new Error(`${r}!=${t.e}`); recordResult({name:`formatAmount(${t.i})`,status:'PASS',duration:Date.now()-s}); } catch(e:any) { recordResult({name:`formatAmount(${t.i})`,status:'FAIL',duration:Date.now()-s,error:e.message}); } }

  // Currency
  const curTests = [{i:'ILS',e:'₪'},{i:'USD',e:'$'},{i:'EUR',e:'€'},{i:undefined,e:'€'}];
  for(const t of curTests) { s=Date.now(); try { if(getCurrencySymbol(t.i)!==t.e) throw new Error('mismatch'); recordResult({name:`currency(${t.i})`,status:'PASS',duration:Date.now()-s}); } catch(e:any) { recordResult({name:`currency(${t.i})`,status:'FAIL',duration:Date.now()-s,error:e.message}); } }

  // Full assembly
  s = Date.now();
  try {
    const cur=getCurrencySymbol(o.currency_code), items=extractItems(o.items,cur), addr=extractAddress(o.shipping_address);
    const totals={subtotal:formatAmount(o.subtotal,cur),shipping:formatAmount(o.shipping_total,cur),tax:formatAmount(o.tax_total,cur),total:formatAmount(o.total,cur)};
    if(items.length!==2||!addr||totals.total!=='267.00 ₪') throw new Error('assembly');
    recordResult({name:'Full order assembly',status:'PASS',duration:Date.now()-s});
  } catch(e:any) { recordResult({name:'Full order assembly',status:'FAIL',duration:Date.now()-s,error:e.message}); }

  printSummary(); process.exit(0);
}
main();
