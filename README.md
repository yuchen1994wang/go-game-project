# 围棋对练复盘

一个基于纯 HTML/CSS/JavaScript 的围棋对弈与复盘应用，支持 AI 分析和走法评分。

## ✨ 功能特性

- 🎯 **对弈模式**：支持 9/13/19 路棋盘，黑白玩家对弈
- ⏱️ **计时器**：双方独立计时，支持暂停、封盘
- 📝 **棋谱记录**：完整记录对局过程，支持悔棋
- 🤖 **AI 复盘**：使用 OpenRouter API 提供全局复盘和单步评分
- 🎓 **死活题练习**：包含 30+ 道经典死活题，支持提示、答案、错题本
- 💾 **本地存储**：对局记录和设置自动保存到浏览器
- 🌓 **主题切换**：支持深色/浅色主题
- 📱 **响应式设计**：适配移动端和桌面端

## 🚀 快速开始

### 访问地址

https://yuchen1994wang.github.io/go-game-project/

### 本地运行

```bash
git clone https://github.com/yuchen1994wang/go-game-project.git
cd go-game-project
# 使用任何静态服务器打开，例如
python -m http.server 8080
# 或
npx serve
```

## 🔧 配置 OpenRouter API Key

本应用使用 OpenRouter 提供 AI 分析服务，需要先配置 API Key：

1. 访问 [OpenRouter](https://openrouter.ai/) 注册并获取免费 API Key
2. 打开应用首页
3. 点击右上角 ⚙️ **设置** 按钮
4. 输入你的 API Key 并点击 **保存**

（可选）点击 **测试** 验证 API Key 是否有效

## 🎮 使用说明

### 开始对弈

1. 进入首页，点击 **开始对弈**
2. 选择棋盘大小（9/13/19 路）
3. 输入黑白双方玩家名称
4. 点击 **开始对弈**

### 对弈操作

- 点击棋盘落子
- **停一手**：跳过当前回合
- **悔棋**：撤销上一步
- **封盘**：隐藏棋盘内容
- **点评**：AI 分析当前局面
- **结束对弈**：进入复盘页面

### 复盘

1. 在首页选择历史对局
2. 或在对弈结束后自动跳转
3. 查看 AI 复盘分析
4. 点击棋盘上的手数查看单步评分
5. 点击 **评价这手** 获取详细分析

### 死活题练习

1. 在首页点击 **🎓 死活题练习**
2. 选择题目难度和位置筛选
3. 点击棋盘空位落子答题
4. 使用 **💡 提示** 获取提示
5. 使用 **📖 查看答案** 查看完整答案
6. 使用 **🔄 重置** 重新开始
7. 错题会自动加入 **错题本**，方便复习

## 📂 项目结构

```
go-game-project/
├── index.html              # 入口页面（自动跳转）
├── css/
│   └── common.css          # 公共样式
├── js/
│   ├── utils.js           # 工具函数
│   ├── storage.js         # 存储管理
│   ├── game.js            # 游戏引擎
│   ├── go-engine.js       # 围棋规则引擎
│   ├── ai.js              # AI 分析
│   ├── tsumego-data.js    # 死活题题库
│   └── tsumego-storage.js # 死活题进度存储
├── pages/
│   ├── auth.html           # 登录页
│   ├── home.html           # 首页/对局列表
│   ├── setup.html          # 对局设置
│   ├── game.html           # 对弈页
│   ├── review.html         # 复盘页
│   ├── practice.html       # 死活题列表
│   └── tsumego.html        # 死活题练习
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages 部署配置
```

## 🛠️ 技术栈

- **前端**：纯 HTML5/CSS3/ES6+ JavaScript
- **AI**：OpenRouter API（默认使用 openai/gpt-oss-120b:free）
- **部署**：GitHub Pages + GitHub Actions
- **存储**：浏览器 localStorage

## 📄 许可证

MIT License

