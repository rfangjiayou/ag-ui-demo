// declarations.d.ts
declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

// 普通 Less 文件声明（非模块化）
declare module '*.less' {
  const content: string;
  export default content;
}
