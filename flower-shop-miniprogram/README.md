# 花店微信点单小程序

这是一个为花店定制的微信点单小程序，包含以下功能：

## 功能特点

### 第一页 - 花束定制
- **花束大小选择**：S、M、L 三种尺寸的单选按钮
- **颜色搭配选择**：白、蓝、粉、绿、红、紫、黄七种颜色，支持多选（1-3 种）
- **花束预览**：根据客户选择的花束大小和颜色，模糊匹配展示预览图片
- **下一步导航**：完成选择后进入订单填写页面

### 第二页 - 订单填写与支付
- **收件信息表单**：
  - 收件人姓名
  - 收件人电话号码
  - 贺卡内容（选填）
  - 收件地址文字信息
- **地图选点**：可拖动选择配送位置，自动获取经纬度
- **订单金额计算**：
  - 根据花束大小计算基础价格（S: ¥128, M: ¥198, L: ¥298）
  - 每增加一种颜色加收 ¥10
  - 根据配送距离计算配送费用
- **微信支付**：集成微信支付接口，完成付款

## 项目结构

```
flower-shop-miniprogram/
├── app.js                 # 小程序入口文件
├── app.json               # 小程序配置
├── sitemap.json           # Sitemap 配置
├── images/                # 图片资源目录
│   ├── bouquet_s_red.jpg
│   ├── bouquet_s_pink.jpg
│   ├── bouquet_s_white.jpg
│   ├── bouquet_m_red.jpg
│   ├── bouquet_m_pink.jpg
│   ├── bouquet_m_white.jpg
│   ├── bouquet_l_red.jpg
│   ├── bouquet_l_pink.jpg
│   ├── bouquet_l_white.jpg
│   └── location.png
└── pages/
    ├── index/             # 首页（花束定制）
    │   ├── index.js
    │   ├── index.json
    │   ├── index.wxml
    │   └── index.wxss
    └── order/             # 订单页
        ├── order.js
        ├── order.json
        ├── order.wxml
        └── order.wxss
```

## 使用方法

### 1. 导入项目
- 打开微信开发者工具
- 选择"导入项目"
- 选择 `flower-shop-miniprogram` 目录
- 填入您的 AppID（或使用测试号）

### 2. 配置图片资源
将您的花束照片放入 `images/` 目录，命名规则：
- `bouquet_s_red.jpg` - S 号红色系花束
- `bouquet_s_pink.jpg` - S 号粉色系花束
- `bouquet_s_white.jpg` - S 号白色系花束
- `bouquet_m_red.jpg` - M 号红色系花束
- ...以此类推

或者修改 `pages/index/index.js` 中的 `imageMap` 对象来适配您的图片命名。

### 3. 配置微信支付
在实际使用前，需要：
1. 在微信公众平台申请微信支付
2. 在后端服务器实现支付签名接口
3. 修改 `pages/order/order.js` 中的 `makePayment` 函数，填入真实的支付参数

### 4. 后端对接（可选）
当前版本将订单数据保存在全局变量中，实际使用时建议：
- 搭建后端服务器
- 在 `makePayment` 函数中将订单数据发送到后端
- 后端接收订单后通知店主

## 自定义配置

### 修改价格
编辑 `pages/order/order.js` 中的 `calculatePrice` 函数：
```javascript
switch(size) {
  case 'S':
    basePrice = 128  // 修改 S 号价格
    break
  case 'M':
    basePrice = 198  // 修改 M 号价格
    break
  case 'L':
    basePrice = 298  // 修改 L 号价格
    break
}
```

### 修改配送费计算
编辑 `pages/order/order.js` 中的 `recalculateDeliveryFee` 函数，根据您的配送策略调整。

### 修改主题颜色
编辑各页面的 `.wxss` 文件，修改主色调（默认为粉色系 `#ffb6c1`）。

## 注意事项

1. **地图功能**：需要在微信公众平台配置地图权限
2. **支付功能**：需要完成微信支付商户认证
3. **图片资源**：请准备高质量的花束照片以获得更好的预览效果
4. **真机测试**：部分功能（如地图、支付）需要在真机上测试

## 技术支持

如有问题，请查看微信小程序官方文档：
- https://developers.weixin.qq.com/miniprogram/dev/framework/
