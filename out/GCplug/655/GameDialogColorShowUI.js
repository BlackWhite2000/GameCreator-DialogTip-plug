var GameDialogColorShowUI = (function () {
    function GameDialogColorShowUI() {
    }
    GameDialogColorShowUI.getModuleData = function (id, comp, length) {
        if (length === void 0) { length = 16; }
        for (var i = 1; i <= length; i++) {
            for (var j = 1; j <= GameData.getLength(id, i); j++) {
                var d = GameData.getModuleData(id, (i - 1) * 1000 + j);
                if (d && d.name) {
                    comp.runWith([d]);
                }
            }
        }
    };
    GameDialogColorShowUI.showData = function () {
        var _this = this;
        if (!this.isInit) {
            GameDialogColorShowUI.getModuleData(this.PLUGIN_MODULE_TYPE_GameDialogColorShowUI, Callback.New(function (data) {
                _this.dataList.push(data);
            }, this));
            this.isInit = true;
        }
        this.tips.forEach(function (v) { v.dispose(); });
        this.tips = [];
        var dialog = GameDialog.lastDialog;
        var textColorArr = [];
        for (var i = 0; i < WorldData.gameDialogColorShowUI_Bind.length; i++) {
            textColorArr.push(WorldData.gameDialogColorShowUI_Bind[i].textColor);
        }
        dialog.playTextLabels.forEach(function (v) {
            var data = _this.dataList.filter(function (vc) { return vc.setID == v.playText && vc.setColor == v.color; })[0];
            if (!data)
                return;
            var textColorIndex = Number(textColorArr.indexOf(v.color));
            if (textColorIndex != -1) {
                var str = new UIBitmap();
                if (!v.parent)
                    return;
                var localToGlobal = v.parent.localToGlobal(new Point(v.x, v.y));
                if (!localToGlobal)
                    return;
                str.x = localToGlobal.x;
                str.y = localToGlobal.y;
                var k = new UIString();
                k.fontSize = v.fontSize;
                k.letterSpacing = v.letterSpacing;
                k.font = v.font;
                k.text = v.playText;
                k.wordWrap = false;
                str.width = k.textWidth;
                str.height = k.textHeight;
                str.mouseEnabled = true;
                _this.tips.push(str);
                var textColorUI_1;
                if (WorldData.gameDialogColorShowUI_Bind[textColorIndex].textShowUI) {
                    textColorUI_1 = WorldData.gameDialogColorShowUI_Bind[textColorIndex].textShowUI;
                }
                else {
                    trace("【对话文本悬浮框】是不是没指定显示的界面?");
                    return;
                }
                stage.addChild(str);
                str.on(EventObject.MOUSE_OVER, _this, function () {
                    if (_this.trigger2) {
                        _this.trigger2.pause = true;
                        _this.trigger2 = null;
                    }
                    if (WorldData.gameDialogIsShow && !isShowDialog())
                        return;
                    var ui = GameUI.show(textColorUI_1);
                    var overEvent = function () {
                        if (ui["dialogImage"])
                            ui["dialogImage"].image = data.setImageData;
                        if (ui["dialogText"])
                            ui["dialogText"].text = getPlaceholderData(data.setTextData);
                        chackDataList(data.setImageDataList, "dialogImage_", "image");
                        chackDataList(data.setTextDataList, "dialogText_", "text");
                        function chackDataList(dataName, componentName, dataType) {
                            this.dataUIListLength = WorldData.gameDialogColorShowUI_LoopLength;
                            if (dataName.length > WorldData.gameDialogColorShowUI_LoopLength) {
                                this.dataUIListLength = dataName.length;
                            }
                            if (dataName.length > 0 && data.setDataList) {
                                for (var i = 0; i < dataName.length; i++) {
                                    if (ui[componentName + i]) {
                                        if (dataType == 'text') {
                                            ui[componentName + i][dataType] = getPlaceholderData(dataName[i]);
                                        }
                                        else {
                                            ui[componentName + i][dataType] = dataName[i];
                                        }
                                        ui[componentName + i].visible = true;
                                    }
                                }
                            }
                            else {
                                for (var i = 0; i < this.dataUIListLength; i++) {
                                    if (ui[componentName + i]) {
                                        ui[componentName + i][dataType] = "";
                                        ui[componentName + i].visible = false;
                                    }
                                }
                            }
                        }
                        _this.trigger1 = null;
                    };
                    function getPlaceholderData(text) {
                        var getData = [
                            function (s) { return Game.player.variable.getVariable(s); },
                            function (s) { return Game.player.variable.getString(s); },
                            function (s) { return ClientWorld.variable.getVariable(s); },
                            function (s) { return ClientWorld.variable.getString(s); }
                        ];
                        var regex = [
                            /\[@v\w+\]/g,
                            /\[@s\w+\]/g,
                            /\[\$v\w+\]/g,
                            /\[\$s\w+\]/g
                        ];
                        for (var i = 0; i < getData.length; i++) {
                            var result = replacePlaceholderData(text, regex[i], getData[i]);
                            if (result) {
                                text = result;
                            }
                        }
                        return text;
                    }
                    function replacePlaceholderData(text, regex, getData, start, end) {
                        if (start === void 0) { start = 3; }
                        if (end === void 0) { end = "]"; }
                        if (!text.match(regex))
                            return;
                        var matches = text.match(regex);
                        for (var i = 0; i < matches.length; i++) {
                            var d = matches[i];
                            var s = Number(d.slice(start, d.indexOf(end)));
                            if (s) {
                                var v_1 = getData(s);
                                text = text.replace(d, v_1);
                            }
                        }
                        return text;
                    }
                    ;
                    var event = WorldData.gameDialogColorShowUI_Bind[textColorIndex].textShowEvent;
                    if (event)
                        _this.trigger1 = CommandPage.startTriggerFragmentEvent(event, Game.player.sceneObject, Game.player.sceneObject, Callback.New(function () {
                            overEvent();
                        }, _this));
                    else
                        overEvent();
                });
                str.on(EventObject.MOUSE_OUT, _this, function () {
                    var ui = GameUI.load(textColorUI_1);
                    if (ui["dialogImage"])
                        ui["dialogImage"].image = "";
                    if (ui["dialogText"])
                        ui["dialogText"].text = "";
                    chackDataList(data.setImageDataList, "dialogImage_", "image");
                    chackDataList(data.setTextDataList, "dialogText_", "text");
                    function chackDataList(dataName, componentName, dataType) {
                        if (dataName.length > 0 && data.setDataList) {
                            for (var i = 0; i < dataName.length; i++) {
                                if (ui[componentName + i]) {
                                    ui[componentName + i][dataType] = "";
                                    ui[componentName + i].visible = true;
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < this.dataUIListLength; i++) {
                                if (ui[componentName + i]) {
                                    ui[componentName + i][dataType] = "";
                                    ui[componentName + i].visible = false;
                                }
                            }
                        }
                    }
                    var event = WorldData.gameDialogColorShowUI_Bind[textColorIndex].textHideEvent;
                    if (event)
                        _this.trigger2 = CommandPage.startTriggerFragmentEvent(event, Game.player.sceneObject, Game.player.sceneObject, Callback.New(function () {
                            if (_this.trigger1)
                                _this.trigger1.pause = true;
                            GameUI.hide(textColorUI_1);
                            _this.trigger2 = null;
                            _this.trigger1 = null;
                        }, _this));
                    else {
                        if (_this.trigger1)
                            _this.trigger1.pause = true;
                        GameUI.hide(textColorUI_1);
                        _this.trigger1 = null;
                        _this.trigger2 = null;
                    }
                });
            }
        });
        function isShowDialog() {
            if (!GameDialog.container || !GameDialog.lastDialog)
                return false;
            var index = GameDialog.container.numChildren - 1;
            var ui = GameDialog.container.getChildAt(index);
            if (!ui)
                return false;
            for (var i = 0; i < WorldData.gameDialogWhiteList.length; i++) {
                var uiID = WorldData.gameDialogWhiteList[i];
                if (isShowUI(uiID)) {
                    return true;
                }
            }
            if (GameDialog.maskLayer && ui == GameDialog.maskLayer) {
                var dialog = GameDialog.container.getChildAt(index - 1);
                if (!dialog)
                    return false;
                return dialog == GameDialog.lastDialog;
            }
            else {
                return ui == GameDialog.lastDialog;
            }
        }
        function isShowUI(uiID) {
            var ui = GameUI.get(uiID);
            var topLayer = Game.layer.uiLayer.numChildren - 1;
            var topUI = Game.layer.uiLayer.getChildAt(topLayer);
            if (!topUI)
                return false;
            if (topUI == GameUI.get(12)) {
                if (topLayer >= 1)
                    return Game.layer.uiLayer.getChildAt(topLayer - 1) == ui;
                else
                    return false;
            }
            else {
                return topUI == ui;
            }
        }
    };
    GameDialogColorShowUI.dataList = [];
    GameDialogColorShowUI.dataUIListLength = 0;
    GameDialogColorShowUI.tips = [];
    GameDialogColorShowUI.isInit = false;
    GameDialogColorShowUI.PLUGIN_MODULE_TYPE_GameDialogColorShowUI = 2;
    return GameDialogColorShowUI;
}());
EventUtils.addEventListenerFunction(GameDialog, GameDialog.EVENT_AFTER_DIALOG_START, function () {
    if (WorldData.gameDialogColorShowUI_Set != 0)
        return;
    GameDialogColorShowUI.showData();
}, this);
EventUtils.addEventListenerFunction(GameDialog, GameDialog.EVENT_DIALOG_WORD_PLAY_COMPLETE, function () {
    if (WorldData.gameDialogColorShowUI_Set == 0)
        return;
    GameDialogColorShowUI.showData();
}, this);
EventUtils.addEventListenerFunction(GameDialog, GameDialog.EVENT_DIALOG_CLOSE, function () {
    GameDialogColorShowUI.tips.forEach(function (v) { v.dispose(); });
}, this);
//# sourceMappingURL=GameDialogColorShowUI.js.map