(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function s(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=s(r);fetch(r.href,o)}})();function ie(){const e=document.querySelector("[data-menu]"),t=document.querySelector("[data-menu-open]"),s=document.querySelector("[data-menu-close]");!e||!t||!s||(t.addEventListener("click",()=>{e.classList.add("is-open"),document.body.classList.add("no-scroll")}),s.addEventListener("click",()=>{e.classList.remove("is-open"),document.body.classList.remove("no-scroll")}),e.querySelectorAll("a").forEach(a=>{a.addEventListener("click",()=>{e.classList.remove("is-open"),document.body.classList.remove("no-scroll")})}),document.addEventListener("keydown",a=>{a.key==="Escape"&&e.classList.contains("is-open")&&(e.classList.remove("is-open"),document.body.classList.remove("no-scroll"))}),ne())}function ne(){const e=document.querySelector(".header");if(!e)return;let t=window.scrollY,s=!1;window.addEventListener("scroll",()=>{s||(window.requestAnimationFrame(()=>{const a=window.scrollY;a<100?e.classList.remove("is-hidden"):a>t?e.classList.add("is-hidden"):e.classList.remove("is-hidden"),t=a,s=!1}),s=!0)})}function oe(){const e=document.querySelector("[data-scroll-top]");e&&(window.addEventListener("scroll",()=>{window.scrollY>300?e.classList.add("is-visible"):e.classList.remove("is-visible")}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}const E="https://your-energy.b.goit.study/api";async function ce(){const e=await fetch(`${E}/quote`);if(!e.ok)throw new Error("Failed to fetch quote");return e.json()}async function le({filter:e,page:t=1,limit:s=12}){const a=new URLSearchParams({filter:e,page:t.toString(),limit:s.toString()}),r=await fetch(`${E}/filters?${a}`);if(!r.ok)throw new Error("Failed to fetch filters");return r.json()}async function de({bodypart:e,muscles:t,equipment:s,keyword:a,page:r=1,limit:o=10}){const i=new URLSearchParams({page:r.toString(),limit:o.toString()});e&&i.append("bodypart",e),t&&i.append("muscles",t),s&&i.append("equipment",s),a&&i.append("keyword",a);const n=await fetch(`${E}/exercises?${i}`);if(!n.ok)throw new Error("Failed to fetch exercises");return n.json()}async function ue(e){const t=await fetch(`${E}/exercises/${e}`);if(!t.ok)throw new Error("Failed to fetch exercise details");return t.json()}async function fe(e,{rate:t,email:s,review:a}){const r=await fetch(`${E}/exercises/${e}/rating`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({rate:t,email:s,review:a})});if(!r.ok){const o=await r.json();throw new Error(o.message||"Failed to submit rating")}return r.json()}async function me(e){const t=await fetch(`${E}/subscription`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})});if(!t.ok){const s=await t.json();throw new Error(s.message||"Failed to subscribe")}return t.json()}const ge=/^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;function q(e){return ge.test(e)}function Y(e){try{const t=localStorage.getItem(e);return t?JSON.parse(t):null}catch(t){return console.error(`Error getting ${e} from localStorage:`,t),null}}function j(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch(s){console.error(`Error saving ${e} to localStorage:`,s)}}function ve(){return new Date().toISOString().split("T")[0]}function v(e){return e?e.charAt(0).toUpperCase()+e.slice(1):""}function pe(e){const t=Math.floor(e),s=5-t;let a="";for(let r=0;r<t;r++)a+='<svg class="exercise-modal-star"><use href="./img/sprite.svg#icon-star"></use></svg>';for(let r=0;r<s;r++)a+='<svg class="exercise-modal-star empty"><use href="./img/sprite.svg#icon-star-empty"></use></svg>';return a}function O(e,t="success"){alert(e)}function D(e){const t=window.innerWidth;return e==="categories"?t<768?9:(t<1280,12):e==="exercises"?t<768?8:(t<1280,10):10}const z="quote-data";async function ye(){const e=document.querySelector("[data-quote-text]"),t=document.querySelector("[data-quote-author]");if(!(!e||!t))try{const s=await he();be(s,e,t)}catch(s){console.error("Error loading quote:",s)}}async function he(){const e=ve(),t=Y(z);if(t&&t.date===e)return{quote:t.quote,author:t.author};const s=await ce();return j(z,{quote:s.quote,author:s.author,date:e}),s}function be(e,t,s){t.textContent=e.quote,s.textContent=e.author}function Se(){const e=document.querySelector("[data-subscribe-form]");if(!e)return;const t=e.querySelector('input[name="email"]'),s=e.querySelector("[data-subscribe-error]"),a=e.querySelector("[data-subscribe-success]"),r=e.querySelector('button[type="submit"]');t.addEventListener("input",()=>{const o=q(t.value)||t.value.length===0;t.classList.toggle("is-invalid",!o),s.textContent=o?"":"Invalid email format",a.hidden=!0}),e.addEventListener("submit",async o=>{o.preventDefault();const i=t.value.trim();if(!q(i)){t.classList.add("is-invalid"),s.textContent="Please enter a valid email address";return}t.classList.remove("is-invalid"),s.textContent="",a.hidden=!0,r.disabled=!0;try{const n=await me(i);a.textContent=n.message||"Successfully subscribed!",a.hidden=!1,e.reset()}catch(n){console.error("Subscription error:",n),s.textContent=n.message||"Subscription failed. Please try again."}finally{r.disabled=!1}})}const V="favorites";function _(){return Y(V)||[]}function Q(e){return _().some(s=>s._id===e)}function Le(e){const t=_();t.some(s=>s._id===e._id)||(t.push(e),j(V,t))}function J(e){const s=_().filter(a=>a._id!==e);j(V,s)}function Ee(e){return Q(e._id)?(J(e._id),!1):(Le(e),!0)}function K(e,t,s,a){const r=_();if(r.length===0){e.innerHTML="",t&&(t.hidden=!1);return}t&&(t.hidden=!0);const o=r.map(i=>`
      <li class="exercise-card" data-exercise-id="${i._id}">
        <div class="exercise-card-header">
          <span class="exercise-card-badge">workout</span>
          <div class="exercise-card-actions">
            <button class="exercise-delete-btn" type="button" data-delete="${i._id}" aria-label="Remove from favorites">
              <svg class="exercise-delete-icon">
                <use href="./img/sprite.svg#icon-trash"></use>
              </svg>
            </button>
            <button class="exercise-start-btn" type="button" data-start="${i._id}">
              Start
              <svg class="exercise-start-icon">
                <use href="./img/sprite.svg#icon-arrow"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="exercise-card-body">
          <div class="exercise-card-icon">
            <svg class="exercise-card-icon-svg">
              <use href="./img/sprite.svg#icon-run"></use>
            </svg>
          </div>
          <h3 class="exercise-card-title">${i.name}</h3>
        </div>
        <div class="exercise-card-meta">
          <span class="exercise-card-meta-item">Burned calories: <span>${i.burnedCalories} / 3 min</span></span>
          <span class="exercise-card-meta-item">Body part: <span>${i.bodyPart}</span></span>
          <span class="exercise-card-meta-item">Target: <span>${i.target}</span></span>
        </div>
      </li>
    `).join("");e.innerHTML=o,e.querySelectorAll("[data-start]").forEach(i=>{i.addEventListener("click",()=>{const n=i.dataset.start;s&&s(n)})}),e.querySelectorAll("[data-delete]").forEach(i=>{i.addEventListener("click",()=>{const n=i.dataset.delete;J(n),a&&a(n),K(e,t,s,a)})})}let c,f,g=null,w=null,x=null;function qe(){var e,t,s,a;c=document.querySelector("[data-exercise-modal]"),f=document.querySelector("[data-rating-modal]"),!(!c||!f)&&((e=c.querySelector("[data-modal-close]"))==null||e.addEventListener("click",$e),(t=f.querySelector("[data-modal-close]"))==null||t.addEventListener("click",W),(s=c.querySelector("[data-modal-give-rating]"))==null||s.addEventListener("click",()=>{T(c),Ce()}),(a=c.querySelector("[data-modal-favorites]"))==null||a.addEventListener("click",xe),Te())}async function G(e){try{const t=await ue(e);g=t,we(t),X(c),Z()}catch(t){console.error("Error loading exercise:",t),O("Failed to load exercise details","error")}}function we(e){var r;const t=c.querySelector("[data-modal-video]"),s=c.querySelector("[data-modal-gif]");e.gifUrl&&(s.src=e.gifUrl,s.alt=e.name,t.innerHTML="",t.appendChild(s)),c.querySelector("[data-modal-title]").textContent=v(e.name);const a=((r=e.rating)==null?void 0:r.toFixed(1))||"0.0";c.querySelector("[data-modal-rating-value]").textContent=a,c.querySelector("[data-modal-stars]").innerHTML=pe(e.rating||0),c.querySelector("[data-modal-target]").textContent=v(e.target),c.querySelector("[data-modal-bodypart]").textContent=v(e.bodyPart),c.querySelector("[data-modal-popularity]").textContent=e.popularity||"0",c.querySelector("[data-modal-calories]").textContent=e.burnedCalories,c.querySelector("[data-modal-description]").textContent=e.description||""}function Z(){if(!g)return;const e=c.querySelector("[data-modal-favorites]");e.querySelector("use"),Q(g._id)?e.innerHTML='Remove from favorites <svg class="btn-favorites-icon"><use href="./img/sprite.svg#icon-heart-filled"></use></svg>':e.innerHTML='Add to favorites <svg class="btn-favorites-icon"><use href="./img/sprite.svg#icon-heart"></use></svg>'}function xe(){g&&(Ee(g),Z())}function $e(){T(c),g=null}function Ce(){const e=f.querySelector("[data-rating-form]");e.reset(),e.querySelector("[data-rating-value]").value="0",e.querySelector('[type="submit"]').disabled=!0,Me(),X(f)}function W(){T(f)}function Te(){const e=f.querySelector("[data-rating-stars]"),t=f.querySelector("[data-rating-form]"),s=t.querySelector("[data-rating-value]"),a=t.querySelector('[name="email"]'),r=t.querySelector('[type="submit"]'),o=f.querySelector("[data-rating-email-error]");e.querySelectorAll("[data-star]").forEach(n=>{n.addEventListener("click",()=>{const p=n.dataset.star;s.value=p,Fe(p),i()})}),a.addEventListener("input",()=>{const n=q(a.value);a.classList.toggle("is-invalid",!n&&a.value.length>0),o.hidden=n||a.value.length===0,i()}),t.addEventListener("submit",async n=>{n.preventDefault();const p=parseInt(s.value,10),I=a.value.trim(),ae=t.querySelector('[name="review"]').value.trim();if(!(!g||p===0||!q(I))){r.disabled=!0;try{await fe(g._id,{rate:p,email:I,review:ae}),O("Thank you for your rating!","success"),W(),g&&G(g._id)}catch(N){console.error("Error submitting rating:",N),O(N.message||"Failed to submit rating","error"),r.disabled=!1}}});function i(){const n=parseInt(s.value,10),p=a.value.trim(),I=n>0&&q(p);r.disabled=!I}}function Fe(e){f.querySelector("[data-rating-stars]").querySelectorAll("[data-star]").forEach(s=>{const a=parseInt(s.dataset.star,10),r=s.querySelector("use");a<=e?r.setAttribute("href","./img/sprite.svg#icon-star"):r.setAttribute("href","./img/sprite.svg#icon-star-empty")})}function Me(){f.querySelector("[data-rating-stars]").querySelectorAll("[data-star] use").forEach(t=>{t.setAttribute("href","./img/sprite.svg#icon-star-empty")})}function X(e){e.classList.add("is-open"),document.body.classList.add("no-scroll"),w=t=>{t.key==="Escape"&&T(e)},document.addEventListener("keydown",w),x=t=>{t.target===e&&T(e)},e.addEventListener("click",x)}function T(e){e.classList.remove("is-open"),document.body.classList.remove("no-scroll"),w&&(document.removeEventListener("keydown",w),w=null),x&&(e.removeEventListener("click",x),x=null)}function ee({container:e,currentPage:t,totalPages:s,onPageChange:a}){if(!e)return;if(s<=1){e.classList.add("is-hidden"),e.innerHTML="";return}e.classList.remove("is-hidden");let r="";r+=`
    <button class="pagination-btn" type="button" data-page="1" ${t===1?"disabled":""} aria-label="First page">
      <svg class="pagination-icon"><use href="./img/sprite.svg#icon-chevrons-left"></use></svg>
    </button>
    <button class="pagination-btn" type="button" data-page="${t-1}" ${t===1?"disabled":""} aria-label="Previous page">
      <svg class="pagination-icon"><use href="./img/sprite.svg#icon-chevron-left"></use></svg>
    </button>
  `,ke(t,s).forEach((i,n)=>{i==="..."?r+='<span class="pagination-dots">...</span>':r+=`
        <button class="pagination-btn ${i===t?"active":""}" type="button" data-page="${i}">
          ${i}
        </button>
      `}),r+=`
    <button class="pagination-btn" type="button" data-page="${t+1}" ${t===s?"disabled":""} aria-label="Next page">
      <svg class="pagination-icon"><use href="./img/sprite.svg#icon-chevron-right"></use></svg>
    </button>
    <button class="pagination-btn" type="button" data-page="${s}" ${t===s?"disabled":""} aria-label="Last page">
      <svg class="pagination-icon"><use href="./img/sprite.svg#icon-chevrons-right"></use></svg>
    </button>
  `,e.innerHTML=r,e.querySelectorAll("[data-page]").forEach(i=>{i.addEventListener("click",()=>{const n=parseInt(i.dataset.page,10);n!==t&&n>=1&&n<=s&&a(n)})})}function ke(e,t){const s=[];if(t<=5)for(let r=1;r<=t;r++)s.push(r);else{s.push(1),e>3&&s.push("...");const r=Math.max(2,e-1),o=Math.min(t-1,e+1);for(let i=r;i<=o;i++)s.includes(i)||s.push(i);e<t-2&&s.push("..."),s.includes(t)||s.push(t)}return s}let h="Muscles",$="",m=1,R=1,d="",y=!1,C,F,M,k,A,L,te,se,H,b,l,u,B;function Ae(e){B=e,C=document.querySelectorAll("[data-filter]"),F=document.querySelector("[data-categories-list]"),M=document.querySelector("[data-categories-view]"),k=document.querySelector("[data-exercises-view]"),A=document.querySelector("[data-exercises-list]"),L=document.querySelector("[data-exercises-empty]"),te=document.querySelector("[data-categories-pagination]"),se=document.querySelector("[data-exercises-pagination]"),H=document.querySelector("[data-filters-category-name]"),b=document.querySelector("[data-search-form]"),l=b==null?void 0:b.querySelector('input[name="keyword"]'),u=document.querySelector("[data-search-clear]"),!(!C.length||!F)&&(C.forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.filter;y&&Pe(),(s!==h||y)&&(He(t),h=s,m=1,d="",l&&(l.value=""),u&&u.classList.remove("is-visible"),S())})}),b&&b.addEventListener("submit",t=>{t.preventDefault(),d=l==null?void 0:l.value.trim(),m=1,y?P():S()}),u&&l&&(l.addEventListener("input",()=>{u.classList.toggle("is-visible",l.value.length>0)}),u.addEventListener("click",()=>{l.value="",u.classList.remove("is-visible"),d="",m=1,y?P():S()})),S(),window.addEventListener("resize",Ne))}function He(e){C.forEach(t=>t.classList.remove("active")),e.classList.add("active")}function Pe(){y=!1,M&&(M.hidden=!1),k&&(k.hidden=!0),H&&(H.textContent=""),$="",d="",m=1,l&&(l.value=""),u&&u.classList.remove("is-visible")}function Ie(e,t){y=!0,$=e,h=t,m=1,d="",M&&(M.hidden=!0),k&&(k.hidden=!1),H&&(H.textContent=`/ ${v(e)}`),l&&(l.value=""),u&&u.classList.remove("is-visible"),C.forEach(s=>{s.classList.toggle("active",s.dataset.filter===t)}),P()}async function S(){try{const e=D("categories"),t=await le({filter:h,page:m,limit:e});let s=t.results;if(d){const a=d.toLowerCase();s=s.filter(r=>r.name.toLowerCase().includes(a))}R=d?1:t.totalPages,_e(s),Re()}catch(e){console.error("Error loading categories:",e),F.innerHTML="<li>Failed to load categories. Please try again.</li>"}}function _e(e){const t=e.map(s=>`
      <li>
        <button class="category-card" type="button" data-category="${s.name}" data-filter-type="${s.filter}">
          <img
            class="category-card-image"
            src="${s.imgURL}"
            alt="${s.name}"
            loading="lazy"
          />
          <div class="category-card-content">
            <span class="category-card-name">${v(s.name)}</span>
            <span class="category-card-filter">${s.filter}</span>
          </div>
        </button>
      </li>
    `).join("");F.innerHTML=t,F.querySelectorAll("[data-category]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.category,r=s.dataset.filterType;Ie(a,r)})})}function Re(){ee({container:te,currentPage:m,totalPages:R,onPageChange:e=>{m=e,S()}})}async function P(){try{const e=D("exercises"),t={page:m,limit:e};h==="Muscles"?t.muscles=$:h==="Body parts"?t.bodypart=$:h==="Equipment"&&(t.equipment=$),d&&(t.keyword=d);const s=await de(t);R=s.totalPages,s.results.length===0?Be():(je(),Oe(s.results)),Ve()}catch(e){console.error("Error loading exercises:",e),A.innerHTML="<li>Failed to load exercises. Please try again.</li>"}}function Oe(e){const t=e.map(s=>{var a;return`
      <li class="exercise-card">
        <div class="exercise-card-header">
          <span class="exercise-card-badge">workout</span>
          <div class="exercise-card-actions">
            <span class="exercise-card-rating">
              ${((a=s.rating)==null?void 0:a.toFixed(1))||"0.0"}
              <svg class="rating-star">
                <use href="./img/sprite.svg#icon-star"></use>
              </svg>
            </span>
            <button class="exercise-start-btn" type="button" data-start="${s._id}">
              Start
              <svg class="exercise-start-icon">
                <use href="./img/sprite.svg#icon-arrow"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="exercise-card-body">
          <div class="exercise-card-icon">
            <svg class="exercise-card-icon-svg">
              <use href="./img/sprite.svg#icon-run"></use>
            </svg>
          </div>
          <h3 class="exercise-card-title">${v(s.name)}</h3>
        </div>
        <div class="exercise-card-meta">
          <span class="exercise-card-meta-item">Burned calories: <span>${s.burnedCalories} / 3 min</span></span>
          <span class="exercise-card-meta-item">Body part: <span>${v(s.bodyPart)}</span></span>
          <span class="exercise-card-meta-item">Target: <span>${v(s.target)}</span></span>
        </div>
      </li>
    `}).join("");A.innerHTML=t,A.querySelectorAll("[data-start]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.start;B&&B(a)})})}function Be(){if(A.innerHTML="",L){L.hidden=!1;const e=L.querySelector("[data-search-keyword]");e&&(e.textContent=d?`"${d}"`:"")}}function je(){L&&(L.hidden=!0)}function Ve(){ee({container:se,currentPage:m,totalPages:R,onPageChange:e=>{m=e,P()}})}let U;function Ne(){clearTimeout(U),U=setTimeout(()=>{y?P():S()},250)}const ze=document.querySelector("[data-filters-section]")!==null,Ue=document.querySelector("[data-favorites-list]")!==null;function Ye(){ie(),oe(),ye(),Se(),qe(),ze&&De(),Ue&&Qe()}function De(){Ae(re)}function re(e){G(e)}function Qe(){const e=document.querySelector("[data-favorites-list]"),t=document.querySelector("[data-favorites-empty]");e&&K(e,t,re,()=>{})}document.addEventListener("DOMContentLoaded",Ye);
//# sourceMappingURL=main-Cf07CyvM.js.map
