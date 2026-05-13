---
name: web-project-workflow
version: 1.1.0
description: Web 项目全流程开发助手。从需求确认，开发、测试到 GitHub Pages 部署的一站式工具。当用户需要开发和部署 Web 项目时使用。
---

# Web 项目全流程开发助手

## 概述

本技能将带你完成 Web 项目从想法到上线的完整流程：
- 📋 **需求确认** - 整理功能细节
- 💻 **开发实现** - 前端功能开发
- 🔍 **安全检查** - 密钥扫描、代码规范
- 🚀 **部署上线** - GitHub Pages 自动部署
- ✅ **验证验收** - 冒烟测试、问题报告

---

## ⚠️ 通用 Agent 能力（重要）

### 1. 外部资源依赖处理能力

**核心原则：** 当项目依赖外部资源（图片/API/字体等）时，**永远准备后备方案**

**典型问题：**
- 外部图片链接失效或被防盗链
- CDN 资源加载失败
- API 请求超时或返回错误
- 第三方服务不可用

**通用解决方案：**

#### 图片后备方案
```tsx
<div className="relative w-16 h-16 bg-blue-100 flex items-center justify-center">
  <img
    src={imageUrl}
    alt={description}
    onError={(e) => {
      const target = e.target as HTMLImageElement
      target.style.display = 'none'
      const parent = target.parentElement
      if (parent) {
        const span = parent.querySelector('.fallback-name') as HTMLElement
        if (span) span.classList.remove('hidden')
      }
    }}
  />
  <span className="hidden fallback-name text-blue-700 font-bold text-sm">
    {displayName}
  </span>
</div>
```

#### API 降级方案
```tsx
try {
  const data = await fetchData()
  setData(data)
} catch (error) {
  setError('加载失败，请重试')
  setData(fallbackData) // 使用本地缓存或默认数据
}
```

**Agent 行为准则：**
- 引入外部资源时，同步实现后备方案
- 使用 `onError` / `onReject` 监听加载失败
- 失败时显示友好的错误提示和重试按钮

### 2. 资源可访问性验证能力

**核心原则：** **不假设**任何外部资源可访问，必须先验证

**验证流程：**
```bash
# 测试链接是否可访问
curl -I "资源URL" 2>&1 | head -n 10

# 检查 HTTP 状态码
# 200 = 成功
# 301/302 = 重定向（需追踪最终地址）
# 400/403/404/500 = 失败
```

**Agent 行为准则：**
- 当用户提供外部链接 → 立即用 curl 验证
- 发现链接失效 → 自动寻找替代方案
- 无法验证时 → 告知用户并请求确认
- 记录验证结果，便于后续排查

### 3. 渐进增强实现能力

**核心原则：** 先实现核心功能，再逐步添加增强特性

**图片处理分级策略：**
1. **Level 1（最快）**：文字占位 + 背景色
2. **Level 2（推荐）**：图标 + 颜色 + 文字组合
3. **Level 3（最终）**：真实图片（需用户确认可用）

**执行顺序：**
- 开发阶段：使用后备方案确保功能完整
- 验证阶段：测试外部资源可用性
- 部署前：让用户确认图片等资源正常显示

---

## 使用流程

### 阶段 1: 需求确认

**步骤：**
1. 与用户确认核心功能
2. 确认项目技术栈
3. 整理功能清单和优先级

**输出：**
- 功能列表（优先级排序）
- 页面结构规划
- 交互流程图

---

### 阶段 2: 开发实现

**任务：**
- 初始化项目结构
- 实现核心功能模块
- 编写公共样式和组件

**检查点：**
- 代码可运行
- 基础功能完整
- 响应式布局适配

**⚠️ 资源依赖检查（必须执行）：**
- 识别所有外部依赖（图片、图标库、API、字体等）
- 为每个外部资源准备后备方案
- 实现 onError/onReject 处理加载失败

---

### 阶段 3: 安全检查与测试

#### 🔑 密钥扫描
检查代码中是否有硬编码的敏感信息：
- API Key
- 密码
- Token
- 私钥

**扫描方法：**
```bash
# 简单模式：搜索常见关键词
grep -r -E "(sk_|password|token|secret|private_key)" --include="*.js" --include="*.html" --include="*.css" .

# 或者遍历检查所有文件
```

如发现硬编码密钥，按以下步骤修复：
1. 将密钥移至 localStorage 或环境变量
2. 提供配置界面（如设置弹窗）
3. 更新文档说明配置方法

#### 🔗 外部资源验证（必须执行）
- 测试所有外部链接可访问性（使用 curl -I）
- 验证 CDN 和第三方库可用
- 确认图标库资源完整加载
- 记录验证结果，标记不可用资源

#### 🧪 功能测试清单
- 页面可正常加载
- 按钮点击响应
- 表单提交正常
- 数据存储/读取正常
- **外部资源后备方案生效**

---

### 阶段 4: GitHub Pages 部署

**前提检查：**
1. 项目已推送到 GitHub 仓库
2. 仓库 Settings → Pages 已启用（Source 选择 GitHub Actions）

**部署步骤：**
1. 创建/检查 `.github/workflows/deploy.yml`
2. 提交并推送代码
3. 触发 GitHub Actions 自动部署
4. 等待部署完成（约 1-3 分钟）
5. 验证访问地址：`https://<username>.github.io/<repo>/`

**标准 deploy.yml 模板：**
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main, master]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: "pages"
  cancel-in-progress: false
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### 阶段 5: 验证验收

**检查清单：**
- ✅ 网站可正常访问
- ✅ 所有页面链接可跳转
- ✅ 核心功能正常运行
- ✅ 响应式布局适配移动端
- ✅ 外部资源正确加载（图片/图标/字体等）

**验证步骤：**
1. 访问部署地址
2. 测试核心功能
3. 检查浏览器控制台错误
4. 使用不同设备/浏览器测试
5. 确认后备方案在资源加载失败时正常工作

---

## 最佳实践

### 开发流程（必遵守）
- **改代码前确认**：所有代码改动前，先向用户说明改动思路，获得确认后再执行
- **交付可访问地址**：可上线版本完成后，必须提供最终访问 URL

### 代码规范
- 变量命名清晰有意义
- 添加必要的注释
- 遵循项目已有的代码风格

### Git 提交
- 小步提交，每提交一个功能点
- Commit message 格式：`类型: 简短描述`（如 `feat: 添加设置弹窗`、`fix: 修复API Key保存`）

### 安全性
- **永远不要** 把密钥、密码、Token 提交到代码库
- 使用环境变量或本地存储管理敏感信息
- 配置界面提示用户自行输入

---

## 常见问题

### Q: 外部资源加载失败？
A: 通用解决方案：
1. 使用 onError/onReject 监听加载失败
2. 显示后备内容（占位图、文字提示）
3. 提供重试机制
4. 记录失败日志供调试

### Q: 如何避免资源失效问题？
A:
1. 优先使用可靠的公共服务（unpkg、jsdelivr）
2. 锁定依赖版本号
3. 本地备份关键资源
4. 实现后备降级方案

### Q: 部署后访问 404？
A: 检查：
1. GitHub Pages 是否在仓库 Settings 中启用
2. Source 是否选择为 GitHub Actions
3. Actions 是否成功运行完成

### Q: 部署后页面空白？
A: 检查：
1. Vite/React Router 的 base 路径配置是否正确
2. 路由 basename 是否与仓库名匹配
3. 查看浏览器控制台是否有错误

### Q: 如何自定义域名？
A: 在项目根目录添加 `CNAME` 文件，内容为你的域名，然后在 DNS 中配置 CNAME 记录。

### Q: 部署后更新不生效？
A: 清除浏览器缓存或等待 5-10 分钟让 CDN 更新。
