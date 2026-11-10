/**
 * Test d'attaque (audit du 10/11/2026) : dépôt d'images anonyme ou dans le dossier d'un autre dans le stockage public des avatars, insertion anonyme de mandats.
 * Tout doit être refusé. Les fichiers déposés par erreur doivent être supprimés avec la clé de service.
 * Run: SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node scripts/security-attack-test.mjs
 */
const SB='https://regdgeodxwpqekhcfmmp.supabase.co', SK=process.env.SUPABASE_SERVICE_ROLE_KEY, AK=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if(!SK||!AK){console.error('SUPABASE_SERVICE_ROLE_KEY et NEXT_PUBLIC_SUPABASE_ANON_KEY requis dans l\'environnement.');process.exit(1)}
const H=(k,tok)=>({apikey:k,Authorization:`Bearer ${tok??k}`,'Content-Type':'application/json'});
const j=async(r)=>({s:r.status,b:await r.json().catch(()=>null)});
const email=`sec-test-${Date.now()}@neediu.invalid`, pw='Sec-Test-2026-xYz!';
const mk=await j(await fetch(`${SB}/auth/v1/admin/users`,{method:'POST',headers:H(SK),body:JSON.stringify({email,password:pw,email_confirm:true})}));
const uid=mk.b?.id; if(!uid){console.log('création impossible',mk.s,JSON.stringify(mk.b).slice(0,100));process.exit(1)}
const lg=await j(await fetch(`${SB}/auth/v1/token?grant_type=password`,{method:'POST',headers:H(AK),body:JSON.stringify({email,password:pw})}));
const U=H(AK,lg.b.access_token); await new Promise(r=>setTimeout(r,1500));
const prof=await j(await fetch(`${SB}/rest/v1/profiles?id=eq.${uid}&select=*`,{headers:U})); console.log('profil créé :',prof.b?.length?'oui':'non (aucune ligne)');
const out=[]; const patch=async(l,body)=>{const r=await j(await fetch(`${SB}/rest/v1/profiles?id=eq.${uid}`,{method:'PATCH',headers:{...U,Prefer:'return=representation'},body:JSON.stringify(body)})); out.push(`${(r.s===200&&r.b?.length)?'FAILLE ':'refusé '} profil.${l} → ${r.s} ${(r.s===200&&r.b?.length)?'modifié':JSON.stringify(r.b).slice(0,60)}`)};
if(prof.b?.length){
 await patch('role=admin',{role:'admin'}); await patch('roles=[admin]',{roles:['admin']}); await patch('kyc_status=verified',{kyc_status:'verified'});
 await patch('expert_plan=premium',{expert_plan:'premium'}); await patch('expert_plan_end (an 2099)',{expert_plan_end:'2099-01-01T00:00:00Z'});
 await patch('stripe_customer_id',{stripe_customer_id:'cus_victim'}); await patch('stripe_subscription_id',{stripe_subscription_id:'sub_x'});
 await patch('referral_months_credit=99',{referral_months_credit:99}); await patch('admin_note',{admin_note:'x'}); await patch('full_name (légitime)',{full_name:'Test'});
}
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');
const up=async(label,hdr,path)=>{const r=await fetch(`${SB}/storage/v1/object/expert-avatars/${path}`,{method:'POST',headers:{...hdr,'Content-Type':'image/png','x-upsert':'true'},body:png}); out.push(`${r.status===200?'FAILLE ':'refusé '} dépôt image ${label} → ${r.status}`);};
await up('anonyme (dossier au hasard)',H(AK),`sec-test-${Date.now()}/a.png`);
await up('connecté (dossier d\'un autre)',U,`00000000-0000-0000-0000-000000000001/a.png`);
const mand=await j(await fetch(`${SB}/rest/v1/mandates`,{method:'POST',headers:{...H(AK),Prefer:'return=minimal'},body:JSON.stringify({})})); out.push(`mandates anonyme INSERT vide → ${mand.s} ${JSON.stringify(mand.b).slice(0,80)}`);
console.log(out.join('\n')); const failles=out.filter(l=>l.startsWith('FAILLE')).length; console.log(`RÉSULTAT : ${failles} faille(s)`);
// nettoyage
await fetch(`${SB}/auth/v1/admin/users/${uid}`,{method:'DELETE',headers:H(SK)}); console.log('compte jetable supprimé'); process.exit(failles?1:0);
