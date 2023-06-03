function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg);var value=info.value}catch(error){reject(error);return}if(info.done){resolve(value)}else{Promise.resolve(value).then(_next,_throw)}}function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise(function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(undefined)})}}function _checkPrivateRedeclaration(obj,privateCollection){if(privateCollection.has(obj)){throw new TypeError("Cannot initialize the same private elements twice on an object")}}function _classPrivateMethodGet(receiver,privateSet,fn){if(!privateSet.has(receiver)){throw new TypeError("attempted to get private field on non-instance")}return fn}function _classPrivateMethodInit(obj,privateSet){_checkPrivateRedeclaration(obj,privateSet);privateSet.add(obj)}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};var ownKeys=Object.keys(source);if(typeof Object.getOwnPropertySymbols==="function"){ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable}))}ownKeys.forEach(function(key){_defineProperty(target,key,source[key])})}return target}import{kebabToCamel,permutations,parseDuration,parseBoolean}from"./util.js";var _findRenderableElements=new WeakSet,_bindArgs=new WeakSet,_bindEvents=new WeakSet,_findEventNodes=new WeakSet,_bindDataValues=new WeakSet,_getElementType=new WeakSet;class Controller extends HTMLElement{handleShadow(){this.template=this.querySelector("template");if(this.template){this.content=this.template.content.cloneNode(true);if(this.template.hasAttribute(":use-shadow")){this.debug({msg:"Initialising shadow DOM"});this.attachShadow({mode:"open"}).appendChild(this.content.cloneNode(true));this.root=this.shadowRoot;this.hasShadow=true}else{this.appendChild(this.content.cloneNode(true));this.hasShadow=false}}}connectedCallback(){var _this=this;return _asyncToGenerator(function*(){if(!_this.isConnected)return;_this.handleShadow();_this.bind();if("renderOnInit"in _this.args){_this.renderOnInit=parseBoolean(_this.args.renderOnInit)}else{_this.renderOnInit=true}yield _this.init(_this.args);if(_this.args.autoRender){const interval=parseDuration(_this.args.autoRender);_this.setAutoRender(interval)}if(_this.renderOnInit)_this.render()})()}disconnectedCallback(){this._events.forEach(e=>e.el.removeEventListener(e.eventType,e.event));this._events=[];this.emit("disconnected",{detail:{from:this}})}attributeChangedCallback(name,oldValue,newValue){let handler=name.replace(/^data-/,"");handler=handler.replace(/^aria-/,"");handler=kebabToCamel(handler);handler=`set${handler.charAt(0).toUpperCase()}${handler.slice(1)}`;if(handler in this&& typeof this[handler]==="function"){this[handler](oldValue,newValue)}}emit(eventName,detail={},config={}){this.dispatchEvent(new CustomEvent(eventName,_objectSpread({bubbles:true,cancelable:true,composed:true,detail:detail},config)))}listenFor(target,eventName,callback){target.addEventListener(eventName,e=>callback(e))}bind(){if(!this._internal.bound){_classPrivateMethodGet(this,_bindArgs,bindArgs).call(this)}_classPrivateMethodGet(this,_bindEvents,bindEvents).call(this);_classPrivateMethodGet(this,_bindDataValues,bindDataValues).call(this);this._internal.bound=true}setAutoRender(interval){if(interval===undefined){console.error(`[${this.localName}] Undefined interval passed to setAutoRender`);return}if(this._internal.autoRenderInterval){window.clearInterval(this._internal.autoRenderInterval)}this._internal.autoRenderInterval=window.setInterval(()=>this.render(),interval)}init(_args){return _asyncToGenerator(function*(){})()}render(rootNode=null){var _this=this;return _asyncToGenerator(function*(){if(!rootNode)rootNode=_this;_classPrivateMethodGet(_this,_findRenderableElements,findRenderableElements).call(_this,rootNode).forEach(el=>{let template=el.getAttribute("_template");if(!template){template=el.innerText;el.setAttribute("_template",template)}const evalMode=el.hasAttribute("@render.eval");let replacerRegex=/\{(.*?)\}/g;template.replace(replacerRegex,(replacer,key)=>{if(evalMode){const fn=new Function(`return ${key}`);template=template.replace(replacer,fn.call(_this))}else{let pos=null;key.split(/[.[\]]/).filter(item=>!!item).forEach(part=>{part=part.replace(/["']/g,"");part=part.replace(/\(\)/g,"");if(pos==null&&part==="this"){pos=_this;return}if(pos&&part in pos){pos=pos[part]}else{pos=null;return}});if(pos==null)pos="";if(typeof pos==="function")pos=pos.call(_this);template=template.replace(replacer,pos.toString()||"")}});el.innerHTML=template})})()}belongsToController(el){if(this.hasShadow)return true;if(el.hasAttribute("data-controller"))el=el.parentElement;const closestController=el.closest("[data-controller]");return closestController===this}debug(obj){let shouldLog=false;if(window.__BINDER_DEBUG__===true)shouldLog=true;if(Array.isArray(window.__BINDER_DEBUG__)&&window.__BINDER_DEBUG__.includes(this.localName))shouldLog=true;if(shouldLog){obj.controller=this;console.debug(obj)}}constructor(args){super();_classPrivateMethodInit(this,_findRenderableElements);_classPrivateMethodInit(this,_bindArgs);_classPrivateMethodInit(this,_bindEvents);_classPrivateMethodInit(this,_findEventNodes);_classPrivateMethodInit(this,_bindDataValues);_classPrivateMethodInit(this,_getElementType);this.debug({msg:"Constructing binder element"});this._internal={};this.root=this;this.args=args||{};this._events=[];if(this.innerHTML.trim()==="")this.innerHTML="<self></self>";this.self=this.querySelector("self");this.setAttribute("data-controller",this.localName)}}_defineProperty(Controller,"observedAttributes",[]);function findRenderableElements(rootNode=null){if(!rootNode)rootNode=this;return[...rootNode.querySelectorAll("[\\@render]"),...rootNode.querySelectorAll("[\\@render\\.eval]")].filter(el=>this.belongsToController(el))}function bindArgs(){this.args={};this.getAttributeNames().forEach(attr=>{const value=this.getAttribute(attr);const key=kebabToCamel(attr).replace(":","");this.args[key]=value})}function bindEvents(){this._events.forEach(e=>e.el.removeEventListener(e.eventType,e.event));this._events=[];const bindEvent=(el,eventType,modifier)=>{const value=el.getAttribute(`@${eventType}${modifier}`);const action=value.replace("this.","").replace("()","");const callable=event=>{if(modifier.includes(".prevent"))event.preventDefault();if(modifier.includes(".stop"))event.stopPropagation();if(modifier.includes(".eval")){const fn=new Function(`${value}`);fn.call(this)}else{try{if(action==="render"){this[action].call(this)}else{this[action].call(this,event)}}catch(e){console.error(`Failed to call '${action}' to handle '${event.type}' event on tag '${this.localName}'`,e)}}};el.addEventListener(eventType,callable);this._events.push({el:el,event:callable,eventType:eventType})};for(let node of _classPrivateMethodGet(this,_findEventNodes,findEventNodes).call(this)){if(!this.belongsToController(node))continue;this.debug({msg:"Attaching event listeners",source:node});for(let attr of node.getAttributeNames()){if(!attr.startsWith("@"))continue;let[event,modifiers]=attr.replace("@","").split(".",2);modifiers=modifiers?`.${modifiers}`:"";if(event==="render"||event==="bind")continue;bindEvent(node,event,modifiers)}}}function*findEventNodes(){if(this.hasShadow){const allNodes=this.root.querySelectorAll("*");for(let node of allNodes){if(node.getAttributeNames().filter(attr=>attr.startsWith("@")).length>0){yield node}}}else{const nodesWithEvents=document.evaluate('.//*[@*[starts-with(name(), "@")]]',this.root);let eventNode=nodesWithEvents.iterateNext();while(eventNode){yield eventNode;eventNode=nodesWithEvents.iterateNext()}}}function bindDataValues(){this.data={};const instance1=this;const tagToEvent={"input|text":"keyup",default:"change"};const handlers={"input|checkbox":(instance,varName,e)=>{if(!instance.data[varName])instance.data[varName]=[];if(e.target.checked){instance.data[varName].push(e.target.value)}else{instance.data[varName]=instance.data[varName].filter(item=>item!==e.target.value)}},select:(instance,varName,e)=>{if(e.target.getAttribute("multiple")!==null){instance.data[varName]=Array.from(e.target.selectedOptions).map(item=>item.value)}else{instance.data[varName]=e.target.value}},default:(instance,varName,e)=>instance.data[varName]=e.target.value};const bindData=(el,modifier)=>{const elType=_classPrivateMethodGet(this,_getElementType,getElementType).call(this,el);const eventType=tagToEvent[elType]||tagToEvent.default;el.addEventListener(eventType,e=>{const varName=el.getAttribute(`@bind${modifier}`).replace("this.data.","").replace("this.","");const handler=handlers[elType]||handlers.default;handler(instance1,varName,e);if(modifier.includes(".render"))instance1.render()})};const modifiers=["",...permutations([".render"],true)];modifiers.forEach(modifier=>{if(this.hasAttribute(`@bind${modifier}`)){bindData(this.root,modifier)}const escapedModifier=modifier.replace(/\./g,"\\.");this.root.querySelectorAll(`[\\@bind${escapedModifier}]`).forEach(el=>{if(!this.belongsToController(el))return;bindData(el,modifier)})})}function getElementType(el){if(el.tagName.toLowerCase()==="input"){return[el.tagName,el.type].map(item=>item.toLowerCase()).join("|")}return el.tagName.toLowerCase()}export{Controller}
//# sourceMappingURL=controller.js.map