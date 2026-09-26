const rows = document.querySelector('#grade-rows');
const current = document.querySelector('#grade-result');
const weightSummary = document.querySelector('#weight-summary');
const error = document.querySelector('#grade-error');
const target = document.querySelector('#target-grade');
const finalWeight = document.querySelector('#final-weight');
const finalResult = document.querySelector('#final-result');
const finalMessage = document.querySelector('#final-message');
let sequence = 0;
function addRow(name = '', grade = '', weight = '') {
  const row = document.createElement('div'); row.className = 'grade-row';
  const id = ++sequence;
  for (const [key, value] of [['name',name],['grade',grade],['weight',weight]]) {
    const input = document.createElement('input'); input.value = String(value); input.dataset.field = key;
    input.setAttribute('aria-label', `${key === 'name' ? 'Category name' : key === 'grade' ? 'Grade percentage' : 'Weight percentage'} ${id}`);
    input.type = key === 'name' ? 'text' : 'number';
    if(key !== 'name'){input.min='0';input.max='100';input.step='0.1';}
    if(key==='name') input.placeholder='Category';
    input.addEventListener('input',calculate);row.append(input);
  }
  const remove = document.createElement('button'); remove.className='remove-grade'; remove.textContent='×';remove.setAttribute('aria-label',`Remove category ${id}`);remove.addEventListener('click',()=>{row.remove();calculate();});row.append(remove);rows.append(row);calculate();
}
function calculate(){
  let total=0, points=0, valid=true;
  const all=[...rows.querySelectorAll('.grade-row')];
  all.forEach(row=>{
    const g=row.querySelector('[data-field="grade"]'),w=row.querySelector('[data-field="weight"]');
    const grade=Number(g.value),weight=Number(w.value);
    if(g.value===''||w.value===''||!Number.isFinite(grade)||!Number.isFinite(weight)||grade<0||grade>100||weight<0||weight>100)valid=false;
    points+=grade*weight;total+=weight;
    row.querySelector('button').disabled=all.length===1;
  });
  document.querySelector('#add-category').disabled=all.length>=15;
  valid=valid&&total>0&&total<=100;
  error.textContent=valid?'':total>100?'Category weights exceed 100%. Adjust them to continue.':'Enter grades and weights from 0 to 100, with a total weight greater than zero.';
  const average=valid?points/total:null;
  current.textContent=average===null?'—':`${average.toFixed(1)}%`;
  weightSummary.textContent=valid?`${total.toFixed(1).replace('.0','')}% of the course included.`:'Waiting for a valid breakdown.';
  const t=Number(target.value),f=Number(finalWeight.value);
  finalResult.textContent='—';
  if(!target.value||!finalWeight.value||t<0||t>100||f<=0||f>100||!Number.isFinite(t)||!Number.isFinite(f)){finalMessage.textContent='Use a target from 0–100% and a final weight above 0% through 100%.';return;}
  if(average===null&&f!==100){finalMessage.textContent='Complete your grade breakdown first.';return;}
  const needed=(t-(average??0)*(1-f/100))/(f/100);
  finalResult.textContent=needed>100?'Over 100%':`${Math.max(0,needed).toFixed(1)}%`;
  finalMessage.textContent=needed>100?`You would need ${needed.toFixed(1)}%. This target isn't reachable with the current average and weighting.`:needed<=0?'Your target is already covered, even with a zero on the final.':`Score at least ${needed.toFixed(1)}% on the final to reach ${t}%.`;
}
function reset(){rows.replaceChildren();addRow('Assignments',92,30);addRow('Quizzes',85,20);addRow('Midterm',88,20);target.value='90';finalWeight.value='30';calculate();}
document.querySelector('#add-category').addEventListener('click',()=>addRow());document.querySelector('#reset-grades').addEventListener('click',reset);target.addEventListener('input',calculate);finalWeight.addEventListener('input',calculate);reset();
