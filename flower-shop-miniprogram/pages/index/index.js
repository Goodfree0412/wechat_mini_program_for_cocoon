Page({
  data: {
    selectedSize: 'M',
    colors: [
      { name: '白', active: false },
      { name: '蓝', active: false },
      { name: '粉', active: false },
      { name: '绿', active: false },
      { name: '红', active: false },
      { name: '紫', active: false },
      { name: '黄', active: false }
    ],
    selectedColors: [],
    previewImage: ''
  },

  onLoad() {
    // 初始化默认选中 M 号
    this.setData({
      selectedSize: 'M'
    })
    // 初始匹配预览图
    this.matchPreviewImage()
  },

  // 选择花束大小
  selectSize(e) {
    const size = e.currentTarget.dataset.size
    this.setData({
      selectedSize: size
    })
    this.matchPreviewImage()
  },

  // 切换颜色选择
  toggleColor(e) {
    const color = e.currentTarget.dataset.color
    const colors = this.data.colors
    const selectedColors = [...this.data.selectedColors]

    const index = colors.findIndex(item => item.name === color)
    
    if (index !== -1) {
      if (colors[index].active) {
        // 取消选择
        colors[index].active = false
        const colorIndex = selectedColors.indexOf(color)
        if (colorIndex > -1) {
          selectedColors.splice(colorIndex, 1)
        }
      } else {
        // 选择新颜色（最多3个）
        if (selectedColors.length >= 3) {
          wx.showToast({
            title: '最多选择 3 种颜色',
            icon: 'none'
          })
          return
        }
        colors[index].active = true
        selectedColors.push(color)
      }

      this.setData({
        colors: colors,
        selectedColors: selectedColors
      })

      // 至少选择一个颜色后才匹配预览图
      if (selectedColors.length > 0) {
        this.matchPreviewImage()
      }
    }
  },

  // 模糊匹配预览图
  matchPreviewImage() {
    const size = this.data.selectedSize
    const colors = this.data.selectedColors

    if (colors.length === 0) {
      this.setData({
        previewImage: ''
      })
      return
    }

    // 模拟根据尺寸和颜色匹配图片的逻辑
    // 实际项目中，这里应该调用后端 API 或者从本地图片库中匹配
    const imageMap = {
      'S-红': '/images/bouquet_s_red.jpg',
      'S-粉': '/images/bouquet_s_pink.jpg',
      'S-白': '/images/bouquet_s_white.jpg',
      'M-红': '/images/bouquet_m_red.jpg',
      'M-粉': '/images/bouquet_m_pink.jpg',
      'M-白': '/images/bouquet_m_white.jpg',
      'L-红': '/images/bouquet_l_red.jpg',
      'L-粉': '/images/bouquet_l_pink.jpg',
      'L-白': '/images/bouquet_l_white.jpg'
    }

    // 简单匹配逻辑：使用第一个颜色和尺寸组合
    const primaryColor = colors[0]
    const key = `${size}-${primaryColor}`
    
    // 如果有精确匹配则使用，否则使用默认图片
    let matchedImage = imageMap[key] || `/images/bouquet_${size}_default.jpg`
    
    // 实际项目中可以替换为真实图片路径或 API 调用
    // 这里为了演示，设置一个示例图片（可以使用网络图片或占位图）
    this.setData({
      previewImage: matchedImage
    })

    console.log('匹配预览图:', {
      size: size,
      colors: colors,
      image: matchedImage
    })
  },

  // 跳转到订单页面
  goToOrder() {
    if (this.data.selectedColors.length === 0) {
      wx.showToast({
        title: '请至少选择一种颜色',
        icon: 'none'
      })
      return
    }

    // 保存选择信息到全局数据
    const app = getApp()
    app.globalData.selectedSize = this.data.selectedSize
    app.globalData.selectedColors = this.data.selectedColors
    app.globalData.previewImage = this.data.previewImage

    wx.navigateTo({
      url: '/pages/order/order'
    })
  }
})
