export class StringUtils {
  static isEmpty(str: string | undefined) {
    return !str || str.trim().length == 0;
  }
}
