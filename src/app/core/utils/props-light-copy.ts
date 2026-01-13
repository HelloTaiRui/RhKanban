
/**
 * 属性浅拷贝工具。用于从源对象列表中依次赋予目标对象共有的键的值。
 */
export class PropsLightCopyTool {


  static copy(dst: any, src: any[]=[], copyAllProperties: boolean = true) {
    try {
      let source=src.reduce((obj,cur)=>{
        if(typeof cur !="object") return obj;
        return {...obj,...cur};
      },{});

      if (copyAllProperties) {
        for (const key in source) {
          dst[key] = source[key];
        }
      } else {
        for (const key in source) {
          if (dst.hasOwnProperty(key)) {
            dst[key] = source[key];
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    return dst;
  }

}
