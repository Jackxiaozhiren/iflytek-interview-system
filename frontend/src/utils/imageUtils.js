/**
 * 图片错误处理工具 - iFlytek 多模态面试评估系统
 * 提供统一的图片加载错误处理
 */

/**
 * 创建图片错误处理函数
 * @param {string} fallbackImage - 备用图片路径
 * @returns {Function} 错误处理函数
 */
export const createImageErrorHandler = (fallbackImage = '/images/placeholder-case.jpg') => {
  return (event) => {
    const target = event.target;
    
    // 避免无限循环，如果已经是fallback图片就不再重试
    if (target.src.includes(fallbackImage)) {
      // 如果连fallback图片也加载失败，使用内联SVG占位符
      const svgPlaceholder = createInlineSVGPlaceholder(
        target.dataset.width || 400,
        target.dataset.height || 300,
        target.dataset.text || '图片加载失败'
      );
      target.src = svgPlaceholder;
      return;
    }
    
    // 尝试使用fallback图片
    target.src = fallbackImage;
  };
};

/**
 * 创建内联SVG占位符
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {string} text - 显示文本
 * @param {string} bgColor - 背景颜色
 * @param {string} textColor - 文字颜色
 * @returns {string} SVG数据URL
 */
export const createInlineSVGPlaceholder = (
  width = 400, 
  height = 300, 
  text = '图片加载失败',
  bgColor = '#f0f0f0',
  textColor = '#999999'
) => {
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <text x="${width/2}" y="${height/2}" text-anchor="middle" dominant-baseline="middle" 
            fill="${textColor}" font-size="${Math.min(width, height) * 0.08}" 
            font-family="Microsoft YaHei, Arial, sans-serif">
        ${text}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
};

/**
 * 默认的图片错误处理函数
 */
export const defaultImageErrorHandler = createImageErrorHandler();

/**
 * 案例图片错误处理函数
 */
export const caseImageErrorHandler = createImageErrorHandler('/images/placeholder-case.jpg');

/**
 * 演示图片错误处理函数
 */
export const demoImageErrorHandler = createImageErrorHandler('/images/placeholder-demo.jpg');

/**
 * 功能图片错误处理函数
 */
export const featureImageErrorHandler = createImageErrorHandler('/images/placeholder-feature.jpg');

/**
 * 视频图片错误处理函数
 */
export const videoImageErrorHandler = createImageErrorHandler('/images/placeholder-video.jpg');

/**
 * 预加载图片
 * @param {string} src - 图片路径
 * @returns {Promise} 加载Promise
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * 批量预加载图片
 * @param {string[]} srcs - 图片路径数组
 * @returns {Promise} 加载Promise
 */
export const preloadImages = (srcs) => {
  return Promise.allSettled(srcs.map(preloadImage));
};

/**
 * 获取图片尺寸
 * @param {string} src - 图片路径
 * @returns {Promise<{width: number, height: number}>} 尺寸信息
 */
export const getImageDimensions = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * 检查图片是否存在
 * @param {string} src - 图片路径
 * @returns {Promise<boolean>} 是否存在
 */
export const checkImageExists = async (src) => {
  try {
    await preloadImage(src);
    return true;
  } catch {
    return false;
  }
};

/**
 * 创建响应式图片srcset
 * @param {string} basePath - 基础路径
 * @param {string} filename - 文件名（不含扩展名）
 * @param {string} extension - 文件扩展名
 * @param {number[]} sizes - 尺寸数组
 * @returns {string} srcset字符串
 */
export const createResponsiveSrcset = (basePath, filename, extension, sizes = [400, 800, 1200]) => {
  return sizes
    .map(size => `${basePath}/${filename}-${size}w.${extension} ${size}w`)
    .join(', ');
};

/**
 * iFlytek品牌色彩的占位符生成器
 */
export const createIFlytekPlaceholder = (width, height, text, type = 'primary') => {
  const colors = {
    primary: { bg: '#1890ff', text: '#ffffff' },
    secondary: { bg: '#667eea', text: '#ffffff' },
    accent: { bg: '#764ba2', text: '#ffffff' },
    success: { bg: '#52c41a', text: '#ffffff' },
    warning: { bg: '#faad14', text: '#ffffff' },
    error: { bg: '#ff4d4f', text: '#ffffff' }
  };
  
  const color = colors[type] || colors.primary;
  return createInlineSVGPlaceholder(width, height, text, color.bg, color.text);
};
