# reserveData 接口 500 错误修复说明

接口对应后端文件：**application/api/controller/reserve/Common.php** 的 **reserveData()** 方法。

---

## 原因简述

1. **最可能**：店铺 `btype` 为 `'3'`（或 0、空等）时，`$dateLists` 从未被赋值，后面 `foreach ($dateLists as ...)` 触发「未定义变量」→ 500。
2. **店铺不存在**：`$shop_info` 为 null 时访问 `$shop_info['btype']` 报错 → 500。
3. **PHP 8+**：`restdates` / `restweek` 为 null 时，`explode(',', null)` 报错 → 500。

---

## 修复步骤（在后端项目中操作）

打开 **application/api/controller/reserve/Common.php**，找到 **reserveData()** 方法中下面这段逻辑（大约 185 行到 210 行附近）：

- `$shop_info = $Shop->where('id', $shop_id)->find();`
- `if($shop_info['btype']=='1'){ ... }`
- `elseif($shop_info['btype']=='2'){ ... }`
- 后面有 `foreach ($monthAllDay as ...) { foreach ($dateLists as ...) { ... } }`

用下面「补丁代码」**整体替换**从「取店铺」到「第一次用到 $dateLists 的 foreach 之前」的那一整段（保留你原有的 btype==2 的循环逻辑和后面的业务代码）。

---

## 补丁代码（复制到 Common.php 中替换对应段落）

```php
// ========== 修复 500：取店铺并判空 ==========
$shop_info = $Shop->where('id', $shop_id)->find();
if (empty($shop_info)) {
    $this->error('店铺不存在');  // 若你项目用其他返回方式，请改成对应写法
    return;
}

// ========== 修复 500：保证 $dateLists 一定有定义（btype 为 3 或其它时不会未定义）==========
$dateLists = [];

if ($shop_info['btype'] == '1') {
    // 指定日期休息：避免 restdates 为 null 时 explode 报错（PHP 8+）
    $restdates = isset($shop_info['restdates']) ? $shop_info['restdates'] : '';
    $dateLists = ($restdates !== null && $restdates !== '')
        ? explode(',', $restdates)
        : [];
} elseif ($shop_info['btype'] == '2') {
    // 每周固定休息：这里保留你原来的 191-202 行逻辑（循环里给 $dateLists 赋值）
    // 若循环里用到了 restweek，建议同样做判空，例如：
    // $restweek = isset($shop_info['restweek']) ? $shop_info['restweek'] : '';
    // 再按你原有逻辑生成 $dateLists
    // ... 你原来的 btype=='2' 的完整代码块 ...
}
// btype 为 '3' 或其它时，$dateLists 保持为空数组，后面 foreach 不会报错

// ========== 下面原有的「获取指定月份所有日期」以及 foreach ($monthAllDay...) foreach ($dateLists...) 保持不变 ==========
```

---

## 注意事项

1. **btype==2 的代码块**：上面用 `// ... 你原来的 btype=='2' 的完整代码块 ...` 标注的地方，需要把你原来 **elseif ($shop_info['btype']=='2')** 里的整段代码原样保留、粘贴进去，不要删掉。
2. **错误返回方式**：若你项目里不是用 `$this->error('店铺不存在');`，请改成你实际使用的方式（例如 `return json(...)` 等）。
3. **restweek 判空**：若 btype==2 分支里用到了 `$shop_info['restweek']` 并传给 `explode`，请同样先判空再 explode，例如：
   ```php
   $restweek = isset($shop_info['restweek']) ? $shop_info['restweek'] : '';
   ```
4. 修改后保存，再让小程序用同一参数请求一次 reserveData，确认不再返回 500。若仍有问题，可查看服务器 PHP 或 ThinkPHP 日志中的具体报错信息（如 "Undefined variable: dateLists" 或 "Trying to access array offset on null"）进一步核对。

---

## 修改完成后

小程序预定页会正常显示：

- 上面的**日期选择**（依赖 reserveData 返回的 dates / arrangeDates）；
- 下面的**包厢/餐桌列表**（依赖 reserveData / reserveData1 返回的 lists）。

若后端已按本文完成修改且接口返回正常，前端无需再改。
