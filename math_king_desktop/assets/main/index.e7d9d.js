window.__require=function t(e,i,n){function o(c,s){if(!i[c]){if(!e[c]){var a=c.split("/");if(a=a[a.length-1],!e[a]){var u="function"==typeof __require&&__require;if(!s&&u)return u(a,!0);if(r)return r(a,!0);throw new Error("Cannot find module '"+c+"'")}c=a}var h=i[c]={exports:{}};e[c][0].call(h.exports,function(t){return o(e[c][1][t]||t)},h,h.exports,t,e,i,n)}return i[c].exports}for(var r="function"==typeof __require&&__require,c=0;c<n.length;c++)o(n[c]);return o}({1:[function(t,e){function i(t,e){var i=[],n=[];return null==e&&(e=function(t,e){return i[0]===e?"[Circular ~]":"[Circular ~."+n.slice(0,i.indexOf(e)).join(".")+"]"}),function(o,r){if(i.length>0){var c=i.indexOf(this);~c?i.splice(c+1):i.push(this),~c?n.splice(c,1/0,o):n.push(o),~i.indexOf(r)&&(r=e.call(this,o,r))}else i.push(r);return null==t?r:t.call(this,o,r)}}(e.exports=function(t,e,n,o){return JSON.stringify(t,i(e,o),n)}).getSerialize=i},{}],2:[function(t,e){"use strict";var i=t("json-stringify-safe"),n=function(){var t=4022871197;return function(e){if(e){e=e.toString();for(var i=0;i<e.length;i++){var n=.02519603282416938*(t+=e.charCodeAt(i));n-=t=n>>>0,t=(n*=t)>>>0,t+=4294967296*(n-=t)}return 2.3283064365386963e-10*(t>>>0)}t=4022871197}},o=function(t){return function(){var e,o,r=48,c=1,s=r,a=new Array(r),u=0,h=new n;for(e=0;e<r;e++)a[e]=h(Math.random());var l=function(){++s>=r&&(s=0);var t=1768863*a[s]+2.3283064365386963e-10*c;return a[s]=t-(c=0|t)},d=function(t){return Math.floor(t*(l()+11102230246251565e-32*(2097152*l()|0)))};d.string=function(t){var e,i="";for(e=0;e<t;e++)i+=String.fromCharCode(33+d(94));return i};var p=function(){var t=Array.prototype.slice.call(arguments);for(e=0;e<t.length;e++)for(o=0;o<r;o++)a[o]-=h(t[e]),a[o]<0&&(a[o]+=1)};return d.cleanString=function(t){return(t=(t=t.replace(/(^\s*)|(\s*$)/gi,"")).replace(/[\x00-\x1F]/gi,"")).replace(/\n /,"\n")},d.hashString=function(t){for(t=d.cleanString(t),h(t),e=0;e<t.length;e++)for(u=t.charCodeAt(e),o=0;o<r;o++)a[o]-=h(u),a[o]<0&&(a[o]+=1)},d.seed=function(t){null==t&&(t=Math.random()),"string"!=typeof t&&(t=i(t,function(t,e){return"function"==typeof e?e.toString():e})),d.initState(),d.hashString(t)},d.addEntropy=function(){var t=[];for(e=0;e<arguments.length;e++)t.push(arguments[e]);p(u+++(new Date).getTime()+t.join("")+Math.random())},d.initState=function(){for(h(),e=0;e<r;e++)a[e]=h(" ");c=1,s=r},d.done=function(){h=null},void 0!==t&&d.seed(t),d.range=function(t){return d(t)},d.random=function(){return d(Number.MAX_VALUE-1)/Number.MAX_VALUE},d.floatBetween=function(t,e){return d.random()*(e-t)+t},d.intBetween=function(t,e){return Math.floor(d.random()*(e-t+1))+t},d}()};o.create=function(t){return new o(t)},e.exports=o},{"json-stringify-safe":1}],IngameScene:[function(t,e){"use strict";cc._RF.push(e,"41ca6i+HA9Ooqx0Sr36WHSO","IngameScene");var i=t("RiddleFrameController"),n=t("ResultPopup"),o=t("./component/ScoreLabel"),r=t("./constants"),c=t("./lib/helpers"),s=t("./lib/riddleGenerate");cc.Class({extends:cc.Component,properties:{riddleFrameCtor:i,resultPopup:n,notificaitonText:cc.Label,resultText:cc.Label,timerProgressBar:cc.ProgressBar,timerText:cc.Label,questtionText:cc.Label,scoreText:o,chainText:cc.Label,highscoreText:cc.Label,timerTickSound:cc.AudioClip,correctSound:cc.AudioClip,wrongSound:cc.AudioClip,gameOverSound:cc.AudioClip,levelUpSound:cc.AudioClip},onLoad:function(){this.rand=t("random-seed").create(),this.rand.initState(),this.rand.seed(Math.random()),this.riddleFrameCtor.node.on("answer",this.onResult,this),this.resultPopup.node.on("restart",this.onRestart,this)},start:function(){this.resetAndStartGame(),this.resultPopup.node.active=!0,this.resultPopup.hide(!0)},update:function(t){var e=this;if(this.isPlaying)if(this.timer-=1e3*t,this.timerText.string=c.formatTimer(this.timer+""),this.timerProgressBar.progress=this.timer/r.ROUND_DURATION,this.chainTimer-=1e3*t,this.timerProgressBar.barSprite.node.color=new cc.Color(255,this.timer/r.ROUND_DURATION*255,this.timer/r.ROUND_DURATION*255,255),this.timer<0)this.isPlaying=!1,this.riddleFrameCtor.locked=!0,cc.audioEngine.play(this.gameOverSound,!1,1),this.animateEndGame(function(){e.resultPopup.show(e.score)});else if(this.timer<1e4){var i=this.timer/1e3;i+t>Math.ceil(i)&&(cc.audioEngine.play(this.timerTickSound,!1,.5),cc.tween(this.timerText.node).to(.1,{color:(new cc.Color).fromHEX("#d35400")}).to(.1,{color:(new cc.Color).fromHEX("#ffffff")}).start(),this.timer<5e3&&this.scheduleOnce(function(){cc.audioEngine.play(e.timerTickSound,!1,.5)},.5))}},resetAndStartGame:function(){var t=this;this.reset(),this.animateGoText(function(){t.notificaitonText.node.active=!1,t.riddleFrameCtor.node.active=!0,t.startNewRiddle()})},reset:function(){this.isPlaying=!1,this.questionNumber=0,this.level=0,this.chain=0,this.timer=r.ROUND_DURATION,this.chainTimer=0,this.score=0,this.displayingScore=0,this.highscoreText.node.active=!1,this.chainText.node.active=!1,this.resultText.node.active=!1,this.riddleFrameCtor.node.active=!1,this.notificaitonText.node.active=!0,this.notificaitonText.node.setScale(0),this.timerProgressBar.progress=1,this.timerProgressBar.barSprite.node.color=(new cc.Color).fromHEX("#ffffff"),this.timerText.string=c.formatTimer(this.timer+""),this.questtionText.string="Level "+(this.level+1)+"-"+(this.questionNumber+1),this.scoreText.setScore(this.score,!0)},nextRiddle:function(){this.questionNumber++,this.questionNumber>=r.DIFFICULTY_STEP?(this.questionNumber=0,this.level++,this.animateLevelUp(this.startNewRiddle.bind(this))):this.startNewRiddle(),this.animateQuestionInfo()},startNewRiddle:function(){var t=s(this.level+1,this.rand);this.riddleFrameCtor.optainNewRiddle(t),this.isPlaying=!0,this.chainTimer=r.CHAIN_DURATION},animateGoText:function(t){var e=this;cc.tween(this.notificaitonText.node).delay(.4).call(function(){e.notificaitonText.node.setScale(.3),e.notificaitonText.string="READY",cc.audioEngine.play(e.timerTickSound,!1,1)}).to(.35,{scale:{value:1,easing:"sineOut"}}).delay(.2).to(.35,{scale:{value:.35,easing:"sineIn"}}).call(function(){e.notificaitonText.node.setScale(.4),e.notificaitonText.string="GO!",cc.audioEngine.play(e.gameOverSound,!1,1)}).to(.5,{scale:{value:1.3,easing:"sineOut"}}).to(.3,{scale:{value:1.2,easing:"sineIn"}}).call(function(){t()}).start()},animateEndGame:function(t){this.riddleFrameCtor.node.active=!1,this.notificaitonText.node.active=!0,this.notificaitonText.string="TIME UP!",this.notificaitonText.node.setScale(.3),this.notificaitonText.node.color=(new cc.Color).fromHEX("#d35400"),cc.tween(this.notificaitonText.node).to(.3,{scale:{value:1,easing:"sineOut"}}).delay(.4).call(function(){t()}).start()},animateLevelUp:function(t){var e=this;cc.audioEngine.play(this.levelUpSound,!1,1),this.riddleFrameCtor.node.active=!1,this.notificaitonText.node.active=!0,this.notificaitonText.string="LEVEL UP!",this.notificaitonText.node.setScale(.3),cc.tween(this.notificaitonText.node).to(.3,{scale:{value:1,easing:"sineOut"}}).delay(.3).to(.15,{scale:{value:0,easing:"sineOut"}}).call(function(){e.riddleFrameCtor.node.active=!0,e.notificaitonText.node.active=!1,t()}).start()},animateQuestionInfo:function(){this.questtionText.string="Level "+(this.level+1)+"-"+(this.questionNumber+1),cc.tween(this.questtionText.node).to(.1,{scale:1.2,color:(new cc.Color).fromHEX("#16a085")}).delay(.05).to(.1,{scale:1,color:(new cc.Color).fromHEX("#ECF0F1")}).start()},animateChainText:function(){var t=this;this.chainText.node.active=!0,this.chainText.node.x=this.scoreText.node.width/2-10,this.chainText.node.setScale(0),this.chainText.string="Chain x"+this.chain,cc.tween(this.chainText.node).delay(.2).to(.2,{scale:{value:1,easing:"bounceOut"}}).delay(.3).to(.2,{scale:0}).call(function(){t.chainText.node.active=!1}).start()},animateResultText:function(t){var e=this;this.resultText.node.y=-30,this.resultText.node.active=!0,this.resultText.node.opacity=0,cc.tween(this.resultText.node).to(.2,{position:cc.v2(0,0),opacity:255}).delay(.4).to(.2,{position:cc.v2(0,-30),opacity:0}).call(function(){e.resultText.node.active=!1,e.riddleFrameCtor.locked=!1,t()}).start()},onResult:function(t){var e=this;if(this.isPlaying){this.isPlaying=!1,this.riddleFrameCtor.locked=!0;var i="correct"===t;if(i){this.chainTimer>0?this.chain=Math.min(++this.chain,r.MAX_CHAIN):this.chain=0;var n=r.SCORING*Math.max(this.chain,1);this.score+=n,cc.tween(this.scoreText.node).delay(.2).to(.1,{color:(new cc.Color).fromHEX("#ffffff")}).call(function(){e.scoreText.setScore(e.score);var t=cc.sys.localStorage.getItem("highscore")||0;e.score>t&&(e.highscoreText.node.active=!0,cc.tween(e.highscoreText.node).to(.1,{scale:1.1,color:(new cc.Color).fromHEX("#F1C40F")}).to(.1,{scale:1,color:(new cc.Color).fromHEX("#f39c12")}).start())}).to(.1,{color:(new cc.Color).fromHEX("#ffffff")}).to(.1,{color:(new cc.Color).fromHEX("#e67e22")}).to(.1,{color:(new cc.Color).fromHEX("#ffffff")}).to(.1,{color:(new cc.Color).fromHEX("#e67e22")}).to(.1,{color:(new cc.Color).fromHEX("#ffffff")}).start(),this.chain>1&&this.animateChainText()}this.resultText.string=i?"CORRECT":"INCORRECT",this.resultText.node.color=(new cc.Color).fromHEX(i?"#16a085":"#d35400"),cc.audioEngine.play(i?this.correctSound:this.wrongSound,!1,1),this.animateResultText(function(){i?e.nextRiddle():(e.riddleFrameCtor.clearInput(),e.chainTimer=-1,e.isPlaying=!0)})}},onRestart:function(){this.resultPopup.hide(),this.resetAndStartGame()}}),cc._RF.pop()},{"./component/ScoreLabel":"ScoreLabel","./constants":"constants","./lib/helpers":"helpers","./lib/riddleGenerate":"riddleGenerate",ResultPopup:"ResultPopup",RiddleFrameController:"RiddleFrameController","random-seed":2}],InputFrameController:[function(t,e){"use strict";cc._RF.push(e,"34795oJcMBF0ZeRU5Ut18Zv","InputFrameController"),cc.Class({extends:cc.Component,properties:{button_0:cc.Button,button_1:cc.Button,button_2:cc.Button,button_3:cc.Button,button_4:cc.Button,button_5:cc.Button,button_6:cc.Button,button_7:cc.Button,button_8:cc.Button,button_9:cc.Button,button_Plus:cc.Button,button_Minus:cc.Button,button_Multiple:cc.Button,button_Divide:cc.Button,button_C:cc.Button,button_Enter:cc.Button},onLoad:function(){this.isKeyboardShifed=!1,this.button_0.node.on("click",this.onButtonClicked,this),this.button_1.node.on("click",this.onButtonClicked,this),this.button_2.node.on("click",this.onButtonClicked,this),this.button_3.node.on("click",this.onButtonClicked,this),this.button_4.node.on("click",this.onButtonClicked,this),this.button_5.node.on("click",this.onButtonClicked,this),this.button_6.node.on("click",this.onButtonClicked,this),this.button_7.node.on("click",this.onButtonClicked,this),this.button_8.node.on("click",this.onButtonClicked,this),this.button_9.node.on("click",this.onButtonClicked,this),this.button_Plus.node.on("click",this.onButtonClicked,this),this.button_Minus.node.on("click",this.onButtonClicked,this),this.button_Multiple.node.on("click",this.onButtonClicked,this),this.button_Divide.node.on("click",this.onButtonClicked,this),this.button_C.node.on("click",this.onButtonClicked,this),this.button_Enter.node.on("click",this.onButtonClicked,this),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyPressed,this)},start:function(){},onKeyDown:function(t){t.keyCode===cc.macro.KEY.shift&&(this.isKeyboardShifed=!0)},onKeyPressed:function(t){if(t.keyCode!==cc.macro.KEY.shift)switch(t.keyCode){case cc.macro.KEY[0]:case cc.macro.KEY.num0:this.node.emit("input",0);break;case cc.macro.KEY[1]:case cc.macro.KEY.num1:this.node.emit("input",1);break;case cc.macro.KEY[2]:case cc.macro.KEY.num2:this.node.emit("input",2);break;case cc.macro.KEY[3]:case cc.macro.KEY.num3:this.node.emit("input",3);break;case cc.macro.KEY[4]:case cc.macro.KEY.num4:this.node.emit("input",4);break;case cc.macro.KEY[5]:case cc.macro.KEY.num5:this.node.emit("input",5);break;case cc.macro.KEY[6]:case cc.macro.KEY.num6:this.node.emit("input",6);break;case cc.macro.KEY[7]:case cc.macro.KEY.num7:this.node.emit("input",7);break;case cc.macro.KEY[8]:if(this.isKeyboardShifed){this.node.emit("input","*");break}case cc.macro.KEY.num8:this.node.emit("input",8);break;case cc.macro.KEY[9]:case cc.macro.KEY.num9:this.node.emit("input",9);break;case cc.macro.KEY["+"]:this.node.emit("input","+");break;case cc.macro.KEY.dash:case cc.macro.KEY["-"]:this.node.emit("input","-");break;case cc.macro.KEY["*"]:case cc.macro.KEY.x:this.node.emit("input","*");break;case cc.macro.KEY.forwardslash:case cc.macro.KEY["/"]:this.node.emit("input","/");break;case cc.macro.KEY.numdel:case cc.macro.KEY.Delete:case cc.macro.KEY.backspace:this.node.emit("input","C");break;case cc.macro.KEY.equal:if(this.isKeyboardShifed){this.node.emit("input","+");break}case cc.macro.KEY.enter:case cc.macro.KEY.space:case cc.macro.KEY["="]:this.node.emit("input","Enter")}else this.isKeyboardShifed=!1},onButtonClicked:function(t){switch(t){case this.button_0:this.node.emit("input",0);break;case this.button_1:this.node.emit("input",1);break;case this.button_2:this.node.emit("input",2);break;case this.button_3:this.node.emit("input",3);break;case this.button_4:this.node.emit("input",4);break;case this.button_5:this.node.emit("input",5);break;case this.button_6:this.node.emit("input",6);break;case this.button_7:this.node.emit("input",7);break;case this.button_8:this.node.emit("input",8);break;case this.button_9:this.node.emit("input",9);break;case this.button_Plus:this.node.emit("input","+");break;case this.button_Minus:this.node.emit("input","-");break;case this.button_Multiple:this.node.emit("input","*");break;case this.button_Divide:this.node.emit("input","/");break;case this.button_C:this.node.emit("input","C");break;case this.button_Enter:this.node.emit("input","Enter");break;default:cc.error("undefined input button")}}}),cc._RF.pop()},{}],LandingScene:[function(t,e){"use strict";cc._RF.push(e,"f81c9Et825BE4flcrHLshzh","LandingScene"),cc.Class({extends:cc.Component,properties:{highscoreText:cc.Label,clickSound:cc.AudioClip},start:function(){var t=cc.sys.localStorage.getItem("highscore")||0;this.highscoreText.string="-HIGHSCORE: "+t+"-",this.highscoreText.node.active=t>0},onPlayButtonClicked:function(){cc.director.loadScene("ingame"),cc.audioEngine.play(this.clickSound,!1,1)}}),cc._RF.pop()},{}],ResultPopup:[function(t,e){"use strict";cc._RF.push(e,"e8a928f/TVLLa/SAULl17y6","ResultPopup"),cc.Class({extends:cc.Component,properties:{overlay:cc.Node,frame:cc.Node,scoreText:cc.Label,highScoreText:cc.Label,clickSound:cc.AudioClip},start:function(){},show:function(t){this.overlay.active=!0,this.frame.active=!0,this.scoreText.string="You scored: "+t;var e=t>(cc.sys.localStorage.getItem("highscore")||0);e&&cc.sys.localStorage.setItem("highscore",t),this.highScoreText.node.active=e,this.frame.setScale(.3),cc.tween(this.frame).to(.4,{scale:{value:1,easing:"sineInOut"}}).start()},hide:function(t){var e=this;this.overlay.active=!1,t?(this.frame.active=!1,this.frame.setScale(0)):cc.tween(this.frame).to(.4,{scale:{value:0,easing:"sineInOut"}}).call(function(){e.frame.active=!1}).start()},onBackToMenuClicked:function(){cc.audioEngine.play(this.clickSound,!1,1),cc.director.loadScene("landing")},onRestartClicked:function(){cc.audioEngine.play(this.clickSound,!1,1),this.node.emit("restart")}}),cc._RF.pop()},{}],RiddleFrameController:[function(t,e){"use strict";cc._RF.push(e,"d5071e/oO5PXr2IjDcs85iC","RiddleFrameController");var i=t("InputFrameController"),n=t("./lib/helpers");cc.Class({extends:cc.Component,properties:{inputCtor:i,leftRiddleText:cc.Label,rightRiddleText:cc.Label,inputText:cc.Label,inputFrame:cc.Sprite,inputSound:cc.AudioClip},onLoad:function(){this.locked=!0,this.inputCtor.node.on("input",this.onInput,this)},start:function(){},onInput:function(t){this.locked||this.currentRiddle&&(isNaN(t)||"operator"===this.currentRiddle.riddlePart?"operator"===this.currentRiddle.riddlePart&&n.isInputOperator(t)?(this.input=t,this.inputText.string=n.getInputCharacter(t),cc.audioEngine.play(this.inputSound,!1,1)):"C"===t?(this.clearInput(),cc.audioEngine.play(this.inputSound,!1,1)):"Enter"===t&&this.node.emit("answer",n.checkAnswer(this.currentRiddle,this.input)?"correct":"incorrect"):(null===this.input&&(this.input=0),this.input<=99&&(this.input=10*this.input+t,this.inputText.string=this.input>0?this.input.toString():"",cc.audioEngine.play(this.inputSound,!1,1))))},clearInput:function(){this.input=null,this.inputText.string=""},optainNewRiddle:function(t){t=t||{},this.currentRiddle={},this.currentRiddle.operand1=t.operand1||0,this.currentRiddle.operand2=t.operand2||0,this.currentRiddle.result=t.result||0,this.currentRiddle.operator=t.operator||"+",this.currentRiddle.riddlePart=t.riddlePart||"operator",this.clearInput();var e="operator"===this.currentRiddle.riddlePart?80:165;switch(this.currentRiddle.riddlePart){case"operand1":this.leftRiddleText.string="",this.rightRiddleText.string=n.getInputCharacter(this.currentRiddle.operator)+" "+this.currentRiddle.operand2+" = "+this.currentRiddle.result;break;case"operand2":this.leftRiddleText.string=this.currentRiddle.operand1+" "+n.getInputCharacter(this.currentRiddle.operator),this.rightRiddleText.string="= "+this.currentRiddle.result;break;case"result":this.leftRiddleText.string=this.currentRiddle.operand1+" "+n.getInputCharacter(this.currentRiddle.operator)+" "+this.currentRiddle.operand2+" =",this.rightRiddleText.string="";break;case"operator":this.leftRiddleText.string=this.currentRiddle.operand1,this.rightRiddleText.string=this.currentRiddle.operand2+" = "+this.currentRiddle.result}this.inputText.string="",this.leftRiddleText._forceUpdateRenderData(),this.rightRiddleText._forceUpdateRenderData(),this.inputFrame.node.width=e;var i=this.leftRiddleText.node.width+this.rightRiddleText.node.width+this.inputFrame.node.width+16;this.leftRiddleText.node.x=(this.leftRiddleText.node.width-i)/2,this.inputFrame.node.x=this.leftRiddleText.node.x+(this.leftRiddleText.node.width+this.inputFrame.node.width)/2+8,this.rightRiddleText.node.x=this.inputFrame.node.x+(this.inputFrame.node.width+this.rightRiddleText.node.width)/2+16,this.inputText.node.x=this.inputFrame.node.x,this.locked=!1}}),cc._RF.pop()},{"./lib/helpers":"helpers",InputFrameController:"InputFrameController"}],ScoreLabel:[function(t,e){"use strict";cc._RF.push(e,"5084cB+tM5CloykXwkNTDDl","ScoreLabel"),cc.Class({extends:cc.Component,properties:{},start:function(){this.label=this.getComponent(cc.Label),this.displayingScore=0,this.lerpingScore=0,this.score=0,this.label.string="- SCORE: "+this.displayingScore+" -",this.lerpingTime=0,this.lerpingValue=0},setScore:function(t,e){void 0===e&&(e=!1),this.score=t,e?(this.lerpingTime=0,this.lerpingValue=0,this.lerpingScore=this.score):(this.lerpingTime=20,this.lerpingValue=(this.score-this.lerpingScore)/20)},update:function(){this.lerpingTime<=0?(this.lerpingValue=0,this.lerpingScore=this.score):this.lerpingTime>0&&(this.lerpingScore+=this.lerpingValue,this.lerpingTime--),this.displayingScore!=this.lerpingScore&&(this.displayingScore=this.lerpingScore,this.label.string="- SCORE: "+~~this.displayingScore+" -")}}),cc._RF.pop()},{}],constants:[function(t,e){"use strict";cc._RF.push(e,"ae788ZEYsVNlbkaEu3AUFYR","constants"),e.exports={ROUND_DURATION:11e3,MULTIPLE_DIVIDE_INCLUDED_DIFFICULTY:3,CHAIN_DURATION:3e3,DIFFICULTY_STEP:5,SCORING:7,MAX_CHAIN:5},cc._RF.pop()},{}],helpers:[function(t,e){"use strict";cc._RF.push(e,"afb7asBM+VM7IeOCTmPqp3J","helpers"),e.exports.isInputOperator=function(t){return"+"===t||"-"===t||"*"===t||"/"===t},e.exports.getInputCharacter=function(t){return"/"===t?"\xf7":"*"===t?"x":t},e.exports.checkAnswer=function(t,e){switch(t.riddlePart){case"operand1":return parseInt(e)===t.operand1;case"operand2":return parseInt(e)===t.operand2;case"result":return parseInt(e)===t.result;case"operator":if(e===t.operator)return!0;switch(e){case"+":return t.operand1+t.operand2===t.result;case"-":return t.operand1-t.operand2===t.result;case"*":return t.operand1*t.operand2===t.result;case"/":return t.operand1/t.operand2===t.result;default:return!1}}return!1},e.exports.formatDurationDHMSObject=function(t){t=Math.max(0,t);var e=Math.ceil(t/1e3),i=Math.floor(e/60),n=Math.floor(i/60),o=Math.floor(n/24);return{seconds:e%=60,minutes:i%=60,hours:n%=24,days:o}},e.exports.formatTimer=function(t){var e=this.formatDurationDHMSObject(t),i=e.seconds,n=e.minutes,o=e.hours,r=e.days,c=n>9||0===o?n:"0"+n,s=i>9?i:"0"+i;return r>=1?r+":"+o+":"+n+":"+i:o>=1?o+":"+c+":"+s:c+":"+s},cc._RF.pop()},{}],riddleGenerate:[function(t,e){"use strict";cc._RF.push(e,"5373bUE27RLNKrfYsZy6MUA","riddleGenerate");var i=t("../constants");e.exports=function(t,e){var n=e.range(t>=i.MULTIPLE_DIVIDE_INCLUDED_DIFFICULTY?4:2),o=e(4),r=3*t,c=10*t,s=0,a=0,u=0,h="";0===n?(h="+",u=(s=e.intBetween(r,c))-(a=e.intBetween(1,s-1))):1===n?(h="-",s=(a=e.intBetween(r,c))-(u=e.intBetween(1,a-1))):2===n?(h="*",s=e.intBetween(r,c),s=(a=e.intBetween(2,s/2-2))*(u=Math.round(s/a))):3===n&&(h="/",a=e.intBetween(r,c),u=e.intBetween(2,a/2-2),a=(s=Math.round(a/u))*u);var l="result";switch(o){case 0:l="result";break;case 1:l="operand1";break;case 2:l="operand2";break;case 3:l="operator"}return{result:s,operand1:a,operand2:u,operator:h,riddlePart:l}},cc._RF.pop()},{"../constants":"constants"}]},{},["IngameScene","InputFrameController","LandingScene","ResultPopup","RiddleFrameController","ScoreLabel","constants","helpers","riddleGenerate"]);
//# sourceMappingURL=index.js.map
