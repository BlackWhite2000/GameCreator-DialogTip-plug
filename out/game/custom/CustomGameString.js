var CustomGameString;
(function (CustomGameString) {
    function f1(trigger, p) {
        switch (p.type) {
            case 0:
                return Game.currentScene ? Game.currentScene.name : "";
        }
        return "";
    }
    CustomGameString.f1 = f1;
    function f2(trigger, p) {
        if (!Game.currentScene)
            return "";
        var so = ProjectClientScene.getSceneObjectBySetting(p.soType, p.no, p.useVar, p.varID, trigger);
        if (!(so instanceof ProjectClientSceneObject) && p.type != 1)
            return "";
        if (p.type == 0)
            return so.name;
        if (p.type == 1) {
            var varName = void 0;
            if (p.customAttr.selectMode == 1) {
                var mode = p.customAttr.inputModeInfo.mode;
                var constName = p.customAttr.inputModeInfo.constName;
                var varNameIndex = p.customAttr.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.customAttr.varName;
            }
            if (so[varName] == undefined || so[varName] == null)
                return "";
            if (p.customAttr.compAttrEnable) {
                var ui = so[varName];
                if (!ui || !(ui instanceof GUI_BASE))
                    return "";
                var comp = ui.compsIDInfo[p.customAttr.compInfo.compID];
                if (!comp)
                    return "";
                return comp[p.customAttr.compInfo.varName].toString();
            }
            else {
                return so[varName].toString();
            }
        }
        if (p.type == 2) {
            var soModule = so.getModule(p.soModuleAttr.moduleID);
            if (!soModule)
                return "";
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
            if (soModule[varName] == undefined || soModule[varName] == null)
                return "";
            if (p.soModuleAttr.compAttrEnable) {
                var ui = soModule[varName];
                if (!ui || !(ui instanceof GUI_BASE))
                    return "";
                var comp = ui.compsIDInfo[p.soModuleAttr.compInfo.compID];
                if (!comp)
                    return "";
                return comp[p.soModuleAttr.compInfo.varName].toString();
            }
            else {
                return soModule[varName].toString();
            }
        }
    }
    CustomGameString.f2 = f2;
    function f3(trigger, p) {
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
            return "";
        return Game.player.data[varName];
    }
    CustomGameString.f3 = f3;
    function f4(trigger, p) {
        var uiID = p.uiComp.uiID;
        var ui = GameUI.get(uiID);
        if (!ui)
            return "";
        var comp = ui.compsIDInfo[p.uiComp.compID];
        if (!comp)
            return "";
        var value = comp[p.uiComp.varName];
        return value == null ? "" : value.toString();
    }
    CustomGameString.f4 = f4;
    function f5(trigger, p) {
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
            return "";
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
        if (moduleData[varName] == undefined || moduleData[varName] == null)
            return "";
        return moduleData[varName].toString();
    }
    CustomGameString.f5 = f5;
    function f6(trigger, p) {
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
        if (WorldData[varName] == undefined || WorldData[varName] == null)
            return "";
        return WorldData[varName].toString();
    }
    CustomGameString.f6 = f6;
    function f7(trigger, p) {
        switch (p.type) {
            case 0:
                return GUI_Setting.getSystemKeyDesc(GUI_Setting.SYSTEM_KEYS[p.systemKeys]);
            case 1:
                return GameAudio.lastBgmURL + "," + GameAudio.lastBGMVolume + "," + GameAudio.lastBGMPitch;
            case 2:
                return GameAudio.lastBgsURL + "," + GameAudio.lastBGSVolume + "," + GameAudio.lastBGSPitch;
        }
    }
    CustomGameString.f7 = f7;
})(CustomGameString || (CustomGameString = {}));
//# sourceMappingURL=CustomGameString.js.map