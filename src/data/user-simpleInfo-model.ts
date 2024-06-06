/**
 * UserSimpleInfo
 */
export default interface UserSimpleInfo {
  /**
   * 个人描述
   */
  bio: string;
  /**
   * 头像
   */
  faceUrl: string;
  /**
   * id
   */
  id: number;
  /**
   * 语言类型 0:英语 10:中文
   */
  languageType?: number;
  /**
   * 主页子空间名
   */
  namespace?: string;
  /**
   * 作品数量
   */
  opusCount?: number;
  /**
   * seeDao的sns
   */
  seeDaoName: string;
  /**
   * token的数量
   */
  tokenAmount?: number;
  /**
   * 用户名 唯一
   */
  username: string;
  [property: string]: any;
}
