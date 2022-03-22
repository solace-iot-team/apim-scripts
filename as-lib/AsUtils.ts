
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export type WithRequired<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Required<T, K>;

class AsUtils {

  /**
   * Check that file exists and has read permissions.
   * Returns the absolute path of the file or undefined if not found or no read permissions.
   */
  public validateFilePathHasReadPermission = (filePath: string): string | undefined => {
    try {
      const absoluteFilePath = path.resolve(filePath);
      // console.log(`validateFilePathWithReadPermission: absoluteFilePath=${absoluteFilePath}`);
      fs.accessSync(absoluteFilePath, fs.constants.R_OK);
      return absoluteFilePath;
    } catch (e) {
      // console.log(`validateFilePathWithReadPermission: filePath=${filePath}`);
      // console.log(`e=${e}`);
      return undefined;
    }
  }

  /**
   * Read the file and check if it can be parsed as a JSON.
   * @param filePath 
   * @returns the parsed file as an object
   * @throws JSON parser error
   */
  public readFileContentsAsJson = (filePath: string): any => {
    const b: Buffer = fs.readFileSync(filePath);
    try {
      return JSON.parse(b.toString());
    } catch(e) {
      throw e;
    }
  }

  public assertNever = (extLogName: string, x: never): never => {
    const funcName = 'assertNever';
    const logName = `${AsUtils.name}.${funcName}()`;
    throw new Error(`${logName}:${extLogName}: unexpected object: ${JSON.stringify(x)}`);
  }

  /**
   * Type safe key.
   * @todo only supports 1 level, make it support all levels.
   * @param obj 
   * @param selector 
   * @returns the name of the property
   */
  public getPropertyNameString = <T extends Record<string, unknown>>(obj: T, selector: (x: Record<keyof T, keyof T>) => keyof T): keyof T => {
    const keyRecord = Object.keys(obj).reduce((res, key) => {
      const typedKey = key as keyof T
      res[typedKey] = typedKey
      return res
    }, {} as Record<keyof T, keyof T>)
    return selector(keyRecord)
  }

  public  create_UUID = (): string => {
    return uuidv4();
  }

}

export default new AsUtils();