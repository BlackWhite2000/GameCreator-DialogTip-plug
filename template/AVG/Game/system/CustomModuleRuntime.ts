/**
 * #1 CG鉴赏
 */
class Module_CG {
    id: number;
    name: string;
    CGs: string[]; // = [];
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