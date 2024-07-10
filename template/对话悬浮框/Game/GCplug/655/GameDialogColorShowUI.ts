module OpenAPI {
    /**
     * 对话文本悬浮框
     */
    export class GameDialogColorShowUI {

        /**
         * 当前版本号
         */
        static Version = 1.2;

        /**
         * 是否安装本插件
         */
        static Installed = true;

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
                let data: Module_GameDialogColorShowUI = this.dataList.filter(vc => { return vc.setID == v.playText && vc.setColor == v.color })[0];
                if (!data) return;
                let textColorIndex = Number(textColorArr.indexOf(v.color));
                if (textColorIndex != -1) {
                    let str: UIBitmap = new UIBitmap();
                    str.x = v.parent.localToGlobal(new Point(v.x, v.y)).x
                    str.y = v.parent.localToGlobal(new Point(v.x, v.y)).y
                    let k = new UIString();
                    k.fontSize = v.fontSize;
                    k.letterSpacing = v.letterSpacing
                    k.font = v.font;
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
                            this.trigger2 = null;
                        }
                        let ui = GameUI.show(textColorUI);
                        let overEvent = () => {
                            if (ui["dialogImage"]) ui["dialogImage"].image = data.setImageData;
                            if (ui["dialogText"]) ui["dialogText"].text = getPlaceholderData(data.setTextData);
                            chackDataList(data.setImageDataList, "dialogImage_", "image")
                            chackDataList(data.setTextDataList, "dialogText_", "text")
                            function chackDataList(dataName, componentName, dataType) {
                                this.dataUIListLength = WorldData.gameDialogColorShowUI_LoopLength;
                                if (dataName.length > WorldData.gameDialogColorShowUI_LoopLength) {
                                    this.dataUIListLength = dataName.length;
                                }
                                if (dataName.length > 0 && data.setDataList) {
                                    for (let i = 0; i < dataName.length; i++) {
                                        if (ui[componentName + i]) {
                                            if (dataType == 'text') {
                                                ui[componentName + i][dataType] = getPlaceholderData(dataName[i]);
                                            } else {
                                                ui[componentName + i][dataType] = dataName[i];
                                            }
                                            ui[componentName + i].visible = true;
                                        }
                                    }
                                } else {
                                    for (let i = 0; i < this.dataUIListLength; i++) {
                                        if (ui[componentName + i]) {
                                            ui[componentName + i][dataType] = "";
                                            ui[componentName + i].visible = false;
                                        }
                                    }
                                }
                            }
                            this.trigger1 = null
                        }
                        function getPlaceholderData(text: string) {
                            let getData = [
                                (s) => { return Game.player.variable.getVariable(s); },
                                (s) => { return Game.player.variable.getString(s); },
                                (s) => { return ClientWorld.variable.getVariable(s); },
                                (s) => { return ClientWorld.variable.getString(s); }
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
                            for (let i = 0; i < matches.length; i++) {
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
                        if (ui["dialogImage"]) ui["dialogImage"].image = "";
                        if (ui["dialogText"]) ui["dialogText"].text = "";
                        chackDataList(data.setImageDataList, "dialogImage_", "image")
                        chackDataList(data.setTextDataList, "dialogText_", "text")
                        function chackDataList(dataName, componentName, dataType) {
                            if (dataName.length > 0 && data.setDataList) {
                                for (let i = 0; i < dataName.length; i++) {
                                    if (ui[componentName + i]) {
                                        ui[componentName + i][dataType] = "";
                                        ui[componentName + i].visible = true;
                                    }

                                }
                            } else {
                                for (let i = 0; i < this.dataUIListLength; i++) {
                                    if (ui[componentName + i]) {
                                        ui[componentName + i][dataType] = "";
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
                                this.trigger2 = null;
                                this.trigger1 = null;
                            }, this));
                        else {
                            if (this.trigger1) this.trigger1.pause = true;
                            GameUI.hide(textColorUI);
                            this.trigger1 = null;
                            this.trigger2 = null;
                        }

                    })
                }
            })
        }
    }
}
EventUtils.addEventListenerFunction(GameDialog, GameDialog.EVENT_AFTER_DIALOG_START, () => {
    if (WorldData.gameDialogColorShowUI_Set != 0) return
    OpenAPI.GameDialogColorShowUI.showData()
}, this);
EventUtils.addEventListenerFunction(GameDialog, GameDialog.EVENT_DIALOG_WORD_PLAY_COMPLETE, () => {
    if (WorldData.gameDialogColorShowUI_Set == 0) return;
    OpenAPI.GameDialogColorShowUI.showData()
}, this);
EventUtils.addEventListenerFunction(GameDialog, GameDialog.EVENT_DIALOG_CLOSE, () => {
    OpenAPI.GameDialogColorShowUI.tips.forEach(
        v => { v.dispose(); }
    )
}, this);