let roosters=[],comments={},isEditable=!1,lastSelectedWeek=null;async function fetchAllWeeks(){try{const e=await fetch("get_roosters.php"),t=await e.json();roosters=t,populateWeekSelect();const n=51;populateTable(n),updateWeekInfo(n)}catch(e){alert("Fout bij ophalen van gegevens")}}async function fetchWeekData(e){try{const t=await fetch(`get_roosters.php?week=${e}`),n=await t.json();roosters=n,populateTable(e),updateWeekInfo(e)}catch(e){alert("Fout bij ophalen van weekgegevens")}}function populateWeekSelect(){const e=[...new Set(roosters.map((e=>e.startKalenderWeek)))],t=document.getElementById("week-select");t.innerHTML=e.map((e=>`<option value="${e}">Week ${e}</option>`)).join(""),t.addEventListener("change",(e=>{const t=parseInt(e.target.value);fetchWeekData(t),lastSelectedWeek=t}))}function populateTable(e){const t=document.getElementById("rooster-body");t.innerHTML="",roosters.filter((t=>Number(t.startKalenderWeek)===e)).forEach((e=>{const n=`${e.startKalenderWeek}-${e.dagVanDeWeek}`;comments[n]=e.opmerkingen||"",t.innerHTML+=`\n        <tr>\n          <td>${["Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag","Zondag"][e.dagVanDeWeek-1]}</td>\n          <td><input type="text" value="${comments[n]}" data-key="${n}" ${isEditable?"":"disabled"}></td>\n          <td>${e.dienst}</td>\n        </tr>\n      `})),document.querySelectorAll("input[data-key]").forEach((e=>{e.addEventListener("input",(e=>{const t=e.target.dataset.key;comments[t]=e.target.value.slice(0,12)}))}))}async function saveComments(){const e=document.getElementById("save-button");e.textContent="Opslaan...";try{const t=Object.entries(comments).map((([e,t])=>{const[n,a]=e.split("-");return{...roosters.find((e=>e.startKalenderWeek==n&&e.dagVanDeWeek==a)),opmerkingen:t}})),n=await fetch("save_comments.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if((await n.json()).success){e.textContent="Opgeslagen!";const t=document.getElementById("feedback");t.style.display="block",setTimeout((()=>{e.textContent="Opslaan",t.style.display="none"}),2e3)}else e.textContent="Opslaan"}catch(t){e.textContent="Opslaan"}}function updateEditableState(){document.querySelectorAll("input[data-key]").forEach((e=>{e.disabled=!isEditable})),document.getElementById("save-button").disabled=!isEditable}function updateWeekInfo(e){const t=(new Date).getFullYear(),n=dayjs().year(t).isoWeek(e).startOf("isoWeek"),a=dayjs().year(t).isoWeek(e).endOf("isoWeek"),o=document.getElementById("current-week"),s=document.getElementById("week-dates");o.textContent=`Kalenderweek: ${e}`,s.textContent=`${n.format("DD MMMM YYYY")} tot en met ${a.format("DD MMMM YYYY")}`}document.addEventListener("DOMContentLoaded",(()=>{fetchAllWeeks(),document.getElementById("edit-toggle").addEventListener("change",(e=>{isEditable="aan"===e.target.value,updateEditableState()})),document.getElementById("save-button").addEventListener("click",saveComments)}));