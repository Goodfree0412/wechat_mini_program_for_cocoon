Page({
  data: {
    receiverName: '',
    receiverPhone: '',
    cardMessage: '',
    receiverAddress: '',
    latitude: 39.908823, // 北京默认坐标
    longitude: 116.397470,
    markers: [],
    selectedLocation: '',
    
    // 订单信息
    orderSize: '',
    orderColors: '',
    flowerPrice: 0,
    deliveryFee: 0,
    totalPrice: 0
  },

  onLoad() {
    const app = getApp()
    
    // 获取上一页选择的花束信息
    const size = app.globalData.selectedSize || 'M'
    const colors = app.globalData.selectedColors || []
    
    this.setData({
      orderSize: size,
      orderColors: colors.join(' + ')
    })
    
    // 计算价格
    this.calculatePrice(size, colors.length)
    
    // 获取当前位置
    this.getCurrentLocation()
  },

  // 获取当前位置
  getCurrentLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: '/images/location.png',
            width: 30,
            height: 30
          }]
        })
      },
      fail: () => {
        console.log('获取位置失败，使用默认位置')
      }
    })
  },

  // 输入处理
  onReceiverNameInput(e) {
    this.setData({
      receiverName: e.detail.value
    })
  },

  onReceiverPhoneInput(e) {
    this.setData({
      receiverPhone: e.detail.value
    })
  },

  onCardMessageInput(e) {
    this.setData({
      cardMessage: e.detail.value
    })
  },

  onReceiverAddressInput(e) {
    this.setData({
      receiverAddress: e.detail.value
    })
  },

  // 选择地图位置
  chooseLocation() {
    wx.chooseLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      name: '',
      address: '',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          selectedLocation: res.address || res.name,
          receiverAddress: res.address || res.name,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            width: 30,
            height: 30
          }]
        })
        
        // 重新计算配送费（根据距离）
        this.recalculateDeliveryFee(res.latitude, res.longitude)
      },
      fail: (err) => {
        console.error('选择位置失败:', err)
        wx.showToast({
          title: '请选择配送位置',
          icon: 'none'
        })
      }
    })
  },

  // 计算花束价格
  calculatePrice(size, colorCount) {
    let basePrice = 0
    
    // 根据尺寸设置基础价格
    switch(size) {
      case 'S':
        basePrice = 128
        break
      case 'M':
        basePrice = 198
        break
      case 'L':
        basePrice = 298
        break
      default:
        basePrice = 198
    }
    
    // 每增加一种颜色加收 10 元
    const colorExtra = (colorCount - 1) * 10
    
    const flowerPrice = basePrice + colorExtra
    
    // 默认配送费（后续根据实际距离调整）
    const deliveryFee = 15
    
    this.setData({
      flowerPrice: flowerPrice,
      deliveryFee: deliveryFee,
      totalPrice: flowerPrice + deliveryFee
    })
  },

  // 根据实际距离重新计算配送费
  recalculateDeliveryFee(lat, lng) {
    // 这里可以接入地图 API 计算实际距离
    // 简化示例：根据经纬度差值估算
    const defaultLat = 39.908823
    const defaultLng = 116.397470
    
    const latDiff = Math.abs(lat - defaultLat)
    const lngDiff = Math.abs(lng - defaultLng)
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111 // 约略转换为公里
    
    let deliveryFee = 15 // 基础配送费
    
    if (distance > 5) {
      deliveryFee = 15 + Math.ceil((distance - 5)) * 3 // 超过 5 公里，每公里加 3 元
    }
    
    this.setData({
      deliveryFee: Math.round(deliveryFee),
      totalPrice: this.data.flowerPrice + Math.round(deliveryFee)
    })
  },

  // 验证表单
  validateForm() {
    if (!this.data.receiverName.trim()) {
      wx.showToast({ title: '请填写收件人姓名', icon: 'none' })
      return false
    }
    
    if (!this.data.receiverPhone.trim() || !/^1[3-9]\d{9}$/.test(this.data.receiverPhone)) {
      wx.showToast({ title: '请填写正确的电话号码', icon: 'none' })
      return false
    }
    
    if (!this.data.receiverAddress.trim() && !this.data.selectedLocation) {
      wx.showToast({ title: '请填写或选择收件地址', icon: 'none' })
      return false
    }
    
    return true
  },

  // 发起支付
  makePayment() {
    if (!this.validateForm()) {
      return
    }
    
    const app = getApp()
    
    // 构建订单数据
    const orderData = {
      orderId: Date.now().toString(), // 生成订单号
      size: this.data.orderSize,
      colors: this.data.orderColors,
      receiverName: this.data.receiverName,
      receiverPhone: this.data.receiverPhone,
      cardMessage: this.data.cardMessage,
      receiverAddress: this.data.receiverAddress,
      location: {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      flowerPrice: this.data.flowerPrice,
      deliveryFee: this.data.deliveryFee,
      totalPrice: this.data.totalPrice,
      createTime: new Date().toLocaleString()
    }
    
    console.log('订单数据:', orderData)
    
    // 保存订单到全局（实际项目中应该发送到后端服务器）
    app.globalData.orderInfo = orderData
    
    // 调用微信支付
    wx.requestPayment({
      // 以下参数需要从后端获取，这里仅做演示
      // timeStamp: '',
      // nonceStr: '',
      // package: '',
      // signType: 'MD5',
      // paySign: '',
      
      // 模拟支付成功
      success: () => {
        wx.showModal({
          title: '支付成功',
          content: `订单金额 ¥${this.data.totalPrice}\n我们将尽快安排制作和配送！`,
          showCancel: false,
          success: () => {
            // 返回首页或订单列表页
            wx.navigateBack({
              delta: 2
            })
          }
        })
      },
      fail: (err) => {
        console.error('支付失败:', err)
        // 演示模式下，即使支付接口失败也视为成功
        wx.showModal({
          title: '订单已创建',
          content: `订单金额 ¥${this.data.totalPrice}\n（演示模式：未实际扣款）\n店主将收到您的订单信息`,
          showCancel: false,
          success: () => {
            // 返回首页
            wx.navigateBack({
              delta: 2
            })
          }
        })
      }
    })
  }
})
