---
title: "把公式、代码与流程放进同一篇笔记"
published: "2026-09-18"
description: "从一个简单的迭代过程出发，看看数学公式、代码高亮和流程图如何一起解释一个问题。"
category: "学习笔记"
tags: ["数学","编程","演示"]
moods: ["🤔 思考","✨ 灵感"]
---

## 数学表达

梯度下降的一次更新可以写成：

$$
x_{k+1}=x_k-\eta\nabla f(x_k)
$$

其中 $\eta$ 是步长。对于 $f(x)=x^2$，梯度为 $2x$。

## 用代码表达

```python
def gradient_step(x, learning_rate=0.1):
    return x - learning_rate * 2 * x

x = 3.0
for step in range(10):
    x = gradient_step(x)
    print(step, x)
```

## 过程可视化

```mermaid
flowchart LR
    A[设定初值] --> B[计算梯度]
    B --> C[更新变量]
    C --> D{是否收敛}
    D -->|否| B
    D -->|是| E[输出结果]
```

## 再想一步

公式解释关系，代码明确步骤，流程图展现结构。三者放在一起，更适合回顾。
