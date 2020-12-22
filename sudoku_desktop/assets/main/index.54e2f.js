window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Box: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "18523+V+AhHHZTK7KosY8D5", "Box");
    "use strict";
    var _constants = _interopRequireDefault(require("../constants"));
    var _helpers = _interopRequireDefault(require("../libs/helpers"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var MEMO_SLOT = 4;
    cc.Class({
      extends: cc.Component,
      properties: {
        valueText: cc.Label,
        memoFrame: cc.Node,
        memoTexts: [ cc.Label ],
        memoMode: {
          get: function get() {
            return this._memoMode;
          },
          set: function set(value) {
            this._memoMode = value;
          }
        },
        value: {
          get: function get() {
            return this._value;
          },
          set: function set(value) {
            this._value = value;
            this.valueText.string = _helpers["default"].isCInput(this._value) ? "" : this._value + "";
          }
        },
        memoValues: {
          get: function get() {
            return this._memoValues;
          },
          set: function set(value) {
            this._memoValues = value;
            for (var i = 0; i < 4; i++) {
              var slotValue = this._memoValues[i] || -1;
              this.memoTexts[i].string = _helpers["default"].isCInput(slotValue) ? "" : slotValue + "";
            }
          }
        },
        isFixed: {
          get: function get() {
            return this._isFixed;
          },
          set: function set(value) {
            this._isFixed = value;
            this.changeTextColor();
          }
        },
        isHighlight: {
          get: function get() {
            return this._isHighlight;
          },
          set: function set(value) {
            this._isHighlight = value;
            this.changeTextColor();
          }
        },
        isConflicted: {
          get: function get() {
            return this._isConflicted;
          },
          set: function set(value) {
            this._isConflicted = value;
          }
        },
        isCompleted: {
          get: function get() {
            return this._isCompleted;
          },
          set: function set(value) {
            this._isCompleted = value;
          }
        }
      },
      onLoad: function onLoad() {
        this.value = -1;
        this.memoValues = [];
        this.memoMode = false;
        this.isFixed = false;
        this.memoFrame.active = false;
        this.memoTexts.forEach(function(memoText) {
          memoText.string = "";
          memoText.node.color = cc.color(_constants["default"].colors.text.boxes.memo);
        });
        this.node.color = cc.color(_constants["default"].colors.bgs.boxes.normal);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onClicked, this);
      },
      start: function start() {},
      inputValue: function inputValue(value, memoMode) {
        this.memoMode != memoMode && this.switchMode(memoMode);
        if (this.memoMode) if (_helpers["default"].isCInput(value)) this.memoValues = []; else {
          var currentMemoValues = [].concat(this.memoValues);
          currentMemoValues.includes(value) ? currentMemoValues.splice(currentMemoValues.indexOf(value), 1) : currentMemoValues.length < 3 && currentMemoValues.push(value);
          this.memoValues = currentMemoValues;
        } else this.value === value ? this.value = -1 : this.value = value;
      },
      switchMode: function switchMode(memoMode) {
        this.memoMode = memoMode;
        this.memoFrame.active = this.memoMode;
        this.valueText.node.active = !this.memoMode;
        this.value = -1;
        this.memoValues = [];
      },
      select: function select() {
        this.node.color = cc.color(_constants["default"].colors.bgs.boxes.selected);
      },
      deselect: function deselect() {
        this.node.color = cc.color(_constants["default"].colors.bgs.boxes.normal);
      },
      updateBgColor: function updateBgColor() {
        this.node.color = cc.color(_constants["default"].colors.bgs.boxes[this._isConflicted ? "conflicted" : this._isCompleted ? "completed" : "normal"]);
      },
      changeTextColor: function changeTextColor() {
        this.valueText.node.color = cc.color(_constants["default"].colors.text.boxes[this._isHighlight ? "highlighted" : this._isFixed ? "fixed" : "filled"]);
      },
      onClicked: function onClicked() {
        if (this.isFixed) return;
        this.node.emit("clicked", this);
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../libs/helpers": "helpers"
  } ],
  DigitInput: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c59ddVTWQFKEI1Kyl/M+vsv", "DigitInput");
    "use strict";
    var _constants = _interopRequireDefault(require("../constants"));
    var _helpers = _interopRequireDefault(require("../libs/helpers"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        value: cc.Integer
      },
      onLoad: function onLoad() {
        this.isC = _helpers["default"].isCInput(this.value);
        this.button = this.getComponent(cc.Button);
        this.label = this.button.target.getComponentInChildren(cc.Label);
        this.label.string = this.isC ? "C" : this.value + "";
        this.memoMode = false;
        this.isSelected = false;
        this.button.node.on("click", this.onClicked, this);
        this.updateButtonDisplay();
      },
      start: function start() {},
      setSelected: function setSelected(value) {
        this.isSelected = value;
        this.updateButtonDisplay();
      },
      setMemoMode: function setMemoMode(value) {
        this.memoMode = value;
        this.updateButtonDisplay();
      },
      updateButtonDisplay: function updateButtonDisplay() {
        this.label.node.scale = this.memoMode ? .6 : 1;
        var buttonColor = _constants["default"].colors.bgs[this.isC ? "ce" : "digits"][this.isSelected ? "selected" : "normal"];
        var textColor = _constants["default"].colors.text.digits[this.memoMode ? "memoMode" : "digitMode"][this.isSelected ? "selected" : "normal"];
        this.button.normalColor = cc.color(buttonColor);
        this.button.hoverColor = cc.color(buttonColor);
        this.label.node.color = cc.color(textColor);
      },
      onClicked: function onClicked() {
        this.node.emit("digitClicked", this);
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../libs/helpers": "helpers"
  } ],
  StageButton: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b6971A4mA5FTbbMmG1XkPVH", "StageButton");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        button: cc.Button,
        label: cc.Label
      },
      onLoad: function onLoad() {},
      start: function start() {},
      setValue: function setValue(value) {
        this.value = value;
        this.label.string = value + 1 + "";
      }
    });
    cc._RF.pop();
  }, {} ],
  constants: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d318a/Cn8VCf61XpMUJhf0r", "constants");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _default = {
      GAMEPLAY_RNG_SEED: "GCT_SUDOKU",
      GAMEPLAY_DIFFICULTY: 4,
      GAMEPLAY_STAGE_PER_DIFFICULTY: 250,
      GAMEPLAY_INIT_DIFFICULTY: 35,
      GAMEPLAY_DIFFICULTY_RANDOM_MODIFIER: 3,
      GAMEPLAY_DIFFICULTY_INCREMENT: 6,
      colors: {
        text: {
          digits: {
            digitMode: {
              normal: "#484848",
              selected: "#F47302"
            },
            memoMode: {
              normal: "#285893",
              selected: "#3BAAFF"
            }
          },
          memo: {
            normal: "#000000",
            selected: "#517BE5"
          },
          boxes: {
            fixed: "#111111",
            filled: "#C3A07A",
            highlighted: "#FF3500",
            memo: "#0C458F"
          }
        },
        bgs: {
          digits: {
            normal: "#EDD795",
            selected: "#444444"
          },
          ce: {
            normal: "#9AC5FE",
            selected: "#444444"
          },
          memo: {
            normal: "#FFFFFF",
            selected: "#444444"
          },
          boxes: {
            normal: "#EAD6B4",
            selected: "#FF0000",
            completed: "#FEFD99",
            conflicted: "#DBDBDB"
          }
        },
        levels: [ "#E4C932", "#FA6D1A", "#FE496F", "#8168F4" ]
      },
      DEBUG_MODE: false,
      SHOW_DEBUG_ANSWER: true
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  dataMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1a550A7zrVEdbZmum9z7mZv", "dataMgr");
    "use strict";
    var _sudoku = _interopRequireDefault(require("./libs/sudoku"));
    var _randomSeed = _interopRequireDefault(require("./libs/random-seed"));
    var _constants = _interopRequireDefault(require("./constants"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var DataMgr = function() {
      function DataMgr() {
        this._currentLevel = 0;
        this._currentStage = 0;
      }
      DataMgr.generateLevel = function generateLevel(level, stage) {
        var rng = _randomSeed["default"].create(_constants["default"].GAMEPLAY_RNG_SEED + "_" + (level + 1) + "_" + (stage + 1));
        var clueThreshold = rng.intBetween(-_constants["default"].GAMEPLAY_DIFFICULTY_RANDOM_MODIFIER, _constants["default"].GAMEPLAY_DIFFICULTY_RANDOM_MODIFIER);
        return _sudoku["default"].generate(_constants["default"].GAMEPLAY_INIT_DIFFICULTY - level * _constants["default"].GAMEPLAY_DIFFICULTY_INCREMENT + clueThreshold, rng);
      };
      var _proto = DataMgr.prototype;
      _proto.setStage = function setStage(level, stage) {
        this._currentLevel = level;
        this._currentStage = stage;
      };
      _proto.generateCurrentStage = function generateCurrentStage(level, stage) {
        return DataMgr.generateLevel(this._currentLevel, this._currentStage);
      };
      _proto.isLastStage = function isLastStage() {
        return this._currentLevel >= _constants["default"].GAMEPLAY_DIFFICULTY - 1 && this._currentStage >= _constants["default"].GAMEPLAY_STAGE_PER_DIFFICULTY - 1;
      };
      _proto.setNextStage = function setNextStage() {
        if (this.isLastStage()) return;
        var nextStage = this._currentStage + 1;
        var nextLevel = this._currentLevel + (nextStage >= _constants["default"].GAMEPLAY_STAGE_PER_DIFFICULTY ? 1 : 0);
        var nextStage = nextStage % _constants["default"].GAMEPLAY_STAGE_PER_DIFFICULTY;
        return this.setStage(nextLevel, nextStage);
      };
      return DataMgr;
    }();
    module.exports = new DataMgr();
    cc._RF.pop();
  }, {
    "./constants": "constants",
    "./libs/random-seed": "random-seed",
    "./libs/sudoku": "sudoku"
  } ],
  helpers: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eeb8d3//RxJp7sdnbjhcGRJ", "helpers");
    "use strict";
    module.exports.isCInput = function(number) {
      if (Number.isNaN(number)) return true;
      return number < 1 || number > 9;
    };
    module.exports.toNumberValue = function(string) {
      var inputNum = Number.parseInt(string);
      return Number.isNaN(inputNum) ? -1 : inputNum;
    };
    module.exports.getBoxRegion = function(x, y) {
      var regionX = ~~(x / 3);
      var regionY = ~~(y / 3);
      return 3 * regionY + regionX;
    };
    module.exports.getBoxRegionIndex = function(x, y) {
      var regionX = x % 3;
      var regionY = y % 3;
      return 3 * regionY + regionX;
    };
    module.exports.getBoxPositionInRegion = function(index, region) {
      var i = region % 3 * 3 + index % 3;
      var j = 3 * ~~(region / 3) + ~~(index / 3);
      return [ j, i ];
    };
    cc._RF.pop();
  }, {} ],
  ingameBoardCtor: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f6a0bqNrx5BW4LxKId7FSTa", "ingameBoardCtor");
    "use strict";
    var _constants = _interopRequireDefault(require("./constants"));
    var _helpers = _interopRequireDefault(require("./libs/helpers"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        boxPrefab: cc.Prefab,
        selectedBox: {
          get: function get() {
            return this._selectedBox;
          }
        }
      },
      onLoad: function onLoad() {
        var BOX_SPACING = 3;
        var REGION_SPACING = BOX_SPACING;
        this._selectedBox = null;
        this.board = [];
        for (var i = 0; i < 9; i++) {
          var row = [];
          for (var j = 0; j < 9; j++) {
            var box = cc.instantiate(this.boxPrefab).getComponent("Box");
            box.node.parent = this.node;
            box.node.x = j * (box.node.width + BOX_SPACING) + ~~(j / 3) * REGION_SPACING - 4 * (box.node.width + BOX_SPACING) - REGION_SPACING;
            box.node.y = -i * (box.node.height + BOX_SPACING) - ~~(i / 3) * REGION_SPACING + 4 * (box.node.height + BOX_SPACING) + REGION_SPACING;
            row.push(box);
            box.ingameBoard = this;
            box.value = _helpers["default"].toNumberValue(this.ingameController.boardGrid[i][j]);
            box.isFixed = "." !== this.ingameController.boardGrid[i][j];
            box.node.on("clicked", this.boxClicked.bind(this));
          }
          this.board.push(row);
        }
      },
      start: function start() {
        this.checkBoxesStatus();
      },
      _checkConfict: function _checkConfict() {
        this.board.forEach(function(row) {
          row.forEach(function(box) {
            box.isConflicted = false;
          });
        });
        this.isConflictFree = true;
        _constants["default"].DEBUG_MODE && cc.log("===========================");
        _constants["default"].DEBUG_MODE && cc.log("--- Checking conflicts ----");
        _constants["default"].DEBUG_MODE && cc.log("===========================");
        for (var i = 0; i < 9; i++) {
          var row = this.board[i];
          for (var j = 0; j < 9; j++) {
            var box = row[j];
            _constants["default"].DEBUG_MODE && cc.log("--- Checking box: " + (j + 1) + "x" + (i + 1));
            if (row[j].isConflicted) continue;
            if (_helpers["default"].isCInput(box.value)) continue;
            _constants["default"].DEBUG_MODE && cc.log("--- Checking box first passed ---");
            _constants["default"].DEBUG_MODE && cc.log("== Row check ==");
            for (var k = j + 1; k < 9; k++) {
              var checkingBox = row[k];
              if (checkingBox.value === box.value) {
                checkingBox.isConflicted = true;
                box.isConflicted = true;
                this.isConflictFree = false;
                _constants["default"].DEBUG_MODE && cc.error("Checking box conflicted: " + (k + 1) + "x" + (i + 1));
              }
            }
            _constants["default"].DEBUG_MODE && cc.log("== Column check ==");
            for (var _k = i + 1; _k < 9; _k++) {
              var _checkingBox = this.board[_k][j];
              if (_checkingBox.value === box.value) {
                _checkingBox.isConflicted = true;
                box.isConflicted = true;
                this.isConflictFree = false;
                _constants["default"].DEBUG_MODE && cc.error("Checking box conflicted: " + (j + 1) + "x" + (_k + 1));
              }
            }
            _constants["default"].DEBUG_MODE && cc.log("== Region check ==");
            var region = _helpers["default"].getBoxRegion(j, i);
            var index = _helpers["default"].getBoxRegionIndex(j, i);
            for (var _k2 = index + 1; _k2 < 9; _k2++) {
              var checkBoxPos = _helpers["default"].getBoxPositionInRegion(_k2, region);
              var _checkingBox2 = this.board[checkBoxPos[0]][checkBoxPos[1]];
              if (_checkingBox2.value === box.value) {
                _checkingBox2.isConflicted = true;
                box.isConflicted = true;
                this.isConflictFree = false;
                _constants["default"].DEBUG_MODE && cc.error("Checking box conflicted: " + (checkBoxPos[1] + 1) + "x" + (checkBoxPos[0] + 1));
              }
            }
          }
        }
      },
      _checkCompleted: function _checkCompleted() {
        this.board.forEach(function(row) {
          row.forEach(function(box) {
            box.isCompleted = false;
          });
        });
        this.isFullyCompleted = true;
        _constants["default"].DEBUG_MODE && cc.log("============================");
        _constants["default"].DEBUG_MODE && cc.log("--- Checking completion ----");
        _constants["default"].DEBUG_MODE && cc.log("============================");
        var completedRows = [];
        var completedColumns = [];
        var completedRegions = [];
        _constants["default"].DEBUG_MODE && cc.log(" == ROWS CHECK!");
        for (var i = 0; i < 9; i++) {
          completedRows[i] = true;
          var existedDigits = [];
          for (var j = 0; j < 9; j++) {
            if (_helpers["default"].isCInput(this.board[i][j].value) || existedDigits.includes(this.board[i][j].value)) {
              completedRows[i] = false;
              this.isFullyCompleted = false;
              _constants["default"].DEBUG_MODE && cc.log("Row " + (i + 1) + " failed at pos " + (j + 1));
              break;
            }
            existedDigits.push(this.board[i][j].value);
          }
        }
        _constants["default"].DEBUG_MODE && cc.log(" == COLUMN CHECK!");
        for (var _j = 0; _j < 9; _j++) {
          completedColumns[_j] = true;
          var _existedDigits = [];
          for (var _i = 0; _i < 9; _i++) {
            if (_helpers["default"].isCInput(this.board[_i][_j].value) || _existedDigits.includes(this.board[_i][_j].value)) {
              completedColumns[_j] = false;
              this.isFullyCompleted = false;
              _constants["default"].DEBUG_MODE && cc.log("Column " + (_j + 1) + " failed at pos " + (_i + 1));
              break;
            }
            _existedDigits.push(this.board[_i][_j].value);
          }
        }
        for (var r = 0; r < 9; r++) {
          completedRegions[r] = true;
          var _existedDigits2 = [];
          for (var _i2 = 0; _i2 < 9; _i2++) {
            var pos = _helpers["default"].getBoxPositionInRegion(_i2, r);
            if (_helpers["default"].isCInput(this.board[pos[1]][pos[0]].value) || _existedDigits2.includes(this.board[pos[1]][pos[0]].value)) {
              completedRegions[r] = false;
              this.isFullyCompleted = false;
              _constants["default"].DEBUG_MODE && cc.log("Resion " + (r + 1) + " failed at pos " + (_i2 + 1));
              break;
            }
            _existedDigits2.push(this.board[pos[1]][pos[0]].value);
          }
        }
        for (var _i3 = 0; _i3 < 9; _i3++) for (var _j2 = 0; _j2 < 9; _j2++) this.board[_i3][_j2].isCompleted = completedRows[_i3] || completedColumns[_j2] || completedRegions[_helpers["default"].getBoxRegion(_i3, _j2)];
      },
      checkBoxesStatus: function checkBoxesStatus() {
        this._checkCompleted();
        this._checkConfict();
        this.board.forEach(function(row) {
          row.forEach(function(box) {
            box.updateBgColor();
          });
        });
        this.isFullyCompleted && this.isConflictFree && this.ingameController.clearGame();
      },
      haveBoxSelected: function haveBoxSelected() {
        return null !== this._selectedBox;
      },
      setSelectedBoxValue: function setSelectedBoxValue(value, memoMode) {
        if (!this.haveBoxSelected()) return;
        this._selectedBox.inputValue(value, memoMode);
      },
      deselectBox: function deselectBox() {
        if (!this.haveBoxSelected()) return;
        this._selectedBox.deselect();
        this._selectedBox = null;
      },
      hightlightValue: function hightlightValue(value) {
        if (!value) return;
        if (_helpers["default"].isCInput()) return;
        this.board.forEach(function(row) {
          row.forEach(function(box) {
            box.value === value && (box.isHighlight = true);
          });
        });
      },
      dehighlight: function dehighlight() {
        this.board.forEach(function(row) {
          row.forEach(function(box) {
            box.isHighlight = false;
          });
        });
      },
      boxClicked: function boxClicked(target) {
        if (this.ingameInput.isHavingInput()) {
          target.inputValue(this.ingameInput.getInputValue(), this.ingameInput.memoMode);
          this.ingameInput.deselectCurrentInput();
          this.checkBoxesStatus();
        } else if (target !== this._selectedBox) {
          this.deselectBox();
          this._selectedBox = target;
          this._selectedBox.select();
        } else this.deselectBox();
      }
    });
    cc._RF.pop();
  }, {
    "./constants": "constants",
    "./libs/helpers": "helpers"
  } ],
  ingameInputCtor: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "71823jnpu5J45uK5ujdp+PL", "ingameInputCtor");
    "use strict";
    var _DigitInput = _interopRequireDefault(require("./components/DigitInput"));
    var _constants = _interopRequireDefault(require("./constants"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        digitInputs: [ _DigitInput["default"] ],
        memoButton: cc.Button,
        checkAnswerButton: cc.Button,
        menuButton: cc.Button
      },
      onLoad: function onLoad() {
        var _this = this;
        this._selectedDigit = null;
        this.digitInputs.forEach(function(digitInput) {
          digitInput.node.on("digitClicked", _this.onDigitClicked, _this);
        });
        this.memoMode = false;
        this.memoTextLabel = this.memoButton.target.getComponentInChildren(cc.Label);
        this.memoButton.node.on("click", this.onMemoClicked, this);
        this.checkAnswerButton.node.on("click", this.onCheckAnswerClicked, this);
        this.menuButton.node.on("click", this.onMenuClicked, this);
      },
      start: function start() {},
      isHavingInput: function isHavingInput() {
        return null !== this._selectedDigit;
      },
      getInputValue: function getInputValue() {
        return this.isHavingInput() ? this._selectedDigit.value : null;
      },
      deselectCurrentInput: function deselectCurrentInput() {
        if (!this.isHavingInput()) return;
        this._selectedDigit.setSelected(false);
        this._selectedDigit = null;
        this.ingameBoard.dehighlight();
      },
      selectInput: function selectInput(target) {
        this._selectedDigit = target;
        this._selectedDigit.setSelected(true);
        this.ingameBoard.hightlightValue(this.getInputValue());
      },
      switchMemoMode: function switchMemoMode() {
        var _this2 = this;
        this.memoMode = !this.memoMode;
        this.memoButton.normalColor = cc.color(_constants["default"].colors.bgs.memo[this.memoMode ? "selected" : "normal"]);
        this.memoButton.hoverColor = cc.color(_constants["default"].colors.bgs.memo[this.memoMode ? "selected" : "normal"]);
        this.memoTextLabel.node.color = cc.color(_constants["default"].colors.text.memo[this.memoMode ? "selected" : "normal"]);
        this.digitInputs.forEach(function(digitInput) {
          digitInput.setMemoMode(_this2.memoMode);
        });
      },
      onDigitClicked: function onDigitClicked(target) {
        if (this.ingameBoard.haveBoxSelected()) {
          this.ingameBoard.setSelectedBoxValue(target.value, this.memoMode);
          this.ingameBoard.deselectBox();
          this.ingameBoard.checkBoxesStatus();
        } else if (target !== this._selectedDigit) {
          this.deselectCurrentInput();
          this.selectInput(target);
        } else this.deselectCurrentInput();
      },
      onMemoClicked: function onMemoClicked() {
        this.switchMemoMode();
      },
      onCheckAnswerClicked: function onCheckAnswerClicked() {},
      onMenuClicked: function onMenuClicked() {
        this.ingameController.pauseGame();
      }
    });
    cc._RF.pop();
  }, {
    "./components/DigitInput": "DigitInput",
    "./constants": "constants"
  } ],
  ingamePopupCtor: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1d47e/E7GNBObHoKsUc02Bu", "ingamePopupCtor");
    "use strict";
    var _constants = _interopRequireDefault(require("./constants"));
    var _dataMgr = _interopRequireDefault(require("./dataMgr"));
    var _sudoku = _interopRequireDefault(require("./libs/sudoku"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        overlay: cc.Node,
        pausePopup: cc.Node,
        clearPopup: cc.Node,
        nextLevelButton: cc.Node,
        debugLabel: cc.Label
      },
      onLoad: function onLoad() {
        this.hide();
      },
      start: function start() {
        _constants["default"].SHOW_DEBUG_ANSWER && (this.debugLabel.string = _sudoku["default"].solve(this.ingameController.boardInfo));
      },
      show: function show(popup) {
        this.overlay.active = true;
        if ("pause" === popup) this.pausePopup.active = true; else if ("clear" === popup) {
          this.nextLevelButton.active = !_dataMgr["default"].isLastStage();
          this.clearPopup.active = true;
        }
      },
      hide: function hide() {
        this.overlay.active = false;
        this.pausePopup.active = false;
        this.clearPopup.active = false;
      },
      onRestartClicked: function onRestartClicked() {
        this.ingameController.restart();
      },
      onNextLevelClicked: function onNextLevelClicked() {
        this.ingameController.nextLevel();
      },
      onResumeClicked: function onResumeClicked() {
        this.hide();
      },
      onLevelSelectionClicked: function onLevelSelectionClicked() {
        this.ingameController.goToLevelSelection();
      },
      onQuitClicked: function onQuitClicked() {
        this.ingameController.goToMainMenu();
      }
    });
    cc._RF.pop();
  }, {
    "./constants": "constants",
    "./dataMgr": "dataMgr",
    "./libs/sudoku": "sudoku"
  } ],
  ingameSceneCtor: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5a07bF/NkdMnJDGMvu07Ca5", "ingameSceneCtor");
    "use strict";
    var _dataMgr = _interopRequireDefault(require("./dataMgr"));
    var _sudoku = _interopRequireDefault(require("./libs/sudoku"));
    var _ingameBoardCtor = _interopRequireDefault(require("./ingameBoardCtor"));
    var _ingameInputCtor = _interopRequireDefault(require("./ingameInputCtor"));
    var _ingamePopupCtor = _interopRequireDefault(require("./ingamePopupCtor"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        ingameBoard: _ingameBoardCtor["default"],
        ingameInput: _ingameInputCtor["default"],
        ingamePopup: _ingamePopupCtor["default"]
      },
      onLoad: function onLoad() {
        this.ingameBoard.ingameController = this, this.ingameInput.ingameController = this, 
        this.ingamePopup.ingameController = this, this.ingameBoard.ingameInput = this.ingameInput, 
        this.ingameInput.ingameBoard = this.ingameBoard, this.boardInfo = _dataMgr["default"].generateCurrentStage();
        this.boardGrid = _sudoku["default"].board_string_to_grid(this.boardInfo);
      },
      start: function start() {},
      pauseGame: function pauseGame() {
        this.ingamePopup.show("pause");
      },
      clearGame: function clearGame() {
        this.ingamePopup.show("clear");
      },
      restart: function restart() {
        cc.director.loadScene("ingame");
      },
      nextLevel: function nextLevel() {
        _dataMgr["default"].setNextStage();
        cc.director.loadScene("ingame");
      },
      goToMainMenu: function goToMainMenu() {
        cc.director.loadScene("landing");
      },
      goToLevelSelection: function goToLevelSelection() {
        cc.director.loadScene("levelSelection");
      }
    });
    cc._RF.pop();
  }, {
    "./dataMgr": "dataMgr",
    "./ingameBoardCtor": "ingameBoardCtor",
    "./ingameInputCtor": "ingameInputCtor",
    "./ingamePopupCtor": "ingamePopupCtor",
    "./libs/sudoku": "sudoku"
  } ],
  landingSceneCtor: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f426fkg+Y1BYL0D0c19X2Ud", "landingSceneCtor");
    "use strict";
    var _dataMgr = _interopRequireDefault(require("./dataMgr"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {},
      onPlayClicked: function onPlayClicked() {
        cc.director.loadScene("levelSelection");
      }
    });
    cc._RF.pop();
  }, {
    "./dataMgr": "dataMgr"
  } ],
  levelSelectionSceneCtor: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "035a7DMVK5BFacblUS9t8Sf", "levelSelectionSceneCtor");
    "use strict";
    var _constants = _interopRequireDefault(require("./constants"));
    var _dataMgr = _interopRequireDefault(require("./dataMgr"));
    var _StageButton = _interopRequireDefault(require("./components/StageButton"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var STAGE_BUTTON_ROW_PER_PAGE = 5;
    var STAGE_BUTTON_SPACING = 10;
    cc.Class({
      extends: cc.Component,
      properties: {
        levelButtons: [ cc.Button ],
        stageButtonFrame: cc.Node,
        stageButtonPrefab: cc.Prefab,
        backPageButton: cc.Button,
        nextPageButton: cc.Button,
        backButton: cc.Button,
        pageText: cc.Label
      },
      onLoad: function onLoad() {
        var _this = this;
        this.STAGE_PER_SPACE = STAGE_BUTTON_ROW_PER_PAGE * STAGE_BUTTON_ROW_PER_PAGE;
        this.TOTAL_PAGE = ~~(_constants["default"].GAMEPLAY_STAGE_PER_DIFFICULTY / this.STAGE_PER_SPACE);
        this._currentPage = 0;
        this._currentLevel = 0;
        this.levelButtons.forEach(function(levelButton) {
          levelButton.node.on("click", _this.onLevelClick, _this);
        });
        this.backPageButton.node.on("click", this.onBackPageClicked, this);
        this.nextPageButton.node.on("click", this.onNextPageClicked, this);
        this.backButton.node.on("click", this.onBackClicked, this);
        this.stageButtons = [];
        for (var i = 0; i < STAGE_BUTTON_ROW_PER_PAGE; i++) for (var j = 0; j < STAGE_BUTTON_ROW_PER_PAGE; j++) {
          var stageButton = cc.instantiate(this.stageButtonPrefab).getComponent("StageButton");
          stageButton.node.parent = this.stageButtonFrame;
          stageButton.node.x = j * (stageButton.node.width + STAGE_BUTTON_SPACING) - (stageButton.node.width + STAGE_BUTTON_SPACING) * ~~(STAGE_BUTTON_ROW_PER_PAGE / 2);
          stageButton.node.y = -i * (stageButton.node.height + STAGE_BUTTON_SPACING) + (stageButton.node.height + STAGE_BUTTON_SPACING) * ~~(STAGE_BUTTON_ROW_PER_PAGE / 2);
          stageButton.setValue(i * STAGE_BUTTON_ROW_PER_PAGE + j);
          this.stageButtons.push(stageButton);
          stageButton.node.on("click", this.onStageButtonClicked, this);
        }
        this.switchLevel(_dataMgr["default"]._currentLevel);
        this._currentPage = ~~(_dataMgr["default"]._currentStage / this.STAGE_PER_SPACE);
        this.updateStagePage();
      },
      start: function start() {},
      switchLevel: function switchLevel(value) {
        var _this2 = this;
        this.levelButtons[this._currentLevel].normalColor = cc.color("#FFFFFF");
        this.levelButtons[this._currentLevel].hoverColor = cc.color("#FFFFFF");
        this._currentLevel = value;
        this.levelButtons[this._currentLevel].normalColor = cc.color(_constants["default"].colors.levels[this._currentLevel % _constants["default"].colors.levels.length]);
        this.levelButtons[this._currentLevel].hoverColor = cc.color(_constants["default"].colors.levels[this._currentLevel % _constants["default"].colors.levels.length]);
        this.stageButtons.forEach(function(stageButton) {
          stageButton.button.normalColor = cc.color(_constants["default"].colors.levels[_this2._currentLevel % _constants["default"].colors.levels.length]);
          stageButton.button.hoverColor = cc.color(_constants["default"].colors.levels[_this2._currentLevel % _constants["default"].colors.levels.length]);
        });
      },
      updateStagePage: function updateStagePage() {
        var _this3 = this;
        this.pageText.string = this._currentPage + 1 + "/" + this.TOTAL_PAGE;
        this.stageButtons.forEach(function(stageButton) {
          stageButton.setValue(_this3._currentPage * _this3.STAGE_PER_SPACE + _this3.stageButtons.indexOf(stageButton));
        });
      },
      onLevelClick: function onLevelClick(button) {
        var index = this.levelButtons.indexOf(button);
        if (index >= 0 && index != this._currentLevel) {
          this.switchLevel(index);
          this._currentPage = 0;
          this.updateStagePage();
        }
      },
      onBackPageClicked: function onBackPageClicked() {
        var transitionPage = Math.max(0, this._currentPage - 1);
        var isChanged = transitionPage !== this._currentPage;
        if (isChanged) {
          this._currentPage = transitionPage;
          this.updateStagePage();
        }
      },
      onNextPageClicked: function onNextPageClicked() {
        var transitionPage = Math.min(this.TOTAL_PAGE - 1, this._currentPage + 1);
        var isChanged = transitionPage !== this._currentPage;
        if (isChanged) {
          this._currentPage = transitionPage;
          this.updateStagePage();
        }
      },
      onBackClicked: function onBackClicked() {
        cc.director.loadScene("landing");
      },
      onStageButtonClicked: function onStageButtonClicked(button) {
        _dataMgr["default"].setStage(this._currentLevel, button.getComponent("StageButton").value);
        cc.director.loadScene("ingame");
      }
    });
    cc._RF.pop();
  }, {
    "./components/StageButton": "StageButton",
    "./constants": "constants",
    "./dataMgr": "dataMgr"
  } ],
  "random-seed": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a0abcm0OIlEU4qe5eC8L3zd", "random-seed");
    "use strict";
    var _stringify = _interopRequireDefault(require("./stringify"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var Mash = function Mash() {
      var n = 4022871197;
      var mash = function mash(data) {
        if (data) {
          data = data.toString();
          for (var i = 0; i < data.length; i++) {
            n += data.charCodeAt(i);
            var h = .02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += 4294967296 * h;
          }
          return 2.3283064365386963e-10 * (n >>> 0);
        }
        n = 4022871197;
      };
      return mash;
    };
    var uheprng = function uheprng(seed) {
      return function() {
        var o = 48;
        var c = 1;
        var p = o;
        var s = new Array(o);
        var i;
        var j;
        var k = 0;
        var mash = new Mash();
        for (i = 0; i < o; i++) s[i] = mash(Math.random());
        var rawprng = function rawprng() {
          ++p >= o && (p = 0);
          var t = 1768863 * s[p] + 2.3283064365386963e-10 * c;
          return s[p] = t - (c = 0 | t);
        };
        var random = function random(range) {
          return Math.floor(range * (rawprng() + 11102230246251565e-32 * (2097152 * rawprng() | 0)));
        };
        random.string = function(count) {
          var i;
          var s = "";
          for (i = 0; i < count; i++) s += String.fromCharCode(33 + random(94));
          return s;
        };
        var hash = function hash() {
          var args = Array.prototype.slice.call(arguments);
          for (i = 0; i < args.length; i++) for (j = 0; j < o; j++) {
            s[j] -= mash(args[i]);
            s[j] < 0 && (s[j] += 1);
          }
        };
        random.cleanString = function(inStr) {
          inStr = inStr.replace(/(^\s*)|(\s*$)/gi, "");
          inStr = inStr.replace(/[\x00-\x1F]/gi, "");
          inStr = inStr.replace(/\n /, "\n");
          return inStr;
        };
        random.hashString = function(inStr) {
          inStr = random.cleanString(inStr);
          mash(inStr);
          for (i = 0; i < inStr.length; i++) {
            k = inStr.charCodeAt(i);
            for (j = 0; j < o; j++) {
              s[j] -= mash(k);
              s[j] < 0 && (s[j] += 1);
            }
          }
        };
        random.seed = function(seed) {
          "undefined" !== typeof seed && null !== seed || (seed = Math.random());
          "string" !== typeof seed && (seed = (0, _stringify["default"])(seed, function(key, value) {
            if ("function" === typeof value) return value.toString();
            return value;
          }));
          random.initState();
          random.hashString(seed);
        };
        random.addEntropy = function() {
          var args = [];
          for (i = 0; i < arguments.length; i++) args.push(arguments[i]);
          hash(k++ + new Date().getTime() + args.join("") + Math.random());
        };
        random.initState = function() {
          mash();
          for (i = 0; i < o; i++) s[i] = mash(" ");
          c = 1;
          p = o;
        };
        random.done = function() {
          mash = null;
        };
        "undefined" !== typeof seed && random.seed(seed);
        random.range = function(range) {
          return random(range);
        };
        random.random = function() {
          return random(Number.MAX_VALUE - 1) / Number.MAX_VALUE;
        };
        random.floatBetween = function(min, max) {
          return random.random() * (max - min) + min;
        };
        random.intBetween = function(min, max) {
          return Math.floor(random.random() * (max - min + 1)) + min;
        };
        return random;
      }();
    };
    uheprng.create = function(seed) {
      return new uheprng(seed);
    };
    module.exports = uheprng;
    cc._RF.pop();
  }, {
    "./stringify": "stringify"
  } ],
  stringify: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a11b323geJKXpVDbewa+COm", "stringify");
    "use strict";
    exports = module.exports = stringify;
    exports.getSerialize = serializer;
    function stringify(obj, replacer, spaces, cycleReplacer) {
      return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces);
    }
    function serializer(replacer, cycleReplacer) {
      var stack = [], keys = [];
      null == cycleReplacer && (cycleReplacer = function cycleReplacer(key, value) {
        if (stack[0] === value) return "[Circular ~]";
        return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]";
      });
      return function(key, value) {
        if (stack.length > 0) {
          var thisPos = stack.indexOf(this);
          ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
          ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
          ~stack.indexOf(value) && (value = cycleReplacer.call(this, key, value));
        } else stack.push(value);
        return null == replacer ? value : replacer.call(this, key, value);
      };
    }
    cc._RF.pop();
  }, {} ],
  sudoku: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "44ff2VVBoFEJ7IrvjI9BnV3", "sudoku");
    "use strict";
    var sudoku = {};
    sudoku.DIGITS = "123456789";
    var ROWS = "ABCDEFGHI";
    var COLS = sudoku.DIGITS;
    var SQUARES = null;
    var UNITS = null;
    var SQUARE_UNITS_MAP = null;
    var SQUARE_PEERS_MAP = null;
    var MIN_GIVENS = 17;
    var NR_SQUARES = 81;
    var DIFFICULTY = {
      easy: 62,
      medium: 53,
      hard: 44,
      "very-hard": 35,
      insane: 26,
      inhuman: 17
    };
    sudoku.BLANK_CHAR = ".";
    sudoku.BLANK_BOARD = ".................................................................................";
    function initialize() {
      SQUARES = sudoku._cross(ROWS, COLS);
      UNITS = sudoku._get_all_units(ROWS, COLS);
      SQUARE_UNITS_MAP = sudoku._get_square_units_map(SQUARES, UNITS);
      SQUARE_PEERS_MAP = sudoku._get_square_peers_map(SQUARES, SQUARE_UNITS_MAP);
    }
    sudoku.generate = function(difficulty, rng) {
      "string" !== typeof difficulty && "undefined" !== typeof difficulty || (difficulty = DIFFICULTY[difficulty] || DIFFICULTY.easy);
      difficulty = sudoku._force_range(difficulty, NR_SQUARES + 1, MIN_GIVENS);
      var unique = false;
      var blank_board = "";
      for (var i = 0; i < NR_SQUARES; ++i) blank_board += ".";
      var candidates = sudoku._get_candidates_map(blank_board);
      var shuffled_squares = sudoku._shuffle(SQUARES, rng);
      for (var si in shuffled_squares) {
        var square = shuffled_squares[si];
        var rand_candidate_idx = sudoku._rand_range(candidates[square].length, 0, rng);
        var rand_candidate = candidates[square][rand_candidate_idx];
        if (!sudoku._assign(candidates, square, rand_candidate)) break;
        var single_candidates = [];
        for (var si in SQUARES) {
          var square = SQUARES[si];
          1 == candidates[square].length && single_candidates.push(candidates[square]);
        }
        if (single_candidates.length >= difficulty && sudoku._strip_dups(single_candidates).length >= 8) {
          var board = "";
          var givens_idxs = [];
          for (var i in SQUARES) {
            var square = SQUARES[i];
            if (1 == candidates[square].length) {
              board += candidates[square];
              givens_idxs.push(i);
            } else board += sudoku.BLANK_CHAR;
          }
          var nr_givens = givens_idxs.length;
          if (nr_givens > difficulty) {
            givens_idxs = sudoku._shuffle(givens_idxs, rng);
            for (var i = 0; i < nr_givens - difficulty; ++i) {
              var target = parseInt(givens_idxs[i]);
              board = board.substr(0, target) + sudoku.BLANK_CHAR + board.substr(target + 1);
            }
          }
          if (sudoku.solve(board)) return board;
        }
      }
      return sudoku.generate(difficulty, rng);
    };
    sudoku.solve = function(board, reverse) {
      var report = sudoku.validate_board(board);
      if (true !== report) throw report;
      var nr_givens = 0;
      for (var i in board) board[i] !== sudoku.BLANK_CHAR && sudoku._in(board[i], sudoku.DIGITS) && ++nr_givens;
      if (nr_givens < MIN_GIVENS) throw "Too few givens. Minimum givens is " + MIN_GIVENS;
      reverse = reverse || false;
      var candidates = sudoku._get_candidates_map(board);
      var result = sudoku._search(candidates, reverse);
      if (result) {
        var solution = "";
        for (var square in result) solution += result[square];
        return solution;
      }
      return false;
    };
    sudoku.get_candidates = function(board) {
      var report = sudoku.validate_board(board);
      if (true !== report) throw report;
      var candidates_map = sudoku._get_candidates_map(board);
      if (!candidates_map) return false;
      var rows = [];
      var cur_row = [];
      var i = 0;
      for (var square in candidates_map) {
        var candidates = candidates_map[square];
        cur_row.push(candidates);
        if (i % 9 == 8) {
          rows.push(cur_row);
          cur_row = [];
        }
        ++i;
      }
      return rows;
    };
    sudoku._get_candidates_map = function(board) {
      var report = sudoku.validate_board(board);
      if (true !== report) throw report;
      var candidate_map = {};
      var squares_values_map = sudoku._get_square_vals_map(board);
      for (var si in SQUARES) candidate_map[SQUARES[si]] = sudoku.DIGITS;
      for (var square in squares_values_map) {
        var val = squares_values_map[square];
        if (sudoku._in(val, sudoku.DIGITS)) {
          var new_candidates = sudoku._assign(candidate_map, square, val);
          if (!new_candidates) return false;
        }
      }
      return candidate_map;
    };
    sudoku._search = function(candidates, reverse) {
      if (!candidates) return false;
      reverse = reverse || false;
      var max_nr_candidates = 0;
      var max_candidates_square = null;
      for (var si in SQUARES) {
        var square = SQUARES[si];
        var nr_candidates = candidates[square].length;
        if (nr_candidates > max_nr_candidates) {
          max_nr_candidates = nr_candidates;
          max_candidates_square = square;
        }
      }
      if (1 === max_nr_candidates) return candidates;
      var min_nr_candidates = 10;
      var min_candidates_square = null;
      for (si in SQUARES) {
        var square = SQUARES[si];
        var nr_candidates = candidates[square].length;
        if (nr_candidates < min_nr_candidates && nr_candidates > 1) {
          min_nr_candidates = nr_candidates;
          min_candidates_square = square;
        }
      }
      var min_candidates = candidates[min_candidates_square];
      if (reverse) for (var vi = min_candidates.length - 1; vi >= 0; --vi) {
        var val = min_candidates[vi];
        var candidates_copy = JSON.parse(JSON.stringify(candidates));
        var candidates_next = sudoku._search(sudoku._assign(candidates_copy, min_candidates_square, val), reverse);
        if (candidates_next) return candidates_next;
      } else for (var vi in min_candidates) {
        var val = min_candidates[vi];
        var candidates_copy = JSON.parse(JSON.stringify(candidates));
        var candidates_next = sudoku._search(sudoku._assign(candidates_copy, min_candidates_square, val));
        if (candidates_next) return candidates_next;
      }
      return false;
    };
    sudoku._assign = function(candidates, square, val) {
      var other_vals = candidates[square].replace(val, "");
      for (var ovi in other_vals) {
        var other_val = other_vals[ovi];
        var candidates_next = sudoku._eliminate(candidates, square, other_val);
        if (!candidates_next) return false;
      }
      return candidates;
    };
    sudoku._eliminate = function(candidates, square, val) {
      if (!sudoku._in(val, candidates[square])) return candidates;
      candidates[square] = candidates[square].replace(val, "");
      var nr_candidates = candidates[square].length;
      if (1 === nr_candidates) {
        var target_val = candidates[square];
        for (var pi in SQUARE_PEERS_MAP[square]) {
          var peer = SQUARE_PEERS_MAP[square][pi];
          var candidates_new = sudoku._eliminate(candidates, peer, target_val);
          if (!candidates_new) return false;
        }
      }
      if (0 === nr_candidates) return false;
      for (var ui in SQUARE_UNITS_MAP[square]) {
        var unit = SQUARE_UNITS_MAP[square][ui];
        var val_places = [];
        for (var si in unit) {
          var unit_square = unit[si];
          sudoku._in(val, candidates[unit_square]) && val_places.push(unit_square);
        }
        if (0 === val_places.length) return false;
        if (1 === val_places.length) {
          var candidates_new = sudoku._assign(candidates, val_places[0], val);
          if (!candidates_new) return false;
        }
      }
      return candidates;
    };
    sudoku._get_square_vals_map = function(board) {
      var squares_vals_map = {};
      if (board.length != SQUARES.length) throw "Board/squares length mismatch.";
      for (var i in SQUARES) squares_vals_map[SQUARES[i]] = board[i];
      return squares_vals_map;
    };
    sudoku._get_square_units_map = function(squares, units) {
      var square_unit_map = {};
      for (var si in squares) {
        var cur_square = squares[si];
        var cur_square_units = [];
        for (var ui in units) {
          var cur_unit = units[ui];
          -1 !== cur_unit.indexOf(cur_square) && cur_square_units.push(cur_unit);
        }
        square_unit_map[cur_square] = cur_square_units;
      }
      return square_unit_map;
    };
    sudoku._get_square_peers_map = function(squares, units_map) {
      var square_peers_map = {};
      for (var si in squares) {
        var cur_square = squares[si];
        var cur_square_units = units_map[cur_square];
        var cur_square_peers = [];
        for (var sui in cur_square_units) {
          var cur_unit = cur_square_units[sui];
          for (var ui in cur_unit) {
            var cur_unit_square = cur_unit[ui];
            -1 === cur_square_peers.indexOf(cur_unit_square) && cur_unit_square !== cur_square && cur_square_peers.push(cur_unit_square);
          }
        }
        square_peers_map[cur_square] = cur_square_peers;
      }
      return square_peers_map;
    };
    sudoku._get_all_units = function(rows, cols) {
      var units = [];
      for (var ri in rows) units.push(sudoku._cross(rows[ri], cols));
      for (var ci in cols) units.push(sudoku._cross(rows, cols[ci]));
      var row_squares = [ "ABC", "DEF", "GHI" ];
      var col_squares = [ "123", "456", "789" ];
      for (var rsi in row_squares) for (var csi in col_squares) units.push(sudoku._cross(row_squares[rsi], col_squares[csi]));
      return units;
    };
    sudoku.board_string_to_grid = function(board_string) {
      var rows = [];
      var cur_row = [];
      for (var i in board_string) {
        cur_row.push(board_string[i]);
        if (i % 9 == 8) {
          rows.push(cur_row);
          cur_row = [];
        }
      }
      return rows;
    };
    sudoku.board_grid_to_string = function(board_grid) {
      var board_string = "";
      for (var r = 0; r < 9; ++r) for (var c = 0; c < 9; ++c) board_string += board_grid[r][c];
      return board_string;
    };
    sudoku.print_board = function(board) {
      var report = sudoku.validate_board(board);
      if (true !== report) throw report;
      var V_PADDING = " ";
      var H_PADDING = "\n";
      var V_BOX_PADDING = "  ";
      var H_BOX_PADDING = "\n";
      var display_string = "";
      for (var i in board) {
        var square = board[i];
        display_string += square + V_PADDING;
        i % 3 === 2 && (display_string += V_BOX_PADDING);
        i % 9 === 8 && (display_string += H_PADDING);
        i % 27 === 26 && (display_string += H_BOX_PADDING);
      }
      console.log(display_string);
    };
    sudoku.validate_board = function(board) {
      if (!board) return "Empty board";
      if (board.length !== NR_SQUARES) return "Invalid board size. Board must be exactly " + NR_SQUARES + " squares.";
      for (var i in board) if (!sudoku._in(board[i], sudoku.DIGITS) && board[i] !== sudoku.BLANK_CHAR) return "Invalid board character encountered at index " + i + ": " + board[i];
      return true;
    };
    sudoku._cross = function(a, b) {
      var result = [];
      for (var ai in a) for (var bi in b) result.push(a[ai] + b[bi]);
      return result;
    };
    sudoku._in = function(v, seq) {
      return -1 !== seq.indexOf(v);
    };
    sudoku._first_true = function(seq) {
      for (var i in seq) if (seq[i]) return seq[i];
      return false;
    };
    sudoku._shuffle = function(seq, rng) {
      var shuffled = [];
      for (var i = 0; i < seq.length; ++i) shuffled.push(false);
      for (var i in seq) {
        var ti = sudoku._rand_range(seq.length, 0, rng);
        while (shuffled[ti]) ti = ti + 1 > seq.length - 1 ? 0 : ti + 1;
        shuffled[ti] = seq[i];
      }
      return shuffled;
    };
    sudoku._rand_range = function(max, min, rng) {
      if (max) return Math.floor(rng.random() * (max - min)) + min;
      throw "Range undefined";
    };
    sudoku._strip_dups = function(seq) {
      var seq_set = [];
      var dup_map = {};
      for (var i in seq) {
        var e = seq[i];
        if (!dup_map[e]) {
          seq_set.push(e);
          dup_map[e] = true;
        }
      }
      return seq_set;
    };
    sudoku._force_range = function(nr, max, min) {
      min = min || 0;
      nr = nr || 0;
      if (nr < min) return min;
      if (nr > max) return max;
      return nr;
    };
    initialize();
    module.exports = sudoku;
    cc._RF.pop();
  }, {} ]
}, {}, [ "Box", "DigitInput", "StageButton", "constants", "dataMgr", "ingameBoardCtor", "ingameInputCtor", "ingamePopupCtor", "ingameSceneCtor", "landingSceneCtor", "levelSelectionSceneCtor", "helpers", "random-seed", "stringify", "sudoku" ]);
//# sourceMappingURL=index.js.map
