---
name: zzb-roll
display_name: zzb-roll 口播 B-roll
display_name_en: zzb-roll Talking-head B-roll
description: 根据口播视频与 SRT 提炼重点，使用本地 Remotion 编写半透明 B-roll 动效，先审核和预览，再接入工程或导出。
description_zh: 根据口播视频与 SRT 提炼重点，使用本地 Remotion 编写半透明 B-roll 动效，先审核和预览，再接入工程或导出。
description_en: Extract key ideas from a talking-head video and SRT, build local Remotion B-roll overlays, review and preview before integration or export.
version: 1.1.0
author: zhangdashuai2025
allowed-tools: Read, Write, Bash
---

# zzb-roll：字幕重点 → Remotion 动效

默认中文交流。此技能复用分析、审核、设计和交付流程，不把新字幕机械填入固定模板。安装技能本身不会直接生成视频；需要用户提供本地视频、SRT 和可写工作区，WorkBuddy 在用户授权后操作本地 Remotion 工程。

## 输入与安全边界

- 读取本次给定的视频、SRT、参考画面和目标工程。只能访问用户授权的目录；缺少权限时先说明需要授权哪个目录，不尝试绕过权限。
- 没有工程时，在用户指定的独立工作目录建立 Remotion 工程。不要把生成文件写进技能安装目录，不覆盖其他项目。
- SRT 只有句级时间时，不声称已得到词级时间。可直接解析字幕；需要精确检查时，从技能目录运行 `node scripts/inspect-srt.mjs <字幕.srt> --fps 30`。
- 新视频先建立草稿。审核或预览不等于应用和导出；没有用户确认，不覆盖正式时间线。
- 不虚构截图、平台界面、评价、项目星数或统计。视频中已经烧录的字幕和卡片是原片像素，不能当独立图层删除。

## 分镜与审核

1. 合并相邻字幕为语义段，选择有视觉价值的重点，不逐句生成。约 50 秒视频通常选 8–10 组，其他时长按语义密度决定。
2. 中文短语通常 4–12 字；包含英文或数字时约 18 个可视字符以内。15 字以上原字幕不得整句照搬，必要专名或数字短语除外。保留条件词、数字和观点归属。
3. 每条草稿保留 `captionIds`、`sourceText`、`keywords`、`summaryRuleVersion: "keyword-v1"`、提炼文案、时间和视觉意图，以便追溯。
4. 从重点所在字幕开始，通常显示 2–4 秒，避免与下一组明显冲突。列表条目按对应字幕依次出现，已出现条目保留，最后一条要有可读停留。
5. 先向用户展示“原文—提炼文案—时间—动画建议”的审核清单。用户可以改字、改时间或取消单条；确认后再写组件。

设计前读取 @references/design.md。根据数字、比例、比较、路径、来源或 CTA 编写适合当前内容的新场景，不强行套用固定模板。

## 编写与预览

- 优先沿用目标工程版本，并保证 `remotion` 与所有 `@remotion/*` 包版本一致。没有工程时可从已验证的 Remotion `4.0.517` 建立项目；安装依赖前先获得用户授权。
- 动画使用 `useCurrentFrame`、`interpolate` 或 `spring` 等帧驱动 API，不使用 CSS animation、transition 或计时器驱动导出画面。
- Player、合成 MP4 和透明 MOV 共用同一套组件和数据。视频文件通过本地服务可访问 URL 提供给浏览器，不直接把 Windows 盘符路径当成网页媒体 URL。
- 默认外层透明、独立深色半透明圆角卡片、白字、蓝色 `#53baff` 与黄色 `#ffd45c` 重点。根据人物与字幕安全区调整布局；移动不应改变字号或尺寸。
- 每段 B-roll 的弹出音效默认关闭。若用户开启，单独保存该段开关与音量，并让音效与视觉事件帧同步。关闭 B-roll 音效不等于关闭 A-roll 原声。
- 给出可播放预览入口和重点跳转。至少实际播放一段，检查时间推进、遮挡、字形、动画和声音。用户只要求预览时，不替换工程。

## 确认与导出

用户明确确认后，才接入正式编辑器或导出。接入现有工程时读取 @references/integration.md，先备份，再验证保存、重开、时间轴和预览返回编辑器。

- 合成 MP4：包含 A-roll、B-roll 与原声。
- 透明 B-roll：只渲染叠加层，使用 ProRes 4444 MOV 与 Alpha，不包含 A-roll 背景和原声，供剪映叠加。

最终报告实际输出路径，并核对文件存在、时长、音轨及 Alpha。只验证了关键帧时，不声称整片已经完成验证。
