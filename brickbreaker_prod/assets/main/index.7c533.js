window.__require=function e(t,i,c){function o(a,s){if(!i[a]){if(!t[a]){var r=a.split("/");if(r=r[r.length-1],!t[r]){var l="function"==typeof __require&&__require;if(!s&&l)return l(r,!0);if(n)return n(r,!0);throw new Error("Cannot find module '"+a+"'")}a=r}var d=i[a]={exports:{}};t[a][0].call(d.exports,function(e){return o(t[a][1][e]||e)},d,d.exports,e,t,i,c)}return i[a].exports}for(var n="function"==typeof __require&&__require,a=0;a<c.length;a++)o(c[a]);return o}({1:[function(e,t){var i="en",c="jp",o={jp:{play:"\u30b9\u30bf\u30fc\u30c8"},en:{play:"Play Now!"}},n=500;function a(){this._isInitialised=!1,this._splashAdShown=!1}function s(e){for(var t in e=e||{})void 0===e[t]&&delete e[t];return e}function r(e,t){console.error(e),(t=t||{}).noBreak?t.noBreak():(t.beforeBreak&&t.beforeBreak(),t.afterBreak&&t.afterBreak())}function l(){if(!navigator.language)return c;let e=navigator.language.toLowerCase().substr(0,2);return o[e]?e:i}a.prototype.initialize=function(e){if(this._isInitialised)console.warn("h5ad: already initialized");else{if(this._isInitialised=!0,e&&void 0!==e.adBreakTimeout&&(n=e.adBreakTimeout),!window.adsbygoogle){var t=document.createElement("script");t.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",t.setAttribute("data-ad-client","ca-pub-123456789"),t.setAttribute("data-adbreak-test","on"),t.async=!0,document.head.appendChild(t),window.adsbygoogle=window.adsbygoogle||[],adBreak=window.adBreak=function(e){console.log("adBreak:",e),window.adsbygoogle.push(e)},adConfig=window.adConfig=function(e){console.log("adConfig:",e),window.adsbygoogle.push(e)}}adConfig({preloadAdBreaks:"on",sound:"on"})}},a.prototype.onStart=function(e){if(e=e||{},this._isInitialised||this.initialize({adBreakTimeout:e.adBreakTimeout}),this._splashAdShown)console.warn("h5ad: onStart has already been called");else{this._splashAdShown=!0;var t="";t+=".splahContainer {",t+="    background-color: black;",t+="    position: absolute;",t+="    width: 100%;",t+="    height: 100%;",t+="    text-align: left;",t+="}",t+=".splahContainer .gameIcon {",t+="    position: relative;",t+="    width: 100px;",t+="    height: 100px;",t+="    background-size: 100%;",t+="    transform: translate(-50%, -100%);",t+="    left: 50%;",t+="    top: 31%;",t+="    border-radius: 10px;",t+="    border: 2px white solid;",t+="    border-radius: min(2vh,2vw);",t+="    border: min(0.7vw, 0.7vh) white solid;",t+="    width: min(30vw, 20vh);",t+="    height: min(30vw, 20vh);",t+="}",t+=".splahContainer .startButton {",t+="    background-color: rgb(255, 193, 7);",t+="    padding: 20px 30px;",t+="    border-radius: 13px;",t+="    transform: translate(-50%, 100%);",t+="    left: 50%;",t+="    top: 40%;",t+="    border: 5px solid white;",t+="    position: relative;",t+="    cursor: pointer;",t+="    font-size: 26px;",t+="    font-family: arial, verdana;",t+="    color: white;",t+="    text-align: center;",t+="    transition: all 0.1s;",t+="    width: min(50vw,27vh);",t+="    padding: min(3vw,3vh);",t+="    font-size: min(4vh,9vw);",t+="    border-radius: min(2vh,2vw);",t+="    border: min(1vw, 1vh) white solid;",t+="}",t+=".splahContainer .startButton:hover {",t+="    transform: translate(-50%, 100%) scale(1.1);",t+="    background-color: rgb(255 217 104);",t+="}";var i=document.createElement("style");i.styleSheet?i.styleSheet.cssText=t:i.appendChild(document.createTextNode(t)),document.getElementsByTagName("head")[0].appendChild(i);var c=document.createElement("div");e.color&&(c.style.backgroundColor=e.color),c.className="splahContainer";var a=document.createElement("div");a.textContent=o[l()].play,a.className="startButton",c.appendChild(a);var d=document.createElement("div");d.className="gameIcon",e.icon&&(d.style.backgroundImage="url("+e.icon+")"),c.appendChild(d),document.body.appendChild(c),a.onclick=function(){afterBreakCallbackCalled=!1;let t=setTimeout(function(){afterBreakCallbackCalled||(afterBreakCallbackCalled=!0,e.afterBreak&&e.afterBreak())},n);try{adBreak(s({type:"start",name:e.name||"splash_screen",beforeBreak:function(){clearTimeout(t)},afterBreak:function(){afterBreakCallbackCalled||(afterBreakCallbackCalled=!0,e.afterBreak&&e.afterBreak())}}))}catch(i){r(i,e)}setTimeout(function(){document.body.removeChild(c)},200)}}},a.prototype.onNext=function(e){(e=e||{}).type="next",this.adBreak(e)},a.prototype.onBrowse=function(e){(e=e||{}).type="browse",this.adBreak(e)},a.prototype.onPause=function(e){(e=e||{}).type="pause",this.adBreak(e)},a.prototype.adBreak=function(e){if("next"!==(e=e||{}).type&&"browse"!==e.type&&"pause"!==e.type)return console.error("H5ad: unknown type",e.type);let t=setTimeout(function(){e.noBreak&&e.noBreak()},n);try{adBreak(s({type:e.type,name:e.name||e.type,beforeBreak:function(){clearTimeout(t),e.beforeBreak&&e.beforeBreak()},afterBreak:function(){e.afterBreak&&e.afterBreak()}}))}catch(i){r(i,e)}},a.prototype.onMute=function(){adConfig({sound:"off"})},a.prototype.onUnmute=function(){adConfig({sound:"on"})},t.exports=new a},{}],Ball:[function(e,t){"use strict";cc._RF.push(t,"9b280YbFuZJv4QPGPL8e8iv","Ball"),cc.Class({extends:cc.Component,properties:{rigidbody:cc.RigidBody},init:function(e,t){this._isReady=!0,this.gameCtl=e,this.node.position=cc.v2(300,50+t),this.rigidbody.linearVelocity=cc.v2(0,0),this.scaleFactor=Math.min(cc.winSize.width/600,1),this.speed=400*this.scaleFactor},onLoad:function(){this.node.parent.on("touchmove",this.onTouchMove,this),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this)},onKeyDown:function(e){switch(e.keyCode){case cc.macro.KEY.back:cc.director.end();break;default:this._isReady&&(this._isReady=!1,this.rigidbody.linearVelocity=cc.v2(0,1).mul(this.speed))}},onBeginContact:function(e,t,i){if(this.gameCtl)switch(i.tag){case 1:this.gameCtl.onBallContactBrick(t.node,i.node);break;case 2:this.gameCtl.onBallContactGround(t.node,i.node);break;case 3:var c=this.node.parent.convertToWorldSpaceAR(i.node.position),o=e.getWorldManifold().points[0];c.y-=40,this._ballDirectionn=o.sub(c).normalize(),this.gameCtl.onBallContactPaddle(t.node,i.node);break;case 4:this.gameCtl.onBallContactWall(t.node,i.node)}},onEndContact:function(e,t,i){if(this.gameCtl)switch(i.tag){case 3:this.rigidbody.linearVelocity=this._ballDirectionn.mul(this.speed);break;case 4:var c=this.rigidbody.linearVelocity.normalize();if(Math.abs(c.y)<.15){var o=cc.v2(this.rigidbody.linearVelocity.x,.25*this.speed*(c.y>=0?1:-1));this.rigidbody.linearVelocity=o}}},onTouchMove:function(){this._isReady&&(this._isReady=!1,this.rigidbody.linearVelocity=cc.v2(0,1).mul(this.speed))}}),cc._RF.pop()},{}],BrickLayout:[function(e,t){"use strict";cc._RF.push(t,"62398FSMJtHJ55jmSoqf4WF","BrickLayout");var i=e("./BrickView");cc.Class({extends:cc.Component,properties:{padding:0,spacing:0,cols:0,brickPrefab:cc.Prefab,bricksNumber:50},init:function(e){this.node.removeAllChildren(),this.bricksNumber=e.column*e.row,this.brickMap=e.brickMap,this.cols=e.column;for(var t=0,c=0;c<this.bricksNumber;c++){var o=this.brickMap[t],n=c%this.cols,a=o[n],s=cc.instantiate(this.brickPrefab);s.getComponent(i).setBrickType(a),s.parent=this.node,s.x=this.padding+c%this.cols*(s.width+this.spacing)+s.width/2,s.y=-this.padding-Math.floor(c/this.cols)*(s.height+this.spacing)-s.height/2,n>=e.column-1&&(t+=1)}}}),cc._RF.pop()},{"./BrickView":"BrickView"}],BrickModel:[function(e,t){"use strict";cc._RF.push(t,"9d87e3ZgIhAN5ntEWz/8tei","BrickModel"),cc.Class({extends:cc.Component,properties:{},start:function(){}}),cc._RF.pop()},{}],BrickView:[function(e,t){"use strict";cc._RF.push(t,"446b9MwGVhLTYvIS/KH+BcI","BrickView"),cc.Class({extends:cc.Component,properties:{brickNode:cc.Node,brickSprite:cc.Sprite,brickTextures:[cc.SpriteFrame],brickType0Textures:[cc.SpriteFrame],brickType1Textures:[cc.SpriteFrame],brickType2Textures:[cc.SpriteFrame],brickType3Textures:[cc.SpriteFrame],collider:cc.PhysicsBoxCollider,hp:0,score:0},setBrickType:function(e){this._type=e,0===e?(this.brickSprite.spriteFrame=null,this.collider.node.active=!1):(this.brickSprite.spriteFrame=this.brickTextures[e],this.collider.node.active=!0,this.hp=e,this.score=2*e+10)},hitBall:function(){if(this.hp-=1,this.hp>0){var e;switch(this._type){case 0:e=this.brickType0Textures;break;case 1:e=this.brickType1Textures;break;case 2:e=this.brickType2Textures;break;case 3:e=this.brickType3Textures;break;default:e=this.brickType0Textures}var t=this.hp>this._type/2?1:0;this.brickSprite.spriteFrame=e[t],this.animateHitBrick()}else this.animateBreakBrick()},animateBreakBrick:function(){var e=this;this.collider.enabled=!1,cc.tween(this.brickNode).to(.15,{opacity:{value:0,easing:"sineIn"}}).start(),cc.tween(this.brickNode).to(.15,{scale:{value:2,easing:"sineIn"}}).call(function(){return e.node.removeFromParent()}).start()},animateHitBrick:function(){cc.tween(this.brickNode).to(.1,{position:{value:cc.v2(this.brickNode.position.x-2,this.brickNode.position.y),easing:"quartInOut"}}).to(.1,{position:{value:cc.v2(this.brickNode.position.x+4,this.brickNode.position.y),easing:"quartInOut"}}).to(.12,{position:{value:cc.v2(this.brickNode.position.x-1,this.brickNode.position.y),easing:"quartInOut"}}).to(.12,{position:{value:cc.v2(this.brickNode.position.x+2,this.brickNode.position.y),easing:"quartInOut"}}).to(.13,{position:{value:cc.v2(this.brickNode.position.x,this.brickNode.position.y),easing:"quartInOut"}}).start()}}),cc._RF.pop()},{}],GameCtl:[function(e,t){"use strict";cc._RF.push(t,"a337308uxxJva7vh8G06q7Z","GameCtl");var i=e("GameModel"),c=e("../model/LevelModel"),o=e("../view/BrickView"),n=e("./utils");cc.Class({extends:cc.Component,properties:{gameView:e("GameView"),ball:e("Ball"),paddle:e("Paddle"),brickLayout:e("BrickLayout"),overPanel:e("OverPanel"),pausePanel:e("PausePanel"),levelConfig:[cc.JsonAsset],loading:cc.Node,topFrame:cc.Node,physicFrame:cc.Node,brickFrame:cc.Node,topWall:cc.PhysicsBoxCollider,rightWall:cc.PhysicsBoxCollider,leftWall:cc.PhysicsBoxCollider,topOverPanel:cc.Node,middleOverPanel:cc.Node,botOverPanel:cc.Node,isStopGame:!1,brickHitSound:cc.AudioClip,brickBreakSound:cc.AudioClip,winSound:cc.AudioClip,loseSound:cc.AudioClip,clickSound:cc.AudioClip,bgmAudioClip:cc.AudioClip},onLoad:function(){this.scaleFactor=Math.min(cc.winSize.width/600,1),this.relScaleFactor=Math.max(cc.winSize.height/cc.winSize.width,1),this.topFrame.scale=this.scaleFactor,this.physicFrame.scale=this.scaleFactor,this.physicFrame.x=300*(1-this.scaleFactor)-300,this.brickFrame.y=492*this.relScaleFactor,this.topWall.node.y=600*this.relScaleFactor-70,this.rightWall.size.height=1200*this.relScaleFactor,this.leftWall.size.height=1200*this.relScaleFactor,this.topOverPanel.scale=this.scaleFactor,this.middleOverPanel.scale=this.scaleFactor+(1-this.scaleFactor)/2,this.botOverPanel.scale=this.scaleFactor,this.loading.scale=this.scaleFactor,this.pausePanel.node.scale=this.scaleFactor,cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,function(e){e.keyCode===cc.macro.KEY.back&&cc.director.end()}),this.physicsManager=cc.director.getPhysicsManager(),this.physicsManager.enabled=!0,this.gameModel=new i,this._curLevel=~~cc.sys.localStorage.getItem("curlevel")||1,this.loadLevel(this._curLevel)},init:function(e){this.physicsManager.enabled=!0,this.gameModel.init(e.brickCount),this.gameView.init(this),this.ball.init(this,200*(this.relScaleFactor-1)),this.paddle.init(this,200*(this.relScaleFactor-1)),this.brickLayout.init(e),this.overPanel.init(this)},startGame:function(e){this.loading.active=!1,cc.audioEngine.playMusic(this.bgmAudioClip,!0),this.init(e),this.isStopGame=!1},loadLevel:function(e){var t=new c(this.levelConfig[e-1].json);this.startGame(t)},loadCurrentLevel:function(){this.loading.active=!0,n.showAds("next",!0,function(){cc.director.loadScene("game")})},moveNextLevel:function(){var e=this,t=this;n.showAds("next",!0,function(){var i=t._curLevel+1;e.levelConfig[i-1]?(cc.sys.localStorage.setItem("curlevel",i),cc.director.loadScene("game")):(e.loading.active=!0,cc.director.loadScene("selectLevel"))})},onResumeGame:function(){cc.director.resume(),cc.audioEngine.resumeMusic(),this.physicsManager.enabled=!0,this.isStopGame=!1,this.playSound(this.clickSound)},stopGame:function(e){cc.audioEngine.stopMusic(),this.isStopGame=!0,this.physicsManager.enabled=!1,this.saveHighestScore(this._curLevel,this.gameModel.score),e?(this.playSound(this.winSound),(cc.sys.localStorage.getItem("playerLevel")||0)<this._curLevel&&cc.sys.localStorage.setItem("playerLevel",this._curLevel),this.overPanel.show(this.gameModel.score,e)):(this.playSound(this.loseSound),this.overPanel.show(this.gameModel.score,e))},saveHighestScore:function(e,t){var i=JSON.parse(cc.sys.localStorage.getItem("scoreData")||"[]");t<=(i[e-1]||0)||(i[e-1]=t,cc.sys.localStorage.setItem("scoreData",JSON.stringify(i)))},onBallContactBrick:function(e,t){var i=t.getComponent(o);i.hitBall(),0===i.hp?(this.playSound(this.brickBreakSound),this.gameModel.addScore(i.score),this.gameModel.minusBrick(1),this.gameView.updateScore(this.gameModel.score),this.gameModel.bricksNumber<=0&&(this.playSound(this.winSound),this.stopGame(!0))):this.playSound(this.brickHitSound)},onBallContactGround:function(){this.stopGame(),this.playSound(this.brickHitSound)},onBallContactPaddle:function(){this.playSound(this.brickHitSound)},onBallContactWall:function(){this.playSound(this.brickHitSound)},onDestroy:function(){this.physicsManager.enabled=!1},onPause:function(){var e=this;cc.audioEngine.pauseMusic(),cc.director.pause(),this.physicsManager.enabled=!1,this.isStopGame=!0,this.playSound(this.clickSound),n.showAds("pause",!1,function(){e.pausePanel.show()})},playSound:function(e){var t=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(e,!1,t)}}),cc._RF.pop()},{"../model/LevelModel":"LevelModel","../view/BrickView":"BrickView","./utils":"utils",Ball:"Ball",BrickLayout:"BrickLayout",GameModel:"GameModel",GameView:"GameView",OverPanel:"OverPanel",Paddle:"Paddle",PausePanel:"PausePanel"}],GameModel:[function(e,t){"use strict";cc._RF.push(t,"dceaaRUaJhHJ6dPqgG9vpjt","GameModel"),cc.Class({extends:cc.Component,properties:{score:0,bricksNumber:0},init:function(e){this.score=0,this.bricksNumber=e},addScore:function(e){this.score+=e},minusBrick:function(e){this.bricksNumber-=e}}),cc._RF.pop()},{}],GameView:[function(e,t){"use strict";cc._RF.push(t,"e4735UW3lFPMoW0rK22obsG","GameView"),cc.Class({extends:cc.Component,properties:{scoreLabel:cc.Label,levelabel:cc.Label},init:function(e){this.gameCtl=e,this.scoreLabel.string="0";var t=cc.sys.localStorage.getItem("curlevel");this.levelabel.string=t},updateScore:function(e){this.scoreLabel.string=e}}),cc._RF.pop()},{}],LandingScene:[function(e,t){"use strict";cc._RF.push(t,"b85cfPHei5Aio/A9v0oIyPq","LandingScene");var i=e("h5ad"),c=e("../controller/utils");cc.Class({extends:cc.Component,properties:{clickSound:cc.AudioClip,bgmAudioClip:cc.AudioClip,loading:cc.Node,frame:cc.Node,background:cc.Node},onLoad:function(){this.scaleFactor=Math.min(cc.winSize.width/600,1),this.frame.scale=this.scaleFactor,this.loading.scale=this.scaleFactor,this.background.scale=Math.max(cc.winSize.width,cc.winSize.height)/600,i.onStart({icon:c.getResourceUrl("icon"),color:"rgb(3 76 133)",afterBreak:this.afterSplash.bind(this)})},afterSplash:function(){cc.audioEngine.playMusic(this.bgmAudioClip,!0)},start:function(){},onPlayButtonClicked:function(){this.loading.active=!0,cc.director.loadScene("selectLevel"),this.playSound(this.clickSound),cc.audioEngine.stopMusic()},playSound:function(e){var t=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(e,!1,t)}}),cc._RF.pop()},{"../controller/utils":"utils",h5ad:1}],LevelItem:[function(e,t){"use strict";cc._RF.push(t,"d63b4wIyX1FlbY7igExk7D2","LevelItem");var i=e("../controller/utils"),c=cc.Class({extends:cc.Component,properties:{clickSound:cc.AudioClip,onLayer:cc.Node,offLayer:cc.Node,button:cc.Button,levelItem:cc.Node,levelLabel:cc.Label},statics:{isFirst:!0},setLevel:function(e,t){this._handler=t,this._level=e,this.levelLabel.string=e;var i=cc.sys.localStorage.getItem("playerLevel")||0,c=i>=this._level;this.onLayer.active=c,this.offLayer.active=!c;var o=this._level>=2+~~i;this.levelItem.opacity=o?100:255,this.button.interactable=!o},onSelectLevel:function(){var e=this,t=function(){e._handler&&e._handler(),cc.sys.localStorage.setItem("curlevel",e._level),cc.director.loadScene("game"),e.playSound(e.clickSound),cc.tween(e.bgmAudioSource).to(1,{volume:{value:0,easing:"sineIn"}}).call(function(){return e.bgmAudioSource.stop()}).start()};c.isFirst?(c.isFirst=!1,t()):i.showAds("next",!0,t)},playSound:function(e){var t=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(e,!1,t)}});t.exports=c,cc._RF.pop()},{"../controller/utils":"utils"}],LevelModel:[function(e,t,i){"use strict";cc._RF.push(t,"f5bf7ZYQy9FtL2z6N3fxQuH","LevelModel"),i.__esModule=!0,i.default=void 0;var c=function(){function e(e){this.brickCount=this.getTotalBricks(e),this.column=Object.keys(e[0]).length,this.row=Object.keys(e).length,this.brickMap=e}return e.prototype.getTotalBricks=function(e){var t=0;for(var i in e)for(var c in e[i])0!==e[i][c]&&(t+=1);return t},e}();i.default=c,t.exports=i.default,cc._RF.pop()},{}],OverPanel:[function(e,t){"use strict";cc._RF.push(t,"60425zRIQ5LNIZ6KmZ5p/LN","OverPanel");var i=e("../controller/utils");cc.Class({extends:cc.Component,properties:{replayBtn:cc.Node,nextBtn:cc.Node,scoreLabel:cc.Label,highestScoreLabel:cc.Label,clickSound:cc.AudioClip,gameOverPanel:cc.Node,gameWinPanel:cc.Node},onLoad:function(){},init:function(e){this.gameCtl=e,this.node.active=!1},show:function(e,t){this.node.active=!0,this.gameOverPanel.active=!t,this.gameWinPanel.active=t,this.nextBtn.active=t,this.replayBtn.active=!t,this.scoreLabel.string=e,this.highestScoreLabel.string=this.getHighestScore()},getHighestScore:function(){return JSON.parse(cc.sys.localStorage.getItem("scoreData")||"[]").reduce(function(e,t){return e+t})},onRestart:function(){this.gameCtl.loadCurrentLevel(),this.playSound(this.clickSound)},onNextLevel:function(){this.gameCtl.moveNextLevel(),this.playSound(this.clickSound)},onChangeStage:function(){this.playSound(this.clickSound),i.showAds("browse",!0,function(){cc.director.loadScene("selectLevel")})},playSound:function(e){var t=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(e,!1,t)}}),cc._RF.pop()},{"../controller/utils":"utils"}],Paddle:[function(e,t){"use strict";cc._RF.push(t,"4dc82c1qO9KbZBsMZGbHlMV","Paddle"),cc.Class({extends:cc.Component,properties:{speed:500},onLoad:function(){this._minX=this.node.width/2,this._maxX=600-this.node.width/2,this.node.parent.on("touchmove",this.onTouchMove,this),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this),cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this)},update:function(e){if(!this._gameCtrl||!this._gameCtrl.isStopGame){var t=this.node.x;this._isMoveLeft?t=Math.max(this._minX,Math.min(this._maxX,t-this.speed*e)):this._isMoveRight&&(t=Math.max(this._minX,Math.min(this._maxX,t+this.speed*e))),this.node.x=t}},onKeyDown:function(e){switch(e.keyCode){case cc.macro.KEY.left:case cc.macro.KEY.a:this._isMoveLeft=!0;break;case cc.macro.KEY.right:case cc.macro.KEY.d:this._isMoveRight=!0}},onKeyUp:function(e){switch(e.keyCode){case cc.macro.KEY.left:case cc.macro.KEY.a:this._isMoveLeft=!1;break;case cc.macro.KEY.right:case cc.macro.KEY.d:this._isMoveRight=!1}},onTouchMove:function(e){if(!this._gameCtrl.isStopGame){var t=this.node.parent.convertToNodeSpaceAR(e.getLocation());this.node.x=Math.max(this._minX,Math.min(this._maxX,t.x))}},init:function(e,t){this.node.x=300,this.node.y=26.299+t,this._gameCtrl=e}}),cc._RF.pop()},{}],PausePanel:[function(e,t){"use strict";cc._RF.push(t,"b8352WVqZtHF6g5r3IjErdI","PausePanel");var i=e("../controller/utils");cc.Class({extends:cc.Component,properties:{clickSound:cc.AudioClip},show:function(){this.node.active=!0},onReplay:function(){var e=this;i.showAds("next",!1,function(){cc.director.resume(),cc.director.loadScene("game"),e.playSound(e.clickSound)})},onChangeStage:function(){var e=this;i.showAds("browse",!1,function(){cc.director.resume(),cc.director.loadScene("selectLevel"),e.playSound(e.clickSound)})},onResume:function(){this.node.active=!1},playSound:function(e){var t=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(e,!1,t)}}),cc._RF.pop()},{"../controller/utils":"utils"}],SelectLevelScene:[function(e,t){"use strict";cc._RF.push(t,"31aafb/KpBMD5r8BNEBebec","SelectLevelScene");var i=e("./LevelItem");cc.Class({extends:cc.Component,properties:{clickSound:cc.AudioClip,bgmAudioClip:cc.AudioClip,loading:cc.Node,levelPrefab:cc.Prefab,contentView:cc.Node,topFrame:cc.Node,botFrame:cc.Node,background:cc.Node,scrollView:cc.Node},onLoad:function(){this.scaleFactor=Math.min(cc.winSize.width/600,1),this.topFrame.scale=this.scaleFactor,this.botFrame.scale=this.scaleFactor,this.background.scale=Math.max(cc.winSize.width,cc.winSize.height)/600,this.scrollView.scale=this.scaleFactor,this.scrollView.height=(456+140*(1-this.scaleFactor))/this.scaleFactor,this.loading.scale=this.scaleFactor,cc.audioEngine.playMusic(this.bgmAudioClip,!0),this.loadLevelConfig()},playSound:function(e){var t=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(e,!1,t)},loadLevelConfig:function(){for(var e=0;e<30;e++){var t=cc.instantiate(this.levelPrefab);t.getComponent(i).setLevel(e+1,this.onSelect.bind(this)),this.contentView.addChild(t)}},onSelect:function(){this.loading.active=!0}}),cc._RF.pop()},{"./LevelItem":"LevelItem"}],SoundButton:[function(e,t){"use strict";cc._RF.push(t,"693b7oTvNhKEL4LhZ6JE9Ie","SoundButton"),cc.Class({extends:cc.Component,properties:{buttonSprite:cc.Sprite,buttonTextures:[cc.SpriteFrame],clickSound:cc.AudioClip},onLoad:function(){var e=cc.sys.localStorage.getItem("soundConfig")||1;this.buttonSprite.spriteFrame=this.buttonTextures[e],this.setSoundConfig(e)},onSoundButtonClicked:function(){var e=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(this.clickSound,!1,e);var t=1==e?0:1;cc.sys.localStorage.setItem("soundConfig",t),this.buttonSprite.spriteFrame=this.buttonTextures[t],this.setSoundConfig(t)},setSoundConfig:function(e){1==e?cc.audioEngine.setMusicVolume(1):cc.audioEngine.setMusicVolume(0)}}),cc._RF.pop()},{}],TutorialButton:[function(e,t){"use strict";cc._RF.push(t,"02e0fTuk3RCybE2KHyqK0XM","TutorialButton"),cc.Class({extends:cc.Component,properties:{tutorialLayer:cc.Node,isShow:!1,clickSound:cc.AudioClip},onTutorialClicked:function(){var e=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(this.clickSound,!1,e),this.tutorialLayer.active=!this.isShow,this.isShow=!this.isShow,this.playSound(this.clickSound)},playSound:function(e){var t=cc.sys.localStorage.getItem("soundConfig")||1;cc.audioEngine.play(e,!1,t)}}),cc._RF.pop()},{}],utils:[function(e,t){"use strict";cc._RF.push(t,"edc1bnU0BhO64vKFQYCrNHB","utils");var i=e("h5ad");t.exports={showAds:function(e,t,c){i.adBreak({type:e,beforeBreak:function(){t&&(cc.director.pause(),cc.audioEngine.pauseAll())},afterBreak:function(){t&&(cc.director.resume(),cc.audioEngine.resumeAll()),c&&c()},noBreak:function(){c&&c()}})},getResourceUrl:function(e){var t=cc.resources.getInfoWithPath(e),i=t.uuid;return t.nativeVer&&(i+="."+t.nativeVer),"./assets/resources/native/"+i.substr(0,2)+"/"+i+".png"}},cc._RF.pop()},{h5ad:1}]},{},["GameCtl","utils","BrickModel","GameModel","LevelModel","Ball","BrickLayout","BrickView","GameView","LandingScene","LevelItem","OverPanel","Paddle","PausePanel","SelectLevelScene","SoundButton","TutorialButton"]);