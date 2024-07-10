class WorldData {
    static readonly screenMode: number; // = 0; 移动端屏幕布局模式
    static readonly sceneBGMGradientTime: number; // = 0; BGM过渡时间
    static readonly sceneBGSGradientTime: number; // = 0; BGS过渡时间
    static readonly moveToGridCenter: boolean; // = false; 移动至格子中心点
    static readonly moveDir4: boolean; // = false; 四方向移动
    static readonly jumpTimeCost: number; // = 0; 跳跃花费的时间
    static readonly jumpHeight: number; // = 0; 跳跃高度
    static menuEnabled: boolean; // = true;
    static readonly sceneObjectCollisionSize: number; // = 32; 场景对象碰撞范围
    static readonly sceneObjectMoveStartAct: number; // = 2; 行走动作
    static readonly useSceneObjectMoveStartAct2: boolean; // = false; 开启奔跑动作
    static readonly sceneObjectMoveStartAct2Speed: number; // = 0; 奔跑时的速度
    static readonly sceneObjectMoveStartAct2: number; // = 0; 奔跑动作
    static readonly selectSceneObjectEffect: number; // = 0; 场景对象悬停动画
    static readonly saveFileMax: number; // = 10; 存档总数
    static playCtrlEnabled: boolean; // = true;
    static readonly uiCompFocusAnimation: number; // = 0; 界面组件焦点动画
    static gridObsDebug: boolean; // = false; 显示地图格子障碍
    static rectObsDebug: boolean; // = false; 显示对象碰撞盒
    static dragSceneObjectDebug: boolean; // = false; 鼠标左键拖拽对象
    static zoomCameraDebug: boolean; // = false; 滚轮缩放镜头
    static readonly focusEnabled: boolean; // = false; 使用按钮焦点
    static readonly hotKeyListEnabled: boolean; // = false; 允许按键操作列表
    static readonly sceneObjectMoveStartAct2FPS: number; // = 20; 奔跑时的帧率
    static readonly banCollisionSetting: DataStructure_collisionGroupSetting[]; // = [];
    static readonly selectSE: string; // = ""; 光标
    static readonly sureSE: string; // = ""; 确定
    static readonly cancelSE: string; // = ""; 取消
    static readonly disalbeSE: string; // = ""; 禁用
    static readonly dialogSE: string; // = ""; 文本播放音效
    static dialogSEEnabled: boolean; // = true;
    static keyboards: DataStructure_gameKeyboard[]; // = [];
    static word_gamepadInput: string; // = ""; 请按下游戏手柄键位
    static word_keyboardInput: string; // = ""; 请输入键盘键位
    static gameDialogColorShowUI_Bind: DataStructure_textColor_GameDialogColorShowUI[]; // = [];
    static gameDialogColorShowUI_Set: number; // = 1; 当对话文本
    static gameDialogColorShowUI_LoopLength: number; // = 50; 拓展组件的数量
    static gameDialogIsShow: boolean; // = false; 对话框最前方才显示悬浮框
    static gameDialogWhiteList: number[]; // = [];
}
class PlayerData {
    sceneObject: SceneObject;
    package: DataStructure_packageItem[]; // = [];
    gold: number; // = 0; 金币
}