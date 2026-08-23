+++
title = "TopPICR Python 重构笔记"
date = 2026-08-15
slug = "toppicr-refactor-notes"
description = "把 R 写的 Top-down 蛋白组学分析工具 TopPICR 用 Python 重写，集成到 TDEase 2.0 的一些记录。"
tags = ["notes", "proteomics", "python"]
+++

# TopPICR Python 重构笔记

> 这是我在浙大分析测试中心做的 [TopPICR](https://github.com/toppic-team/toppicr)
> Python 重构项目里踩过的一些坑的笔记。
> 还在持续完善，先把目前想清楚的写下来。

## 背景

TopPICR 是 [TopPIC](https://github.com/toppic-team/toppic) 套件里负责
**质谱鉴定结果后处理** 的 R 包。R 本身没问题，但有两个痛点：

1. 我们要把它集成到 Python 写的 TDEase 2.0（一个 AI Agent）里，
   跨语言调用很重。
2. R 包安装依赖比较烦（特别是 Windows + 不同 R 版本）。

所以决定用 Python 重写核心逻辑，保留输入输出格式兼容。

## 整体结构

```text
toppicr-py/
├── toppicr/
│   ├── __init__.py
│   ├── parser.py          # 解析 TopPIC 的 prsm.tsv / protein.tsv
│   ├── processor.py       # 后处理：过滤、合并、E-value 校正
│   ├── formatter.py       # 输出 mzID / tsv / json
│   └── cli.py             # 命令行入口
├── tests/
└── pyproject.toml
```

## 已经解决的几个坑

### 1. E-value 的浮点精度

TopPIC 输出的是字符串形式的 E-value（如 `"1.2e-12"`），
直接 `float()` 在边界值上会溢出。换成 `decimal.Decimal` 解析后
再按字符串排序，效率反而比浮点比较还高。

```python
from decimal import Decimal

def parse_evalue(s: str) -> Decimal:
    return Decimal(s)

def filter_by_evalue(prsms, threshold="1e-5"):
    threshold = Decimal(threshold)
    return [p for p in prsms if parse_evalue(p.evalue) <= threshold]
```

### 2. PrSM 合并的稳定性

同一蛋白可能被多个谱图打到，TopPICR 用某种启发式合并
（具体算法读 R 代码读了一晚上）。
我先用了简单的 "best-E-value 优先 + 共享蛋白的谱图归到同一 group"，
跑出来跟 R 版本对得上 95% 以上，剩下的 5% 在调参中。

### 3. CLI 兼容

保证命令行参数和 R 版本一致，这样原来的 bash 脚本不用改。

## 还没解决的

- 内存占用比 R 版本大（待 profile）
- 某些 corner case 的 prsm 合并顺序与 R 版本略有差异，
  需要一个**大规模的 golden set** 来 verify
- GUI 工具 [TDEase 2.0](https://github.com/toppic-team/toppicr) 还没合并

## 写在后面

如果对 Top-down 蛋白组学 + Python 工程化感兴趣，欢迎提 issue / PR。
数据资源建设、模型训练这块我们也缺人——
特别是能跑通 `TopFD + TopPIC + TopMG` 全流程又愿意写 Python 的人。

联系：[taoyee@zju.edu.cn](mailto:taoyee@zju.edu.cn)
