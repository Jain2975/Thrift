import { Request, Response, NextFunction } from "express";
import filterXSS from "xss";

export const xssSanitize = (req: Request, res: Response, next: NextFunction) => {
  const cleanObj = (obj: any): any => {
    if (typeof obj === "string") {
      return filterXSS(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(item => cleanObj(item));
    }
    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        obj[key] = cleanObj(obj[key]); 
      }
    }
    return obj;
  };

  if (req.body) cleanObj(req.body);     
  if (req.query) cleanObj(req.query);   
  if (req.params) cleanObj(req.params); 

  next();
};
