(this["webpackJsonpstadt-land-fluss"]=this["webpackJsonpstadt-land-fluss"]||[]).push([[13],{181:function(e,t,n){"use strict";var r=n(2),a=n(168),c=n(80),o=n.n(c),i=(n(0),n(182)),s=n.n(i);t.a=function(e){return Object(r.jsx)("div",{className:s.a.button_wrapper,children:Object(r.jsx)(a.a,{type:"button",color:"default",variant:"contained",size:"large",startIcon:Object(r.jsx)(o.a,{}),onClick:e.onReturnToDashboard,children:"Dashboard"})})}},182:function(e,t,n){e.exports={button_wrapper:"ToDashboardButton_button_wrapper__1EtAB"}},184:function(e,t,n){"use strict";n.d(t,"l",(function(){return u})),n.d(t,"k",(function(){return d})),n.d(t,"j",(function(){return j})),n.d(t,"g",(function(){return f})),n.d(t,"n",(function(){return b})),n.d(t,"e",(function(){return h})),n.d(t,"d",(function(){return m})),n.d(t,"c",(function(){return p})),n.d(t,"h",(function(){return g})),n.d(t,"i",(function(){return v})),n.d(t,"m",(function(){return y})),n.d(t,"a",(function(){return w})),n.d(t,"b",(function(){return C})),n.d(t,"f",(function(){return k}));var r=n(12),a=n(185),c=n(189),o=n(205),i=n.n(o),s=n(77),l=n(50),u=function(e,t){if(e>t.length)throw new Error("Cannot create more randomn unique letters than the number of possibleLetters provided!");for(var n=[],r=Object(a.a)(t),c=function(e){var t=i()(r);n.push(t),r=r.filter((function(e){return e!==t}))},o=0;o<e;o++)c();return n},d=function(e,t,n){for(var r=Object(a.a)(n),c=e-n.length,o=t.filter((function(e){return!n.includes(e)})),s=function(e){var t=i()(o);r.push(t),o=o.filter((function(e){return e!==t}))},l=0;l<c;l++)s();return r},j=function(e){return Array.from(e).map((function(e){return e[1]})).sort((function(e,t){return e.name.toLowerCase()<t.name.toLowerCase()?-1:e.name.toLowerCase()>t.name.toLowerCase()?1:0}))},f=function(e){return Object(l.e)(e,{points:s.s,star:!1,text:"",valid:!0})},b=function(e){return e.map((function(e){return Object(r.a)(Object(r.a)({},e),{},{text:e.text.trim(),valid:!!e.text})}))},h=function(e,t){var n=new Map;return e.forEach((function(r){var a=[];t.forEach((function(){var t=new Map;e.forEach((function(e){t.set(e.id,!0)})),a.push(t)})),n.set(r.id,a)})),n},m=function(e,t){if(e.checkForDuplicates||e.onlyPlayerWithValidAnswer)for(var n=t.keys().next().value,r=t.get(n),a=0;a<r.length;a++)p(e,t,a)},p=function(e,t,n){(e.checkForDuplicates||e.onlyPlayerWithValidAnswer)&&Array.from(t.keys()).forEach((function(r){var a=t.get(r);a[n].valid&&(e.onlyPlayerWithValidAnswer&&O(r,t,n)?a[n].points=s.n:e.checkForDuplicates&&x(r,t,n)?a[n].points=s.o:a[n].points=s.s)}))},O=function(e,t,n){var r=Array.from(t.keys()).filter((function(t){return t!==e})),a=!0;return r.forEach((function(e){return a=a&&!t.get(e)[n].valid})),a},x=function(e,t,n){var r=Array.from(t.keys()).filter((function(t){return t!==e})),a=t.get(e)[n].text.toLowerCase().replace(/[^0-9a-z]/gi,"");return Object(c.some)(r,(function(e){var r=t.get(e)[n];return r.valid&&a===r.text.toLowerCase().replace(/[^0-9a-z]/gi,"")}))},g=function(e){return e<=3?1:2},v=function(e){var t=0;return e.forEach((function(e){return t=e?t:t+1})),t},y=function(e,t){var n=new Map;return e.forEach((function(e,r){if(!e){var a=t.get(r);a&&n.set(r,a)}})),j(n)},w=function(e,t){t.forEach((function(t){t.forEach((function(t){t.valid?e.creativeAnswersExtraPoints&&t.star&&(t.points=t.points+s.d):t.points=0}))}))},C=function(e,t){var n=[],r={};return e.forEach((function(e,t){return r[t]={playerName:e.name,points:0}})),t.forEach((function(e){e.forEach((function(e,t){var n=e.reduce((function(e,t){return e+t.points}),0);r[t].points+=n}))})),Object.keys(r).forEach((function(e){return n.push(r[e])})),n.sort((function(e,t){return t.points-e.points}))},k=function(e,t,n){var r=[];return n.forEach((function(n){n.forEach((function(n,a){var c=e.get(a);n.forEach((function(e,n){e.valid&&e.star&&r.push({category:t.categories[n],playerName:c.name,text:e.text})}))}))})),r}},207:function(e,t,n){"use strict";var r=n(2),a=n(0),c=n.n(a),o=n(77),i=n(208),s=n.n(i);t.a=function(e){var t=e.rules;return t.checkForDuplicates||t.onlyPlayerWithValidAnswer||t.creativeAnswersExtraPoints?Object(r.jsxs)(c.a.Fragment,{children:[e.isForGameResultsPage?Object(r.jsx)("h3",{className:s.a.heading,children:"Regeln f\xfcr die Punktevergabe"}):null,e.isForGameResultsPage?null:Object(r.jsx)("h4",{className:s.a.heading,children:"Regeln f\xfcr die Punktevergabe"}),Object(r.jsxs)("ul",{className:s.a.list,children:[t.checkForDuplicates?Object(r.jsx)("li",{children:o.e.checkForDuplicates}):null,t.onlyPlayerWithValidAnswer?Object(r.jsx)("li",{children:o.e.onlyPlayerWithValidAnswer}):null,t.creativeAnswersExtraPoints?Object(r.jsx)("li",{children:o.e.creativeAnswersExtraPoints}):null]})]}):null}},208:function(e,t,n){e.exports={heading:"ScoringOptionsList_heading__24MfE",list:"ScoringOptionsList_list__2_T80"}},271:function(e,t,n){e.exports={button_wrapper:"GameResults_button_wrapper__3kHLB"}},325:function(e,t,n){"use strict";n.r(t);var r=n(38),a=n(39),c=n(41),o=n(40),i=n(2),s=n(132),l=n(0),u=n.n(l),d=n(27),j=n(185),f=n(173),b=n(134),h=n(307),m=n(308),p=n(130),O=n(206),x=n.n(O),g=n(269),v=n.n(g),y=Object(p.a)({listItem:{flex:"0 0 auto",justifyContent:"center",margin:0},listItemText:{flex:"0 0 auto",minWidth:"6rem"}}),w=function(e){var t=y(),n=Math.max.apply(Math,Object(j.a)(e.gameResults.map((function(e){return e.points}))));return Object(i.jsx)(f.a,{children:e.gameResults.map((function(e,r){return Object(i.jsxs)(b.a,{className:t.listItem,children:[Object(i.jsx)(h.a,{children:(a=e.points===n,a?Object(i.jsx)(v.a,{color:"primary",fontSize:"large"}):Object(i.jsx)(x.a,{fontSize:"large"}))}),Object(i.jsx)(m.a,{className:t.listItemText,primary:e.playerName,secondary:"".concat(e.points," Punkte")})]},"results-for-player-"+r);var a}))})},C=n(191),k=n(12),R=n(272),N=n(328),A=n(299),E=n(301),P=n(168),D=n(317),F=n(318),_=n(323),S=n(270),I=n.n(S),W=n(333),L=n(172),z=n(7),M=n(179),T=n(314),B=n(316),V=n(311),G=n(313),H=n(315),J=n(312),K=n(192),q=n.n(K),Q=Object(z.a)((function(e){return Object(M.a)({head:{backgroundColor:e.palette.primary.main,color:e.palette.primary.contrastText,maxWidth:"8rem","&:not(:last-child)":{borderRight:"1px solid rgba(255, 255, 255, 0.5)"}},body:{fontSize:14,maxWidth:"8rem","&:not(:last-child)":{borderRight:"1px solid rgba(224, 224, 224, 1)"}}})}))(V.a),U=Object(z.a)((function(e){return Object(M.a)({root:{"&:nth-of-type(odd)":{backgroundColor:e.palette.action.hover}}})}))(J.a),X=Object(p.a)({tableContainer:{borderRadius:0},table:{maxWidth:"80vw"},firstColumn:{fontWeight:"bold"},invalidInput:{color:"crimson",textDecoration:"line-through"},creativeAnswerStarIcon:{paddingRight:"0.2rem",fontSize:"1rem",verticalAlign:"text-top"}}),Y=function(e){var t=X(),n=e.gameConfig,r=e.gameRound,a=e.roundNo,c=e.sortedPlayers,o=function(e){return Object(i.jsxs)(u.a.Fragment,{children:[Object(i.jsx)(W.a,{title:"Als besonders kreativ markiert",placement:"bottom",children:Object(i.jsx)(q.a,{className:t.creativeAnswerStarIcon,color:"secondary"})}),Object(i.jsxs)("span",{children:[e.text," (+",e.points,")"]})]})};return Object(i.jsx)(G.a,{component:L.a,className:t.tableContainer,children:Object(i.jsxs)(T.a,{className:t.table,"aria-label":"Runde ".concat(a," im Detail"),children:[Object(i.jsx)(H.a,{children:Object(i.jsxs)(J.a,{children:[Object(i.jsx)(Q,{children:"Kategorie"}),c.map((function(e,t){return Object(i.jsx)(Q,{align:"right",children:e.name},"slf-table-head-cell-for-player-".concat(t))}))]})}),Object(i.jsx)(B.a,{children:n.categories.map((function(e,n){return Object(i.jsxs)(U,{children:[Object(i.jsx)(Q,{component:"th",scope:"row",className:t.firstColumn,children:e}),c.map((function(e,a){var c=r.get(e.id)[n];return Object(i.jsxs)(Q,{className:c.valid?"":t.invalidInput,align:"right",children:[c.valid&&c.star?o(c):null,c.valid&&!c.star?"".concat(c.text," (+").concat(c.points,")"):null,!c.valid&&c.text?c.text:null,c.valid||c.text?null:Object(i.jsx)("span",{className:"sr-only",children:"Leere Antwort"})]},"slf-table-cell-for-category-".concat(n,"-player-").concat(a))}))]},"slf-table-row-for-category-".concat(n))}))})]})})},Z=function(e){var t=e.children,n=e.value,r=e.index,a=Object(R.a)(e,["children","value","index"]);return Object(i.jsx)("div",Object(k.a)(Object(k.a)({role:"tabpanel",hidden:n!==r,id:"scrollable-auto-tabpanel-".concat(r),"aria-labelledby":"scrollable-auto-tab-".concat(r)},a),{},{children:n===r&&t}))},$=Object(p.a)((function(e){return{root:{flexGrow:1,width:"100%",padding:"0 !important",backgroundColor:e.palette.background.paper}}})),ee=function(e){var t=$(),n=e.gameConfig,r=e.open,a=e.rounds,c=e.sortedPlayers,o=e.onClose,s=u.a.useState(0),l=Object(C.a)(s,2),d=l[0],j=l[1];return Object(i.jsxs)(N.a,{onClose:o,open:r,maxWidth:"lg",children:[Object(i.jsxs)(A.a,{className:t.root,children:[Object(i.jsx)(D.a,{position:"static",color:"default",children:Object(i.jsx)(_.a,{value:d,onChange:function(e,t){return j(t)},indicatorColor:"secondary",textColor:"primary",variant:"scrollable",scrollButtons:"auto",children:a.map((function(e,t){return Object(i.jsx)(F.a,Object(k.a)({label:"Runde ".concat(t+1,": ").concat(n.letters[t])},function(e){return{id:"scrollable-auto-tab-".concat(e),"aria-controls":"scrollable-auto-tabpanel-".concat(e)}}(t)),"slf-game-rounds-overview-tab-".concat(t))}))})}),a.map((function(e,t){return Object(i.jsx)(Z,{value:d,index:t,children:Object(i.jsx)(Y,{gameConfig:n,gameRound:e,roundNo:t+1,sortedPlayers:c})},"slf-game-rounds-overview-tab-panel-".concat(t))}))]}),Object(i.jsx)(E.a,{children:Object(i.jsx)(P.a,{type:"button",onClick:o,children:"Schlie\xdfen"})})]})},te=function(e){var t=Object(l.useState)(!1),n=Object(C.a)(t,2),r=n[0],a=n[1];return Object(i.jsxs)(u.a.Fragment,{children:[Object(i.jsx)(P.a,{color:"primary",variant:"contained",size:"large",startIcon:Object(i.jsx)(I.a,{}),onClick:function(){return a(!0)},children:"Alle Runden im Detail"}),Object(i.jsx)(ee,{gameConfig:e.gameConfig,open:r,rounds:e.rounds,sortedPlayers:e.sortedPlayers,onClose:function(){return a(!1)}})]})},ne=n(300),re=n(319),ae=n(331),ce=Object(p.a)({list:{paddingBottom:0},listItem:{padding:"0.25rem 0"},listItemAvatar:{marginRight:"1rem"}}),oe=function(e){var t=ce(),n=e.hallOfFameData,r=e.open,a=e.onClose;return Object(i.jsxs)(N.a,{onClose:a,open:r,maxWidth:"lg",children:[Object(i.jsxs)(A.a,{children:[Object(i.jsx)(ne.a,{children:"Hall of Fame"}),Object(i.jsx)(s.a,{}),Object(i.jsx)(f.a,{className:t.list,children:n.map((function(e,n){return Object(i.jsxs)(b.a,{className:t.listItem,children:[Object(i.jsx)(re.a,{className:t.listItemAvatar,children:Object(i.jsx)(ae.a,{icon:Object(i.jsx)(x.a,{}),color:"primary",label:e.playerName})}),Object(i.jsx)(m.a,{primary:e.text,secondary:e.category})]},"slf-hall-of-fame-item-".concat(n))}))})]}),Object(i.jsx)(E.a,{children:Object(i.jsx)(P.a,{type:"button",onClick:a,children:"Schlie\xdfen"})})]})},ie=function(e){var t=Object(l.useState)(!1),n=Object(C.a)(t,2),r=n[0],a=n[1];return Object(i.jsxs)(u.a.Fragment,{children:[Object(i.jsxs)(P.a,{color:"primary",variant:"contained",size:"large",startIcon:Object(i.jsx)(q.a,{}),disabled:0===e.hallOfFameData.length,onClick:function(){return a(!0)},children:[Object(i.jsx)("span",{lang:"en",children:"Hall of Fame"}),Object(i.jsx)("span",{className:"sr-only",children:"(Liste der besonders kreativen Antworten)"})]}),Object(i.jsx)(oe,{hallOfFameData:e.hallOfFameData,open:r,onClose:function(){return a(!1)}})]})},se=n(207),le=n(78),ue=n(181),de=n(17),je=n(184),fe=n(271),be=n.n(fe),he=function(e){Object(c.a)(n,e);var t=Object(o.a)(n);function n(){var e;Object(r.a)(this,n);for(var a=arguments.length,c=new Array(a),o=0;o<a;o++)c[o]=arguments[o];return(e=t.call.apply(t,[this].concat(c))).state={gameConfig:null,gameResults:[],gameRounds:[],hallOfFameData:[],sortedPlayers:[]},e}return Object(a.a)(n,[{key:"render",value:function(){var e=this,t=this.state,n=t.gameConfig,r=t.gameResults,a=t.gameRounds,c=t.hallOfFameData,o=t.sortedPlayers;return null===n?null:Object(i.jsxs)("div",{className:"main-content-wrapper",children:[Object(i.jsxs)("div",{className:"material-card-style",children:[Object(i.jsx)(le.a,{text:"Ergebnis"}),Object(i.jsx)("p",{className:"sr-only",role:"alert",children:"Das Spiel ist zu Ende. Die Ergebnisse werden angezeigt."}),Object(i.jsx)(w,{gameResults:r}),Object(i.jsx)(s.a,{}),Object(i.jsxs)("div",{className:be.a.button_wrapper,children:[Object(i.jsx)(te,{gameConfig:n,rounds:a,sortedPlayers:o}),Object(i.jsx)(ie,{hallOfFameData:c})]})]}),Object(i.jsxs)("div",{className:"material-card-style",children:[Object(i.jsx)(le.a,{text:"Spieleinstellungen"}),Object(i.jsxs)("div",{className:"game-settings",children:[Object(i.jsx)("h4",{children:"Runden"}),Object(i.jsx)("p",{children:n.numberOfRounds}),Object(i.jsx)("h4",{children:"Buchstaben"}),Object(i.jsx)("p",{children:n.letters.join(", ")}),Object(i.jsx)("h4",{children:"Kategorien"}),Object(i.jsx)("p",{children:n.categories.join(", ")})]}),Object(i.jsx)(se.a,{isForGameResultsPage:!0,rules:n.scoringOptions})]}),Object(i.jsx)(ue.a,{onReturnToDashboard:function(){return e.props.history.push("/")}})]})}},{key:"componentDidMount",value:function(){var e=this.props,t=e.allPlayers,n=e.gameConfig,r=e.gameRounds;null===t||null===n||null===r?this.props.history.push("/"):(this.setState({gameConfig:n,gameResults:Object(je.b)(t,r),gameRounds:r,hallOfFameData:Object(je.f)(t,n,r),sortedPlayers:Object(je.j)(t)}),this.props.onResetAppState())}}]),n}(l.Component);t.default=Object(d.b)((function(e){return e}),(function(e){return{onResetAppState:function(){return e(Object(de.i)())}}}))(he)}}]);
//# sourceMappingURL=13.bc7a2136.chunk.js.map