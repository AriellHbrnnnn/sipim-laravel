import{r as d,j as e,X as J,S as Q,A as y}from"./app-EN_gyGxz.js";import{X as $,A as X}from"./AuthenticatedLayout-Bt2o64kt.js";import{c as _}from"./alert-circle-B6C4OT6A.js";import{S as H}from"./search-IHMbg-Qn.js";import{S as C}from"./shopping-cart-Dmzspt0x.js";import{C as W,a as Y}from"./chevron-right-twvR3q8l.js";import{T as B,P as G}from"./trash-2-BE4G8w-V.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=_("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=_("Printer",[["polyline",{points:"6 9 6 2 18 2 18 9",key:"1306q4"}],["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["rect",{width:"12",height:"8",x:"6",y:"14",key:"5ipwut"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=_("Tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]);function Z({show:f,transactionId:a,items:b,total:i,cashierName:h,date:o,time:r,onClose:u}){const[x,v]=d.useState(!1);if(!f)return null;const l=()=>{v(!0);const p=`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Receipt #${a}</title>
            <style>
                @page {
                    size: 80mm auto;
                    margin: 5mm;
                }
                body {
                    font-family: 'Courier New', monospace;
                    margin: 0;
                    padding: 10px;
                    font-size: 11px;
                    line-height: 1.4;
                    color: #000;
                }
                h1 {
                    font-size: 20px;
                    text-align: center;
                    margin: 0 0 5px 0;
                    font-weight: bold;
                }
                .center {
                    text-align: center;
                }
                .header {
                    border-bottom: 2px dashed #333;
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                }
                .info {
                    margin: 10px 0;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 4px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    border-top: 2px dashed #333;
                    border-bottom: 2px dashed #333;
                    margin: 10px 0;
                    padding: 10px 0;
                }
                thead {
                    border-bottom: 1px solid #333;
                }
                th, td {
                    padding: 6px 2px;
                    text-align: left;
                }
                th {
                    font-weight: bold;
                }
                th:nth-child(2), td:nth-child(2) {
                    text-align: center;
                    width: 40px;
                }
                th:nth-child(3), td:nth-child(3),
                th:nth-child(4), td:nth-child(4) {
                    text-align: right;
                }
                tbody tr {
                    border-bottom: 1px dotted #ccc;
                }
                .total-row {
                    font-size: 16px;
                    font-weight: bold;
                    margin: 10px 0;
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                }
                .footer {
                    border-top: 2px dashed #333;
                    padding-top: 10px;
                    margin-top: 10px;
                    text-align: center;
                    font-size: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header center">
                <h1>SIPIM STORE</h1>
                <div style="font-size: 11px; margin: 2px 0;">Store Information & Management</div>
                <div style="font-size: 9px; margin-top: 5px; color: #666;">
                    Jl. Contoh No. 123, Jakarta<br>
                    Tel: (021) 1234-5678
                </div>
            </div>
            
            <div class="info">
                <div class="info-row">
                    <span>Transaction #</span>
                    <span><strong>${a}</strong></span>
                </div>
                <div class="info-row">
                    <span>Date</span>
                    <span><strong>${o}</strong></span>
                </div>
                <div class="info-row">
                    <span>Time</span>
                    <span><strong>${r}</strong></span>
                </div>
                <div class="info-row">
                    <span>Cashier</span>
                    <span><strong>${h}</strong></span>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${b.map(g=>`
                        <tr>
                            <td>${g.product_name}</td>
                            <td>${g.quantity}</td>
                            <td>Rp ${g.price.toLocaleString("id-ID")}</td>
                            <td><strong>Rp ${(g.price*g.quantity).toLocaleString("id-ID")}</strong></td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
            
            <div class="total-row">
                <span>TOTAL</span>
                <span>Rp ${i.toLocaleString("id-ID")}</span>
            </div>
            
            <div class="footer">
                <div style="font-size: 11px; margin-bottom: 5px;"><strong>Thank you for shopping!</strong></div>
                <div style="margin: 5px 0;">Please come again</div>
                <div style="margin-top: 10px; color: #999; font-size: 9px;">Powered by SIPIM</div>
            </div>
            
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    }, 250);
                };
            <\/script>
        </body>
        </html>
    `,j=window.open("","_blank","width=300,height=600");j&&(j.document.write(p),j.document.close()),setTimeout(()=>v(!1),500)};return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"receipt-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-lg max-w-md w-full shadow-xl",children:[e.jsxs("div",{className:"receipt-header flex items-center justify-between px-6 py-4 border-b border-gray-200",children:[e.jsx("h3",{className:"text-lg font-semibold text-gray-900",children:"Transaction Receipt"}),e.jsx("button",{onClick:u,className:"text-gray-400 hover:text-gray-600 transition-colors",children:e.jsx($,{className:"w-5 h-5"})})]}),e.jsx("div",{className:"receipt-preview p-6",children:e.jsx("div",{className:"bg-white p-6 border border-gray-200 rounded-lg",children:e.jsx(D,{transactionId:a,items:b,total:i,cashierName:h,date:o,time:r})})}),e.jsxs("div",{className:"receipt-actions flex gap-3 px-6 py-4 bg-gray-50 rounded-b-lg",children:[e.jsx("button",{onClick:u,className:"flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium text-gray-700 transition-colors",children:"Close"}),e.jsxs("button",{onClick:l,disabled:x,className:"flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50",children:[e.jsx(U,{className:"w-4 h-4"}),x?"Printing...":"Print"]})]})]})}),e.jsx("div",{className:"receipt-print-only",children:e.jsx(D,{transactionId:a,items:b,total:i,cashierName:h,date:o,time:r})})]})}function D({transactionId:f,items:a,total:b,cashierName:i,date:h,time:o}){return e.jsxs("div",{className:"receipt-content text-center space-y-4",style:{fontFamily:"monospace"},children:[e.jsxs("div",{className:"border-b-2 border-dashed border-gray-300 pb-4",children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:"SIPIM STORE"}),e.jsx("p",{className:"text-sm text-gray-600 mt-1",children:"Store Information & Management"}),e.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"Jl. Contoh No. 123, Jakarta"}),e.jsx("p",{className:"text-xs text-gray-500",children:"Tel: (021) 1234-5678"})]}),e.jsxs("div",{className:"text-left space-y-1 text-sm",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Transaction #"}),e.jsx("span",{className:"font-semibold",children:f})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Date"}),e.jsx("span",{className:"font-semibold",children:h})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Time"}),e.jsx("span",{className:"font-semibold",children:o})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Cashier"}),e.jsx("span",{className:"font-semibold",children:i})]})]}),e.jsx("div",{className:"border-t-2 border-b-2 border-dashed border-gray-300 py-4",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"text-left border-b border-gray-300",children:[e.jsx("th",{className:"pb-2",children:"Item"}),e.jsx("th",{className:"pb-2 text-center",children:"Qty"}),e.jsx("th",{className:"pb-2 text-right",children:"Price"}),e.jsx("th",{className:"pb-2 text-right",children:"Total"})]})}),e.jsx("tbody",{children:a.map((r,u)=>e.jsxs("tr",{className:"border-b border-gray-200",children:[e.jsx("td",{className:"py-2",children:r.product_name}),e.jsx("td",{className:"py-2 text-center",children:r.quantity}),e.jsx("td",{className:"py-2 text-right",children:r.price.toLocaleString("id-ID")}),e.jsx("td",{className:"py-2 text-right font-semibold",children:(r.price*r.quantity).toLocaleString("id-ID")})]},u))})]})}),e.jsx("div",{className:"text-left space-y-2",children:e.jsxs("div",{className:"flex justify-between text-lg font-bold",children:[e.jsx("span",{children:"TOTAL"}),e.jsxs("span",{children:["Rp ",b.toLocaleString("id-ID")]})]})}),e.jsxs("div",{className:"border-t-2 border-dashed border-gray-300 pt-4 text-center",children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Thank you for shopping!"}),e.jsx("p",{className:"text-xs text-gray-500 mt-2",children:"Please come again"}),e.jsx("p",{className:"text-xs text-gray-400 mt-4",children:"Powered by SIPIM"})]})]})}function ie({auth:f,products:a,categories:b,settings:i,filters:h}){const{flash:o}=J().props,[r,u]=d.useState(h.search||""),[x,v]=d.useState(h.category||"all"),[l,p]=d.useState([]),[j,g]=d.useState(!1),[N,L]=d.useState(null),[w,k]=d.useState(null);d.useEffect(()=>{const t=sessionStorage.getItem("pos_cart");if(t)try{p(JSON.parse(t))}catch(s){console.error("Failed to parse cart:",s)}},[]),d.useEffect(()=>{sessionStorage.setItem("pos_cart",JSON.stringify(l))},[l]),d.useEffect(()=>{o!=null&&o.lastTransaction&&w&&(L({id:o.lastTransaction.id,items:w.items.map(t=>({product_name:t.product_name,quantity:t.quantity,price:t.price})),total:w.total,date:o.lastTransaction.date,time:o.lastTransaction.time}),g(!0),k(null),sessionStorage.removeItem("pos_cart"))},[o,w]);const z=t=>{const s=l.find(n=>n.product_id===t.id);if(s){if(s.quantity>=t.stock){alert(`Cannot add more. Only ${t.stock} in stock!`);return}p(n=>n.map(c=>c.product_id===t.id?{...c,quantity:c.quantity+1}:c))}else{if(t.stock===0){alert("Product out of stock!");return}p(n=>[...n,{product_id:t.id,product_name:t.name,price:t.price,quantity:1}])}},I=(t,s)=>{if(s<=0){P(t);return}const n=a.data.find(c=>c.id===t);n&&s<=n.stock?p(c=>c.map(m=>m.product_id===t?{...m,quantity:s}:m)):n&&alert(`Cannot set quantity. Only ${n.stock} in stock!`)},P=t=>{p(s=>s.filter(n=>n.product_id!==t))},M=()=>{confirm("Clear all items from cart?")&&(p([]),sessionStorage.removeItem("pos_cart"))},S=()=>l.reduce((t,s)=>t+s.price*s.quantity,0),T=()=>i!=null&&i.tax_enabled?S()*(i.tax_percentage/100):0,R=()=>S()+T(),A=t=>{t&&t.preventDefault();const s={};r&&(s.search=r),x!=="all"&&(s.category=x),y.get("/pos",s,{preserveState:!0,preserveScroll:!0})},q=t=>{v(t);const s={category:t};r&&(s.search=r),y.get("/pos",s,{preserveState:!0,preserveScroll:!0})},E=()=>{u(""),v("all"),y.get("/pos",{},{preserveState:!0,preserveScroll:!0})},O=()=>{if(l.length===0){alert("Cart is empty!");return}const t=S(),s=T(),n=R();k({items:[...l],total:n});const c=l.map(m=>({product_id:m.product_id,quantity:m.quantity,price:m.price}));y.post("/pos/checkout",{items:c,subtotal:t,tax:s,total:n},{preserveScroll:!0,onSuccess:()=>{p([])},onError:m=>{console.error("Checkout errors:",m),k(null)}})},F=r||x&&x!=="all";return e.jsxs(X,{user:f.user,header:e.jsx("h2",{className:"font-semibold text-xl text-gray-800",children:"Point of Sale"}),children:[e.jsx(Q,{title:"Point of Sale"}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"lg:col-span-2 space-y-4",children:[e.jsxs("div",{className:"bg-white border border-gray-200 rounded-lg p-4",children:[e.jsxs("form",{onSubmit:A,className:"space-y-3",children:[e.jsxs("div",{className:"relative",children:[e.jsx(H,{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"}),e.jsx("input",{type:"text",placeholder:"Search products...",value:r,onChange:t=>u(t.target.value),className:"w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(V,{className:"w-4 h-4 text-gray-500"}),e.jsxs("div",{className:"flex flex-wrap gap-2 flex-1",children:[e.jsx("button",{type:"button",onClick:()=>q("all"),className:`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${x==="all"?"bg-blue-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:"All"}),b.map(t=>e.jsx("button",{type:"button",onClick:()=>q(t),className:`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${x===t?"bg-blue-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:t},t))]})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{type:"submit",className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm",children:"Search"}),F&&e.jsxs("button",{type:"button",onClick:E,className:"px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm flex items-center gap-2",children:[e.jsx($,{className:"w-4 h-4"}),"Clear"]})]})]}),e.jsxs("div",{className:"mt-3 text-xs text-gray-600",children:["Showing ",a.data.length," of ",a.total," products",l.length>0&&e.jsxs("span",{className:"ml-2 font-semibold text-blue-600",children:["• ",l.length," items in cart"]})]})]}),e.jsxs("div",{className:"bg-white border border-gray-200 rounded-lg p-4",children:[a.data.length>0?e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3",children:a.data.map(t=>e.jsxs("button",{onClick:()=>z(t),disabled:t.stock===0,className:`bg-white border-2 rounded-lg p-3 text-left transition-all ${t.stock===0?"opacity-50 cursor-not-allowed border-gray-200":"hover:border-blue-500 hover:shadow-md border-gray-200"}`,children:[e.jsx("div",{className:"aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center",children:e.jsx(C,{className:"w-8 h-8 text-gray-400"})}),e.jsx("h3",{className:"font-semibold text-sm text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]",children:t.name}),e.jsx("p",{className:"text-xs text-gray-500 mb-2",children:t.category}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("span",{className:"text-sm font-bold text-blue-600",children:["Rp ",t.price.toLocaleString("id-ID")]}),e.jsx("span",{className:`text-xs px-2 py-0.5 rounded font-medium ${t.stock>10?"bg-green-100 text-green-800":t.stock>0?"bg-yellow-100 text-yellow-800":"bg-red-100 text-red-800"}`,children:t.stock})]})]},t.id))}):e.jsxs("div",{className:"text-center py-12 text-gray-500",children:[e.jsx(C,{className:"w-12 h-12 mx-auto mb-2 text-gray-400"}),e.jsx("p",{children:"No products found"})]}),a.last_page>1&&e.jsx("div",{className:"mt-4 pt-4 border-t border-gray-200",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"text-sm text-gray-700",children:["Page ",a.current_page," of ",a.last_page]}),e.jsx("div",{className:"flex gap-2",children:a.links.map((t,s)=>t.label==="&laquo; Previous"?e.jsx("button",{onClick:()=>t.url&&y.get(t.url,{},{preserveState:!0,preserveScroll:!0}),disabled:!t.url,className:"px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50",children:e.jsx(W,{className:"w-4 h-4"})},s):t.label==="Next &raquo;"?e.jsx("button",{onClick:()=>t.url&&y.get(t.url,{},{preserveState:!0,preserveScroll:!0}),disabled:!t.url,className:"px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50",children:e.jsx(Y,{className:"w-4 h-4"})},s):e.jsx("button",{onClick:()=>t.url&&y.get(t.url,{},{preserveState:!0,preserveScroll:!0}),className:`px-3 py-1 border rounded-lg text-sm ${t.active?"bg-blue-600 text-white border-blue-600":"border-gray-300 hover:bg-gray-50"}`,children:t.label},s))})]})})]})]}),e.jsx("div",{className:"lg:col-span-1",children:e.jsxs("div",{className:"bg-white border border-gray-200 rounded-lg sticky top-4",children:[e.jsx("div",{className:"px-6 py-4 border-b border-gray-200",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("h3",{className:"text-lg font-semibold text-gray-900 flex items-center gap-2",children:[e.jsx(C,{className:"w-5 h-5"}),"Cart"]}),l.length>0&&e.jsx("button",{onClick:M,className:"text-xs text-red-600 hover:text-red-700 font-medium",children:"Clear All"})]})}),e.jsx("div",{className:"px-6 py-4 max-h-96 overflow-y-auto",children:l.length===0?e.jsxs("div",{className:"text-center py-8",children:[e.jsx(C,{className:"mx-auto h-12 w-12 text-gray-400"}),e.jsx("p",{className:"mt-2 text-sm text-gray-500",children:"Cart is empty"}),e.jsx("p",{className:"text-xs text-gray-400 mt-1",children:"Click products to add"})]}):e.jsx("div",{className:"space-y-3",children:l.map(t=>e.jsxs("div",{className:"border border-gray-200 rounded-lg p-3",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsx("h4",{className:"text-sm font-semibold text-gray-900 flex-1 line-clamp-2",children:t.product_name}),e.jsx("button",{onClick:()=>P(t.product_id),className:"text-red-600 hover:text-red-700 ml-2",children:e.jsx(B,{className:"w-4 h-4"})})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>I(t.product_id,t.quantity-1),className:"w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100",children:e.jsx(K,{className:"w-3 h-3"})}),e.jsx("span",{className:"w-8 text-center text-sm font-semibold",children:t.quantity}),e.jsx("button",{onClick:()=>I(t.product_id,t.quantity+1),className:"w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100",children:e.jsx(G,{className:"w-3 h-3"})})]}),e.jsxs("div",{className:"text-right",children:[e.jsxs("div",{className:"text-xs text-gray-500",children:["@Rp ",t.price.toLocaleString("id-ID")]}),e.jsxs("div",{className:"text-sm font-bold text-gray-900",children:["Rp"," ",(t.price*t.quantity).toLocaleString("id-ID")]})]})]})]},t.product_id))})}),l.length>0&&e.jsxs("div",{className:"px-6 py-4 border-t border-gray-200 space-y-3",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-gray-600",children:"Subtotal"}),e.jsxs("span",{className:"text-gray-900 font-medium",children:["Rp ",S().toLocaleString("id-ID")]})]}),(i==null?void 0:i.tax_enabled)&&e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsxs("span",{className:"text-gray-600",children:["Tax (",i.tax_percentage,"%)"]}),e.jsxs("span",{className:"text-gray-900 font-medium",children:["Rp ",T().toLocaleString("id-ID")]})]}),e.jsxs("div",{className:"flex justify-between items-center pt-2 border-t border-gray-200",children:[e.jsx("span",{className:"text-base font-semibold text-gray-900",children:"Total"}),e.jsxs("span",{className:"text-2xl font-bold text-blue-600",children:["Rp ",R().toLocaleString("id-ID")]})]})]}),e.jsxs("button",{onClick:O,className:"w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-lg",children:["Checkout (",l.length," items)"]})]})]})})]}),j&&N&&e.jsx(Z,{show:j,transactionId:N.id,items:N.items,total:N.total,cashierName:f.user.name,date:N.date,time:N.time,onClose:()=>g(!1)})]})}export{ie as default};
