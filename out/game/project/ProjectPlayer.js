














var ProjectPlayer = (function (_super) {
    __extends(ProjectPlayer, _super);
    function ProjectPlayer() {
        return _super.call(this, true) || this;
    }
    ProjectPlayer.increaseGold = function (v) {
        Game.player.data.gold = Math.max(Game.player.data.gold + v, 0);
        EventUtils.happen(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_GOLD_NUMBER);
    };
    ProjectPlayer.getItemDS = function (itemID) {
        return ArrayUtils.matchAttributesD2(Game.player.data.package, "item", { id: itemID }, true)[0];
    };
    ProjectPlayer.getItem = function (itemID) {
        var itemDS = this.getItemDS(itemID);
        if (itemDS)
            return itemDS.item;
        return null;
    };
    ProjectPlayer.changeItemNumber = function (itemID, v) {
        if (!GameData.getModuleData(1, itemID))
            return;
        if (v > 0) {
            var itemDS = this.getItemDS(itemID);
            if (itemDS) {
                itemDS.number += v;
            }
            else {
                itemDS = new DataStructure_packageItem;
                itemDS.item = GameData.newModuleData(1, itemID);
                itemDS.number = v;
                Game.player.data.package.push(itemDS);
            }
        }
        else {
            var itemDS = this.getItemDS(itemID);
            if (itemDS) {
                itemDS.number += v;
                if (itemDS.number <= 0)
                    Game.player.data.package.splice(Game.player.data.package.indexOf(itemDS), 1);
            }
        }
        EventUtils.happen(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER);
    };
    ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER = "ProjectPlayerCHANGE_ITEM_NUMBER";
    ProjectPlayer.EVENT_CHANGE_GOLD_NUMBER = "ProjectPlayerCHANGE_GOLD_NUMBER";
    return ProjectPlayer;
}(ClientPlayer));
//# sourceMappingURL=ProjectPlayer.js.map