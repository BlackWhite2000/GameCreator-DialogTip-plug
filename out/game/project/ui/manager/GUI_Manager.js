var GUI_Manager = (function () {
    function GUI_Manager() {
    }
    GUI_Manager.standardList = function (list, useItemClickSe) {
        if (useItemClickSe === void 0) { useItemClickSe = true; }
        list.on(EventObject.CHANGE, this, function (list, state) {
            if (state == 0)
                list.scrollTo(list.selectedIndex, true, true, 300, Ease.strongOut);
        }, [list]);
        if (useItemClickSe) {
            list.on(UIList.ITEM_CLICK, this, function (list) {
                GameAudio.playSE(ClientWorld.data.sureSE);
            }, [list]);
        }
    };
    GUI_Manager.standardTab = function (tab) {
        stage.on(EventObject.KEY_DOWN, tab, GUI_Manager.onStandardTabKeyDown, [tab]);
        tab["__lastIdx"] = tab.selectedIndex;
        tab.on(EventObject.CHANGE, this, function (tab) {
            var lastIndex = tab["__lastIdx"];
            if (lastIndex >= 0) {
                GameAudio.playSE(ClientWorld.data.selectSE);
            }
            tab["__lastIdx"] = tab.selectedIndex;
        }, [tab]);
    };
    GUI_Manager.regHitAreaFocusList = function (area, list, playSureSE, onFocus, thisPtr) {
        if (playSureSE === void 0) { playSureSE = true; }
        if (onFocus === void 0) { onFocus = null; }
        if (thisPtr === void 0) { thisPtr = null; }
        list.on(UIList.ITEM_CREATE, this, hitAreaFocusListCallback);
        function hitAreaFocusListCallback(ui, data, index) {
            ui.on(EventObject.MOUSE_DOWN, this, function (e) { e.stopPropagation(); });
        }
        area.on(EventObject.MOUSE_DOWN, GUI_Manager, function (list, playSureSE) {
            onFocus && onFocus.apply(thisPtr);
            GUI_Manager.focusList(list, playSureSE);
        }, [list, playSureSE]);
    };
    GUI_Manager.focusList = function (list, playSureSE) {
        if (playSureSE === void 0) { playSureSE = true; }
        if (UIList.focus == list)
            return;
        UIList.focus = list;
        for (var i = 0; i < list.length; i++) {
            var itemBox = list.getItemUI(i);
            if (itemBox.mouseX >= 0 && itemBox.mouseX <= list.itemWidth && itemBox.mouseY >= 0 && itemBox.mouseY <= list.itemHeight) {
                list.selectedIndex = i;
                break;
            }
        }
        if (playSureSE)
            GameAudio.playSE(WorldData.sureSE);
    };
    GUI_Manager.onStandardTabKeyDown = function (tab, e) {
        if (!tab.stage || !tab.mouseEnabled) {
            return;
        }
        var keyCode = e.keyCode;
        var index = tab.selectedIndex;
        if (GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.L1)) {
            index--;
        }
        else if ((GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.R1))) {
            index++;
        }
        else {
            return;
        }
        index = Math.min(tab.length - 1, Math.max(index, 0));
        tab.selectedIndex = index;
    };
    return GUI_Manager;
}());
//# sourceMappingURL=GUI_Manager.js.map