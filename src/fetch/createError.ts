import { $tc } from 'src/hooks/use-i18n';

const enhanceError = (error: any, config: any, code: any, response: any) => {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.response = response;
  error.isCustomAxiosError = true;
  error.toJSON = function toJSON() {
    return {
      message: $tc(this.code) || this.message,
      name: this.name,
      stack: this.stack,
      config: this.config,
      code: this.code,
    };
  };
  return error;
};

const createError = (
  message: string,
  config: Record<string, any>,
  code: number | string,
  response: Record<string, any>
): Error => {
  const error = new Error($tc(code) || message);
  return enhanceError(error, config, code, response);
};

export default createError;
