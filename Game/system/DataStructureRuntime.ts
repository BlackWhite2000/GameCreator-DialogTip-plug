/**
 * #1 preloadAsset
 */
class DataStructure_preloadAsset {
    assetType: number; // = 0; 资源类型
    asset0: string; // = ""; 图片
    asset1: string; // = ""; 音频
    asset2: number; // = 1; 行走图
    asset3: number; // = 1; 立绘
    asset4: number; // = 1; 动画
    asset5: number; // = 1; 界面
    asset6: number; // = 1; 对话框
}
/**
 * #2 packageItem
 */
class DataStructure_packageItem {
    item: Module_Item; // = 0; 道具
    number: number; // = 1; 数目
}
/**
 * #3 keys
 */
class DataStructure_keys {
    key: number; // = 0; 按键
}
/**
 * #4 
 */
class DataStructure_unnamed4 {
}
/**
 * #5 shopItem
 */
class DataStructure_shopItem {
    item: number; // = 1; 道具
    numberType: number; // = 0;
    number: number; // = 0;
    numberVar: number; // = 1;
    priceType: number; // = 0;
    price: number; // = 0;
    priceVar: number; // = 1;
}
/**
 * #6 gameKeyboard
 */
class DataStructure_gameKeyboard {
    gameKey: number; // = 0; 键位
    keyCode1: number; // = 0; 值1
    keyCode2: number; // = 0; 值2
    keyCode3: number; // = 0; 值3
    keyCode4: number; // = 0; 值4
}
/**
 * #7 inputMessage
 */
class DataStructure_inputMessage {
    type: number; // = 0; 类别
    numberValue: any; // 游戏数值
    booleanValue: any; // 游戏开关
    stringValue: any; // 游戏字符串
}
/**
 * #8 collisionGroupSetting
 */
class DataStructure_collisionGroupSetting {
    group1: number; // = 0; 组-1
    group2: number; // = 0; 组-2
}
/**
 * #15001 设定_绑定触发文本颜色
 */
class DataStructure_textColor_GameDialogColorShowUI {
    textColor: string; // = "#ffffff"; 颜色
    textShowUI: number; // = 0; 显示界面
    textShowEvent: string; // = ""; 显示时
    textHideEvent: string; // = ""; 关闭时
}