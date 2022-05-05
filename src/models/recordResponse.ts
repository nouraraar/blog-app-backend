  
export type recordResponse<K extends string, T> = {
    [P in K]: T;
  };
  