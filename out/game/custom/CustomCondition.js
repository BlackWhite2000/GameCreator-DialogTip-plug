var CustomCondition;
(function (CustomCondition) {
    function f1(trigger, p) {
        var so = ProjectClientScene.getSceneObjectBySetting(p.soType, p.soIndex, p.useVar, p.soIndexVarID, trigger);
        if (!so)
            return;
        if (p.type != 13 && !(so instanceof ProjectClientSceneObject))
            return false;
        if (p.type == 0)
            return so.inScene;
        if (p.type == 1)
            return so.fixOri;
        if (p.type == 2)
            return so.selectEnabled;
        if (p.type == 3)
            return so.bridge;
        if (p.type == 4)
            return so.through;
        if (p.type == 5)
            return so.moveAutoChangeAction;
        if (p.type == 6)
            return so.ignoreCantMove;
        if (p.type == 7)
            return so.autoPlayEnable;
        if (p.type == 8)
            return so.isMoving;
        if (p.type == 9)
            return so.isJumping;
        if (p.type == 10)
            return so.repeatedTouchEnabled;
        if (p.type == 11)
            return so.onlyPlayerTouch;
        if (p.type == 12)
            return so.waitTouchEvent;
        if (p.type == 13) {
            var varName = void 0;
            if (p.soCustomAttr.selectMode == 1) {
                var mode = p.soCustomAttr.inputModeInfo.mode;
                var constName = p.soCustomAttr.inputModeInfo.constName;
                var varNameIndex = p.soCustomAttr.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.soCustomAttr.varName;
            }
            if (p.soCustomAttr.compAttrEnable) {
                var ui = so[varName];
                if (!ui || !(ui instanceof GUI_BASE))
                    return false;
                var comp = ui.compsIDInfo[p.soCustomAttr.compInfo.compID];
                if (!comp)
                    return false;
                return comp[p.soCustomAttr.compInfo.varName] ? true : false;
            }
            else {
                return so[varName] ? true : false;
            }
        }
        if (p.type == 14) {
            var soModule = so.getModule(p.soModuleAttr.moduleID);
            if (!soModule)
                return false;
            var varName = void 0;
            if (p.soModuleAttr.selectMode == 1) {
                var mode = p.soModuleAttr.inputModeInfo.mode;
                var constName = p.soModuleAttr.inputModeInfo.constName;
                var varNameIndex = p.soModuleAttr.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.soModuleAttr.varName;
            }
            if (p.soModuleAttr.compAttrEnable) {
                var ui = soModule[varName];
                if (!ui || !(ui instanceof GUI_BASE))
                    return false;
                var comp = ui.compsIDInfo[p.soModuleAttr.compInfo.compID];
                if (!comp)
                    return false;
                return comp[p.soModuleAttr.compInfo.varName] ? true : false;
            }
            else {
                return soModule[varName] ? true : false;
            }
        }
    }
    CustomCondition.f1 = f1;
    function f2(trigger, p) {
        var uiID;
        if (p.checkType == 0) {
            if (p.useVarID) {
                uiID = Game.player.variable.getVariable(p.uiIDVarID);
            }
            else {
                uiID = p.uiID;
            }
        }
        else {
            uiID = p.uiComp.uiID;
        }
        var ui = GameUI.get(uiID);
        if (!ui) {
            if (p.checkType == 0 && p.type == 3)
                return true;
            return false;
        }
        if (p.checkType == 1) {
            var comp = ui.compsIDInfo[p.uiComp.compID];
            if (!comp)
                return false;
            var value = comp[p.uiComp.varName];
            return value ? true : false;
        }
        if (p.type == 0)
            return true;
        if (p.type == 1)
            return false;
        if (p.type == 2)
            return ui.stage ? true : false;
        if (p.type == 3)
            return ui.stage ? false : true;
        if (p.type == 4) {
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
    }
    CustomCondition.f2 = f2;
    function f3(trigger, p) {
        if (p.type == 0)
            return !WorldData.menuEnabled || GameGate.gateState < GameGate.STATE_4_PLAYER_CONTROL_START || Controller.isPlayerTriggerEvent;
        if (p.type == 1)
            return !Controller.inSceneEnabled;
        if (p.type == 2)
            return Game.pause;
        if (p.type == 3)
            return GameDialog.isInDialog;
        if (p.type == 4)
            return WorldData[p.worldAttrName] ? true : false;
        if (p.type == 5)
            return Browser.onMobile;
        if (p.type == 6)
            return os.platform == 3 || os.platform == 0;
        if (p.type == 7) {
            var systemKeyName = GUI_Setting.SYSTEM_KEYS[p.systemKey];
            var systemKeyboardInfo = GUI_Setting.KEY_BOARD[systemKeyName];
            for (var i = 0; i < ProjectUtils.keyboardEvents.length; i++) {
                if (systemKeyboardInfo.keys.indexOf(ProjectUtils.keyboardEvents[i].keyCode) != -1)
                    return true;
            }
            return false;
        }
    }
    CustomCondition.f3 = f3;
    function f4(trigger, p) {
        var moduleID = p.modelData.moduleID;
        var dataID;
        if (p.modelData.dataIsUseVar) {
            dataID = Game.player.variable.getVariable(p.modelData.dataVarID);
        }
        else {
            dataID = p.modelData.dataID;
        }
        var moduleData = GameData.getModuleData(moduleID, dataID);
        if (!moduleData)
            return false;
        var varName;
        if (p.modelData.selectMode == 1) {
            var mode = p.modelData.inputModeInfo.mode;
            var constName = p.modelData.inputModeInfo.constName;
            var varNameIndex = p.modelData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.modelData.varName;
        }
        if (moduleData[varName] == undefined)
            return false;
        return !!moduleData[varName];
    }
    CustomCondition.f4 = f4;
    function f5(trigger, p) {
        var varName;
        if (p.worldData.selectMode == 1) {
            var mode = p.worldData.inputModeInfo.mode;
            var constName = p.worldData.inputModeInfo.constName;
            var varNameIndex = p.worldData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.worldData.varName;
        }
        if (WorldData[varName] == undefined)
            return false;
        return !!WorldData[varName];
    }
    CustomCondition.f5 = f5;
    function f6(trigger, p) {
        var varName;
        if (p.playerData.selectMode == 1) {
            var mode = p.playerData.inputModeInfo.mode;
            var constName = p.playerData.inputModeInfo.constName;
            var varNameIndex = p.playerData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.playerData.varName;
        }
        if (Game.player.data[varName] == undefined)
            return false;
        return !!Game.player.data[varName];
    }
    CustomCondition.f6 = f6;
})(CustomCondition || (CustomCondition = {}));
//# sourceMappingURL=CustomCondition.js.map