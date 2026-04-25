import JSEncrypt from 'jsencrypt';

/**
 * RSA 加密工具类
 */
class CryptoUtil {
  private encrypt: JSEncrypt | null = null;
  private publicKey: string = '';

  /**
   * 设置公钥
   */
  setPublicKey(publicKey: string) {
    this.publicKey = publicKey;
    this.encrypt = new JSEncrypt();
    this.encrypt.setPublicKey(publicKey);
  }

  /**
   * 加密文本
   */
  encryptText(text: string): string {
    if (!this.encrypt) {
      throw new Error('请先设置公钥');
    }
    const encrypted = this.encrypt.encrypt(text);
    if (!encrypted) {
      throw new Error('加密失败');
    }
    return encrypted;
  }

  /**
   * 获取当前公钥
   */
  getPublicKey(): string {
    return this.publicKey;
  }
}

export const cryptoUtil = new CryptoUtil();
