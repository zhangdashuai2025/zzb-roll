# zzb-roll v1.1.0

根据口播视频与 SRT 提炼重点，使用本地 Remotion 生成可审核、可预览、可导出的 B-roll 动效。现在分别提供 **Codex 版**与 **WorkBuddy 版**，请只下载与你使用的软件对应的 ZIP。

## 下载

| 使用软件 | 下载包 | 安装方式 |
| --- | --- | --- |
| OpenAI Codex | [下载 Codex 版](./zzb-roll-codex-v1.1.0.zip) | 解压后运行 `node install.mjs`，重启 Codex |
| 腾讯 WorkBuddy | [下载 WorkBuddy 版](./zzb-roll-workbuddy-v1.1.0.zip) | WorkBuddy → 专家·技能·连接器 → 技能 → 添加技能 → 上传技能 |

两个版本的核心流程一致：提供视频和 SRT → 审核重点分镜 → 生成 Remotion 预览 → 修改 → 导出合成 MP4 或透明 ProRes 4444 MOV。

Skill 不是独立的视频软件。主机需要获得素材和工作区权限，并能执行本地 Node/Remotion 工程。默认不逐句复刻字幕；每段弹出音效默认关闭，可独立开启和调整音量。

详细教程：

- [Codex 版安装使用说明](docs/Codex版安装使用说明.md)
- [WorkBuddy 版安装使用说明](docs/WorkBuddy版安装使用说明.md)
- [飞书分享总说明](docs/飞书分享总说明.md)

发布包不包含作者的视频、字幕、API Key 或私有工程数据。
