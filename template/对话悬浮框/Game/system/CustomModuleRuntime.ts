/**
 * #1 道具
 */
class Module_Item {
    id: number;
    name: string;
    icon: string; // = ""; 图标
    intro: string; // = "";
    sell: number; // = 0; 商店售价
    isUse: boolean; // = false; 可使用
    sellEnabled: boolean; // = false; 允许出售给商店
    isConsumables: boolean; // = false; 消耗品
    se: string; // = ""; 使用时音效
    callEvent: string; // = ""; 使用后执行的事件
}
/**
 * #2 对话悬浮框
 */
class Module_GameDialogColorShowUI {
    id: number;
    name: string;
    setID: string; // = ""; 标识符
    setColor: string; // = ""; 标识色
    setImageData: string; // = ""; 图片
    setTextData: string; // = ""; 文本
    setDataList: boolean; // = false; 更多数据拓展
    setImageDataList: string[]; // = [];
    setTextDataList: string[]; // = [];
}
