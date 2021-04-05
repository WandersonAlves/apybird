export default abstract class ClassRegister {
  private static classes: any[] = [];

  static addClass(target: any) {
    this.classes.push(target);
  }

  /**
   * Get all class that are decorated
   * @returns A array of decorated classes
   */
  static getAll() {
    return this.classes;
  }
}