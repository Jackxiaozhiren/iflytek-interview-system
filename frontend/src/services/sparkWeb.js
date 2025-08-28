import CryptoJS from 'crypto-js';

// 封装讯飞语音听写 Web API 的逻辑
class SparkWeb {
  constructor({ onMessage, onError, onOpen, onClose } = {}) {
    this.status = 'closed'; // connecting, open, closed
    this.socket = null;
    this.onMessage = onMessage;
    this.onError = onError;
    this.onOpen = onOpen;
    this.onClose = onClose;
  }

  // 构建认证URL
  getAuthUrl() {
    const apiKey = import.meta.env.VITE_SPARK_API_KEY;
    const apiSecret = import.meta.env.VITE_SPARK_API_SECRET;
    const url = 'wss://rtasr.xfyun.cn/v1/ws';
    const host = 'rtasr.xfyun.cn';
    const date = new Date().toUTCString();
    
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1/ws HTTP/1.1`;
    const signature = CryptoJS.HmacSHA256(signatureOrigin, apiSecret).toString(CryptoJS.enc.Base64);
    
    const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    const authorization = btoa(authorizationOrigin);

    return `${url}?authorization=${authorization}&date=${date}&host=${host}`;
  }

  // 连接
  connect() {
    if (this.status !== 'closed') {
      console.error('WebSocket is not closed.');
      return;
    }
    this.status = 'connecting';
    const url = this.getAuthUrl();
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.status = 'open';
      this.onOpen && this.onOpen();
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === 'result') {
        const result = JSON.parse(data.data);
        this.onMessage && this.onMessage(result);
      }
    };

    this.socket.onerror = (event) => {
      this.status = 'closed';
      this.onError && this.onError(event);
      this.socket.close();
    };

    this.socket.onclose = () => {
      this.status = 'closed';
      this.onClose && this.onClose();
    };
  }

  // 发送数据
  send(data) {
    if (this.status !== 'open') {
      console.error('WebSocket is not open.');
      return;
    }
    this.socket.send(data);
  }

  // 关闭连接
  close() {
    if (this.status === 'open' && this.socket) {
      // 发送结束帧
      this.socket.send(JSON.stringify({ action: 'end' }));
    }
  }
}

export default SparkWeb; 