
const data=JSON.parse(document.getElementById('gallery-data').textContent);
const $=id=>document.getElementById(id);
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('style-total').textContent=data.length;
const decks=data.flatMap(row=>row.decks);
$('human-total').textContent=decks.filter(deck=>deck.kind==='human').length;
$('model-total').textContent=new Set(decks.filter(deck=>deck.kind==='codex').map(deck=>deck.image)).size;
for(const row of data){const option=document.createElement('option');option.value=row.id;option.textContent=`${row.id} ${row.style}`;$('style').append(option)}
$('rows').innerHTML=data.map(row=>`<section class="style-row" data-id="${row.id}" aria-labelledby="style-${row.id}"><div class="row-heading"><span class="row-id">STYLE ${row.id}</span><h2 id="style-${row.id}">${escapeHTML(row.style)}</h2><span class="row-note">${escapeHTML(row.material_note)}</span></div><div class="grid">${row.decks.map((deck,i)=>`<article class="deck" data-variant="${deck.variant}"><h3 class="deck-heading"><span class="deck-name">${escapeHTML(deck.label.split(" · ")[0])}</span><span class="deck-variant">${deck.variant==='original'?'原图':deck.variant==='generated'?'给定素材生成':'骨架'}</span><span class="heading-pages">${deck.pages} 页</span>${deck.kind==='codex'?'<span class="model-tag">CODEX</span>':deck.kind==='api'?'<span class="model-tag">OPENROUTER</span>':''}</h3><button class="preview" data-row="${row.id}" data-deck="${i}" aria-label="放大 ${escapeHTML(row.style)} ${deck.label} 总览"><img src="${deck.image}" alt="${escapeHTML(row.style)} · ${deck.label} · ${deck.pages} 页总览" loading="${row.id==='01'?'eager':'lazy'}" decoding="async"></button><p class="source" title="${escapeHTML(deck.source)}">${escapeHTML(deck.source)}</p><div class="deck-footer"><span class="page-count"><span class="dot"></span>${deck.pages} 页</span><a href="${deck.image}" target="_blank" rel="noopener">PNG ↗</a>${deck.pdf?`<a href="${deck.pdf}" target="_blank" rel="noopener">PDF ↗</a>`:''}${deck.pptx?`<a href="${deck.pptx}" download>PPTX ↓</a>`:''}</div></article>`).join('')}</div></section>`).join('');
function filter(){const term=$('search').value.trim().toLowerCase(),style=$('style').value;let count=0;for(const row of data){const visible=(style==='all'||row.id===style)&&`${row.id} ${row.style}`.toLowerCase().includes(term);document.querySelector(`[data-id="${row.id}"]`).hidden=!visible;if(visible)count++}$('empty').hidden=count!==0;$('result-count').textContent=`${count} / ${data.length} 种风格`}
const params=new URLSearchParams(location.search);
$('search').value=params.get('q')||'';
if(data.some(row=>row.id===params.get('style')))$('style').value=params.get('style');
$('search').addEventListener('input',filter);$('style').addEventListener('change',filter);filter();
$('rows').addEventListener('click',event=>{const button=event.target.closest('.preview');if(!button)return;const row=data.find(r=>r.id===button.dataset.row),deck=row.decks[Number(button.dataset.deck)];$('viewer-title').textContent=`${row.id} ${row.style} / ${deck.label} · ${deck.pages} 页`;$('viewer-image').src=deck.image;$('viewer-image').alt=`${row.style} ${deck.label} 总览`;$('viewer-image').classList.remove('full');$('zoom').textContent='放大细看';$('zoom').setAttribute('aria-pressed','false');$('viewer-original').href=deck.image;$('viewer').showModal();document.querySelector('.modal-body').scrollTo(0,0)});
$('close').addEventListener('click',()=>$('viewer').close());$('viewer').addEventListener('click',event=>{if(event.target===$('viewer'))$('viewer').close()});function toggleZoom(){const full=$('viewer-image').classList.toggle('full');$('zoom').textContent=full?'适应屏幕':'放大细看';$('zoom').setAttribute('aria-pressed',String(full))}
$('viewer-image').addEventListener('click',toggleZoom);$('zoom').addEventListener('click',toggleZoom);

function syncNavigation(){
  for(const link of document.querySelectorAll('.view-nav a')){
    const url=new URL(link.getAttribute('href'),location.href);
    const style=$('style').value,query=$('search').value.trim();
    if(style==='all')url.searchParams.delete('style');else url.searchParams.set('style',style);
    if(query)url.searchParams.set('q',query);else url.searchParams.delete('q');
    link.href=url.href;
  }
}
$('search').addEventListener('input',syncNavigation);
$('style').addEventListener('change',syncNavigation);
syncNavigation();
