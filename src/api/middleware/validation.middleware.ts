import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';

export default function validate(validator) {
  return [validator(), handleValidationError];
}

function handleValidationError(req: Request, res: Response, next: NextFunction) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json(error);
  }

  next();
}
