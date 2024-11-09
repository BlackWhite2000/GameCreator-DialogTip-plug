/**
 * 对话文本悬浮框
 */
class GameDialogColorShowUI {
    /**
     * 数据列表
     */
    static dataList: Module_GameDialogColorShowUI[] = [];

    /**
     * 数据长度
     */
    static dataUIListLength = 0;

    /**
     * tips
     */
    static tips: UIBitmap[] = [];

    /**
     * 是否初始化
     */
    static isInit: boolean = false;

    /**
     * 显示时
     */
    static trigger1: CommandTrigger

    /**
     * 关闭时
     */
    static trigger2: CommandTrigger;

    /**
     * 模块
     */
    static PLUGIN_MODULE_TYPE_GameDialogColorShowUI: number = 2;

    /**
     * 显示数据
     */
    static showData() {
        if (!this.isInit) {
            for (let i = 1; i <= GameData.getLength(this.PLUGIN_MODULE_TYPE_GameDialogColorShowUI); i++) {
                this.dataList.push(GameData.getModuleData(this.PLUGIN_MODULE_TYPE_GameDialogColorShowUI, i));
            }
            this.isInit = true;
        }
        this.tips.forEach(
            v => { v.dispose(); }
        )
        this.tips = [];
        let dialog = GameDialog.lastDialog
        let textColorArr = [];
        for (let i = 0; i < WorldData.gameDialogColorShowUI_Bind.length; i++) {
            textColorArr.push(WorldData.gameDialogColorShowUI_Bind[i].textColor)
        }
        dialog.playTextLabels.forEach(v => {
            // @ts-ignore
            let data: Module_GameDialogColorShowUI = this.dataList.filter(vc => { return vc.setID == v.playText && vc.setColor == v.color })[0];
            if (!data) return;
            let textColorIndex = Number(textColorArr.indexOf(v.color));
            if (textColorIndex != -1) {
                let str: UIBitmap = new UIBitmap();
                // @ts-ignore
                str.x = v.parent.localToGlobal(new Point(v.x, v.y)).x
                // @ts-ignore
                str.y = v.parent.localToGlobal(new Point(v.x, v.y)).y
                let k = new UIString();
                k.fontSize = v.fontSize;
                k.letterSpacing = v.letterSpacing
                k.font = v.font;
                // @ts-ignore
                k.text = v.playText;
                k.wordWrap = false;
                str.width = k.textWidth
                str.height = k.textHeight;
                str.mouseEnabled = true;
                this.tips.push(str);
                let textColorUI;
                if (WorldData.gameDialogColorShowUI_Bind[textColorIndex].textShowUI) {
                    textColorUI = WorldData.gameDialogColorShowUI_Bind[textColorIndex].textShowUI;
                } else {
                    trace("【对话文本悬浮框】是不是没指定显示的界面?")
                    return;
                }
                stage.addChild(str)
                str.on(EventObject.MOUSE_OVER, this, () => {
                    if (this.trigger2) {
                        this.trigger2.pause = true;
                        // @ts-ignore
                        this.trigger2 = null;
                    }


                    if (WorldData.gameDialogIsShow && !isShowDialog()) return
                    let ui = GameUI.show(textColorUI);
                    let overEvent = () => {
                        // @ts-ignore
                        if (ui["dialogImage"]) ui["dialogImage"].image = data.setImageData;
                        // @ts-ignore
                        if (ui["dialogText"]) ui["dialogText"].text = getPlaceholderData(data.setTextData);
                        chackDataList(data.setImageDataList, "dialogImage_", "image")
                        chackDataList(data.setTextDataList, "dialogText_", "text")
                        // @ts-ignore
                        function chackDataList(dataName, componentName, dataType) {
                            // @ts-ignore
                            this.dataUIListLength = WorldData.gameDialogColorShowUI_LoopLength;
                            if (dataName.length > WorldData.gameDialogColorShowUI_LoopLength) {
                                // @ts-ignore
                                this.dataUIListLength = dataName.length;
                            }
                            if (dataName.length > 0 && data.setDataList) {
                                for (let i = 0; i < dataName.length; i++) {
                                    // @ts-ignore
                                    if (ui[componentName + i]) {
                                        if (dataType == 'text') {
                                            // @ts-ignore
                                            ui[componentName + i][dataType] = getPlaceholderData(dataName[i]);
                                        } else {
                                            // @ts-ignore
                                            ui[componentName + i][dataType] = dataName[i];
                                        }
                                        // @ts-ignore
                                        ui[componentName + i].visible = true;
                                    }
                                }
                            } else {
                                // @ts-ignore
                                for (let i = 0; i < this.dataUIListLength; i++) {
                                    // @ts-ignore
                                    if (ui[componentName + i]) {
                                        // @ts-ignore
                                        ui[componentName + i][dataType] = "";
                                        // @ts-ignore
                                        ui[componentName + i].visible = false;
                                    }
                                }
                            }
                        }
                        // @ts-ignore
                        this.trigger1 = null
                    }
                    function getPlaceholderData(text: string) {
                        let getData = [
                            (s: any) => { return Game.player.variable.getVariable(s); },
                            (s: any) => { return Game.player.variable.getString(s); },
                            (s: any) => { return ClientWorld.variable.getVariable(s); },
                            (s: any) => { return ClientWorld.variable.getString(s); }
                        ];
                        let regex = [
                            /\[@v\w+\]/g,
                            /\[@s\w+\]/g,
                            /\[\$v\w+\]/g,
                            /\[\$s\w+\]/g
                        ]
                        for (let i = 0; i < getData.length; i++) {
                            let result = replacePlaceholderData(text, regex[i], getData[i]);
                            if (result) {
                                text = result;
                            }
                        }
                        return text;
                    }
                    function replacePlaceholderData(text: string, regex: RegExp, getData: any, start = 3, end = "]") {
                        if (!text.match(regex)) return;
                        let matches = text.match(regex);
                        // @ts-ignore
                        for (let i = 0; i < matches.length; i++) {
                            // @ts-ignore
                            let d = matches[i];
                            let s = Number(d.slice(start, d.indexOf(end)));
                            if (s) {
                                let v = getData(s);
                                text = text.replace(d, v);
                            }
                        }
                        return text;
                    };
                    //
                    let event = WorldData.gameDialogColorShowUI_Bind[textColorIndex].textShowEvent;
                    if (event)
                        // 执行片段事件
                        this.trigger1 = CommandPage.startTriggerFragmentEvent(event, Game.player.sceneObject, Game.player.sceneObject, Callback.New(() => {
                            overEvent();
                        }, this));
                    else overEvent();
                })
                str.on(EventObject.MOUSE_OUT, this, () => {
                    let ui = GameUI.load(textColorUI);
                    // @ts-ignore
                    if (ui["dialogImage"]) ui["dialogImage"].image = "";
                    // @ts-ignore
                    if (ui["dialogText"]) ui["dialogText"].text = "";
                    chackDataList(data.setImageDataList, "dialogImage_", "image")
                    chackDataList(data.setTextDataList, "dialogText_", "text")
                    // @ts-ignore
                    function chackDataList(dataName, componentName, dataType) {
                        if (dataName.length > 0 && data.setDataList) {
                            for (let i = 0; i < dataName.length; i++) {
                                // @ts-ignore
                                if (ui[componentName + i]) {
                                    // @ts-ignore
                                    ui[componentName + i][dataType] = "";
                                    // @ts-ignore
                                    ui[componentName + i].visible = true;
                                }

                            }
                        } else {
                            // @ts-ignore
                            for (let i = 0; i < this.dataUIListLength; i++) {
                                // @ts-ignore
                                if (ui[componentName + i]) {
                                    // @ts-ignore
                                    ui[componentName + i][dataType] = "";
                                    // @ts-ignore
                                    ui[componentName + i].visible = false;
                                }
                            }
                        }
                    }
                    let event = WorldData.gameDialogColorShowUI_Bind[textColorIndex].textHideEvent;
                    // 执行片段事件
                    if (event)
                        this.trigger2 = CommandPage.startTriggerFragmentEvent(event, Game.player.sceneObject, Game.player.sceneObject, Callback.New(() => {
                            if (this.trigger1) this.trigger1.pause = true;
                            GameUI.hide(textColorUI);
                            // @ts-ignore
                            this.trigger2 = null;
                            // @ts-ignore
                            this.trigger1 = null;
                        }, this));
                    else {
                        if (this.trigger1) this.trigger1.pause = true;
                        GameUI.hide(textColorUI);
                        // @ts-ignore
                        this.trigger1 = null;
                        // @ts-ignore
                        this.trigger2 = null;
                    }

                })
            }
        })

        function isShowDialog() {
            // @ts-ignore
            if (!GameDialog.container || !GameDialog.lastDialog) return false;
            // @ts-ignore
            var index = GameDialog.container.numChildren - 1;
            // @ts-ignore
            var ui = GameDialog.container.getChildAt(index);
            if (!ui) return false;

            for (let i = 0; i < WorldData.gameDialogWhiteList.length; i++) {
                const uiID = WorldData.gameDialogWhiteList[i]
                if (isShowUI(uiID)) {
                    return true
                }
            }

            // @ts-ignore
            if (GameDialog.maskLayer && ui == GameDialog.maskLayer) {
                // @ts-ignore
                var dialog = GameDialog.container.getChildAt(index - 1);
                if (!dialog) return false;
                return dialog == GameDialog.lastDialog;
            } else {
                return ui == GameDialog.lastDialog;
            }
        }

        function isShowUI(uiID: number) {
            let ui: GUI_BASE = GameUI.get(uiID) as any;
            let topLayer = Game.layer.uiLayer.numChildren - 1;
            let topUI = Game.layer.uiLayer.getChildAt(topLayer);
            if (!topUI) return false;
            // 虚拟键盘的情况下
            if (topUI == GameUI.get(12)) {
                if (topLayer >= 1) return Game.layer.uiLayer.getChildAt(topLayer - 1) == ui;
                else return false;
            }
            else {
                return topUI == ui;
            }
        }
    }
}
EventUtils.addEventListenerFunction(GameDialog, GameDialog.EVENT_AFTER_DIALOG_START, () => {
    if (WorldData.gameDialogColorShowUI_Set != 0) return
    GameDialogColorShowUI.showData()
}, this);
EventUtils.addEventListenerFunction(GameDialog, GameDialog.EVENT_DIALOG_WORD_PLAY_COMPLETE, () => {
    if (WorldData.gameDialogColorShowUI_Set == 0) return;
    GameDialogColorShowUI.showData()
}, this);
EventUtils.addEventListenerFunction(GameDialog, GameDialog.EVENT_DIALOG_CLOSE, () => {
    GameDialogColorShowUI.tips.forEach(
        v => { v.dispose(); }
    )
}, this);