(this["webpackJsonpstadt-land-fluss"]=this["webpackJsonpstadt-land-fluss"]||[]).push([[11],{160:function(e,a,t){"use strict";t.d(a,"a",(function(){return i}));var n=t(1),o=t(0),r=t(76);function i(e,a){var t=o.memo(o.forwardRef((function(a,t){return o.createElement(r.a,Object(n.a)({},a,{ref:t}),e)})));return t.muiName=r.a.muiName,t}},163:function(e,a,t){"use strict";var n=t(186),o=t(67),r=t.n(o),i=t(0),l=t.n(i),c=t(164),d=t.n(c);a.a=function(e){return l.a.createElement("div",{className:d.a.button_wrapper},l.a.createElement(n.a,{type:"button",color:"default",variant:"contained",size:"large",startIcon:l.a.createElement(r.a,null),onClick:e.onReturnToDashboard},"Dashboard"))}},164:function(e,a,t){e.exports={button_wrapper:"ToDashboardButton_button_wrapper__1EtAB"}},168:function(e,a,t){"use strict";t.d(a,"a",(function(){return o}));var n=t(0);function o(e){var a=e.controlled,t=e.default,o=(e.name,n.useRef(void 0!==a).current),r=n.useState(t),i=r[0],l=r[1];return[o?a:i,n.useCallback((function(e){o||l(e)}),[])]}},178:function(e,a,t){"use strict";t.d(a,"b",(function(){return n})),t.d(a,"a",(function(){return s}));var n,o=t(151),r=t(0),i=t.n(r),l=t(26),c=t(179),d=t.n(c);!function(e){e.newgame="newgame",e.joingame="joingame"}(n||(n={}));var s=function(e){var a="newgame"===e.context?"ein neues Spiel erstellst":"einem anderen Spiel beitrittst",t="Du nimmst bereits an einem laufenden Spiel teil. Wenn du ".concat(a,",\n    kannst du nicht mehr in das alte Spiel zur\xfcckkehren!");return i.a.createElement("div",{className:"material-card-style"},i.a.createElement("p",{className:d.a.hint_text},i.a.createElement("span",{className:"rejoin-running-game-hint-highlighted"},"Achtung: "),t),i.a.createElement(o.a,{component:l.b,to:"/play",className:d.a.link},"\u21d2 Zur\xfcck ins laufende Spiel"))}},179:function(e,a,t){e.exports={hint_text:"RejoinRunningGameHint_hint_text__24Gb_",link:"RejoinRunningGameHint_link__2heEh"}},186:function(e,a,t){"use strict";var n=t(2),o=t(1),r=t(0),i=(t(4),t(3)),l=t(5),c=t(16),d=t(96),s=t(11),p=r.forwardRef((function(e,a){var t=e.children,l=e.classes,c=e.className,p=e.color,u=void 0===p?"default":p,m=e.component,b=void 0===m?"button":m,h=e.disabled,f=void 0!==h&&h,g=e.disableElevation,y=void 0!==g&&g,v=e.disableFocusRipple,x=void 0!==v&&v,S=e.endIcon,I=e.focusVisibleClassName,C=e.fullWidth,j=void 0!==C&&C,k=e.size,O=void 0===k?"medium":k,w=e.startIcon,z=e.type,E=void 0===z?"button":z,R=e.variant,N=void 0===R?"text":R,T=Object(n.a)(e,["children","classes","className","color","component","disabled","disableElevation","disableFocusRipple","endIcon","focusVisibleClassName","fullWidth","size","startIcon","type","variant"]),_=w&&r.createElement("span",{className:Object(i.a)(l.startIcon,l["iconSize".concat(Object(s.a)(O))])},w),D=S&&r.createElement("span",{className:Object(i.a)(l.endIcon,l["iconSize".concat(Object(s.a)(O))])},S);return r.createElement(d.a,Object(o.a)({className:Object(i.a)(l.root,l[N],c,"inherit"===u?l.colorInherit:"default"!==u&&l["".concat(N).concat(Object(s.a)(u))],"medium"!==O&&[l["".concat(N,"Size").concat(Object(s.a)(O))],l["size".concat(Object(s.a)(O))]],y&&l.disableElevation,f&&l.disabled,j&&l.fullWidth),component:b,disabled:f,focusRipple:!x,focusVisibleClassName:Object(i.a)(l.focusVisible,I),ref:a,type:E},T),r.createElement("span",{className:l.label},_,t,D))}));a.a=Object(l.a)((function(e){return{root:Object(o.a)({},e.typography.button,{boxSizing:"border-box",minWidth:64,padding:"6px 16px",borderRadius:e.shape.borderRadius,color:e.palette.text.primary,transition:e.transitions.create(["background-color","box-shadow","border"],{duration:e.transitions.duration.short}),"&:hover":{textDecoration:"none",backgroundColor:Object(c.c)(e.palette.text.primary,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"},"&$disabled":{backgroundColor:"transparent"}},"&$disabled":{color:e.palette.action.disabled}}),label:{width:"100%",display:"inherit",alignItems:"inherit",justifyContent:"inherit"},text:{padding:"6px 8px"},textPrimary:{color:e.palette.primary.main,"&:hover":{backgroundColor:Object(c.c)(e.palette.primary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},textSecondary:{color:e.palette.secondary.main,"&:hover":{backgroundColor:Object(c.c)(e.palette.secondary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},outlined:{padding:"5px 15px",border:"1px solid ".concat("light"===e.palette.type?"rgba(0, 0, 0, 0.23)":"rgba(255, 255, 255, 0.23)"),"&$disabled":{border:"1px solid ".concat(e.palette.action.disabledBackground)}},outlinedPrimary:{color:e.palette.primary.main,border:"1px solid ".concat(Object(c.c)(e.palette.primary.main,.5)),"&:hover":{border:"1px solid ".concat(e.palette.primary.main),backgroundColor:Object(c.c)(e.palette.primary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},outlinedSecondary:{color:e.palette.secondary.main,border:"1px solid ".concat(Object(c.c)(e.palette.secondary.main,.5)),"&:hover":{border:"1px solid ".concat(e.palette.secondary.main),backgroundColor:Object(c.c)(e.palette.secondary.main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},"&$disabled":{border:"1px solid ".concat(e.palette.action.disabled)}},contained:{color:e.palette.getContrastText(e.palette.grey[300]),backgroundColor:e.palette.grey[300],boxShadow:e.shadows[2],"&:hover":{backgroundColor:e.palette.grey.A100,boxShadow:e.shadows[4],"@media (hover: none)":{boxShadow:e.shadows[2],backgroundColor:e.palette.grey[300]},"&$disabled":{backgroundColor:e.palette.action.disabledBackground}},"&$focusVisible":{boxShadow:e.shadows[6]},"&:active":{boxShadow:e.shadows[8]},"&$disabled":{color:e.palette.action.disabled,boxShadow:e.shadows[0],backgroundColor:e.palette.action.disabledBackground}},containedPrimary:{color:e.palette.primary.contrastText,backgroundColor:e.palette.primary.main,"&:hover":{backgroundColor:e.palette.primary.dark,"@media (hover: none)":{backgroundColor:e.palette.primary.main}}},containedSecondary:{color:e.palette.secondary.contrastText,backgroundColor:e.palette.secondary.main,"&:hover":{backgroundColor:e.palette.secondary.dark,"@media (hover: none)":{backgroundColor:e.palette.secondary.main}}},disableElevation:{boxShadow:"none","&:hover":{boxShadow:"none"},"&$focusVisible":{boxShadow:"none"},"&:active":{boxShadow:"none"},"&$disabled":{boxShadow:"none"}},focusVisible:{},disabled:{},colorInherit:{color:"inherit",borderColor:"currentColor"},textSizeSmall:{padding:"4px 5px",fontSize:e.typography.pxToRem(13)},textSizeLarge:{padding:"8px 11px",fontSize:e.typography.pxToRem(15)},outlinedSizeSmall:{padding:"3px 9px",fontSize:e.typography.pxToRem(13)},outlinedSizeLarge:{padding:"7px 21px",fontSize:e.typography.pxToRem(15)},containedSizeSmall:{padding:"4px 10px",fontSize:e.typography.pxToRem(13)},containedSizeLarge:{padding:"8px 22px",fontSize:e.typography.pxToRem(15)},sizeSmall:{},sizeLarge:{},fullWidth:{width:"100%"},startIcon:{display:"inherit",marginRight:8,marginLeft:-4,"&$iconSizeSmall":{marginLeft:-2}},endIcon:{display:"inherit",marginRight:-4,marginLeft:8,"&$iconSizeSmall":{marginRight:-2}},iconSizeSmall:{"& > *:first-child":{fontSize:18}},iconSizeMedium:{"& > *:first-child":{fontSize:20}},iconSizeLarge:{"& > *:first-child":{fontSize:22}}}}),{name:"MuiButton"})(p)},203:function(e,a,t){"use strict";var n=t(31);Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var o=n(t(0)),r=(0,n(t(42)).default)(o.default.createElement("path",{d:"M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"}),"DirectionsWalk");a.default=r},256:function(e,a,t){"use strict";t.r(a);var n=t(70),o=t(32),r=t(33),i=t(35),l=t(36),c=t(280),d=t(186),s=t(203),p=t.n(s),u=t(0),m=t.n(u),b=t(20),h=t(178),f=t(64),g=t(163),y=t(13),v=t(43),x=t(23),S=function(e){Object(l.a)(t,e);var a=Object(i.a)(t);function t(){var e;Object(o.a)(this,t);for(var r=arguments.length,i=new Array(r),l=0;l<r;l++)i[l]=arguments[l];return(e=a.call.apply(a,[this].concat(i))).state={idInput:"",nameInput:e.props.playerInfo?e.props.playerInfo.name:"",validateInputs:!1},e.handleInputChange=function(a){var t=a.target,o=t.name,r=t.value;e.setState(Object(n.a)({},o,r))},e.handleSubmit=function(a){a.preventDefault(),e.state.idInput&&e.state.nameInput.trim()?e.joinGame():e.setState({nameInput:e.state.nameInput.trim(),validateInputs:!0})},e.joinGame=function(){var a=e.props.playerInfo,t=e.props.playerIdCreationTimestamp,n=e.state,o=n.idInput,r=n.nameInput;Object(x.f)(),Object(x.h)({id:a.id,idCreationTimestamp:t,name:r.trim()}),Object(x.j)({gameId:o,idCreationTimestamp:Object(v.b)(new Date),isPlayerAdmin:!1}),e.props.onSetGameData({gameConfig:null,gameId:o,isRejoiningGame:!1,playerInfo:{id:a.id,isAdmin:!1,name:r.trim()}}),e.props.history.push("/play")},e.returnToDashboard=function(){e.props.history.push("/")},e}return Object(r.a)(t,[{key:"render",value:function(){var e=m.a.createElement("form",{onSubmit:this.handleSubmit,className:"app-form",noValidate:!0,autoComplete:"off"},m.a.createElement(c.a,{name:"nameInput",label:"Spielername",value:this.state.nameInput,onChange:this.handleInputChange,className:"app-form-input",variant:"outlined",fullWidth:!0,required:!0,autoFocus:!0,error:this.state.validateInputs&&!this.state.nameInput}),m.a.createElement(c.a,{name:"idInput",label:"Spiel-ID",value:this.state.idInput,onChange:this.handleInputChange,className:"app-form-input",variant:"outlined",fullWidth:!0,required:!0,error:this.state.validateInputs&&!this.state.idInput}),m.a.createElement("div",{className:"button-wrapper"},m.a.createElement(d.a,{type:"submit",color:"primary",variant:"contained",size:"large",startIcon:m.a.createElement(p.a,null)},"Beitreten")));return m.a.createElement("div",{className:"main-content-wrapper"},this.props.gameId?m.a.createElement(h.a,{context:h.b.joingame}):null,m.a.createElement("div",{className:"material-card-style"},m.a.createElement(f.a,{showDivider:!0,text:"Spiel beitreten"}),e),m.a.createElement(g.a,{onReturnToDashboard:this.returnToDashboard}))}},{key:"componentDidMount",value:function(){var e=new URLSearchParams(this.props.location.search);e.has("id")&&this.setState({idInput:e.get("id")})}},{key:"componentDidUpdate",value:function(e){this.props.playerInfo&&this.props.playerInfo!==e.playerInfo&&this.setState({nameInput:this.props.playerInfo.name})}}]),t}(u.Component);a.default=Object(b.b)((function(e){return{gameId:e.gameId,playerIdCreationTimestamp:e.playerIdCreationTimestamp,playerInfo:e.playerInfo}}),(function(e){return{onSetGameData:function(a){return e(Object(y.i)(a))}}}))(S)}}]);
//# sourceMappingURL=11.4366f374.chunk.js.map